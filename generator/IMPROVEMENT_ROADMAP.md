# Improvement Roadmap

Follow-up to `BUGFIX_ROADMAP.md` (closed out 2026-07-10, all 11 findings resolved).
That audit's bugs were all hiding in untested branches — a truthy check instead of
`.length`, an `if/else` whose side effect landed on the wrong object. Two gaps remain
that are likely to keep producing that same shape of bug:

1. **Known, self-documented gaps** — 9 `TODO`/`FIXME` comments already left in the
   code marking deliberately incomplete or disabled logic.
2. **Untested branches in complex logic files** — overall branch coverage is 88.8%
   against 94.75% statement coverage (`npm test`, 2026-07-10). Every file already
   fixed in the bugfix roadmap (`creature.ts`, `effect.factory.ts`, `item.service.ts`)
   sits in the lower half of this list, which is why the rest are worth auditing with
   the same method rather than assuming they're fine.

Status legend: ☐ not started · ▶ in progress · ✅ fixed & committed ·
🟡 reviewed & decided not to change · ⏸ deferred (deliberately postponed)

---

## Tier 1 — known gaps (`TODO`/`FIXME` already in code)

### 1. ✅ `description.service.ts:276` `getProbability()` — `probability2` never rendered

```ts
getProbability(effect: Effect): string {
  //TODO: handle probability2
  return effect.probability1 && effect.probability1 < 100
    ? ` (${effect.probability1}%)`
    : "";
}
```

Only `probability1` is ever shown in generated documentation. If any effect config
sets a meaningful `probability2` (dual-probability effects, e.g. different chance
per save-vs-fail outcome), it's silently dropped from the docs.

**Fix applied:** when `probability2` is set, it must be greater than
`probability1` (throws otherwise) and the displayed percentage becomes
`probability2 - probability1` (e.g. `probability1: 20, probability2: 60` →
`" (40%)"`). When `probability2` is absent, behavior is unchanged.

**Confirmed no current impact:** no shipped effect config sets `probability2`
today — full regeneration (golden/pipeline tests) produced no output changes.
Added 2 tests to the existing `getProbability` block in
`description.service.test.ts` (verified they fail against the old code, pass
with the fix).

### 2. ✅ `description.service.ts:373` `getParalyze()` — IDS entry/id not reflected in text

```ts
private getParalyze(effect: IdsEffect, target: ItemAbilityTargetEnum): string[] {
  const results: string[] = [];
  //TODO: handle ids entry/id
  results.push(`Paralyze ${this.getTarget(target)} for ${this.getDuration(effect.duration)}${this.getSaveText(effect)}.`);
  return results;
}
```

`IdsEffect` carries an IDS file/entry (e.g. race- or class-restricted paralyze), but
the generated sentence never mentions the restriction — documentation reads as an
unconditional paralyze even when the effect only triggers against a specific race/
class.

**Fix applied:** the generic `EA`/`"ANYONE"` (unrestricted) case is unchanged. Any
other `idsFile`/`idsEntry` combination (most likely `GENERAL` or `RACE`) now
appends `" (only affects ${entry})"` before the save-text clause, with `entry`
run through a new `toPascalCase()` helper for readability — e.g. `idsEntry:
"HALF_ELF"` renders as `"Half Elf"`, not `"HALF_ELF"`. `toPascalCase()` splits
on any run of non-alphanumeric characters (`_`, `-`, etc.), capitalizes each
word, and joins with a space.

