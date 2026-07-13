# SonarJS Roadmap — ✅ COMPLETE (2026-07-13)

`npx eslint .` is at 0 findings (`sonarjs/todo-tag`/`fixme-tag` tracked
separately in `TODO_ROADMAP.md`, not part of this count). All 4 tiers below
are done; `npm run build` and `npm test` (831/831) stayed clean throughout.

Follow-up to adding `eslint-plugin-sonarjs`'s `recommended` config on 2026-07-13
(see `LINT_ROADMAP.md` for the strict-TypeScript-ESLint rollout this builds on).
Baseline: 80 findings. `sonarjs/todo-tag`/`fixme-tag` (47 of those) are now off —
tracked instead in `TODO_ROADMAP.md`, since most need game/mod domain knowledge
to triage, not a mechanical fix. That leaves **33** to work through here.

Status legend: ☐ not started · ✅ fixed & committed ·
🟡 reviewed & decided not to change (kept active, scoped disable, or file-level off)

---

## ✅ 1. False-positive-shaped rules (10 findings, 4 rules) — audited & scoped-disabled

Same audit-before-fixing approach as `LINT_ROADMAP.md`'s Tier 2: for each hit,
confirm whether it's a real issue or a pattern Sonar's static analysis can't
see through, the same way `no-unnecessary-type-assertion` and
`no-unnecessary-condition` each turned out to have real false positives in
this codebase.

### `sonarjs/different-types-comparison` (2, `spell.service.ts:59,62`)

Re-flags `result.type === undefined` / `result.level === undefined` as
"always false" — this is the exact code documented in `LINT_ROADMAP.md`'s
Tier 2 item 4 (`@typescript-eslint/no-unnecessary-condition`'s own false
positive on the same lines), already verified via the full test suite to be
genuinely reachable (the `...others` spread re-copies an explicit `undefined`
over the default). **Done: added to the existing scoped
`eslint-disable-next-line` on those lines, no new investigation needed.**

### `sonarjs/no-duplicated-branches` (6, `effect.service.ts` — lines 94/86,

193/154, 237/223, 249/86, 290/223, 309/86)

`getEffect()`'s big switch groups `case` labels by shared handling code, and
several groups happen to produce identical bodies today
(`` `${effect.value}` ``/`` `${effect.type}` `` for both `StatisticModifierEffect`
and `ModifierTypeEffect` opcodes, for instance) purely by coincidence — they're
separate groups because they map to _different_ TS discriminated-union effect
types, not because someone copy-pasted a case by mistake. Merging them for
Sonar's sake would erase that correspondence.
**Done: verified each of the 6 pairs individually** — all map to genuinely
distinct `EffectTypeEnum` opcodes that just happen to share a body shape
(`AttackDamageBonus`-group vs the `DexterityBonus`/resistance-group, and
`CurrentHPbonus` and `CastingTimeModifier` vs that same group, all sharing
`parameter1 = value; parameter2 = type`; `Regeneration` vs `Poison` sharing
`amount`/`type`/`icon→special`; `Translucency` and `CastingFailure` vs
`ProficiencyModifier` sharing `amount`/`type`). Applied one
`/* eslint-disable */` / `/* eslint-enable */` pair bracketing the whole
switch rather than 6 line-disables, since the duplication is a structural
property of the whole dispatch table.

### `sonarjs/function-return-type` (1, `action.factory.ts:35`)

`disableInterrupt()` has two TS overload signatures
(`(): Action` / `(actions: Action[]): Action[]`) and an implementation
returning `Action | Action[]` — a standard, correct TS overload pattern.
Sonar's return-type-consistency check doesn't appear to special-case
overloaded signatures. **Done: scoped disable, citing the overload.**

### `sonarjs/pseudo-random` (1, `utils.service.ts:268`)

`Math.random()` inside `shuffleArray()`'s Fisher–Yates shuffle, used to
randomize BAF target order (a gameplay feature) — not a security context
(tokens, credentials, etc.), which is what this rule exists to catch.
**Done: scoped disable, noting the non-security context.**

---

## 🟡 / ✅ 2. Small real findings (2) — done, one differently than planned

