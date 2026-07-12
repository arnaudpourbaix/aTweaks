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

### ✅ `weapon.service.ts` — table figure was stale (same issue as `weidu.utils.ts`)

This file already had 12 tests before this audit — the "28%" table figure was
wrong for the same reason as `weidu.utils.ts` above. Real number: 96.55%
branches (28/29), one gap: the `else` path of
`if (item.enchant && (!weapon.flags || !weapon.flags.includes(ItemFlagEnum.Magical)))`
in `checkEnchantment()` — never tested with a weapon that already has the
`Magical` flag. Added one test for that case; confirmed correct (no duplicate
flag pushed). Now 100% branches. No bug found.

**Note:** at this point the original Tier 2 table above was confirmed
unreliable in several places (also true for `weidu.utils.ts` and
`weapon.service.ts`) — a fresh, accurate branch-coverage pass was taken
instead of continuing down the stale table. New leader:
`weidu-item.service.ts` at 50% (20/40).

### ✅ `weidu-item.service.ts` — audited, one dead branch simplified away

Added `weidu-item.service.test.ts` (no coverage before) — 15 tests covering
`createItem()` (stringRef comment, `copyFrom`-via-immunity vs. plain file
name, the "immunity has no itemSlot" throw, header presence, the projectile
type guard, immunities) and `createItemHeader()` (Melee/Ranged/neither swing
animation defaults, `abilityflags`).

**Confirmed-dead branch, simplified rather than tested (it's untestable):**

```ts
if (item.header.projectile) {
  if (typeof item.header.projectile !== "string")
    throw new Error(`Unhandled projectile!`);
  const projectile = item.header.projectile
    ? `(IDS_OF_SYMBOL (~projectl~ ~${item.header.projectile}~)) + 1`
    : "";
  this.write(lines, 0x9c, 2, projectile, 2);
}
```

The inner ternary re-checks `item.header.projectile` truthiness, but the
outer `if` already guarantees it's truthy — the `: ""` branch is provably
unreachable, not just untriggered by current config. Simplified to a plain
template string with no ternary. No behavior change (confirmed via full
regeneration — zero output diff). Now 100% branches/statements.

### ✅ `weidu-projectile.service.ts` — audited, plus a real architectural bug found and fixed

Added `weidu-projectile.service.test.ts` (no coverage before) — 6 tests
covering `createProjectile()`'s 4 conditionals (`NoBAM` vs. not, `projectileInfo`
present/absent, `areaEffectInfo` present/absent). Only one real projectile is
ever configured in shipped content (`lib/creatures/basilisks.ts:257`,
`AreaOfEffect`), so 3 of the 4 conditionals' branches were previously
untriggered by anything — dormant, not buggy; all pass against the current
implementation once written.

**Found a real, pre-existing circular-import bug while writing the test —
unrelated to projectile logic, but real:**

```
abstract-weidu.service.ts -> utils.service.ts -> translation.service.ts -> abstract-weidu.service.ts
                                                   (class TranslationService extends AbstractWeiduService)
```

`utils.service.ts`'s `resolveStringRef()` needs `translationService`, and
`TranslationService` extends `AbstractWeiduService` (for `add()`/`initLines()`
only — it never used any of `AbstractWeiduService`'s `utils`-dependent
methods). This cycle happened to never crash in the real generator because
some other import elsewhere always fully resolved `translation.service.ts`
before anything imported `abstract-weidu.service.ts` as the *first* link in
the chain — but it's fragile, and `weidu-projectile.service.test.ts` (the
first thing to import `abstract-weidu.service.ts` without that lucky
pre-resolution) crashed immediately with `Class extends value undefined is
not a constructor` the moment it was added.

**Fix applied:** extracted `add()`/`initLines()` — the only two methods
`TranslationService` actually used — into a new dependency-free
`AbstractCodeService` (`lib/src/services/abstract-code.service.ts`, no
imports beyond the `CodeLine` type). `AbstractWeiduService` now extends
`AbstractCodeService` and keeps its `utils`-dependent methods
(`write`/`writeStringRef`/etc.); `TranslationService` now extends
`AbstractCodeService` directly instead of `AbstractWeiduService`, breaking
the cycle entirely. Every other `Weidu*Service` class still extends the full
`AbstractWeiduService` unchanged. Confirmed no behavior change: full
regeneration produced zero output diff, all 577 tests pass (up from 571).

