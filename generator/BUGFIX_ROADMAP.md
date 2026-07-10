# Bugfix Roadmap

Findings from a systematic correctness audit of the generator codebase (2026-07-10),
following the pattern discovered while adding unit tests to `lib/src/services/baf/`:
a condition or branch silently does less than intended — either a truthy/falsy check
is wrong for the actual data shape (e.g. checking an array for truthiness instead of
`.length`), or a branch's side effects are incomplete/discarded (dead code, a computed
value never used, a mutation applied to the wrong object).

Two bugs of this shape were already found and fixed in
`lib/src/services/baf/statement-builder.service.ts`:
- `execute()`: a `"replace"` custom code branch only suppressed the default builder
  function but never applied the replacement content.
- `attackTargetWithStatuses()`: `if (creature.attack.selectWeapons)` checked array
  truthiness instead of `.length`, making a fallback branch permanently unreachable.

Process for each item below: fix → update/add the test that locks in correct
behavior → regenerate affected `.baf` files if generated output changes → review →
commit.

Status legend: ☐ not started · ▶ in progress · ✅ fixed & committed

---

## Tier 1 — live bugs (already affecting generated output today)

### 1. ✅ `ability.service.ts` `applyPreset()` — id/resource conflict fix is a no-op

**File:** `lib/src/services/baf/ability.service.ts:245-264`

```ts
private applyPreset(
  ability: RawCreatureAbility,
  presetName: string,
): RawCreatureAbility {
  const preset = ABILITY_PRESETS.find((p) => p.preset === presetName);
  if (!preset) throw new Error(`Unknown preset ${presetName}`);
  if (Array.isArray(preset.ability.spell))
    throw new Error(`Preset don't support spell arrays`);
  const result: RawCreatureAbility = deepmerge(preset.ability, ability, {});
  if (ability.spell && preset.ability.spell?.id && ability.spell.resource) {
    ability.spell.id = undefined;
  } else if (
    ability.spell &&
    preset.ability.spell?.resource &&
    ability.spell.id
  ) {
    ability.spell.resource = undefined;
  }
  return result;
}
```

**Why it's wrong:** `result` is a fresh deep-cloned object from `deepmerge(...)`
computed *before* the `if/else if` block. That block then mutates the original
`ability.spell` (the input parameter), not `result.spell` — so the mutation has
zero effect on the value actually returned. Whenever a preset supplies `spell.id`
and a creature override supplies `spell.resource` (or vice versa), the merged
`result.spell` ends up with **both** fields set, and downstream trigger/action
selection (which checks `id` before `resource`) can pick the wrong one, generating
inconsistent WeiDU output.

**Fix applied:** mutate `result.spell` (the returned, merged object) instead of
`ability.spell` (the discarded input). One-line change on both branches.

**Confirmed real impact:** this preset (`DimensionDoorOffscreen`) is used for the
"Dimension Door" and "Dryad Charm" abilities via `Creature.addSpell()`, which
auto-populates `spell.resource` with the generated spell file (e.g. `"ja#s0f8"`)
while the preset supplies `spell.id` (e.g. `WIZARD_DIMENSION_DOOR`) — exactly the
conflicting-fields scenario. Before the fix, generated scripts checked
`HaveSpell(WIZARD_DIMENSION_DOOR)` (spell memorization by id) but cast/removed via
`ForceSpellRES("ja#s0f8", ...)`/`RemoveSpell(WIZARD_DIMENSION_DOOR)` — a mismatched
trigger/action pair referencing two different things. After the fix, both the
trigger and the remove action correctly use `HaveSpellRES("ja#s0f8")` /
`RemoveSpellRES("ja#s0f8")`, matching the resource actually cast.

Regenerated 19 affected `.baf` files across `fey/`, `golem/`, `spider/`, and
`undead/` families (all creatures using Dimension Door or Dryad Charm-style
abilities through this preset). Verified via `ability.service.test.ts` — a new
test in the `getAbilities - preset id/resource conflict resolution (applyPreset)`
block confirms it fails against the old code and passes with the fix.

---

### 2. ✅ `sleep-presets.ts` — `GreaterCommand` preset mislabeled as "Sleep"

**File:** `lib/config/presets/sleep-presets.ts:23-40`

```ts
{
  preset: SPELLS.Sleep.file,
  ability: {
    name: "ability.sleep",
    // ...
  },
},
{
  preset: SPELLS.GreaterCommand.file,
  ability: {
    name: "ability.sleep",   // <- should be "ability.GreaterCommand"
    // ...
  },
},
```

**Why it's wrong:** Copy-paste from the `Sleep` preset above it. There's a
dedicated, otherwise-unused translation key `ability.GreaterCommand` in
`lib/translations/en/ability.ts:75` (`"Greater Command"`) — strong evidence this
was the intended value. Any creature using the `GreaterCommand` preset currently
gets "Sleep" as its generated script comment and documentation heading.

**Fix applied:** changed `name: "ability.sleep"` to `name: "ability.GreaterCommand"`
in the `GreaterCommand` preset entry.

**Confirmed real impact:** `lib/creatures/undead.ts:1740` uses this preset (Greater
Mummy). Regenerated output changed the script comment from `// Sleep` to
`// Greater Command` in `lib/pnp-monster/undead/ja#m4f.baf`, and the documentation
heading from `<h5>Sleep (1/day)</h5>` to `<h5>Greater Command (1/day)</h5>` in
`docs/monsters.html`. Added `lib/config/presets/sleep-presets.test.ts` (verified
fails against the old data, passes with the fix) — also asserts no two presets in
`SLEEP_PRESETS` share an ability name, guarding against the same copy-paste
mistake recurring.

