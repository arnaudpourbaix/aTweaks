# Split SPELLS / FNP_SPELLS by section

## Problem

`lib/config/spell-names.ts` exports `SPELLS` as one flat object holding Wizard,
Priest, Class, and Innate spells together, distinguished only by `//` comments.
`FNP_SPELLS` (Faiths & Powers mod spells) is similarly flat, currently holding
only Priest spells. Neither structure reflects the categories the code
actually cares about, making the file harder to navigate as it grows.

## Design

### `spell-names.ts` restructure

Replace the single `SPELLS` object with four section constants, composed into
a nested `SPELLS` export:

```ts
export const WIZARD_SPELLS = { AgannazarScorcher: {...}, ... } satisfies Record<string, SpellReference>;
export const PRIEST_SPELLS = { AerialServant: {...}, ... } satisfies Record<string, SpellReference>;
export const CLASS_SPELLS  = { BerserkerRage: {...}, ... } satisfies Record<string, SpellReference>;
export const INNATE_SPELLS = { MephitColorSpray: {...}, ... } satisfies Record<string, SpellReference>;

export const SPELLS = {
  Wizard: WIZARD_SPELLS,
  Priest: PRIEST_SPELLS,
  Class: CLASS_SPELLS,
  Innate: INNATE_SPELLS,
};
```

Access changes from `SPELLS.ColorSpray.file` to `SPELLS.Wizard.ColorSpray.file`
(and equivalently `.Priest.`, `.Class.`, `.Innate.`). Section membership for
every existing key is exactly what the current `// Wizard` / `// Priest` /
`// Innates` / `// Class` comments in the file already mark. No spell name
collides across sections, so the mapping from key to section is unambiguous.

`FNP_SPELLS` gets the same treatment, currently with a single populated
section:

```ts
export const FNP_PRIEST_SPELLS = { AnimateDead: {...}, ... } satisfies Record<string, BaseSpell>;
export const FNP_SPELLS = { Priest: FNP_PRIEST_SPELLS };
```

Both imports (`SPELLS`, `FNP_SPELLS`) keep their existing exported names, so
no import statements need to change — only property access at each call site.

### Flattened iteration helpers

Three call sites iterate over *all* spells rather than accessing one by name,
and would silently break under the nested shape:

- `MainService.checkPresets` / `checkSpells` (`lib/src/services/main.service.ts`)
  — duplicate file/id validation via `Object.values(SPELLS)` and
  `utils.objectKeys(SPELLS)`.
- `StatementBuilderService.precastSpells`
  (`lib/src/services/baf/statement-builder.service.ts`) — scans all spells
  with a matching `duration` via `utils.objectKeys(SPELLS)`.
- `UtilsService.getExternalSpell` (`lib/src/services/utils/utils.service.ts`)
  — looks up a Faiths & Powers spell by filename via
  `Object.values(FNP_SPELLS)`.

Add two helpers in `spell-names.ts` and point these three call sites at them:

```ts
export function getAllSpells(): Record<string, SpellReference> {
  return { ...WIZARD_SPELLS, ...PRIEST_SPELLS, ...CLASS_SPELLS, ...INNATE_SPELLS };
}

export function getAllFnpSpells(): Record<string, BaseSpell> {
  return { ...FNP_PRIEST_SPELLS };
}
```

### Migrating the remaining call sites

Roughly 30 other files access `SPELLS.<Name>` / `FNP_SPELLS.<Name>` directly
(spell/creature definitions, presets, `spell-group.ts`, `kit-ability.ts`,
`statement-builder.service.ts` for non-iteration uses). Each such access gets
the section segment inserted based on the key's section membership
established above (all `FNP_SPELLS.<Name>` accesses become
`FNP_SPELLS.Priest.<Name>`, since that's the only section populated today).

This is mechanical and will be done as a scripted find/replace keyed off the
per-key section mapping, run once across `lib/`, followed by:

- `npm run build` (tsc) to catch anything the script missed or mapped wrong
  (a stale `SPELLS.Foo` reference becomes a type error, not a silent bug).
- `npm test` (vitest) to confirm existing coverage still passes, notably
  `lib/config/presets/sleep-presets.test.ts` which imports `SPELLS` directly.

## Out of scope

- No behavior change to generated output — this is a pure identifier/access
  refactor.
- `FNP_SPELLS` only gets a `Priest` section for now; Wizard/Class/Innate
  sections are added later if/when Faiths & Powers spells of those types are
  needed, following the same pattern established here.
- No change to `SpellReference` / `BaseSpell` typing (e.g. restricting `id` to
  a per-section identifier prefix) — Class and Innate spell identifiers don't
  follow a consistent prefix today, so this would add complexity without a
  clean payoff.