### ✅ `main.service.ts` — partially audited, no bug found

Added `main.service.test.ts` (no coverage before) — 4 tests covering
`isCreatureValid()`'s three states (`undefined`/`false`/`true`) and
`generateCreature()`'s early-return for an invalid creature. Branches
86.95% (20/23), up from 73.9%.

**Stopped short of 100% deliberately:** the remaining 3 uncovered branches
(`generateCreatures()`'s "family already declared" throw,
`checkSpells()`'s "spell file declared multiple times" and "spell identifier
declared multiple times" throws) all read real global module-level config
(`familyFactories`, `SPELLS`) rather than taking parameters. Testing them
would need `vi.mock()`-ing those imports — disproportionate effort for
guards that are simple, obviously-correct `if (list.includes(x)) throw;
list.push(x);` duplicate-detection patterns with no bug risk on inspection.
No fix needed; not pursued further.

### ✅ `model/creature/data.ts` — audited, no bug found

Added 10 tests to the existing `data.test.ts` — `level2`'s already-built-Level
passthrough (the other two level setters were already covered, this one
wasn't), and the full `boolean` / `merge-into-existing-array` /
`replace-non-array` / `left-untouched` matrix for both the `spells`
(`removeMemorized`) and `effects` (`remove`) setters. All pass — no bug
found; the merge logic here is actually a more graceful version of the
"union-typed remove field" pattern than `kit.service.ts`'s `removeKit()`
(which just throws on a boolean/array conflict instead of merging). Branches
90.9% (40/44), up from 75%.

**Two remaining gaps left alone deliberately:** the final `else if
(Array.isArray(...))` in both the `spells` and `effects` setters is provably
unreachable — the field type is `boolean | string[] | undefined`, and by
that point `undefined` and `boolean` are already handled, so TS narrowing
guarantees an array. Same shape as the `weidu-item.service.ts` dead branch,
but here "fixing" it means restructuring two related conditions rather than
deleting one redundant ternary, and the explicit `Array.isArray` checks read
more defensively than a bare `else` would. Left as-is, consistent with the
closed bugfix roadmap's item #10 precedent (don't simplify when the fix
would be worse than the original).

### ✅ `baf.factory.ts` — second dead random flag found and removed

Continuing the audit of this file (item #7 already removed
`addStatementsFromTargetList`'s dead `random` machinery). The two remaining
uncovered branches were both in the *other* function, `addOneBlockTargetList()`.

**Found: `addOneBlockTargetList()`'s `random` flag is also 100% dead.** Its
one caller (`statement-builder.service.ts:885`, `attackTargetWithStatuses`)
never passes `random` at all. Unlike item #7's version, this one had no
FIXME explaining a known defect, and its trigger structure (`RandomNumGT`
inside an `Or` of inverse-negated per-rank triggers, all AND'd together
across ranks into one block) is different enough that correctness wasn't
independently verifiable without deeper domain knowledge.

**Decision (from the maintainer):** remove it, same treatment as item #7.

**Fix applied:** removed `random?: boolean` from the param type, the
`p.random = p.random ?? false` line, the `max` constant, and the
`if (p.random && index < targets.length - 1) orTrigger.triggers.push(...)`
block. Confirmed zero output impact via full regeneration.

Added an `addOneBlockTargetList` describe block to `baf.factory.test.ts`
(this function had no coverage before) — 5 tests covering the per-target
`Or`/negation-inversion structure, `inBetweenStatements` present/absent, the
final statement's `LastSeenBy` resolution, and `reverse`. Now 100%
branches/statements for this file.

### ✅ `translation.service.ts` — audited, no bug found

Added `translation.service.test.ts` (no coverage before) — 7 tests covering
`stringRef()`'s unknown-key throw, `fromOptional()`'s undefined case,
`from()`'s numeric-stringRef-not-found throw, `addCustomTranslation()` +
resolving it back, `interpolate()`'s undefined-var throw, and (once found)
private `fromStringRef()`'s `lang` default parameter — which turned out to
be dead in practice, since its only call site (`from()`) always passes
`lang` through explicitly, even when `from()` itself used its own default.
Harmless (no behavior difference either way), closed directly by invoking
the private method with no second argument. All pass — no bug found. Now
100% branches/statements for this file.

### ✅ `model/creature/abstract-creature.ts` — audited, no bug found

Added `abstract-creature.test.ts` (no coverage before) — 8 tests covering
`projectile()`'s not-found throw, `ability()`'s no-ability throw,
`addSpell()`/`addItem()`'s duplicate-id throws, and `attachSpellToWeapon()`'s
`CastSpell`/`RemoveSpell` effect attachment (including the `cast.remove`
branch). All pass — no bug found. Now 100% branches/statements for this file
(up from 79.16%).

### ✅ `weidu-spell.service.ts` — audited, no bug found

Added `weidu-spell.service.test.ts` (no coverage before) — 9 tests covering
`createSpell()`'s `deleteHeaders` (array/neither-true-nor-array) and
`deleteOpcodes` branches, the `options` block's `spellType`/`castingTime`
INT_VARs, and `createSpellHeader()`'s `location`/`target` presence, the
projectile type guard, and the `spell.level ?? 0` power fallback (both in the
main effects list and the per-header effects list — same pattern as
`weidu-item.service.ts`'s `power` handling, `0` is falsy so the fallback
renders as an *omitted* `power=` rather than `power=0`). All pass — no bug
found. Now 100% branches/statements (up from 80%).

### ✅ `model/creature/creature.ts` — one dead branch simplified, otherwise clean

Added 7 tests to the existing `creature.test.ts` — `setAttack()`'s
no-actions-given fallback, per-action field defaulting, and melee/ranged
defaults/overrides; `addItem()`'s equip/no-equip/replace-existing-slot cases.

**Found another provably-dead branch, same shape as `weidu-item.service.ts`'s:**

```ts
override addItem(item: PartialItem): Item {
  const result = super.addItem(item);
  if (!item.equippedSlot) return result;
  // ...
  if (item.equippedSlot) {          // <- always true here, already returned above if falsy
    this.data.items.equipped.push({ file: result.file, slot: item.equippedSlot });
  }
  return result;
}
```

The second `if (item.equippedSlot)` re-checks something the early return at
the top of the method already guarantees. Simplified to drop the redundant
wrapper. Confirmed zero output impact via full regeneration. Now 100%
branches/statements for this file (up from 81.25%).

### ✅ `creature.factory.ts` — partially audited, one gap confirmed as already-known

Added `creature.factory.test.ts` (no coverage before) — 6 tests covering
`checkValidation()`'s already-validated throw and `equipItem()`'s no-slot
throw, the equip push, and the slot-conflict warning. Branches 89.79%
(44/49), up from 81.63%.

**Found the same "array vs bare-string slot" fragility as
`item.service.ts`'s `isSlotIncluded()`** (`BUGFIX_ROADMAP.md` #8, reviewed
and left as-is): `equipItem()`'s conflict check does `e.slot[0]`, but
`EquippedItem.slot` is typed `ItemSlot | ItemSlot[]`, and real config
(`lib/creatures/ogres.ts:553`) does store it as a bare string sometimes. When
that happens, `e.slot[0]` reads the first *character* of the string instead
of comparing slot names, so the conflict warning silently doesn't fire. Same
conclusion as the precedent: this is purely a `console.log` warning — the
item is still equipped either way regardless of whether the check fires — so
consistent with that decision, locked in as current (imperfect but
zero-functional-impact) behavior via a test rather than "fixed."

**Stopped short of 100% deliberately:** the remaining 5 branches are all
inside `validate()` (duplicate-monster-id throw, family-mismatch/no-files/
existing-files warnings, and the `valid`-push else-path). Testing them needs
mocking the full downstream creature-processing pipeline
(`creatureService.check`, `immunityService.handleImmunities`, autogeneration,
etc.) — disproportionate effort for warning-only branches with no functional
impact, same reasoning as `main.service.ts`'s stopped-short gaps.

### ✅ `utils.service.ts` — audited, no bug found

Added 20 tests to the existing `utils.service.test.ts` — `resolveStringRef()`
(undefined, resolvable key, resolvable/unresolvable numeric stringRef),
`getImmunityFunctionName()` (object vs. string-lookup forms), `hasImmunity()`
(direct match, recursion into a referenced immunity, not-found throw),
`hasCriticalHitImmunity()` (self-name match, direct list match, recursion,
no-match), the 3 missing `getIdsFileFromSpellProtectionStat()` switch cases
(`Gender`/`Specific`/`State`), `getSpellFunctionName()`'s no-trailing-"name"
case, and 6 `getSpellInfos()` cases covering the not-found/direct-type/
copyFrom-fallback/options-fallback/final-fallback branch chain (including the
`spell.level ?? 1` fallback, only reachable by violating `Spell.level`'s
required-field type). All pass — no bug found. Now 98.82% branches (84/85,
up from 82.35%).

**One gap left alone deliberately:** `writeFile()`'s backslash-path fallback
(`file.lastIndexOf("/")` returning `-1`, falling back to `lastIndexOf("\\")`)
is a pure Windows-path-separator edge case with no logic risk — not pursued.

### ✅ `trigger.factory.ts` — audited, no bug found

Added `trigger.factory.test.ts` (no coverage before) — 12 tests covering
`haveSpellRES()`/`hasItem()`'s `negation` default, `validSpellTarget()`/
`validAttackTarget()`'s `isTargetPlayer` branch (most real call sites target
enemies, so the "is a player" case was untested), `validAttackTarget()`'s
`maxRange` presence, and `inverseNegations()`'s recursion into nested
composite (`Or`) triggers vs. leaf triggers. All pass — no bug found. Now
100% branches/statements (up from 83.33%).