---

### 3. ✅ `weidu-function.service.ts` — immunity `displayIcons` never emitted

**File:** `lib/src/services/weidu/weidu-function.service.ts:197-223` (`callImmunityFunction`)

```ts
callImmunityFunction(lines, immunity, tab) {
  const spells = this.generateSpells(lines, immunity, tab);
  const effects = immunity.preventEffects.length ? ` effects="${immunity.preventEffects.join(" ")}"` : "";
  const icons = immunity.preventIcons.length ? ` prevent_icons="${immunity.preventIcons.join(" ")}"` : "";
  const strings = immunity.strings.length ? ` strings="${immunity.strings.join(" ")}"` : "";
  const animations = immunity.animations.length ? ` animations="${immunity.animations.join(" ")}"` : "";
  const display = immunity.displaySpellIneffective ? " displaySpellIneffective=1" : "";
  this.add(lines, `LPF ADD_IMMUNITY_CRE_ITM_SPL INT_VAR resist_dispel duration ${display} STR_VAR${effects}${icons}${strings}${animations}${spells} END`, tab);
```

**Why it's wrong:** `ImmunityConfig.displayIcons` is populated in config (e.g. the
`poison` immunity sets `displayIcons: [PortraitIconEnum.ProtectionFromPoison]` in
`lib/config/immunity-config.ts:33`) and threaded through `State.immunities`, but
this function never reads it. The underlying WeiDU macro
(`ADD_IMMUNITY_CRE_ITM_SPL`) accepts a `display_icons` STR_VAR to add a portrait
icon effect — it's just never passed. The poison-immunity portrait icon (and any
future immunity's `displayIcons`) is silently never added to generated
creatures/items.

**Fix applied:** added a `displayIcons` STR_VAR param (`display_icons="..."`),
mirroring the `preventIcons`/`icons` pattern already present, and confirmed the
WeiDU macro's parameter name (`lib/common/effect.tpa:11`, opcode 142 "Display
portrait icon") to make sure the name matched exactly.

**Confirmed real impact:** the `poison` immunity is the only config currently
setting `displayIcons`. Regenerated `lib/common/immunities.tpa` now emits
`display_icons="30"` (Protection from Poison icon) alongside the existing
`prevent_icons="6"`, where before it was silently dropped. Added
`weidu-function.service.test.ts` (this service had zero test coverage before —
verified the new tests fail against the old code and pass with the fix).

---

## Tier 2 — dormant bugs (correct bug pattern, no current config triggers them — landmines for later)

