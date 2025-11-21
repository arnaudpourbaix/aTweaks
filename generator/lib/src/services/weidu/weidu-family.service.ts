import * as fs from "fs";
import path from "path";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { CR, TAB } from "../../model/constants";
import { Creature } from "../../model/creature/creature";
import { State } from "../../state";
import translationService from "../translation.service";
import utils from "../utils/utils.service";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { CreatureFamily } from "../../model/creature/family";
import weiduProjectileService from "./weidu-projectile.service";
import weiduEffectService from "./weidu-effect.service";
import weiduSpellService from "./weidu-spell.service";
import weiduItemService from "./weidu-item.service";

class WeiduFamilyService extends AbstractWeiduService {
  createOrUpdateMainFile(family: MonsterFamilyEnum, creature?: Creature) {
    const file = this.getMainFilename(family);
    if (!creature) {
      let content = "";
      const commonFile = path.join(
        State.modFolder,
        `${utils.getFamilyFolder(family)}/common.tpa`
      );
      if (fs.existsSync(commonFile)) {
        content = `INCLUDE "%MOD_FOLDER%/${utils.getFamilyFolder(
          family
        )}/common.tpa"${CR}`;
      }
      fs.rmSync(file);
      utils.writeFile(file, content);
    } else {
      fs.appendFileSync(
        file,
        `INCLUDE "%MOD_FOLDER%/${utils.getFamilyFolder(family)}/${
          creature.monster
        }.tpa" // ${translationService.from(creature.name)}${CR}`
      );
    }
  }

  generateFamilyData(family: CreatureFamily) {
    const lines = this.initLines();
    // weiduProjectileService.createProjectiles(lines, family);
    // weiduEffectService.createEffectFiles(lines, creature.effectFiles);
    weiduSpellService.createSpells(lines, family.spells);
    weiduItemService.createItems(lines, family.items);
    this.add(lines, "", 0);
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    const file = this.getMainFilename(family.name);
    fs.appendFileSync(file, content);
  }

  getMainFilename(family: MonsterFamilyEnum) {
    const file = path.join(
      State.modFolder,
      `${utils.getFamilyFolder(family)}/main.tpa`
    );
    return file;
  }
}

const weiduFamilyService = new WeiduFamilyService();
export default weiduFamilyService;