**Investigation note:** the literal `Paralyze` opcode this function renders is
distinct from `EffectTypeEnum.Hold`, which is what the widely-used
`effectFactory.paralyze()` helper actually generates (see `BUGFIX_ROADMAP.md`
#6). `Hold` currently has **no case at all** in `getEffectDescription()`'s
dispatch chain, so the real, race-restrictable paralysis abilities (undead,
slimes, crawlers, bears) produce no doc text for that effect regardless of this
fix. That's a separate, larger gap — tracked as new item #11 below rather than
folded into this one.

**Confirmed no current impact on today's output:** the only shipped `Paralyze`-
opcode effect (`lib/creatures/spiders.ts:173-179`) already uses the generic
`EA`/`ANYONE` case — full regeneration (golden/pipeline tests) produced no
output changes. Added tests for the restricted-race/general cases and for
`toPascalCase()` directly in `description.service.test.ts` (verified they fail
against the old code, pass with the fix).

### 3. ✅ `item.service.ts:118-127` `isEquippedWeapon()` — multi-slot weapon arrays under-handled

```ts
isEquippedWeapon(item: EquippedItem): boolean {
  //TODO handle case where you have an array of WEAPON slots
  if (
    Array.isArray(item.slot) &&
    !item.slot.every((s) => WEAPON_SLOTS.map((w) => w.slot).includes(s)) &&
    item.slot.length !== 1
  )
    return false;
  const slot = Array.isArray(item.slot) ? item.slot[0] : item.slot;
  return WEAPON_SLOTS.map((s) => s.slot).includes(slot);
}
```

Companion to the already-reviewed `isSlotIncluded()` (`BUGFIX_ROADMAP.md` #8, left
as-is).

**Decision (from the maintainer):** a weapon is "equipped" if *all* of its slots
are weapon slots.

**Investigation result — this was already correct, just confusingly written:**
tracing every input through the old guard clause (single slot, all-weapon array,
mixed array with length > 1, mixed single-element array, empty array) shows it
already produced exactly the "all slots must be weapon slots" result in every
case — the `item.slot.length !== 1` clause never actually changed the outcome,
it was dead complexity that made the function look buggier than it was. This
was a readability fix, not a behavior fix.

**Fix applied:** replaced the guard-clause version with a direct
`slots.every(...)` check (plus an explicit empty-array guard, since
`[].every()` is vacuously `true`). Added `item.service.test.ts` (this service
had zero test coverage before) — 6 tests covering single slot,
all-weapon/mixed/empty arrays. All 6 pass unchanged against both the old and
new implementation, confirming no behavior change; kept as a regression net
for the simplified logic.

### 4. ✅ `target.service.ts:62` `getTargetFromAbility()` — random-order targeting disabled

```ts
if (randomOrder) {
  // result.targets = utils.shuffleArray(result.targets); // TODO: disable to prevent file changes (since generated sources are committed)
}
```

`randomOrder` is accepted as a parameter but does nothing — commented out because
shuffling would make regenerated `.baf` output non-deterministic (bad for a repo
that commits generated sources).

**Context (from the maintainer):** the generator was originally a separate repo
from the mod, so `randomOrder`'s `Math.random()` shuffle was fine. After
merging the two repos, every regeneration reshuffled and churned the
committed `.baf` files, so it was disabled as a stopgap. The actual intent:
`randomOrder` should use real, non-deterministic shuffling, but stay off
during day-to-day development and only be switched on deliberately for a
final release build.

`TARGET_LISTS` entries (e.g. `"FarthestEnemies"`) are a fixed, ordered list of
WeiDU object identifiers (`"FarthestEnemyOf(Myself)"`,
`"SecondFarthestEnemyOf(Myself)"`, ...); `addStatementsFromTargetList()` turns
each into its own top-level block in the generated `.baf`, and since IE scripts
run blocks top-to-bottom and act on the first one whose triggers pass, this
order is what determines real in-game target preference once generated —
confirmed this isn't about per-cast runtime randomness, it's about not
defaulting every `randomOrder` ability to strict nearest/farthest-first.

**Fix applied:** restored the real shuffle (`utils.shuffleArray`), gated
behind a new `GLOBAL_CONFIG.enableRandomTargetOrder` flag (default `false`),
following the same plain-boolean pattern as `constitutionAffectHitPoint` /
`spellcasterPrecastMidDurationSpells` already in `lib/config/generate.ts`.
With the flag off (today's default), behavior and output are byte-for-byte
identical to before. Flipping it to `true` and regenerating once is the
"activate before release" step the maintainer described.

**Confirmed no current impact with the flag off:** full regeneration produced
zero file changes beyond the code/test edits themselves. Added a
`randomOrder` test block to `target.service.test.ts` (this function had no
coverage of the `randomOrder` behavior before) — covers flag-off (no
shuffle), `randomOrder: false` (no shuffle even with the flag on), shuffle
invoked with both true, and shuffle applied before `limit`.

### 5. ✅ `statement-builder.service.ts:852` `attackTargetWithStatuses()` — unlabeled TODO

```ts
const list = targetService.getList(targetListName); //TODO:
```

Bare `//TODO:` with no description. Git history traced it to a large multi-file
"wip: triggers" refactor commit (`09cf5c81`) with no note on what it was
flagging. Per the maintainer: stale, no specific concern remembered.

**Fix applied:** removed the comment. No behavior change.

### 6. ✅ `statement-builder.service.ts:981` — potion-use message hardcoded to `@3002` instead of a translation key

```ts
{
  name: "DisplayStringHead",
  params: [ScriptTarget.myself, `@3002`], // TODO: should be "common.potion.use", but languages file are generated after
},
```

Every other display string in this codebase goes through the translation system;
this one was hardcoded, supposedly because language files are generated in a
later pipeline stage than this one runs.

**Investigation result — the stated reason was stale, same shape as #3 and #5:**
`translationService`'s constructor calls `generateStringRefs()` immediately,
which walks every static translation key and assigns it a strref number
upfront — before any creature generation runs. So `translationService.stringRef(key)`
already works at this point in the pipeline regardless of when the `.tra` file
is *written* to disk; there was no real ordering constraint. The
`common.potion.use` key (`"*quaffs a potion*"`) already existed in
`lib/translations/en/common.ts` — it just wasn't being used.

**Fix applied (by the maintainer):** replaced `` `@3002` `` with
`translationService.stringRef("common.potion.use")`. Regenerated 10 `.baf`
files across the `ogre/` family (creatures with `usePotions: true`) — each
`DisplayStringHead(Myself,@3002)` (an unresolved, dead placeholder) became
`DisplayStringHead(Myself,10110)` (the real, working strref).

### 7. ✅ `baf.factory.ts:28-38` `addStatementsFromTargetList()` — `random` targeting disabled, biased distribution

```ts
if (p.random && index < targets.length - 1) {
  // FIXME: random is disabled because it has a critical issue.
  // let's say it targets 6 nearest enemies, each enemy has an equal chance to be selected
  // if there are 6 enemies, this is working as intended
  // if there are 3 enemies, there is 50% of no target selection, which is not intended
  // NumCreatureGT could help but it would make code more complex
}
```

**Confirmed root cause:** each generated per-target block includes a
`See(target)` trigger (via `triggerFactory.validAttackTarget`), which fails
when that ranked target (e.g. `FourthNearestEnemyOf`) doesn't exist. The
`RandomNumLT` formula computes its decline probability from the *static*
`targets.length`, assuming all `N` slots are eventually reachable. When fewer
real enemies exist, the decline-probability mass reserved for the
never-reachable trailing slots is wasted — nothing forces a pick among the
real candidates once you run past them. Traced the exact numbers in the
FIXME: 3 real enemies against a 6-slot list gives `(5/6)(4/5)(3/4) = 50%`
chance nothing is picked, exactly matching the comment. A correct fix needs a
*runtime* enemy count (`NumCreatureGT` or similar) to compute the probability
dynamically — not something guessable without WeiDU trigger expertise.

**Also found:** this `random` flag (`TargetList.random`, distinct from item
#4's `randomOrder`) was set to `true` by **zero** shipped creatures or
presets — fully dead, unlike `randomOrder`'s 60+ usages.

**Decision (from the maintainer):** since it's unused today and a correct fix
needs runtime trigger logic beyond what's safe to guess at, remove the dead
machinery rather than leave it half-disabled.

**Fix applied:** removed `random?: boolean` from `TargetList`
(`model/script/target.ts`), from `addStatementsFromTargetList()`'s param type
and body (including the disabled `RandomNumLT` block) in `baf.factory.ts`,
and from all three call sites in `statement-builder.service.ts`. Left
`addOneBlockTargetList()` (a different function in the same file) untouched —
it has its own, *not* disabled `RandomNumGT`-based random implementation
unrelated to this TODO.

**Confirmed no impact:** full regeneration produced zero file changes beyond
the code edits themselves.

### 8. ⏸ `ability.factory.ts:20-35` `polymorphSelf()` — situational form selection not implemented

**Deferred by the maintainer — low priority, revisit later.**

```ts
// TODO: cover all these creatures
// Set intelligent form depending on situation
// Fast form to run away or track players
// Strong melee form in melee
// Strong range in ranged
```

Currently all 9 polymorph forms are added with equal, unconditional probability —
none of the "pick fast form to flee / strong melee in melee / strong ranged at
range" situational logic described in the comment exists. This is a feature gap,
not a bug: needs a design decision on whether this is worth the trigger complexity
before implementing, since `statement-builder.service.ts` already has to reject "OR
triggers not handled currently" in nearby code (line 848).

### 9. ✅ `weidu-family.service.ts:69-72` `generateFinalCode()` — `integrate_sectypes` disabled for install-time cost

```ts
if (family.spells.some(...) || family.creatures.some(...)) {
  //FIXME: enable in the end (disabled because it greatly decreases installation time)
  // this.add(lines, "LAF integrate_sectypes END", 0);
}
```

The condition to call `integrate_sectypes` is still evaluated and presumably
intended to matter (secondary spell types not integrated into IDS otherwise), but
the actual call is commented out repo-wide because it tanks install time.

**Fix applied:** same pattern as item #4/#7 (per the maintainer) — gated the
`LAF integrate_sectypes END` call behind a new
`GLOBAL_CONFIG.enableSecondaryTypes` flag (default `false`). Keeps install
time fast during day-to-day development; flip to `true` and regenerate once
for a release build so secondary spell types actually get integrated. The
existing condition (only run when a family/creature spell has a
`secondaryType`) is preserved unchanged.

**Confirmed no current impact with the flag off:** full regeneration produced
zero file changes beyond the code/test edits. Added
`weidu-family.service.test.ts` (this service had no test coverage before) —
4 tests covering flag-off (no emit), flag-on with a family-level secondary
type, flag-on with a creature-level secondary type, and flag-on with no
secondary type anywhere (condition still respected).

### 10. ✅ `effect.service.ts:263-266` `CurrentHPbonus` — unhandled `flag` field

```ts
case EffectTypeEnum.CurrentHPbonus:
  effect.parameter1 = `${effect.value}`;
  effect.parameter2 = `${effect.type}`; //TODO: handle flag if necessary
  break;
```

`CurrentHPbonus` effects may carry a `flag` (opcode 428 supports flags like
"instant/no visual"), but nothing reads or emits it here.

**Decision (from the maintainer):** nothing to do here — removed the TODO
comment. No behavior change.

### 11. ✅ `description.service.ts` `getEffectDescription()` — `EffectTypeEnum.Hold` is never documented

Found while working item #2. `getEffectDescription()`'s `if`/`else if` dispatch
chain (`description.service.ts:192-254`) has no branch for
`EffectTypeEnum.Hold` — search the file for `"Hold"` and there isn't a single
match. That matters because `effectFactory.paralyze()`
(`lib/src/factories/effect.factory.ts:64-125`, see closed `BUGFIX_ROADMAP.md`
#6) — the helper actually used by real paralysis abilities across `undead.ts`,
`slimes.ts`, `crawlers.ts`, `bears.ts`, and `poison.service.ts` — emits its
core effect as `opcode: EffectTypeEnum.Hold`, not `EffectTypeEnum.Paralyze`.
Every one of those abilities currently produced **zero lines of documentation**
for the actual paralyze/hold effect (confirmed: the string "Paralyze" did not
appear anywhere in the generated `docs/monsters.html` before this fix).

**Fix applied:** per direction from the maintainer — Hold and Paralyze are
kept as distinct effect opcodes (gameplay-wise they must remain separate), but
they are described identically to the player, so `getEffectDescription()` now
routes both `EffectTypeEnum.Paralyze` and `EffectTypeEnum.Hold` to the same
`getParalyze()` renderer. No new function needed since `getParalyze()` already
operates on the shared `IdsEffect` shape (target/duration/restriction/save
text) regardless of which of the two opcodes it's called for.

**Confirmed real impact (this was a live bug, not dormant):** regenerating
output changed `docs/monsters.html` (2 creatures gained a `"Paralyze target
for ..."` line where there was previously none) and all 7
`tra/*/generated.tra` files. Most notably, Mummy and Greater Mummy's
paralyzing-touch ability string refs (`@10789`, `@10790`, `@10794`, `@10795`
in `tra/english/generated.tra`) went from **literally blank** (`~~`) to their
correct text, e.g. `"Paralyze target for 3 rounds (saves vs spell at +2)."`
Added a routing test to the `getEffectDescription (private, dispatcher)` block
in `description.service.test.ts` (verified it fails against the old code,
passes with the fix).

The other `IdsEffect` opcodes (`Slay`, `UseEFFFile`,
`DamageVsCreatureTypeModifier`, `Thac0VsCreatureTypeModifier`) still have no
case in the dispatch chain — not addressed here, worth checking separately.

---

## Tier 2 — branch-coverage audit candidates (no known TODO, but low branch coverage)

Overall: **88.8% branches / 94.75% statements** (`npm test`, 2026-07-10). The files
below have real conditional logic (not data tables) and sit well below that average.
Ordered lowest branch % first; each is a candidate for the same treatment the
bugfix roadmap gave `ability.service.ts`, `effect.factory.ts`, and `creature.ts` —
add tests for the untested branches first, *then* decide whether any exposed
behavior is a bug.

| Branch % | Stmt % | File |
|---|---|---|
| 11% | 100% | `lib/src/factories/ability.factory.ts` |
| ~~13%~~ 100% | 100% | ~~`lib/src/services/utils/weidu.utils.ts`~~ (stale figure, see below) |
| 25% | 96% | `lib/src/services/state.service.ts` |
| 28% | 100% | `lib/src/services/weapon.service.ts` |
| 32% | 100% | `lib/src/services/weidu/weidu-family.service.ts` |
| 33% | 100% | `lib/src/services/effects/grab.service.ts` |
| 33% | 100% | `lib/src/services/effects/immunity.service.ts` |
| 35% | 74% | `lib/src/services/kit.service.ts` |
| 36% | 92% | `lib/src/services/weidu/weidu-core.service.ts` |
| 47% | 98% | `lib/src/services/hit-point.service.ts` |
| 50% | 88% | `lib/src/services/item.service.ts` |
| 52% | 90% | `lib/src/model/creature/abstract-creature.ts` |
| 53% | 89% | `lib/src/services/main.service.ts` |
| 53% | 89% | `lib/src/services/weidu/weidu-projectile.service.ts` |

`kit.service.ts` stands out — it's the only file here with statement coverage
meaningfully below the project average (74%) *and* low branch coverage, meaning
whole code paths, not just branches, are unexercised. Suggest starting there.

Files already covered by the closed bugfix audit (`creature.ts` 43%,
`effect.factory.ts` 49%, `weidu-core.service.ts` 36%) are listed for reference, not
re-investigation — they already went through this process and either got fixed
(#5, #6) or reviewed and left as-is (#10).

### ✅ `kit.service.ts` — audited

Added `kit.service.test.ts` (no coverage before) — 18 tests covering
`applyKit()`, `removeKit()`, `applyKitImmunities()`, and `applyKitAbilities()`.

**Bug found and fixed — `applyKitImmunities()` deduped against the wrong
object:**

```ts
applyKitImmunities(creature, baseCreature, immunities) {
  baseCreature.data.immunities ??= [];
  for (const name of immunities) {
    if (!creature.data.immunities.includes(name)) {
      baseCreature.data.immunities.push(name);
    }
  }
}
```

It checked whether an immunity was already present on `creature.data.immunities`
(the root creature) before pushing, but pushed onto `baseCreature.data.immunities`
— a *separate* array when `baseCreature` is an adjustment. If the adjustment's
own `data.immunities` already independently listed that immunity, this pushed a
literal duplicate entry rather than checking against `baseCreature` itself.

**Fix applied:** the guard now checks both `creature.data.immunities` and
`baseCreature.data.immunities` before pushing, preserving the original
cross-creature dedup while adding the missing same-object dedup. Confirmed no
current impact: full regeneration produced zero output changes (no shipped
ogre/adjustment combination currently overlaps this way) — the same dormant
shape as several closed bugfix items.

**Also found, not changed:** `removeKit()` — the "adjustment overrides with a
different kit" path in `applyKit()` — is 100% dead in shipped config today.
The one place that would exercise it (`kit: "BERSERKER"` on a Tazok
adjustment in `lib/creatures/ogres.ts:797`, overriding the root creature's
`TRUECLASS`) is commented out. Tests cover this path (locking in current
behavior) in case it's re-enabled later, but nothing was changed here.

### ✅ `ability.factory.ts` `polymorphSelf()` — audited, no bug found

Added `ability.factory.test.ts` (no coverage before) — 6 tests covering the
cast-trigger entry and all 9 polymorph-form entries.

**No bug found — the reservoir-sampling math checks out.** Each of the first
8 forms gets a `RandomNumLT(1000, round(1000/(9-index)))` trigger with a
correctly *decreasing* threshold (111, 125, 143, 167, 200, 250, 333, 500),
and the 9th/last form has no trigger at all — an unconditional fallback if
every earlier roll declines. That's the textbook unbiased sequential-selection
formula, verified by test. Notably, this is the same formula item #7's
disabled `baf.factory.ts` code was trying to use — it works correctly *here*
because these are all self-targeted abilities with no `See(target)`-style
existence check that could make a later slot systematically unreachable (the
complication that made item #7's version biased).

The only real gap here remains the already-deferred item #8: no situational
form selection (flee/melee/ranged), just uniform random among all 9 forms.
Not touched — that's a feature decision, not a correctness bug.

### 🟡 `weidu.utils.ts` — table figure was stale, no work needed

Re-checked before starting: this file is already at **100% branches / 100%
statements**, fully covered by its existing 7-test file. The "13%" branch
figure in the original Tier 2 table was wrong — a leftover from the
regex-based HTML scraping used to build that table, which was already flagged
as having some false positives. Nothing to do here.

### ✅ `state.service.ts` — audited, no bug found

Added `state.service.test.ts` (no coverage before) — 7 tests covering
`buildParameters()`'s parsing of every real parameter prefix shape found in
`Actions.ACTIONS`/`Triggers.TRIGGERS` (`O:`, `I:`, `S:`, the `I:Object*`
special case that's an object despite the `I:` prefix, and the
`I:DmgType*Damages`-style trailing qualifier after the `*`). All pass against
the current implementation — no bug found in any reachable path.

Now at 100% branches / 100% statements (up from 25%/96%). The one remaining
gap is `Promise.reject(error)` inside `init()`'s `catch` block — an
untested defensive error-propagation path with no bug risk, not worth
mocking a forced failure for. No fix needed.

---

## Process

Same as `BUGFIX_ROADMAP.md`: for each item, add/extend tests to lock in current
behavior → decide fix vs. leave-as-is → apply fix if needed → regenerate affected
`.baf`/doc output if it changes → review → commit.
