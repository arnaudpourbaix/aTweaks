# Lint Roadmap

Follow-up to adding strict, type-aware ESLint (`typescript-eslint`'s
`strict-type-checked` + `stylistic-type-checked` presets) on 2026-07-12. `npm run
lint:fix` already applied 247 mechanical autofixes (reverting 3 that broke `tsc` —
see the commit message). `npm run build` and `npm test` (831/831) are both clean.
Baseline was **1,525 lint errors**. Tier 0 (rule-config fix) brought that to
**1,282**; Tier 1 (`as any` private-access rewrite, below) has since brought it to
**485**. None of this blocks the build or tests today — `npm run lint` simply isn't
green yet.

This was never 1,525 independent problems. A `-f json` dump (`npx eslint . -f json`,
92 files affected) showed the errors clustering hard around a small number of root
causes (counts below are the original baseline, before Tier 0/1's fixes):

| Count | Rule | Where |
|---|---|---|
| 803 | `no-unsafe-{call,member-access,assignment,argument,return}` | 98.8% in `*.test.ts` — **fixed, see Tier 1** |
| 176 | `no-explicit-any` | 98.3% in `*.test.ts` — **fixed, see Tier 1** |
| 279 | `restrict-template-expressions` | 95.3% in source (numbers/enums in generated script text) — **243 of these fixed, see Tier 0** |
| 62 | `no-non-null-assertion` | 58% source / 42% test |
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

### ☐ 3. `no-non-null-assertion` (62: 36 source / 26 test)

Every `x!` is a claim "this is never null/undefined" that the compiler can't verify.
For each occurrence: either prove it via a preceding guard (replace `!` with a
narrowing `if`/early-return, zero behavior change) or, if it's genuinely unprovable
from the surrounding code, that's worth flagging rather than silencing — same
category of finding as the closed bugfix roadmap's dead/wrong-branch bugs.

### ☐ 4. `no-unnecessary-condition` (49: 42 source / 7 test)

ESLint is saying a condition is always-truthy or always-falsy given the inferred
types — i.e. structurally the same shape as several confirmed bugs already found and
fixed in `IMPROVEMENT_ROADMAP.md` (the `weidu-item.service.ts` dead ternary, the
`creature.ts`/`item.service.ts` redundant re-checks, `statement-builder.service.ts`'s
duplicate `ActionListEmpty`). Audit each hit the same way: is this a leftover guard
that's now provably dead (simplify, no behavior change), or is it flagging that a
type is narrower than the runtime data actually is (real bug — the guard exists
because the type is wrong, not because the guard is redundant)?

### ☐ 5a. Pre-existing test-file type errors, unrelated to lint (found via the `tsconfig.eslint.json` fix)

Not a lint rule — raw `tsc` errors ESLint's type-aware rules don't surface (they use
type info for their own checks, they don't replicate generic "is this assignable"
compiler diagnostics). These predate this whole lint effort and were invisible to
everything that exists today: `npm run build` excludes `*.test.ts`, `vitest` type-
checks nothing (esbuild transpile-only), and ESLint doesn't either. Confirmed via
`npx tsc -p tsconfig.eslint.json` (only usable after the `rootDir` fix above) in
files this roadmap's Tier 1 didn't touch:

- `lib/src/model/creature/abstract-creature.test.ts`
- `lib/src/model/creature/creature.test.ts`
- `lib/src/model/creature/family.test.ts`
- `lib/src/services/baf/target.service.test.ts`
- `lib/src/services/effects/effect.service.test.ts`
- `lib/src/services/effects/grab.service.test.ts`
- `lib/src/services/effects/poison.service.test.ts`
- `lib/src/services/spell.service.test.ts`
- `vitest.config.ts` itself (a `coverage` option typed wrong)

Worth its own pass — likely the same `Partial<Effect>`-shaped fixture mismatches
fixed in Tier 1, but scope/count not yet assessed. Run
`npx tsc -p tsconfig.eslint.json` to get the current list.

### ☐ 5. `restrict-template-expressions` — the 29 `X | undefined` cases (not covered by Tier 0's config change)

Listed above; each one interpolates a possibly-`undefined` value into generated
output. For each: confirm whether the `undefined` case is reachable from real config
(same "confirmed no current impact" check used throughout `IMPROVEMENT_ROADMAP.md`)
and either add a fallback (`?? ""`, `?? 0`, etc.) or narrow the type if it's
provably always defined by that point.

---

## Tier 3 — mechanical cleanup (low risk, no investigation needed)

### ☐ 6. `no-unused-vars` (43)

Delete or prefix with `_` per existing project convention. Grep-and-fix, no logic
risk.

### ☐ 7. `unbound-method` (25, mostly source)

Flags a method reference passed around detached from its instance (e.g.
`array.map(someService.method)` — loses `this` if `method` uses it). Fix per call
site: bind (`someService.method.bind(someService)`), wrap in an arrow
(`(x) => someService.method(x)`), or confirm the method never uses `this` and is
safe as-is (some of these may be false-positive-shaped, e.g. static-like methods —
verify before wrapping).

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