### ✅ `model/creature/family.ts` — audited, no bug found

Added `family.test.ts` (no coverage before) — 10 tests covering
`creature()`'s not-found throw, `sequencer()` (delegates to
`abilityService.getSequencer()` — this and `minorSequencer()` were
apparently never called anywhere in tests before), and the
`item()`/`spell()`/`projectile()` overrides' family-wide fallback search
(found on a later creature after an earlier one doesn't have it, and the
re-throw when nobody in the family has it either). All pass — no bug found.
Now 100% branches/statements (up from 85%).

### ✅ `spell.service.ts` — audited, no bug found

Added `spell.service.test.ts` (no coverage before) — 16 tests covering
`getSpell()`'s doc/level/type defaulting (including the explicit-`undefined`-
with/without-`copyFrom` distinction, same shape as `weidu-item.service.ts`'s
provably-dead-vs-real pattern, but real here since `...others` can genuinely
carry an explicit `undefined` key), the icon-suffix regex, the header-type
throw, header field defaults, racial-resistances auto-add (and its
`addRacialResistances: false` opt-out), `getGroupRessources()`'s not-found
throw, and `addProjectile()`'s object-projectile handling and duplicate-file
dedup guard (this whole private method had never been exercised — 0/1
functions). All pass — no bug found. Now 98.55% branches (68/69, up from
85.5%).

