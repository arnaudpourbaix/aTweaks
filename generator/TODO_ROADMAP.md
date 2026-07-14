# TODO / FIXME Roadmap

Extracted from `eslint-plugin-sonarjs`'s `todo-tag`/`fixme-tag` scan (2026-07-13) —
47 hits total. Cataloged here instead of left as blocking lint errors, since most
of these need game/mod domain knowledge to triage, not a mechanical fix.
`sonarjs/todo-tag` and `sonarjs/fixme-tag` are off in `eslint.config.mjs`; this
file is the tracking mechanism instead. When one of these is resolved, remove
the source comment and check it off here.

Status legend: 🔴 reported broken · 🟡 missing mechanic/feature gap ·
🔵 needs investigation (unclear from the code alone) · ⚪ acknowledged low priority ·
☐ not started · ✅ resolved

---

## ✅ Reported broken (FIXME) — investigated, both resolved as "understood, won't fix from here"

### ✅ `damage-aoe-presets.ts:129` — FrostFingers doesn't work at all

Investigated: the preset is unused (its one reference, a mummy spellbook slot
in `undead.ts:1644`, is commented out and was replaced by `Command`). Traced
the generator's handling of the preset's `CheckStat(SCRIPTINGSTATE4)` trigger
end-to-end and confirmed it's correctly wired through to generated output —
not a bug in this codebase. **Confirmed by the maintainer: the underlying
Frost Fingers spell is broken in the Faiths & Powers mod itself.** Not
fixable from the generator side. Comment updated in place to say so; kept
(unused) for whenever FNP fixes it.

### ✅ `common.ts:9` — hunterCustomCode statements don't work properly

Investigated: `hunterCustomCode` itself is live (bears, jaguar, mountain
lion), but the two broken statement blocks were already commented out, so
nothing broken ships today. Ruled out a suspected typo (`MoveToSavedLocationn`
with a double "n") — it's a real, separately-documented WeiDU action in this
codebase's own reference table, identical to `MoveToSavedLocation`, not a
mistake. **Confirmed by the maintainer: not every creature sharing this
object should get this patrol behavior** — it would need to be per-creature/
conditional rather than baked into the shared `hunterCustomCode` object to be
re-enabled correctly, not a simple trigger-logic bug. Comment updated in
place to say so.

---

## 🟡 Missing mechanics / feature gaps (TODO)

- `cure-presets.ts:11` — `ability.cureLightWounds.spell` is `{}` (empty) with a
  `//TODO: target` comment; looks like the spell/targeting was never filled in.
- `slimes.ts:233` — black pudding's acid attack should also degrade the
  target's nonmagical armor by -1 AC per hit, cumulative, destroying it at AC 10.
  Not implemented.
- `undead.ts:1042` — an attack that should age the target 10-40 years (1d4×10)
  isn't implemented.
- `undead.ts:1981` — a Blink effect (4-round duration, 14-round timer) isn't
  implemented.
- `undead.ts:1639` — spellbook should vary by installed mod/component (SR,
  Faiths & Powers, ...); currently one fixed spellbook.
- `feys.ts:1092` — Quench Fire ability not implemented.
- `ability.factory.ts:18` — a commented-out design note for a
  situational-intelligence system (form changes based on combat state); no
  creature currently uses this path per the comment.

---

## 🔵 Needs investigation (unclear without more context)

- ☐ `spell-group.ts:54` — `// TODO: check these:` above 4 "SpellPack b6" and 3
  "IR/IRR" spell resource entries in the `blindness` spell-immunity group;
  needs verifying those resource names actually exist/are correct against
  the SpellPack and Item Revisions mods themselves - not verifiable from
  this codebase alone. Still open.
- ✅ `undead.ts:370` — investigated: the level-24 header (6d10 cold, 3d10
  crushing) this comment refers to no longer exists in the code, only the
  question remains. The only current caller of `createWallOfIce()` is the
  Death Knight, which casts at `level1: 9` - so today, nobody would reach a
  level-24 tier. **Kept intentionally** (maintainer: might be used later by
  a new creature) rather than deleted as dead-code cleanup.
- ☐ `undead.ts:1150` — bare `//TODO:` with no text, on `deathKnight()`.
  **Kept** (maintainer: this creature is a work in progress).

---

## ⚪ Acknowledged low priority

- `golems.ts:190` — charge mechanic is "a very basic idea... many improvements
  can be done but since this golem is only used once by a mod, it is a low
  priority" (author's own words).

---

## Commented-out "spirit variant" creature files (34 hits, one recurring idea)

Every one of these is the same shape: a creature family has a block of
commented-out `files: [...]` entries for a "Spirit" or mod-specific variant
(Faiths & Powers' Spirit Spider), each tagged `//TODO: <variant name>`. These
read as "this variant exists in some mod/game install but isn't confirmed
supported yet," not bugs — flagging as one decision rather than 34 individual
ones:

| File         | Lines                       | Variant                                                         |
| ------------ | --------------------------- | --------------------------------------------------------------- |
| `bears.ts`   | 187, 310-314                | Spirit Bear                                                     |
| `cats.ts`    | 123, 209-214                | Panther Spirit / Spirit Lion                                    |
| `spiders.ts` | 1068-1072                   | Spirit Spider (Faiths & Powers)                                 |
| `undead.ts`  | 2841-2845 **and** 2896-2900 | Spirit Spider (Faiths & Powers) — **listed twice, identically** |
| `wolves.ts`  | 605-610                     | Spirit Wolf                                                     |

The `undead.ts` duplication (same 5-line list appears twice, ~55 lines apart)
is worth a look on its own — likely a copy-paste artifact from splitting or
merging creature blocks, independent of whether the Spirit Spider variant
itself ever gets implemented.

**Decision needed:** are these "someday, if I get to it" (leave as comments,
maybe consolidate the duplicate undead.ts block) or "not planned" (delete the
dead commented code)? Either way, they don't need 34 separate line items.