### 4. ✅ `utils.service.ts` `replaceParamTokens()` — multi-token replacement only keeps the last substitution

**File:** `lib/src/services/utils/utils.service.ts:31-42`

```ts
replaceParamTokens(params, tokens) {
  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    if (typeof p === "string") {
      for (const token of tokens)
        params[i] = p.replace(token.key, token.value);
    }
  }
}
```

**Why it's wrong:** The inner loop always replaces from the original `p`, not from
the progressively-updated `params[i]`. With 2+ tokens, each iteration overwrites
the previous substitution instead of compounding — only the last token's
replacement survives. E.g. tokens `[{key:'$A',value:'1'},{key:'$B',value:'2'}]`
applied to `"$A $B"` yields `"$A 2"` instead of `"1 2"`. Currently latent: every
call site (`baf.factory.ts`, `statement-builder.service.ts`) happens to pass
single-element token arrays.

**Fix applied:** replace on `params[i]` (the running value) instead of the
original `p` inside the inner loop.

**Confirmed no current impact, but real logic bug:** all existing call sites
(`baf.factory.ts`, `statement-builder.service.ts`) pass single-element token
arrays, so no `.baf`/generated output changed after regenerating. Added a
multi-token test to the existing `replaceParamTokens` block in
`utils.service.test.ts` (verified fails against the old code) — this closes off
the landmine for any future caller that passes 2+ tokens.

---

### 5. ✅ `creature.ts` `addSpell()` — truthy check drops the `memorizedCount: 0` removal sentinel

**File:** `lib/src/model/creature/creature.ts:118-127`

```ts
override addSpell(spell: PartialSpell): Spell {
  const result = super.addSpell(spell);
  if (spell.memorizedCount) {
    this.data.spells.memorized.push({
      file: result.file,
      memorizedCount: spell.memorizedCount,
    });
  }
  return result;
}
```

**Why it's wrong:** `spell.memorizedCount` is `number | undefined`, and `0` is an
explicit, meaningful sentinel — confirmed by
`lib/src/services/weidu/weidu-creature.service.ts:352`:
`if (m.memorizedCount === 0) code = 'REMOVE_MEMORIZED_SPELL ~${m.file}~';`. The
truthy check here treats `0` the same as `undefined`, so `addSpell({ ...,
memorizedCount: 0 })` never pushes an entry, silently producing neither
`ADD_MEMORIZED_SPELL` nor `REMOVE_MEMORIZED_SPELL`. Currently latent: no shipped
creature calls `addSpell` with `memorizedCount: 0` (the sibling `memorizeSpell()`
method has no such guard and works correctly).

**Fix applied:** changed `if (spell.memorizedCount)` to
`if (spell.memorizedCount !== undefined)`.

**Confirmed no current impact:** no shipped creature calls `addSpell` with
`memorizedCount: 0` (confirmed via grep and a full regeneration — no `.baf`
output changed). Added `lib/src/model/creature/creature.test.ts` (this model
class had no test coverage before), verified the `memorizedCount: 0` case fails
against the old code.

---

### 6. ☐ `effect.factory.ts` `paralyze()` — `races: []` truthy check skips the Hold effect entirely

**File:** `lib/src/factories/effect.factory.ts:108` (approx.)

```ts
if (params.races) {
  for (const race of params.races) {
    effects.unshift({ opcode: EffectTypeEnum.Hold, idsFile: EffectIDSFileEnum.RACE, idsEntry: race, ...duration, ...base });
  }
} else {
  effects.unshift({ opcode: EffectTypeEnum.Hold, idsFile: EffectIDSFileEnum.EA, idsEntry: "ANYONE", ...duration, ...base });
}
```

