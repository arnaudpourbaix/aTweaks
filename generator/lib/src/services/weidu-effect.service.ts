import { Effect, EffectFile } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import { CodeLine } from "../model/misc";
import { AbstractWeiduService } from "./abstract-weidu.service";

export class WeiduEffectService extends AbstractWeiduService {
  static instance = new WeiduEffectService();

  createEffectFiles(lines: CodeLine[], effectFiles: EffectFile[]) {
    for (const effect of effectFiles) {
      this.add(lines, `CREATE EFF "${effect.file}"`, 0);
      this.write(lines, 0x10, 4, effect.opcode, 1);
      this.write(lines, 0x14, 4, effect.target, 1);
      this.write(lines, 0x1c, 4, this.getIntegerValue(effect.parameter1), 1);
      this.write(lines, 0x24, 4, effect.timing, 1);
      this.write(lines, 0x20, 4, this.getIntegerValue(effect.parameter2), 1);
      this.write(lines, 0x5c, 4, effect.dispelResistance, 1);
      this.write(lines, 0x28, 4, effect.duration, 1);
      this.write(lines, 0x2c, 2, effect.probability1, 1);
      this.writeAscii(lines, 0x30, 8, effect.resource, 1);
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
    power?: number;
    header?: number;
    type: "SPL" | "ITM" | "CRE";
  }) {
    const has2da = this.has2daLookup({ lines, tab, effect });
    if (has2da) {
      this.add(lines, `PATCH_IF row != "-1" BEGIN`, tab++);
    }
    let fn = "ADD_EFFECT";
    if (effect.global && type === "ITM") fn = "ADD_ITEM_EQEFFECT";
    else if (type === "CRE") fn = "ADD_CRE_EFFECT";
    const intVars: string[] = [
      `opcode=${effect.opcode}`,
      `target=${effect.target}`,
    ];
    if (header) intVars.unshift(`header=${header}`);
    if (effect.global) intVars.push("global=1");
    if (!!effect.power || !!power)
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
    if (effect.diceSize) intVars.push(`dicesize=${effect.diceSize}`);
    if (effect.diceThrown) intVars.push(`dicenumber=${effect.diceThrown}`);
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
    if (has2da) {
      this.add(lines, `END`, --tab);
    }
  }

  has2daLookup({
    lines,
    tab,
    effect,
  }: {
    lines: CodeLine[];
    tab: number;
    effect: Effect;
  }): boolean {
    let col = 0;
    let file = "";
    let param = 2;
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      file = "msectype";
    } else if (
      effect.opcode === EffectTypeEnum.ProtectionFromResourceAndMessage &&
      !/\d+/.test(effect.parameter2)
    ) {
      file = "splprot";
    }
    if (!file) return false;
    this.add(
      lines,
      `LPF GET_2DA_ENTRY_OF INT_VAR col_match=${col} STR_VAR file=~${file}~ entry_match=~${
        param === 1 ? effect.parameter1 : effect.parameter2
      }~ RET row col END`,
      tab
    );
    if (param === 1) effect.parameter1 = "row";
    else effect.parameter2 = "row";
    return true;
  }
}
