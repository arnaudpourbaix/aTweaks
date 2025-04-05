import { EffectTypeEnum } from "./effect.type";
import { EffectDispelResistanceEnum, EffectFlagsEnum, EffectTargetEnum, EffectTimingEnum, SaveTypeEnum } from "./enums";

export interface BaseEffect {
    opcode: EffectTypeEnum;
    target: EffectTargetEnum;
    power?: number;
    timing: EffectTimingEnum;
    dispelResistance?: EffectDispelResistanceEnum;
    duration?: number;
    probability1: number;
    probability2?: number;
    diceThrown?: number;
    diceSize?: number;
    saveTypes?: SaveTypeEnum[];
    saveBonus?: number;
    flags?: EffectFlagsEnum[] | number;
    resource?: string;
    special?: number;
    /**
     * Global effect
     */
    global: boolean;
}

export interface Effect extends BaseEffect {
    parameter1: string;
    parameter2: string;
}