**One gap left alone:** `getGroupRessources()`'s `group.spells ?? []`
fallback is unreachable via real config (`SPELL_GROUPS` is a fixed
non-injectable array; all 34 real entries set `spells`) — not pursued.

### ✅ `effect.service.ts` — real bug found and fixed, now 100% branches

This file's `getEffect()` is a large opcode-dispatch switch; ~15 opcodes had
never been exercised by any test (`AttackDamageBonus`, `ProtectionFromOpcode`,
`PolymorphIntoSpecific`, `Berserk`, `ProficiencyModifier`, `DispelEffects`,
`RemoveOpcode`, `MakeUnselectable`, `OverrideCreatureData`,
`SetAnimationSequence`, plus sub-condition branches on `Regeneration`/
`Disease`/`Poison`'s `icon`, `KillTarget`'s `displayText`,
`NoCollisionDetection`'s `passWalls`, `DisableSpellcasting`'s `showMessage`).
Added ~35 tests to the existing `effect.service.test.ts` covering all of
them.

**Bug found and fixed — `DispelEffects` truthy-checked a meaningful zero,
same shape as several closed-roadmap bugs:**

```ts
case EffectTypeEnum.DispelEffects:
  if (effect.dispelType)
    effect.parameter1 = `${DispelEffectTypeEnum[effect.dispelType ?? 0]}`;
  if (effect.magicWeaponDispelType)
    effect.parameter2 = `${DispelEffectWeaponTypeEnum[effect.magicWeaponDispelType ?? 0]}`;
  break;
```

