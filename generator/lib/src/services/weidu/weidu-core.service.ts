import * as fs from "fs";
import path from "path";
import { SPELL_STATES } from "../../../config/ability-presets";
import { GLOBAL_CONFIG } from "../../../config/generate";
import { SPELL_PROTECTIONS } from "../../../config/spell-protection";
import { CR, TAB } from "../../model/constants";
import { EquippedItem, JEWEL_SLOTS } from "../../model/creature/item";
import { ImmunityConfig } from "../../model/final/immunity";
import { SpellProtectionStat } from "../../model/spell-item/spell-protection";
import { ItemFlagEnum } from "../../model/spell-item/effect.enums";
import { State } from "../../state";
import utils from "../utils/utils.service";
import { AbstractWeiduService } from "./abstract-weidu.service";

class WeiduCoreService extends AbstractWeiduService {
  private lines = this.initLines();

  writeFile(): void {
    const content = this.lines
      .map((l) => `${TAB.repeat(l.tab)}${l.code}`)
      .join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.files.coreMonsters),
      content
    );
  }

  generateProtectionSpells() {
    for (const sp of SPELL_PROTECTIONS) {
      let file = utils.getIdsFileFromSpellProtectionStat(
        sp.stat as SpellProtectionStat
      );
      let value: string | number | undefined = sp.value;
      if (typeof value === "string" && !/\d+/.test(value) && file) {
        this.add(
          this.lines,
          `OUTER_SET value=IDS_OF_SYMBOL (~${file}~ ~${value}~)`,
          0
        );
        value = "%value%";
      }
      this.add(
        this.lines,
        `APPEND ~splprot.2da~ ~${sp.name}%TAB%${sp.stat}%TAB%${
          value ?? -1
        }%TAB%${sp.relation}~ UNLESS ~${sp.name}~`,
        0
      );
    }
    this.add(this.lines, ``, 0);
  }

  generateSpellStates() {
    for (const state of Object.values(SPELL_STATES)) {
      this.add(
        this.lines,
        `LAF ADD_IDS_ENTRY STR_VAR idsFile = "splstate.ids" identifier = "${state}" END`,
        0
      );
    }
    this.add(this.lines, ``, 0);
  }

  generateItem(itemSlot: EquippedItem, immunity: ImmunityConfig) {
    const criticalHitImmunity = utils.hasCriticalHitImmunity(immunity);
    this.add(this.lines, `// ${immunity.name}`);
    this.add(this.lines, `CREATE ITM "${itemSlot.file}"`, 0);
    this.write(this.lines, 0x64, 4, "0x72", 1);
    let flags = 2 ** ItemFlagEnum.NotCopyable;
    if (itemSlot.slot === "HELMET") {
      this.write(this.lines, 0x1c, 2, 72, 1);
    } else if (criticalHitImmunity) {
      flags += 2 ** ItemFlagEnum.ToggleCriticalHit;
    }
    this.write(this.lines, 0x18, 4, flags, 1);
    this.write(this.lines, 0x3a, 8, this.getIcon(itemSlot), 1);
    if (immunity.stringRef) {
      this.writeStringRef(this.lines, 0x8, immunity.stringRef, 1);
      //TODO:
      // this.writeStringRef(this.lines, 0xc, immunity.stringRef, 1);
      // const stringRef = utils.resolveStringRef(immunity.stringRef);
      // this.add(
      //   this.lines,
      //   `SAY NAME1 ~${stringRef}~ SAY NAME2 ~${stringRef}~`,
      //   1
      // );
    }
    if (immunity.description) {
      this.writeStringRef(this.lines, 0x50, immunity.description, 1);
      //TODO:
      // this.writeStringRef(this.lines, 0x54, immunity.description, 1);
      // this.add(
      //   this.lines,
      //   `SAY UNIDENTIFIED_DESC ~${utils.resolveStringRef(
      //     immunity.description
      //   )}~`,
      //   1
      // );
    }
    this.add(this.lines, `COPY_EXISTING ~${itemSlot.file}.itm~ ~override~`, 0);
    this.add(
      this.lines,
      `LPF ${utils.getImmunityFunctionName(immunity.name)} END`,
      1
    );
    this.add(this.lines, "", 0);
  }

  getIcon(itemSlot: EquippedItem) {
    if (itemSlot.slot === JEWEL_SLOTS) return "IRING16";
    switch (itemSlot.slot) {
      case "ARMOR":
        return "IPLAT01";
      case "HELMET":
        return "IHELM01";
      case "AMULET":
        return "IAMUL01";
      case "LRING":
      case "RRING":
        return "IRING16";
      case "BOOTS":
        return "IBOOT01";
    }
  }
}

const weiduCoreService = new WeiduCoreService();
export default weiduCoreService;
