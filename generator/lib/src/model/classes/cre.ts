import { MonsterEnum, MonsterFamilyEnum } from "../../../creatures/monster";
import { StringReference } from "../misc";
import { RawCreatureAbility } from "../raw/ability";
import { Actions } from "../raw/actions";
import { RawCreatureAttack } from "../raw/attack";
import {
  RawCreatureAdditionalData,
  RawCreatureAdjustment,
  RawCreatureAutoGenerate,
  RawCreatureData,
} from "../raw/creature";
import { RawEffectFile } from "../raw/effect";
import { RawItem } from "../raw/item";
import { RawProjectile } from "../raw/projectile";
import { RawAdditionalCode, RawCustomCode } from "../raw/script";
import { RawSpell } from "../raw/spell";
import { CreWeapon } from "./cre-types";

export class Cre {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;

  /**
   * Filename for BAF file (without extension)
   */
  bafFile?: string;

  /**
   * Filename for TPA file (without extension)
   */
  tpaFile: string;

  /**
   * Asking or responding to help shouts (default: true)
   */
  help = true;

  /**
   * Will initiate dialog (values are creature script name)
   */
  dialog: string[] = [];

  /**
   * Can track enemies when no one in sight ? (default: true)
   */
  tracking = true;

  /**
   * Random walk outside of combat (default: false)
   */
  walk = false;

  /**
   * Random walk within combat when nothing else to do (default: true)
   */
  combatWalk = true;

  /**
   * Fully heal while resting (default: false)
   */
  restHeal = false;

  /**
   * Can use potions (default: false)
   */
  usePotions = false;

  /**
   * Can use kit abilities (default: false)
   */
  useKitAbilities = false;

  /**
   * Able to hide in shadows (default: false)
   */
  hideInShadows = false;

  attack?: RawCreatureAttack;
  canPolymorph?: boolean;

  initActions?: Actions.Action[];

  customCode?: RawCustomCode[];
  additionalCode?: RawAdditionalCode[];

  data: RawCreatureData;
  additionalData: RawCreatureAdditionalData;

  files: string[] = [];
  newFiles: { files: string[]; copyFrom: string }[] = [];

  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles: string[] = [];
  adjustments: RawCreatureAdjustment[] = [];

  abilities: RawCreatureAbility[] = [];
  items: RawItem[] = [];
  spells: RawSpell[] = [];
  projectiles: RawProjectile[] = [];
  effectFiles: RawEffectFile[] = [];

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

  constructor(
    private monster: MonsterEnum,
    private family: MonsterFamilyEnum
  ) {}

  addItem(item: RawItem) {}

  addWeapon(weapon: CreWeapon) {}

  addSpell(spell: RawSpell) {}
}