`DispelEffectTypeEnum.AlwaysDispel` and `DispelEffectWeaponTypeEnum.AlwaysDispel`
are both `0` — a real, meaningful enum member, not a sentinel for "unset."
The truthy checks (`if (effect.dispelType)`) treat `0` the same as
`undefined`, so setting either field to `AlwaysDispel` silently produced no
`parameter1`/`parameter2` at all. The stray `?? 0` inside each branch was a
tell: someone clearly anticipated the zero case but guarded it with the
wrong check, so the fallback could never actually run.

**Fix applied:** changed both checks to `!== undefined` and dropped the
now-redundant (and, with the fix, truly unreachable) `?? 0` fallbacks.

**Confirmed no current impact:** no shipped creature/spell config uses the
`DispelEffects` opcode at all — dormant, same shape as several items in the
closed `BUGFIX_ROADMAP.md`. Full regeneration produced zero output changes.
Now 100% branches/statements for this file (up from 85.63%).

### ✅ `model/spell-item/effect.enums.ts` — audited, no bug found

Despite the filename, this "model" file has one real function:
`getCastSpellOnConditionValue()`, a 22-case string→number switch. 20 of the
22 cases had never been exercised by any test. Added
`effect.enums.test.ts` (no coverage before) — a parameterized test covering
every case plus the unmatched-text fallback (`0`, unreachable given
`CastSpellOnConditionType`'s exhaustive string-literal union, but cheap to
test via an `as any` cast). All pass — no bug found. Now 100%
branches/statements (up from 85.91%).

### ✅ `item.service.ts` — third occurrence of the dead-recheck pattern, fixed

Added 12 tests to the existing `item.service.test.ts` — `getItem()`'s
`equippedSlot` normalization, `setHeader()`'s location/target/damageType
defaulting (with/without `copyFrom`) and object-projectile handling
(including the dedup guard), and `isSlotIncluded()`.

**Found the third occurrence of the "redundant re-check after an
unconditional default" pattern** (after `weidu-item.service.ts`'s projectile
ternary and `creature.ts`'s `addItem()`):

```ts
equippedSlot: item.equippedSlot ?? [],
// ...
if (result.equippedSlot) {                          // always true - [] is truthy
  result.equippedSlot = this.getItemSlots(result.equippedSlot);
}
```

`result.equippedSlot` is set to `item.equippedSlot ?? []` two lines above —
since even an empty array is truthy in JS, the `if` can never be false.
Simplified to an unconditional call. Confirmed zero output impact via full
regeneration. Now 100% branches/statements for this file (up from 86.95%).

### ✅ `grab.service.ts` — audited, no bug found

Added 2 tests to the existing `grab.service.test.ts` — `attachGrabToWeapon()`
with an explicit `grab.saveType` (previously only the default was ever
tested), and `getGrabbedEffects()` (private) with `grab.rounds` unset — that
fallback is dead in the normal flow (`createGrabSpell()` already mutates
`grab.rounds` via `??=` before calling it) but reachable calling the private
method directly. All pass — no bug found. Now 100% branches/statements (up
from 87.5%).

---

### ✅ `weidu-effect.service.ts` — audited, no bug found, one dead-scaffolding gap documented

Added `weidu-effect.service.test.ts` (no coverage before) — 14 tests covering
`createEffectFiles()`'s numeric-`special` write, `addEffect()`'s
ITM/CRE/global `fn` selection, `parameter3`/`parameter4`'s truthy-and-not-"0"
guards, and the numeric-vs-array `flags` encoding, plus `has2daLookup()`'s
no-match/match paths. All pass — no bug found. Now 97.26% branches (71/73,
up from 87.67%).

**Two gaps left alone — genuinely dead scaffolding, not guessable:**

```ts
has2daLookup({ lines, tab, effect }) {
  let col = 0;
  let file = "";
  let param = 2;                                    // <- hardcoded, never reassigned
  if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
    file = "msectype";
  }
  if (!file) return false;
  this.add(lines, `... entry_match=~${
    param === 1 ? effect.parameter1 : effect.parameter2   // <- param===1 branch unreachable
  }~ ...`, tab);
  if (param === 1) effect.parameter1 = "row";              // <- unreachable
  else effect.parameter2 = "row";
}
```