- `sonarjs/no-misleading-array-reverse` (really "no-misleading-array-sort" in
  this version) → **not a harmless smell after all.** `documentation.service.ts`'s
  `getTraits()` calls `State.immunities.sort(...)` inline inside a `for...of`,
  mutating the shared global `State.immunities` order. Sorting a copy instead
  (the obvious fix) **broke `pipeline.golden.test.ts`**: `main.service.ts` calls
  `generateCreatures()` (→ `documentationService.generate()` → this method)
  _before_ `generateCommonCode()` (→ `weiduFunctionService.generateImmunities()`,
  which iterates `State.immunities` in whatever order it's currently in) - so
  this "local" sort was silently controlling the order of
  `DEFINE_PATCH_FUNCTION` blocks in generated WeiDU output the entire time.
  Reverted to the mutating sort, documented the real dependency inline with a
  comment + scoped `eslint-disable-next-line`, and left the actual fix (making
  the sort explicit wherever the real ordering dependency lives, since this
  doc-generation-has-code-gen-side-effects coupling is real technical debt) as
  a deliberate future decision rather than something a lint cleanup should
  make unprompted. **This is exactly the "looks like dead code/harmless smell,
  but the full test suite catches a real dependency" pattern from
  `LINT_ROADMAP.md` - same lesson, different tool.**
- `sonarjs/no-redundant-assignments` → `effect.enums.ts`'s
  `getCastSpellOnConditionValue()` has `let value = 0;` then a `case
"HitBy([ANYONE])": value = 0;` that redundantly reassigns the same value.
  This one really was just that - fixed, verified against
  `pipeline.golden.test.ts` (unaffected, as expected for a genuinely-dead
  reassignment).

## ✅ 3. Cognitive complexity (9 functions over the 15-point threshold)

All 9 resolved:

- `weidu-effect.service.ts`'s `addEffect()` (30→ under threshold): extracted
  `addParameterIntVars`/`addSimpleIntVars`/`addSaveAndFlagIntVars` - each was
  a genuinely separable group of INT_VAR fields.
- `weidu-spell.service.ts`'s `createSpell()` (21): extracted
  `createSpellFileHeader()` (the copyFrom-vs-CREATE branch) and
  `addChangeSpellOptions()`.
- `weidu-item.service.ts`'s `createItem()` (18): extracted
  `createItemFileHeader()` and `writeItemAbilityHeaderPatch()`.
- `weidu-creature.service.ts`'s `createNewFiles()` (16) and `addItemSlots()`
  (18): extracted `addNewFile()`, `getNoWeaponFiles()`, `getItemFlags()`.
- `ability.service.ts`'s `parseAbilitySpell()` (17): extracted
  `addExclusionTriggers()` - turned out to be byte-for-byte duplicated in
  `parseAbilitySpells()` too, so this also deduped real repeated code, not
  just moved it around.
- `ability.service.ts`'s `getSpellAction()` (16): **left as-is, scoped
  disable.** A resource/id × cast-type lookup table would lose the
  discriminated-union narrowing between each `name` and its `params` shape
  without a cast - same reasoning as the two switches below.
- `description.service.ts`'s `getEffectDescription()` (21): **converted the
  if/else-if opcode chain to a `switch`** - Sonar's metric counts a switch as
  one flat construct rather than one increment per branch, so this dropped
  under threshold with no logic change. Bonus: the switch's case-based
  narrowing made one `as ModifierTypeEffect` cast genuinely redundant
  (confirmed via `tsc` against both tsconfigs, unlike the false positives
  earlier in `LINT_ROADMAP.md` - this one really was over-asserted) - removed it.
- `effect.service.ts`'s `getEffect()` (27): **left as-is, scoped disable.**
  This is the function the top of this section already used as the
  "flat switch domain complexity" example - several case bodies carry their
  own small nested `if` (Poison's icon→special, Disease's
  frequencyMultiplier, ...), which is inherent per-opcode behavior, not
  duplication a helper could remove without just relocating it.

## ✅ 4. Everything else (12 findings, low-stakes style)

All resolved:

- `no-alphabetical-sort` (5, all in test files sorting plain ASCII identifiers
  like `"Player1"` or file paths for deterministic comparison) - scoped
  disables in `target.service.test.ts` and `pipeline.golden.test.ts` (locale
  correctness genuinely doesn't matter for internal ASCII-only ordering); for
  `utils.service.test.ts`'s `shuffleArray` permutation check, added a real
  `(a, b) => a - b` comparator instead since it was trivial and removes any
  fragility around numeric-vs-lexicographic sort order.
- `no-undefined-argument` (2) - dropped the explicit `undefined` arguments in
  `target.service.test.ts`'s `fakeCreature(undefined)` and
  `utils.service.test.ts`'s `getMemorizedSpellType(undefined)` (both optional
  params with no default - identical behavior, less noise).
- `use-type-alias` (1, `triggers.ts:228`) - extracted the repeated
  `"LOCALS" | "GLOBAL" | (string & {})` union (appeared identically in
  `Global`/`GlobalGT`/`GlobalLT`) into a `Triggers.GlobalScope` type alias.
- `no-nested-template-literals` (1, `weidu-creature.service.ts`) -
  `removeMemorizedSpell()`'s inner `.map((v) => \`~${v}~\`)` result now goes
  through a `names` local before the outer template literal.
- `no-small-switch` + `prefer-default-last` (2, `i18n.ts:21-22`) -
  **confirmed intentional** (user: this project ships English only, the
  `default: case "english":` switch is a placeholder for anyone who wants to
  contribute other-language translations later). Scoped disables with a
  comment explaining why, rather than restructuring working code.
- `max-switch-cases` (1, `effect.service.ts`, 58 cases vs. a 30 max) - scoped
  disable next to the switch; same "structural to the real WeiDU-opcode
  domain" reasoning as the `cognitive-complexity` disable already on this
  function.

---

## ✅ 5. Stricter-than-`recommended` survey (62 rules `recommended` ships off)

Follow-up requested after Tiers 1-4 above closed out `recommended` itself:
surveyed every rule `sonarjs/recommended` disables by default, to see whether
a stricter preset was worth adopting for this codebase specifically.

Enabling all 62 at once surfaced 869 findings, dominated by a handful of
rules that don't fit this project (see below) - so each rule got an
individual on/off decision instead of a blanket adoption:

**Turned on with real value found:**
- `max-union-size` - not "your domain has too many variants" as it first
  looked; the rule specifically exempts unions already extracted to a
  `type X = ...` alias, so every hit was really "name this inline union" -
  extracted 14 (`StatisticModifierOpcode`, `SpellCastType`, etc.).
- `no-duplicate-string` - found real repeated domain constants worth naming
  (`PETRIFYING_GAZE_NAME`, `ROTTING_DISEASE_NAME`, `PNP_MONSTER_DIR`, ...) and
  several test-fixture values worth the same treatment; scoped-disabled only
  where the "duplication" is either WeiDU trigger/action reference data
  (`triggers.ts`/`actions.ts` - many entries legitimately share a
  `parameters`/`section` value) or parallel test descriptions across
  independent describe blocks (same shape as the Tier 4 `no-alphabetical-sort`
  false positives).
- `no-nested-incdec`, `prefer-immediate-return`, `no-unused-function-argument`,
  `bool-param-default`, `no-tab`, `no-inconsistent-returns`,
  `expression-complexity`, `nested-control-flow`, `no-collapsible-if`,
  `file-name-differ-from-class`, `shorthand-property-grouping` - all real,
  all fixed. Two `bool-param-default` hits were scoped-disabled instead:
  `main.service.test.ts`'s `fakeCreature(valid)` and `weidu.utils.ts`'s
  `getBooleanValue(value)` both use `undefined` as a genuine third state
  (not "never validated" vs `false`/`true`, or "don't write this field at all"
  vs `"0"`/`"1"`) - a default would silently change behavior, not just style.

**Turned on via configuration instead of fighting the codebase:**
- `arrow-function-convention` (311 raw hits → 1) - `requireParameterParentheses: true`
  makes the rule agree with this project's own Prettier default (parens
  always on single-param arrows) instead of contradicting it.
