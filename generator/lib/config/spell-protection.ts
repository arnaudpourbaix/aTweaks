import {
  SpellProtection,
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/raw/spell-protection";

/**
 * If value is not set, it will generate -1
 */
export const SPELL_PROTECTIONS: SpellProtection[] = [
  {
    name: "JA_NOT_OUTDOOR_CHECK",
    stat: SpellProtectionStat.Areatype,
    // value: "OUTDOOR",
    relation: SpellProtectionRelation.NotEqual, // BinaryNotMatch
  },
];
