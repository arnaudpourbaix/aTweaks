# Lint Roadmap

Follow-up to adding strict, type-aware ESLint (`typescript-eslint`'s
`strict-type-checked` + `stylistic-type-checked` presets) on 2026-07-12. `npm run
lint:fix` already applied 247 mechanical autofixes (reverting 3 that broke `tsc` —
see the commit message). `npm run build` and `npm test` (831/831) are both clean.
Baseline was **1,525 lint errors**. Tier 0 (rule-config fix) brought that to
**1,282**; Tier 1 (`as any` private-access rewrite) brought it to **485**; Tier 2
item 3 (`no-non-null-assertion`, below) has since brought it to **356**; Tier 2
item 4 (`no-unnecessary-condition`) to **294**; Tier 2 items 5a/5 (pre-existing
test-file `tsc` errors, then `restrict-template-expressions`) to **281**;
Tier 3 item 6 (`no-unused-vars`) to **254**; Tier 3 item 7 (`unbound-method`)
to **230**. None of this blocks the build or tests today — `npm run lint`
simply isn't green yet.

This was never 1,525 independent problems. A `-f json` dump (`npx eslint . -f json`,
92 files affected) showed the errors clustering hard around a small number of root
causes (counts below are the original baseline, before Tier 0/1's fixes):

| Count | Rule | Where |
|---|---|---|
| 803 | `no-unsafe-{call,member-access,assignment,argument,return}` | 98.8% in `*.test.ts` — **fixed, see Tier 1** |
| 176 | `no-explicit-any` | 98.3% in `*.test.ts` — **fixed, see Tier 1** |
| 279 | `restrict-template-expressions` | 95.3% in source (numbers/enums in generated script text) — **243 of these fixed, see Tier 0** |
| 62 | `no-non-null-assertion` | 58% source / 42% test — **fixed, see Tier 2 item 3** |
| 49 | `no-unnecessary-condition` | 86% source |
| 43 | `no-unused-vars` | mostly source |
| 25 | `unbound-method` | 80% source |
| ~90 | everything else (`prefer-nullish-coalescing`, `no-redundant-type-constituents`, `no-empty-function`, etc.) | scattered, 1-17 each |

Remaining 485 errors are now almost entirely Tier 2/3 material — real signal
(`no-non-null-assertion`, `no-unnecessary-condition`) and small mechanical cleanup.

Status legend: ☐ not started · ▶ in progress · ✅ fixed & committed ·
🟡 reviewed & decided not to change · ⏸ deferred (deliberately postponed)

---

## Tier 0 — rule-config decision (do this first, before per-file work)

### ✅ 1. `restrict-template-expressions` — `allowNumber`/`allowBoolean` policy applied

279 hits, 243 of which were a plain `number`/`boolean` (or enum, which is
number-backed) interpolated into a template literal (e.g.
`` `duration=${effect.duration}` ``, `` `${EffectTypeEnum.Hold}` ``) — the single
most common operation in a WeiDU/BAF script generator, turning typed values into
generated script text.

**Fix applied:**

```js
'@typescript-eslint/restrict-template-expressions': [
  'error',
  { allowAny: false, allowBoolean: true, allowNever: false, allowNullish: false, allowNumber: true, allowRegExp: false },
],
```

**Gotcha hit and fixed while applying this:** flat config replaces a rule's whole
options object rather than merging it with what an earlier config (here,
`strictTypeChecked`) set — it does not layer partial overrides on top. An initial
version of this change only specified `allowNumber`/`allowBoolean`, which silently
reset the other four flags (`allowAny`, `allowNever`, `allowNullish`, `allowRegExp`)
to the *rule's own* built-in defaults (`true` for all of them) instead of keeping
`strictTypeChecked`'s stricter `false`. Caught by probing the rule directly with a
throwaway file (`` `${x}` `` where `x: number | undefined` went from flagged to
silently passing) before this was committed — every option this rule supports must
be listed explicitly whenever any one of them is overridden.

**Confirmed correct with the fix:** 243 errors eliminated (1,525 → 1,282); a
probe file confirmed bare `undefined`, `null`, and `number | undefined` are still
flagged, and `npm run build` / `npm test` (831/831) stayed clean (config-only
change, no source touched).

**Left flagged, not blanket-allowed:** 36 remaining hits — `X | undefined` unions
(real risk: interpolating `undefined` renders the literal string `"undefined"` into
generated WeiDU script/doc output) and a few object/array types (`ItemSlot |
ItemSlot[]`, `Movement`). See Tier 2 item 5 — fix these individually.

---

## Tier 1 — the `as any` private-method-access pattern (highest leverage) — ✅ done

Files that used `const service = xService as any;` (or the file-specific
equivalent) purely to call private methods from tests, each replaced with a cast
through `unknown` to a small locally-declared interface naming just the private
members exercised in that file:

```ts
interface DescriptionServicePrivate {
  getProbability(effect: Partial<Effect>): string;
  getParalyze(effect: Partial<IdsEffect>, target: ItemAbilityTargetEnum): string[];
  // ...only the methods this file actually calls
}
const service = descriptionService as unknown as DescriptionServicePrivate;
```

- ✅ `description.service.test.ts` (283 → 0)
- ✅ `statement-builder.service.test.ts` (207 → 0)
- ✅ `creature.service.test.ts` (108 → 0)
- ✅ `ability.service.test.ts` (55 → 0)
- ✅ `weidu-creature.service.test.ts` (49 → 0)
- ✅ `weidu-spell.service.test.ts`, `weidu-item.service.test.ts`, `state.service.test.ts`,
  `abstract-weidu.service.test.ts` (smaller, same pattern → 0)
- ✅ `utils.service.test.ts` — the related but distinct per-expression `(x as any)`
  pattern (casting a specific *result value* down to access a field TypeScript
  can't narrow to), fixed the same way with narrow local casts (39 → 0)

**Net effect:** 1,282 → 485 lint errors (797 eliminated), zero behavior changes —
`npm run build` and `npm test` (831/831) stayed clean throughout, verified file by
file.

**A real typing gap this surfaced, not just noise:** `Partial<Effect>` doesn't
distribute cleanly over `getEffectDescription`/`getModifierType`'s tests, which use
`it.each` to drive an `opcode` loop variable typed as the *full* `EffectTypeEnum`
across rows belonging to different, narrower `Effect` union members (Partial over a
union homomorphically distributes per-member, so a broadened opcode fails against
any single member's narrower subset). Solved with an explicit escape hatch
(`type LooseEffect = { opcode?: EffectTypeEnum } & Record<string, unknown>`) for
just those two dispatcher-style methods, documented inline — see
`description.service.test.ts`.

**Also worth knowing about, found while verifying this tier:**

1. **A real config bug in the Tier 0 fix**, caught before it was committed: flat
   config replaces a rule's whole options object rather than merging, so a partial
   override had silently reset `allowAny`/`allowNever`/`allowNullish`/`allowRegExp`
   to the rule's own permissive defaults instead of `strictTypeChecked`'s stricter
   `false`. Already fixed (see Tier 0 above) — flagged here as a reminder that flat
   config's replace-not-merge behavior is an easy trap.
2. **`.prettierrc.json` had `singleQuote: true`**, contradicting the double-quote
   style used everywhere in this codebase — caught when `npx prettier --write`
   reformatted a file to single quotes. Fixed (`singleQuote: false`); two files that
   had already been reformatted (`creature.service.test.ts`,
   `weidu-creature.service.test.ts`) were reformatted back before committing.
3. **`tsconfig.eslint.json` was silently non-functional as a standalone type-check**:
   `npx tsc -p tsconfig.eslint.json` immediately errored on a `rootDir` mismatch
   (`vitest.config.ts` sits outside `lib/`) before reporting any real diagnostics —
   so every "type-check confirms clean" verification done against it up to that
   point had actually verified nothing. Fixed by adding `"rootDir": "."` to the
   file. Once working, it revealed real, **pre-existing** type errors unrelated to
   this work in files this tier didn't touch — see the note below the tier list.

---

## Tier 2 — real signal, needs the audit-before-fixing treatment

Same process as `BUGFIX_ROADMAP.md`/`IMPROVEMENT_ROADMAP.md`: these rules can be
pointing at a real bug, not just a style nit, so look before fixing.

### ✅ 3. `no-non-null-assertion` (62: 36 source / 26 test) — done

All 62 fixed across ~20 files, one at a time: read the surrounding code, decide
whether the assertion was provable (add a real guard/throw, or restructure so
TS's own narrowing covers it) or a config-completeness guarantee (e.g.
`TARGET_STATUS`/`POISONS`/`CreatureSizeTable` each have exactly one entry per
their corresponding name-union type, confirmed by comparing counts — extracted
into small shared `getXDetails()` helpers that throw on the
should-never-happen miss instead of asserting past it).

Two real, previously-dormant bugs found and fixed along the way (both flagged
by other rules while touching the same lines, not by `no-non-null-assertion`
itself):
- `grab.service.ts`: `grab.saveType ? grab.saveType : default` truthy-checked
  `SaveTypeEnum.Spell` (value `0`, a real save type) — same shape as the
  `DispelEffects` bug already closed in `IMPROVEMENT_ROADMAP.md`. Fixed with
  `??`. No shipped creature sets this field, so it was dormant.
- `ability.service.ts`: a `Generator<number>` with no explicit `TReturn` was
  silently `any` at its `.next().value`, defeating the type checker across
  every downstream use.

**Caught three premature-simplification mistakes here, all via the full test
suite (not lint/tsc, which stayed green)** — each was code that looked
dead-per-the-type but had a test explicitly naming and exercising the
defended-against case:
- `utils.service.ts`'s `spell.level ?? 1` (test: "falls back to level 1 ...
  (type violation - defensive fallback)").
- `grab.service.ts`'s "creature has no size" warning branch (test: "...warns
  when the creature has no size").
- `weidu-creature.service.ts`'s `p.creature.attack?.dualWielding` — this one
  went the other way: traced real `Creature` construction
  (`creatureFactory` → `setAttack()`) to confirm `attack` truly is always set
  in production, then fixed the test's incomplete fixture instead of
  re-adding the now-confirmed-unnecessary `?.`.

Net lesson banked for Tier 2 item 4 below: when a "dead" branch's condition
involves a field the type marks required, check for a test naming that
specific defensive case before deleting anything — and when in doubt, running
the full suite (not just lint/tsc) is what actually catches it.

### ✅ 4. `no-unnecessary-condition` (49: 42 source / 7 test) — done

All 49 fixed across creature.service.ts, item.service.ts, translation.service.ts,
string-ref.utils.ts, weapon.service.ts, spell.service.ts, weidu-spell.service.ts,
kit.service.test.ts (plus the ones already closed incidentally while auditing
`no-non-null-assertion`: creature.factory.ts, movement.ts, baf-generator.service.ts,
statement-builder.service.ts). Same audit-before-fixing process as item 3: for each
hit, checked whether the flagged condition's field is genuinely always-set per the
type (simplify) or whether a test names and exercises the specific case the type
says can't happen (keep the guard, add `eslint-disable-next-line` with a comment
citing the test).

Two real, previously-dormant issues found along the way:
- `creature.service.ts`'s `checkMovement()`: the `&& movement` half of `if
  (data.kit === "BARBARIAN" && movement)` was genuinely dead — traced the
  `!data.movement && !isAdjustment throw` guard two lines up to prove
  `p.creature.data.movement` is unconditionally set by the time any adjustment's
  `checkMovement` runs (the base creature's call already would have thrown
  otherwise). Simplified: `if (data.kit === "BARBARIAN")`.
- `item.service.ts`'s `setHeader()`: **caught a real bug by the full test
  suite, not by lint/tsc** (both stayed green). Simplifying `result.header.effects
  ? ... : (result.header.effects = [])` to always call `getEffects` broke
  `pipeline.golden.test.ts` — `Spider.createJaws` in `lib/creatures/spiders.ts`
  constructs `header: { ..., effects: p.effects }` where `p.effects` is an
  optional param, so when omitted the object literal has an *explicit* `effects:
  undefined` key. `{ effects: [], ...header }`'s spread then overwrites the `[]`
  default with that `undefined` at runtime — even though TS's spread-type
  inference says the merged `effects` field is always `Effect[]` (never
  undefined), which is exactly why ESLint flagged the guard as unnecessary in the
  first place. This is the same failure shape as the `no-non-null-assertion`
  premature-simplifications (type says required, reality says otherwise) but from
  a *different* root cause: TS's object-spread type inference doesn't account for
  a spread source's optional property being explicitly assigned `undefined`, not
  just omitted. Fixed by keeping the fallback (`result.header.effects ?? []`)
  with an `eslint-disable-next-line` documenting the real gap.
- Same "optional prop explicitly passed as `undefined` survives a defaulting
  spread" shape recurred in `spell.service.ts`'s `getSpell()`
  (`type`/`level`, both covered by tests literally named "forces type/level back
  to ... when explicitly undefined") and `weidu-spell.service.ts` (`spell.level`
  read downstream of that same spread) — once recognized, these were identified
  by reading the surrounding code rather than by breaking tests again.

**Lesson for future tiers:** "the type says this field is always set" has two
independent ways to be wrong here, not one — (1) a test fixture/config
intentionally violates the type to exercise defensive code (the Tier 2 item 3
shape), or (2) an object-spread default gets silently overwritten by an
explicit-`undefined` property from the spread source, which no static analysis
in this project currently catches. Grep for `...others`/`...header`-style spreads
sitting after a `field: x ?? default` in the same literal before trusting "no
test names this case" as proof a guard is dead.

### ✅ 5a. Pre-existing test-file type errors, unrelated to lint (found via the `tsconfig.eslint.json` fix) — done

`npx tsc -p tsconfig.eslint.json` is now fully clean (0 errors). Not a lint rule —
these were raw `tsc` errors ESLint's type-aware rules don't surface, invisible to
everything that existed before this effort (`npm run build` excludes `*.test.ts`,
`vitest` type-checks nothing, ESLint doesn't replicate generic assignability
diagnostics). Fixed across:

- `lib/src/model/creature/abstract-creature.test.ts`,
  `lib/src/model/creature/creature.test.ts`, `lib/src/services/spell.service.test.ts`:
  **the dominant cluster** — `PartialSpell`/`Spell.name: StringReference` is
  required (not in `PartialSpell`'s optional-key list), and ~18 call sites across
  these files omitted it entirely. Added a real `name`. First pass used a bare
  number literal, which type-checks (`StringReference = TranslationKey | number`)
  but **broke 2 tests at runtime**: `spell.service.test.ts`'s `addProjectile`
  path calls `translationService.fromOptional(spell.name)`, which throws for a
  number that was never registered. Fixed properly by registering it via
  `translationService.addCustomTranslation(["Test Spell"])` — the same pattern
  `poison.service.ts` already uses in production for exactly this reason — and
  reusing the returned stringRef across the file's ~14 `getSpell()` calls.
- `lib/src/model/creature/family.test.ts`: `family.creature(99)` — `99` isn't a
  `MonsterEnum` member; this is a deliberate "id that doesn't exist" test value,
  so cast (`99 as MonsterEnum`) rather than changing the value.
- `lib/src/services/baf/target.service.test.ts`: **a real typo bug in the test**
  — `align: "CHAOTICEVIL"` isn't a valid `AlignIdentifier` (missing the
  underscore); fixed to `"CHAOTIC_EVIL"` in both the input and the expected
  output string it's asserted against.
- `lib/src/services/effects/effect.service.test.ts`: three `ProtectionFromResource`
  tests construct `type: { stat: SpellProtectionStat.Ea, value: 0, ... }` — the
  `SpellProtectionEa` type declares `value?: AllegianceIdentifier` (a friendly
  string) for authoring config, but `EXISTING_SPELL_PROTECTIONS` (the resolved
  table `effect.service.ts` actually matches against) stores each entry's
  already-resolved *raw numeric* value — `{ index: 0, stat: "0x10a", value: 0,
  relation: 4 }` is the literal row these tests exercise. Kept the numeric value
  (it's correct for what's being tested) and added `as any` with a comment
  explaining the friendly-type-vs-resolved-table mismatch, rather than changing
  the test's numbers to something that no longer matches the table.
- `lib/src/services/effects/grab.service.test.ts`: `weapon.header.effects[0].type`
  — `Effect` is a large discriminated union and `.type` isn't on every member
  (e.g. `ArmorClassBonusEffect` has none), so indexing into `Effect[]` and
  reading `.type` doesn't type-check without narrowing. Cast to the concrete
  `CastSpellEffect` (what `grabService.attachGrabToWeapon` actually constructs).
- `vitest.config.ts`: `silent: "passed-only"` is a vitest 3.x value; the
  installed vitest is 2.1.9, whose `silent` option is `boolean` only — worse,
  since JS doesn't validate config at runtime, the truthy string was silently
  behaving like `silent: true` (hiding failures too, not just passes). Changed
  to `silent: false` so failures stay visible.
- `tsconfig.eslint.json`: separately, `vitest.config.ts`'s own import chain
  (`vitest/config` → vite → a `rollup/parseAst` subpath export) failed to
  resolve under this project's `moduleResolution` (inherited `"node"` from the
  build `tsconfig.json`, which predates subpath-exports support). Fixed by
  overriding `"module": "preserve"` / `"moduleResolution": "bundler"` inside
  `tsconfig.eslint.json` only — it's a `noEmit` type-check-only config, so this
  doesn't touch the real build (`tsconfig.json`, which excludes
  `vitest.config.ts` and `*.test.ts` entirely).

`npm run build` and `npm test` (831/831) both clean.

### ✅ 5. `restrict-template-expressions` — the `X | undefined` cases (not covered by Tier 0's config change) — done

Most of the original 29 had already been closed incidentally while auditing Tier 2
items 3/4 (creature.service.ts, weapon.service.ts, weidu-spell.service.ts, etc.);
15 remained, all fixed here across index.ts, effect.service.ts,
weidu-projectile.service.ts, weidu-effect.service.ts, weidu-function.service.ts.
Same per-hit audit as the rest of Tier 2: is the `undefined` case reachable from
real config, or provably excluded by a guard the type checker can't see through?

- `weidu-projectile.service.ts`: **the one real bug** — `createProjectile()`
  unconditionally interpolated `projectile.copyFromFile` (optional on the type)
  into a `COPY_EXISTING "..."` WeiDU command with no guard at all. Every real
  creature config that sets a `projectile` object does set `copyFromFile`, but
  nothing enforced it — an omission would have silently emitted
  `COPY_EXISTING "undefined.pro" ...` into generated script. Added a real
  `if (!projectile.copyFromFile) throw` guard.
- `effect.service.ts`'s stringRef branch had the same silent-`"undefined"` shape:
  `` `${utils.resolveStringRef(effect.stringRef)}` `` would render the literal
  text `"undefined"` if the helper ever returned undefined; replaced with
  `utils.resolveStringRef(...) ?? ""` (traced the helper - given a defined input,
  as guaranteed by the surrounding `if (effect.stringRef)`, it can't actually
  return undefined, so this is a no-behavior-change type fix, not a live bug).
- `weidu-effect.service.ts`/`weidu-function.service.ts`: the bulk of the
  remaining hits were `weiduUtils.getIntegerValue(effect.parameterN)` calls
  already sitting inside an `effect.parameterN && ... !== "0"` truthy guard —
  `getIntegerValue` only returns `undefined` for an undefined/empty input, which
  the guard already excludes. Added `?? ""` fallbacks (unreachable in practice,
  satisfies the type). `effect.target` similarly defaulted with
  `?? EffectTargetEnum.PresetTarget`, matching effect.service.ts's own
  `setDefaultEffectValues()` default, since `addEffect()` is a public method not
  guaranteed to only be called after that defaulting runs.
- `weidu-function.service.ts`'s `OUTER_SET ${sp.name}=...`: `name` is optional on
  `BaseSpellProtection` generally, but every literal entry in the small,
  hand-authored `SPELL_PROTECTIONS` config array sets it (the entry is
  meaningless without it). Added a real `if (!sp.name) throw` guard rather than
  a silent fallback, since an unnamed entry would be a config-authoring mistake
  worth surfacing loudly.

`npm run build` and `npm test` (831/831) both clean.

---

## Tier 3 — mechanical cleanup (low risk, no investigation needed)

### ✅ 6. `no-unused-vars` (43) — done

Down to 23 by the time this tier started (rest closed incidentally earlier).
**The "existing project convention" of prefixing with `_` turned out not to
exist yet** — probed it directly (a throwaway `_b` param still errored) and
confirmed the base rule has no `argsIgnorePattern` configured anywhere. Added
one (`^_` for args/vars/caught errors) to `eslint.config.mjs` before using it,
since without that option prefixing does nothing.

Two real, previously-dormant bugs found (both parameters that looked used but
weren't, caught by the rule doing exactly its job):

- **`wyvern.ts`'s `createStinger(poisonType, saveBonus)`**: `saveBonus` was
  accepted and passed by every caller (`0`, `0`, `-2` for the three wyvern
  variants) but never threaded into `poisonService.getSpell({ poisonType })` -
  the greater wyvern's `-2` save penalty was silently dropped from generated
  output. Fixed by passing it through; **regenerated the real project
  files** (`npm run atweaks`) and diffed - confirmed the only change was
  `savebonus="-2"` appearing on the greater wyvern's poison effect and its
  description text picking up "(saves vs poison/death at -2)", across
  `lib/pnp-monster/wyvern/48.tpa`, `docs/monsters.html`, and all 7 language
  `.tra` files (custom translations aren't localized, so the same English
  text ships in every language file - that's why one content fix touches
  9 golden fixtures, not a sign of something broader). Committed alongside
  the fix, same as `IMPROVEMENT_ROADMAP.md`'s established process for a
  content-changing fix.
- **`trigger.factory.ts`'s `validAttackTarget()`**: accepted `seeInvisible`
  but never used it, unlike its two siblings (`validTrackTarget`/
  `validSpellTarget`), which both exclude invisible targets when the creature
  can't see invisible. Both real call sites passed a genuine per-creature
  `creature.seeInvisible()` value, and no test exercised `seeInvisible: false`
  for this method - flagged to the user before fixing, since it's a
  generated-script behavior change. **User's call: remove the parameter
  entirely** (not a bug worth fixing) - removed it from the signature and
  both call sites instead of adding the missing invisibility check.

Also `main.service.ts`'s `generateCreature(creature, families)` - `families`
was passed through from `generateCreatures()`'s loop but never read; the
`main.service.test.ts` call site already called it with `[]`, confirming
it was genuinely vestigial. Removed the parameter (and the test's `[]` arg).

The rest were the two established shapes from earlier tiers: dead imports/a
dead local enum (`ettin.ts`'s unused `Ids` didn't even match creature-specific
member names, looked copy-pasted from another file), and the
`statement-builder.service.ts` dispatch-handler-signature case (`options`/
`creature` unused in a specific handler but required by the shared
`fn.apply(this, [statements, creature, options])` call shape) - prefixed with
`_` now that the option exists.

`npm run build` and `npm test` (831/831) both clean.

### ✅ 7. `unbound-method` (25, mostly source) — done

All three shapes described above showed up, one each:

- `baf.factory.ts`'s `.map(triggerFactory.inverseNegation)`: the method
  genuinely never uses `this` - annotated `inverseNegation(this: void, ...)`
  at the declaration instead of wrapping at the one call site, so the
  contract is documented permanently rather than re-verified per caller.
- `kit.service.test.ts` (5): `expect(creature.setBehavior).toHaveBeenCalled...`
  - a well-known false-positive shape for typed `vi.fn()` mocks assigned to a
    real class's method-typed property (confirmed `vi.mocked(...)` doesn't
    suppress it either - tested directly). `eslint-disable-next-line` per
    occurrence, since it's inherent to how TS types a mock through the
    original class's method signature, not a real unbound-`this` risk.
- `statement-builder.service.ts` (19): the `execute()` dispatch table -
  `this.execute(this.destroyUponDeath, "destroyUponDeath", ...)` passes 19
  bare method references, all safe in practice because `execute()` calls
  `fn.apply(this, [statements, creature, options])` internally, but the type
  checker can't see through that indirection from the call site. Added
  `.bind(this)` at all 19 call sites (the rule's own suggested fix) - a
  runtime no-op given the existing `.apply(this, ...)`, but it makes each
  reference provably safe independent of `execute()`'s implementation.

`npm run build` and `npm test` (831/831) both clean.

### ☐ 8. Everything else (`prefer-nullish-coalescing` 17, `no-redundant-type-constituents`
14, `no-empty-function` 11, `no-unsafe-enum-comparison` 4, `no-useless-assignment` 4,
`no-namespace` 3, `no-unnecessary-type-conversion` 3, `prefer-optional-chain` 3,
`preserve-caught-error` 3, and a handful of 1-2 count rules)

Small enough to sweep in one pass once Tiers 0-2 are done and the noise is gone —
each of these is a handful of occurrences, straightforward one-line fixes with the
rule's own `--fix` covering some of them.

---

## Process

For each tier/file: fix → `npm run build` → `npm test` (confirm 831/831 still pass,
or regenerate + diff-check `.baf`/doc output if a fix changes generated content,
same as the improvement roadmap's process) → `npm run lint` (confirm the target
errors are gone and nothing new appeared) → commit. Re-run the JSON dump
(`npx eslint . -f json`) periodically to re-rank remaining work — file-level counts
will shift as Tier 0/1 remove the noise burying the smaller items.