- `no-reference-error` (29 raw hits → 0) - was false-positiving on `console`
  and every other real Node global because the rule does its own scope
  analysis independent of tsc's types; added `languageOptions.globals:
  globals.node` (new `globals` devDependency).

**Left off** (`eslint.config.mjs` has the per-rule reasoning inline):
`no-undefined-assignment` (fights the TS-undefined/optional-property idiom
used throughout the model), `file-header` (not a convention this project
uses), `elseif-without-else` (would force empty `else {}` on dispatch-style
chains), `no-wildcard-import` (conflicts with `import * as fs from "fs"`),
`cyclomatic-complexity` (redundant with `cognitive-complexity`, which
deliberately doesn't penalize flat dispatch switches the same way),
`no-commented-code` (would relitigate `TODO_ROADMAP.md`'s already-tracked
blocks), `max-lines`/`max-lines-per-function` (large creature-family
files/functions are large because the domain is large).

**Turned on with no findings** (kept as a zero-cost safety net): the
remaining ~40 rules, mostly security-oriented checks with no web/cloud
attack surface in this codebase (AWS IAM, web SQL, OS command injection,
etc.) plus assorted style rules that happened not to fire here.

## Process

Same as `LINT_ROADMAP.md`: audit → fix or scoped-disable-with-comment → verify
(`npx prettier --write`, `npx eslint`, `npx tsc -p tsconfig.eslint.json`,
`npx vitest run` on the touched files + `pipeline.golden.test.ts`) → periodic
full `npm run build` + `npm test` → commit in batches.