**Why it's wrong:** `params.races` is optional and typed `RaceIdentifier[] |
undefined`. The branch is chosen by truthiness, not `.length`. If `races: []` is
ever passed, the loop runs zero times *and* the `else` fallback never runs
either — the core `Hold` opcode is missing entirely from the effect list, so the
creature would visually appear paralyzed (icon/animation effects still fire) but
not actually be immobilized. Currently latent: all current call sites pass
`races` either omitted or non-empty.

**Likely fix:** change `if (params.races)` to `if (params.races?.length)`.

---

### 7. ☐ `description.service.ts` `getDiceValue()` — negative diceless value loses its sign

**File:** `lib/src/services/doc/description.service.ts:583-594` (approx.)

```ts
private getDiceValue(payload) {
  const dice = payload.diceThrown && payload.diceSize ? `${payload.diceThrown}D${payload.diceSize}` : "";
  const value = payload.value ? `${this.getSignedNumber(payload.value)}` : "";
  return dice ? `${dice}${value}` : `${value.substring(1)}`;
}
```

**Why it's wrong:** When there's no dice component, the code assumes `value`
always starts with `+` and blindly strips the first character. `getSignedNumber`
returns negative numbers unchanged (e.g. `"-3"`), so `"-3".substring(1)` yields
`"3"` — a negative bonus (e.g. `damageBonus: -2` with no dice) would display as a
positive value in generated documentation. Currently latent: no shipped config
has a negative diceless value in this path.

**Likely fix:** don't blanket-strip the first character; only strip a leading
`+`, e.g. `value.replace(/^\+/, "")`.

---

## Tier 3 — lower confidence / needs a judgment call

### 8. ☐ `item.service.ts` `isSlotIncluded()` — array short-circuit may be intentional

**File:** `lib/src/services/item.service.ts:109-116`

```ts
isSlotIncluded(itemSlots, includedSlot) {
  if (Array.isArray(includedSlot)) return false;
  const list = itemSlots.map((i) => this.getItemSlots(i.slot)).flat(1);
  return list.includes(includedSlot);
}
```

**Why it's suspicious:** Called from `immunity.service.ts:75-78` with
`itemSlot.slot`, which for ~10 immunities in `lib/config/immunity-config.ts` is
literally the multi-slot `JEWEL_SLOTS` array. Because the function always
returns `false` when `includedSlot` is an array, the "slot already assigned"
conflict-check warning can never fire for these immunities. There's a sibling
TODO in `isEquippedWeapon` acknowledging arrays aren't fully handled — **needs a
decision on whether this is a known/accepted gap or an actual bug** before
touching it.

---

### 9. ☐ `potion.ts` — duplicate `POTN08` entries

**File:** `lib/config/potion.ts:29-52` (approx.)

Two entries — "Exilir of health (10hp)" and "Potion of healing (10hp)" — both
reference item file `POTN08` with identical trigger conditions. This produces two
functionally-identical (redundant, not incorrect) statement blocks in generated
scripts. Likely a copy-paste where the second entry's `files` should reference a
different item code.

---

### 10. ☐ `weidu-core.service.ts` `getIcon()` — reference-equality check on `JEWEL_SLOTS`

**File:** `lib/src/services/weidu/weidu-core.service.ts:66-67` (approx.)

```ts
getIcon(itemSlot) {
  if (itemSlot.slot === JEWEL_SLOTS) return "IRING16";
  switch (itemSlot.slot) { /* ARMOR, HELMET, AMULET, LRING, RRING, BOOTS only */ }
```

Compares `itemSlot.slot` to the imported array constant by reference. Works today
only because every config entry needing this fallback passes the literal
`JEWEL_SLOTS` reference itself. The `switch` never handles `"BELT"`, `"GLOVES"`,
or `"CLOAK"` individually — a future config using an equivalent-but-different
array (or a single slot like `"BELT"`) would silently get no icon at all
(`write()`'s `if (!value) return;` guard swallows it).

---

### 11. ☐ `effect.service.ts` — dead no-op statement

**File:** `lib/src/services/effects/effect.service.ts:219-222` (approx.)

```ts
case EffectTypeEnum.ProtectionFromProjectile:
  effect.opcode;
  effect.parameter2 = `${effect.projectile}`;
  break;
```

`effect.opcode;` reads a property and discards it — a no-op expression statement.
Likely inert leftover code rather than a functional defect (this effect type's
format doesn't appear to need `parameter1`), but worth a second look in case a
`parameter1` assignment was intended and lost.
