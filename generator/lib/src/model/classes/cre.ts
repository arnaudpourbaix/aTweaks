import { MonsterEnum, MonsterFamilyEnum } from "../../../creatures/monster";
import { TranslationKey } from "../../translations/i18n";
import { CreatureAttack } from "../final/attack";
import { CreatureAdditionalData, CreatureData } from "../final/creature";
import { EffectFile } from "../final/effect";
import { Projectile } from "../final/projectile";
import { Item, Spell } from "../final/spell-item";
import {
  RawCreatureAdjustment,
  RawCreatureAutoGenerate,
} from "../raw/creature";
import { CreBehavior } from "./cre-types";

export class Cre {
  name!: TranslationKey;
  monster!: MonsterEnum;
  family!: MonsterFamilyEnum;
  data!: CreatureData;
  additionalData!: CreatureAdditionalData;
  behavior!: CreBehavior;
  attack!: CreatureAttack;
  files: string[] = [];
  newFiles: { files: string[]; copyFrom: string }[] = [];

  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles: string[] = [];
  adjustments: RawCreatureAdjustment[] = [];

  items: Item[] = [];
  spells: Spell[] = [];
  projectiles: Projectile[] = [];
  effectFiles: EffectFile[] = [];

  /**
   * Auto-generate some creature data (true by default)
   */
  autoGenerate: RawCreatureAutoGenerate = {
    thac0: true,
    hitPoints: true,
    savingThrows: true,
    enchantment: true,
    meleeRange: true,
  };
}