The `param === 1` ternary/if-else scaffolding implies this was meant to
support a second opcode whose 2da-lookup key lives in `parameter1` instead of
`parameter2`, but only `RemoveSpellTypeProtections` (→ `parameter2`) is ever
wired up, and `param` is hardcoded to `2`. There's no way to guess what the
intended second opcode/condition should be, so left undocumented-but-dead
rather than fixed.

---

### ✅ `weidu-creature.service.ts` — partially audited, no bug found

Added `weidu-creature.service.test.ts` (no coverage before) — 14 tests
covering `removeEffects()` (boolean/array `effects.remove` on both the
creature and an adjustment), `removeKnownSpells()`/`removeMemorizedSpells()`'s
explicit-`false` opt-out, `addMemorizedSpells()`'s `memorizedCount === 0`
removal sentinel, `patchScript()`'s `logging` flag, `patchCreature()`'s
`enforce` flag, and `handleAdjustments()`/`handleAdjustment()`'s validation
throws. All pass — no bug found. Branches 97.14% (136/140, up from 88.57%).

**Stopped short of 100% deliberately:** the remaining 4 gaps are either
unreachable via real config (`patchScript()`'s
`p.removeScripts.length || GLOBAL_CONFIG.tpaConstants.genericScriptsToRemove`
— the latter is a real, permanently non-empty ~90-entry array, so this
condition is always true) or need substantially heavier fixture setup
(`removeAllEffects()`'s per-file adjustment-override logic,
`patchCreatureAdjustement()`'s `CREATURE_DATA_FIELDS` iteration) —
disproportionate effort for the largest, most integration-heavy file
audited so far.

### ✅ `string-ref.utils.ts` — audited, no bug found

Added 1 test to the existing `string-ref.utils.test.ts` — `getStringId()`'s
"matched entry has an empty `id` array" throw. `EXISTING_STRING_REFERENCES`
is a fixed array with no real entry lacking an id, so the test temporarily
pushes a fake entry (cleaned up in a `finally`) rather than skip the gap.
No bug found. Now 100% branches/statements (up from 90%).

---

### ✅ `documentation.service.ts` — audited, no bug found

Added 9 tests to the existing `documentation.service.test.ts` — `getTraits()`
and `getCreatureTraits()`'s description-paragraph branches, `getSpellQuantity
()`'s full unknown/X-per-day/at-will/every-N-rounds matrix, `replace()`'s
missing-token throw and multi-occurrence/undefined-fallback replacement, and
`addCreature()`'s `doubleApr` multiplier (via a full fake creature and the
real `lib/templates/monster.html`, verifying the rendered `Attacks per
Round` value). All pass — no bug found. Now 100% branches (up from 90.47%).

---

### ✅ `weidu-function.service.ts` — audited, no bug found

Added 2 tests to the existing `weidu-function.service.test.ts` —
`generateProtectionSpells()`'s `sp.value ?? -1` fallback (documented in the
config file's own comment: "If value is not set, it will generate -1"; no
real `SPELL_PROTECTIONS` entry omits it, so temporarily pushed/popped a fake
one) and `generateSpellResource()`'s `group.spells ?? []` default. No bug
found. Now 100% branches/statements (up from 96.15%).

### ✅ `hit-point.service.ts` — audited, no bug found

Added 2 tests to the existing `hit-point.service.test.ts` —
`getConstitutionBonus()`'s "constitution not found in table" throw, and
`getHitDiceSize()`'s `monsterId`-keyed `HitDiceTable` match (documented but
currently unused by real config — the one example in `hp.ts` is commented
out — tested via a temporarily-pushed/popped fake entry). No bug found. Now
100% branches/statements (up from 95.91%).

### ✅ `abstract-weidu.service.ts` — audited, no bug found

Added `abstract-weidu.service.test.ts` (no coverage before) — 4 tests
covering `addConditionalSourceRes()`'s single-string-vs-array `codes`
parameter and `executeCodeWithIncludedFiles()`'s empty-`files` no-op, called
via a real subclass (`weiduItemService`, since this is a base class not
meant to be instantiated directly). No bug found. Now 100% branches (up from
93.33%).

### ✅ `baf-generator.service.ts` — audited, no bug found

Extended `baf-generator.service.test.ts` with 5 tests covering
`generateTrigger()`/`generateAction()`'s parameter-count mismatch throws,
`getTriggerParameters()`'s unknown-trigger-name throw, and both functions'
per-parameter "hole in matching-length metadata" guards (tested via a
temporarily-pushed/popped fake `State.triggers`/`State.actions` entry with an
`undefined` parameter — real config never has this, but the guard is
reachable if a trigger/action definition is ever malformed). No bug found.
Now 100% branches (up from 93.10%).

### ✅ `statement-builder.service.ts` — real bug found and fixed, now 100% branches

`followSummoner()` had `if (options.summon) triggers.unshift({ name:
"ActionListEmpty" })` at the end of building its trigger list — but the
function already returns early via `if (!options.summon) return;`, so the
condition was always true (the now-familiar confirmed-dead-branch pattern),
*and* the trigger array literal already explicitly included `{ name:
"ActionListEmpty" }`. The unshift was therefore just pushing a duplicate.
Confirmed on real output: every summon creature's committed `.baf` had
`ActionListEmpty()` listed twice in the "Summon follow summoner" `IF` block.
Fixed by deleting the redundant unshift; regenerating updated 41 committed
`ja#*su.baf` files (one duplicate line removed each, diff verified to
contain nothing else).

