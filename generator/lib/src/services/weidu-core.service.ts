import * as fs from "fs";
import { GLOBAL_CONFIG } from "../../config/generate";
import { CR, TAB } from "../model/constants";
import { ItemFlagEnum } from "../model/final/enums";
import { ImmunityConfig } from "../model/final/immunity";
import { CodeLine } from "../model/misc";
import { RawItemSlot } from "../model/raw/item";
import { State } from "../state";
import { AbstractWeiduService } from "./abstract-weidu.service";
import path from "path";

export class WeiduCoreService extends AbstractWeiduService {
  static instance = new WeiduCoreService();

  private lines: CodeLine[] = [];

  writeFile(): void {
    const content = this.lines
      .map((l) => `${TAB.repeat(l.tab)}${l.code}`)
      .join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.commonCreatureFile),
      content
    );
  }

  generateItem(itemSlot: RawItemSlot, immunity: ImmunityConfig) {
    const criticalHitImmunity = this.utils.hasCriticalHitImmunity(immunity);
    this.add(this.lines, `CREATE ITM "${itemSlot.file}"`, 0);
    this.add(this.lines, `WRITE_LONG 0x64 0x72`, 1);
    const criticalHit = criticalHitImmunity
      ? 2 ** ItemFlagEnum.ToggleCriticalHit
      : 0;
    this.add(
      this.lines,
      `WRITE_LONG 0x18 ${2 ** ItemFlagEnum.NotCopyable + criticalHit}`,
      1
    );
    if (itemSlot.slot === "HELMET")
      this.add(this.lines, `WRITE_SHORT 0x1c 72`, 1);
    this.add(this.lines, `WRITE_ASCII 0x3a ~${this.getIcon(itemSlot)}~ #8`, 1);
    this.add(
      this.lines,
      `SAY NAME1 ~${immunity.name} trait~ SAY NAME2 ~${immunity.name} trait~`,
      1
    );
    this.add(this.lines, `SAY UNIDENTIFIED_DESC ~${immunity.description}~`, 1);
    this.add(this.lines, `COPY_EXISTING ~${itemSlot.file}.itm~ ~override~`, 0);
    this.add(
      this.lines,
      `LPF ${this.utils.getImmunityFunctionName(immunity.name)} END`,
      1
    );
    this.add(this.lines, "", 0);
  }

  getIcon(itemSlot: RawItemSlot) {
    switch (itemSlot.slot) {
      case "ARMOR":
        return "IPLAT01";
      case "HELMET":
        return "IHELM01";
      case "AMULET":
        return "IAMUL01";
      case "LRING":
      case "RRING":
        return "IRING01";
      case "BOOTS":
        return "IBOOT01";
    }
  }
}
