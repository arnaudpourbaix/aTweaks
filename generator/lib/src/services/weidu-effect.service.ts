import { Effect, EffectFile } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import { CodeLine } from "../model/misc";
import { GrabConfig } from "../model/raw/grab";
import { AbstractWeiduService } from "./abstract-weidu.service";

export class WeiduEffectService extends AbstractWeiduService {
  static instance = new WeiduEffectService();

  createGrabProtectionEffect(lines: CodeLine[], grab: GrabConfig) {
    const effect = this.grabService.getGrabProtectionEffect(grab);
    this.createEffectFiles(lines, [{ ...effect, file: grab.file }]);
  }

  createEffectFiles(lines: CodeLine[], effectFiles: EffectFile[]) {
    for (const effect of effectFiles) {
      this.add(lines, `CREATE EFF "${effect.file}"`, 0);
      this.add(lines, `WRITE_LONG 0x10 ${effect.opcode}`, 1);
      this.add(lines, `WRITE_LONG 0x14 ${effect.target}`, 1);
      if (effect.timing) this.add(lines, `WRITE_LONG 0x24 ${effect.timing}`, 1);
      if (effect.parameter1 && effect.parameter1 !== "0")
        this.add(
          lines,
          `WRITE_LONG 0x1c ${this.getIntegerValue(effect.parameter1)}`,
          1
        );
      if (effect.parameter2 && effect.parameter2 !== "0")
        this.add(
          lines,
          `WRITE_LONG 0x20 ${this.getIntegerValue(effect.parameter2)}`,
          1
        );
      if (effect.dispelResistance)
        this.add(lines, `WRITE_LONG 0x5c ${effect.dispelResistance}`, 1);
      if (effect.duration)
        this.add(lines, `WRITE_LONG 0x28 ${effect.duration}`, 1);
      if (effect.probability1)
        this.add(lines, `WRITE_SHORT 0x2c ${effect.probability1}`, 1);
      if (effect.resource)
        this.add(lines, `WRITE_ASCII 0x30 ~${effect.resource}~ #8`, 1);
      this.add(lines, "", 0);
    }
  }

  addEffect(
    lines: CodeLine[],
    tab: number,
    effect: Effect,
    power: number,
    type: "SPL" | "ITM" | "CRE"
  ) {
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      this.add(
        lines,
        `LPF GET_2DA_ENTRY_OF INT_VAR col_match = 0 STR_VAR file = ~msectype.2da~ entry_match = ~${effect.parameter2}~ RET row col END`,
        1
      );
      effect.parameter2 = "row";
      this.add(lines, `PATCH_IF row != "-1" BEGIN`, tab++);
    }
    let fn = "ADD_EFFECT";
    if (effect.global && type === "ITM") fn = "ADD_ITEM_EQEFFECT";
    else if (type === "CRE") fn = "ADD_CRE_EFFECT";
    this.add(lines, `LPF ${fn}`, tab);
    this.add(lines, `INT_VAR`, tab + 1);
    if (effect.global) this.add(lines, `global = 1`, tab + 2);
    this.add(lines, `opcode = ${effect.opcode}`, tab + 2);
    if (effect.target) this.add(lines, `target = ${effect.target}`, tab + 2);
    if ((effect.power ?? power) !== 0)
      this.add(lines, `power = ${effect.power ?? power}`, tab + 2);
    if (effect.parameter1 && effect.parameter1 !== "0")
      this.add(
        lines,
        `parameter1 = ${this.getIntegerValue(effect.parameter1)}`,
        tab + 2
      );
    if (effect.parameter2 && effect.parameter2 !== "0")
      this.add(
        lines,
        `parameter2 = ${this.getIntegerValue(effect.parameter2)}`,
        tab + 2
      );
    if (effect.timing) this.add(lines, `timing = ${effect.timing}`, tab + 2);
    if (effect.dispelResistance)
      this.add(lines, `resist_dispel = ${effect.dispelResistance}`, tab + 2);
    if (effect.duration)
      this.add(lines, `duration = ${effect.duration}`, tab + 2);
    this.add(lines, `probability1 = ${effect.probability1}`, tab + 2);
    if (effect.probability2)
      this.add(lines, `probability2 = ${effect.probability2}`, tab + 2);
    if (effect.diceThrown)
      this.add(lines, `dicenumber = ${effect.diceThrown}`, tab + 2);
    if (effect.diceSize)
      this.add(lines, `dicesize = ${effect.diceSize}`, tab + 2);
    if (effect.saveTypes) {
      const savingthrow = effect.saveTypes.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      this.add(lines, `savingthrow = ${savingthrow}`, tab + 2);
    }
    if (effect.saveBonus) {
      this.add(lines, `savebonus = "${effect.saveBonus}"`, tab + 2);
    }
    if (effect.flags !== undefined) {
      const special =
        typeof effect.flags === "number"
          ? effect.flags
          : effect.flags.reduce((sum, save) => {
              sum += 2 ** save;
              return sum;
            }, 0);
      this.add(lines, `special = ${special}`, tab + 2);
    }
    if (effect.special) {
      this.add(lines, `special = ${effect.special}`, tab + 2);
    }
    if (effect.resource) {
      this.add(lines, `STR_VAR`, 2);
      this.add(lines, `resource = "${effect.resource}"`, tab + 2);
    }
    this.add(lines, `END`, tab + 1);
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      this.add(lines, `END`, --tab);
    }
  }
}
