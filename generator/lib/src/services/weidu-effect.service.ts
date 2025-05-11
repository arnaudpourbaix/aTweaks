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

  addEffect({
    lines,
    tab,
    effect,
    power,
    header,
    type,
  }: {
    lines: CodeLine[];
    tab: number;
    effect: Effect;
    power: number;
    header: number;
    type: "SPL" | "ITM" | "CRE";
  }) {
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
    const intVars: string[] = [
      `header=${header}`,
      `opcode=${effect.opcode}`,
      `target=${effect.target}`,
    ];
    if (effect.global) intVars.push("global=1");
    if ((effect.power ?? power) !== 0)
      intVars.push(`power=${effect.power ?? power}`);
    if (effect.parameter1 && effect.parameter1 !== "0")
      intVars.push(`parameter1=${this.getIntegerValue(effect.parameter1)}`);
    if (effect.parameter2 && effect.parameter2 !== "0")
      intVars.push(`parameter2=${this.getIntegerValue(effect.parameter2)}`);
    if (effect.timing) intVars.push(`timing=${effect.timing}`);
    if (effect.dispelResistance)
      intVars.push(`resist_dispel=${effect.dispelResistance}`);
    if (effect.duration) intVars.push(`duration=${effect.duration}`);
    if (effect.probability1)
      intVars.push(`probability1=${effect.probability1}`);
    if (effect.probability2)
      intVars.push(`probability2=${effect.probability2}`);
    if (effect.diceThrown) intVars.push(`dicenumber=${effect.diceThrown}`);
    if (effect.diceSize) intVars.push(`dicesize=${effect.diceSize}`);
    if (effect.saveTypes) {
      const savingthrow = effect.saveTypes.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      intVars.push(`savingthrow=${savingthrow}`);
    }
    if (effect.saveBonus) intVars.push(`savebonus="${effect.saveBonus}"`);
    if (effect.flags !== undefined) {
      const special =
        typeof effect.flags === "number"
          ? effect.flags
          : effect.flags.reduce((sum, save) => {
              sum += 2 ** save;
              return sum;
            }, 0);
      intVars.push(`special=${special}`);
    } else if (effect.special) {
      intVars.push(`special=${effect.special}`);
    }
    const strVar = effect.resource
      ? ` STR_VAR resource="${effect.resource}"`
      : "";
    this.add(lines, `LPF ${fn} INT_VAR ${intVars.join(" ")}${strVar} END`, tab);
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      this.add(lines, `END`, --tab);
    }
  }
}
