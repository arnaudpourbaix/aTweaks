import { GrabFullConfig } from "../grab";
import { AlignIdentifiers } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifiers } from "../ids/class";
import { GenderIdentifiers } from "../ids/gender";
import { GeneralIdentifiers } from "../ids/general";
import { RaceIdentifiers } from "../ids/race";
import { RawCreatureAutoGenerate, RawScriptLocationEnum } from "../raw/creature";
import { RawProficiencyTypeEnum, SizeEnum } from "../raw/enum";
import { ImmunityName } from "../raw/immunity";
import { RawItemSlot } from "../raw/item";
import { Action, CustomCode } from "../raw/script";
import { RawMemorizedSpell } from "../raw/spell";
import { CreatureAbility } from "./ability";
import { CreatureAttack } from "./attack";
import { Item } from "./item";
import { Projectile } from "./projectile";
import { Spell } from "./spell";

export interface Creature {
    /**
     * Filename for BAF file (without extension, relative path from mod folder)
     */
    bafFile?: string;

    /**
     * Filename for TPA file (without extension, relative path from mod folder)
     */
    tpaFile: string;

    /**
     * Asking or responding to help shouts (default: true)
     */
    help: boolean;

    /**
     * Can track enemies when no one in sight ? (default: true)
     */
    tracking: boolean;

    /**
     * Random walk outside of combat (default: false)
     */
    walk: boolean;

    /**
     * Random walk within combat when nothing else to do (default: true)
     */
    combatWalk: boolean;

    /**
     * Fully heal while resting (default: false)
     */
    restHeal: boolean;

    /**
     * Able to hide in shadows (default: false)
     */
    hideInShadows: boolean;

    attack: CreatureAttack;

    /**
     * Uses this when a monster have several attacks per round with 2 different weapons.
     * It makes sure that both weapons are properly used.
     * It will:
     * - remove one attack per round (because offhand gives one)
     * - gives 3 points in two weapons fighting
     * - add a bonus to hit of +2 to offhand.
     * - (add a bonus to hit of +4 to mainhand and +8 to offhand.)
     * 
     */
    dualWielding: boolean;

    grab?: GrabFullConfig;

    initActions: Action[];

    customCode: CustomCode[];

    data: CreatureData;
    additionalData: CreatureAdditionalData;

    files: string[];
    adjustments: CreatureAdjustment[];

    abilities: CreatureAbility[];
    items: Item[];
    spells: Spell[];
    projectiles: Projectile[];

    /**
     * Auto-generate some creature data (true by default)
     */
    autoGenerate: RawCreatureAutoGenerate;
}

export interface CreatureAdjustment {
    files: string[];
    data?: CreatureData;
    additionalData: CreatureAdditionalData;
    /**
     * Is it a summon ?
     */
    summon?: boolean;
    /**
     * Don't assign a script
     */
    noScript?: boolean;
}

export interface CreatureData {
    level1?: number;
    level2?: number;
    level3?: number;
    strength?: number;
    exceptionalStrength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    movement?: number;
    hp?: number;
    /**
     * Bonus HP (+x). For example, Hit Dice 6+1, bonus is 1
     */
    bonusHp?: number;
    /**
     * Specific case when creature have more HP or can fight when HP is below 0 like some bears.
     */
    specialBonusHp?: number;
    ac?: number;
    crushingAC?: number;
    missileAC?: number;
    piercingAC?: number;
    slashingAC?: number;
    resistFire?: number;
    resistCold?: number;
    resistElectricity?: number;
    resistAcid?: number;
    resistMagic?: number;
    resistSlashing?: number;
    resistCrushing?: number;
    resistPiercing?: number;
    resistMissile?: number;
    thac0?: number;
    apr?: number;
    doubleApr?: boolean;
    xpv?: number;
    hideShadow?: number;
    moveSilent?: number;
    alignment?: AlignIdentifiers;
    saveDeath?: number;
    saveWand?: number;
    savePolymorph?: number;
    saveBreath?: number;
    saveSpell?: number;
    morale?: number;
    moraleBreak?: number;
    moraleRecovery?: number;
    general?: GeneralIdentifiers;
    race?: RaceIdentifiers;
    class?: ClassIdentifiers;
    gender?: GenderIdentifiers;
    size?: SizeEnum;
    animation?: AnimationIdentifiers;
    metalColor?: number;
    minorColor?: number;
    majorColor?: number;
    skinColor?: number;
    leatherColor?: number;
    armorColor?: number;
    hairColor?: number;
}

export interface CreatureAdditionalData {
    /**
     * BAF scripts to remove from CRE
     */
    removeScripts: string[];
    /**
     * BAF Script location. Auto if empty, at the top tier possible.
     * Will raise an error at install if location was not empty (safety measure)
     */
    scriptLocation?: RawScriptLocationEnum;

    proficiencies: { type: RawProficiencyTypeEnum, value: number }[];

    removeItems: string[];
    itemSlots: RawItemSlot[];
    immunities: ImmunityName[];

    removeKnownSpells: boolean;
    removeMemorizedSpells: boolean;
    memorizedSpells: RawMemorizedSpell[];
}

export const CREATURE_DATA_KEYS: (keyof CreatureData)[] = [
    'level1',
    'level2',
    'level3',
    'strength',
    'exceptionalStrength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
    'movement',
    'hp',
    'ac',
    'crushingAC',
    'missileAC',
    'piercingAC',
    'slashingAC',
    'resistFire',
    'resistCold',
    'resistElectricity',
    'resistAcid',
    'resistMagic',
    'resistSlashing',
    'resistCrushing',
    'resistPiercing',
    'resistMissile',
    'thac0',
    'apr',
    'doubleApr',
    'xpv',
    'hideShadow',
    'moveSilent',
    'alignment',
    'saveDeath',
    'saveWand',
    'savePolymorph',
    'saveBreath',
    'saveSpell',
    'morale',
    'moraleBreak',
    'moraleRecovery',
    'general',
    'race',
    'class',
    'gender',
    'animation',
    'metalColor',
    'minorColor',
    'majorColor',
    'skinColor',
    'leatherColor',
    'armorColor',
    'hairColor',
];
