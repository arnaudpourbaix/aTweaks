import { GLOBAL_CONFIG } from "../../config/generate";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreatureAbility } from "../../src/model/raw/ability";
import { RawSaveType } from "../../src/model/raw/enum";
import { RawProjectile } from "../../src/model/raw/projectile";
import { RawSpell } from "../../src/model/raw/spell";

// const petrificationSave: { saveTypes: RawSaveType[]; saveBonus: number } = {
//   saveTypes: ["PetrifyPolymorph"],
//   saveBonus: -4,
// };

// const projectile: RawProjectile = {
//   file: basiliskGazeProjectile,
//   copyFromFile: "gaze",
//   description: "Basilisk petrifying gaze",
//   type: "AreaOfEffect",
//   areaEffectInfo: {
//     areaProjectileFlags: ["AffectOnlyEnemies", "Coneshaped"],
//     triggerRadius: 255,
//     areaOfEffect: 255,
//     coneWidth: 60,
//     fragmentAnimation: "NULL_ANIMATION",
//     explosionEffect: "NONE",
//   },
// };

// export const petrificationAbility: RawCreatureAbility = {
//   name: "Petrification (2e)",
//   target: {
//     name: "NearestEnemies",
//     random: true,
//   },
//   spell: {
//     resource: petrification2e,
//     type: "force",
//   },
// };

// export const petrification5eAbility: RawCreatureAbility = {
//   name: "Petrification (5e)",
//   target: {
//     name: "NearestEnemies",
//     random: true,
//     triggers: [
//       {
//         name: "HaveSpellRES",
//         params: [petrification5e],
//       },
//       {
//         name: "CheckStatGT",
//         params: [GLOBAL_CONFIG.tokens.target, 0, "HELD"],
//         negation: true,
//       },
//       {
//         name: "StateCheck",
//         params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
//         negation: true,
//       },
//     ],
//   },
//   spell: {
//     resource: petrification5e,
//     type: "force",
//   },
// };

// export const petrification2e: RawSpell = {
//   name: "Petrification (2e)",
//   file: petrification2e,
//   memorizedCount: 1,
//   stringRef: TraStringReferenceEnum.PetrifyingGaze,
//   description: [
//     "Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4. On a failed save, the creature is petrified until freed by the greater restoration spell or other magic.",
//   ],
//   secondaryType: "Disabling",
//   infiniteUse: 1,
//   icon: SPELLS.FleshToStone,
//   headers: [
//     {
//       type: "Ranged",
//       projectile: basiliskGazeProjectile,
//       range: 30,
//       effects: [
//         {
//           opcode: "Petrification",
//           ...petrificationSave,
//         },
//         {
//           opcode: "DisplayString",
//           stringRef: TraStringReferenceEnum.Petrified,
//           ...petrificationSave,
//         },
//         {
//           opcode: "PlaySound",
//           resource: "MISC_06B",
//           ...petrificationSave,
//         },
//         {
//           opcode: "PlayVisualEffect",
//           playWhere: "OverTargetUnattached",
//           resource: "SPFLESHS.VVC",
//           ...petrificationSave,
//         },
//         {
//           opcode: "CreatureRGBColorFade",
//           color: { blue: 120, red: 120, green: 120 },
//           fadeSpeed: 25,
//           ...petrificationSave,
//         },
//       ],
//     },
//   ],
// };
