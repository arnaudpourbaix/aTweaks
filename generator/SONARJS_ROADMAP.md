# SonarJS Roadmap

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
separate groups because they map to *different* TS discriminated-union effect
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
  *before* `generateCommonCode()` (→ `weiduFunctionService.generateImmunities()`,
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

## ☐ 3. Cognitive complexity (9 functions over the 15-point threshold)

Audit and refactor the worst ones, same one-file-at-a-time treatment as the
rest of this project's lint work - extract helpers where it genuinely
clarifies, leave alone where the complexity is inherent to the domain (e.g. a
large WeiDU opcode dispatch that's already organized as a flat switch, which
is arguably more readable *as* a switch than split across several
indirection layers).

## ☐ 4. Everything else (11 findings, low-stakes style)

- `no-alphabetical-sort` (5, all in test files sorting plain ASCII identifiers
  like `"Player1"` or file paths for deterministic comparison) - locale
  correctness is irrelevant for internal test-only ordering of ASCII strings.
  Leaning toward scoped disables rather than adding a no-op comparator, but
  not decided yet.
- `no-undefined-argument` (2, `target.service.test.ts` - explicit
  `fakeCreature(undefined)` where the param already defaults) - trivial,
  safe to just drop the argument.
- `use-type-alias` (1, `triggers.ts:228`) - style preference.
- `no-nested-template-literals` (1, `weidu-creature.service.ts:232`) - style.
- `no-small-switch` + `prefer-default-last` (2, `i18n.ts:21-22`) -
  **confirmed intentional**: this project ships English only; the
  `default: case "english":` switch is a placeholder for anyone who wants to
  contribute other-language translations later, not an oversight. Leave as-is;
  disable both rules for this file.
- `max-switch-cases` (1, `effect.service.ts:47`, 58 cases vs. a 30 max) - the
  switch dispatches over `EffectTypeEnum`, a large real domain (WeiDU opcodes);
  splitting it wouldn't reduce real complexity, just relocate it. Leaning
  toward raising the threshold or disabling for this file - not decided yet.

---

## Process

Same as `LINT_ROADMAP.md`: audit → fix or scoped-disable-with-comment → verify
(`npx prettier --write`, `npx eslint`, `npx tsc -p tsconfig.eslint.json`,
`npx vitest run` on the touched files + `pipeline.golden.test.ts`) → periodic
full `npm run build` + `npm test` → commit in batches.