Also simplified a second confirmed-dead branch in `execute()`: the `else if
(custom && custom.type === "replace")` following `if (!custom ||
custom.type !== "replace")` is the exact negation of the prior condition,
so it's always true when reached — collapsed to a plain `else` (6th
occurrence of this pattern this session).

Extended `statement-builder.service.test.ts` with 12 new tests: the
`execute()` `?? []` fallbacks for `insertBefore`/`insertAfter`/`replace`
custom codes, `processStatements()`/`creatureTargetAbility()`'s
`allegianceCheck` trigger (currently unused by any real target list —
covered via a `targetService.getTargetFromAbility` spy), enabling
`GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells` to exercise
`precastMidDurationSpells()`'s body, a `POTIONS` entry without `triggers` to
exercise its `?? []` fallback, `selectWeaponStatements()`'s summon-prepended
`ActionListEmpty`, and the followSummoner duplicate-trigger fix above. Now
100% branches (up from 93.10%).

### ✅ `ability.service.ts` — audited, no bug found

Extended `ability.service.test.ts` with 11 tests covering: the `name ??
"ability.unknown"` fallback, an individual spell's `targetName` override in
both the single-spell (`parseAbilitySpell`) and multi-spell
(`parseAbilitySpells`) code paths, a `reallyForce`-type spell cast by id,
`generateSequencer()`'s "preset resolved without a spell" guard (via a
spy on `applyPreset`, since no real preset can produce this — every preset
merges into a base object that always has a `spell`), `applyPreset()`'s
"preset doesn't support spell arrays" guard and its resource-drops-id
mirror of the already-tested id-drops-resource case (both via temporarily
pushed/popped fake `ABILITY_PRESETS` entries, since no real preset sets
`spell.resource`), and `getSpellAction()`'s final "unexpected combination"
throw for a multi-spell entry with no `type` — noted as a real, if
currently harmless, inconsistency: the single-spell path defaults a missing
`spell.type` to `"normal"` (`spell.type ??= "normal"`) but the multi-spell
`parseAbilitySpells` loop never does, so an omitted `type` in a `spells[]`
entry throws instead of defaulting. No monster config currently uses the
multi-spell array feature at all, so this has zero real-world impact today;
left as documented rather than "fixed" since there's no requirement to
decide what the correct default behavior should be. No bug found otherwise.
Now 100% branches (up from 95.07%).

### ✅ `target.service.ts` — audited, no bug found

Added a test to `target.service.test.ts` covering
`getTargetPrioritiesFromStatusList()`'s `if (targetStatus.length)` guard: a
status-only `targetPriority` entry whose statuses are all player-only (e.g.
`["Sleep"]`, the only `canOnlyTargetPlayer: true` entry in
`TARGET_STATUS`) resolves to an empty enemy-targetable list, so no
`NearestEnemies` priority should be pushed for it (the leftover-status
default fill-in still adds its own, unrelated one). No bug found. Now 100%
branches (up from 98.36%).

---

## Process

Same as `BUGFIX_ROADMAP.md`: for each item, add/extend tests to lock in current
behavior → decide fix vs. leave-as-is → apply fix if needed → regenerate affected
`.baf`/doc output if it changes → review → commit.
