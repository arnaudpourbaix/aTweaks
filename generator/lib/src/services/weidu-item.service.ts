import { Creature } from "../model/final/creature";
import { ItemAbilityTypeEnum } from "../model/final/enums";
import { CodeLine } from "../model/misc";
import { State } from "../state";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { WeiduEffectService } from "./weidu-effect.service";

export class WeiduItemService extends AbstractWeiduService {
  static instance = new WeiduItemService();

  private weiduEffectService = WeiduEffectService.instance;

  createItems(lines: CodeLine[], creature: Creature) {
    for (const item of creature.items) {
      if (item.copyFrom) {
        const immunity = State.immunities.find((i) => i.name === item.copyFrom);
        if (immunity && !immunity.itemSlot)
          throw new Error(`No file configured for immunity ${item.copyFrom}`);
        this.add(
          lines,
          `COPY_EXISTING ~${
            immunity?.itemSlot?.file ?? item.copyFrom
          }.ITM~  ~override/${item.file}.ITM~`,
          0
        );
      } else {
        this.add(lines, `CREATE ITM "${item.file}"`, 0);
        this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
        if (item.type) {
          this.add(lines, `INSERT_BYTES 0x72 0x38`, 1);
          this.add(lines, `WRITE_SHORT 0x68 1`, 1);
          this.add(lines, `WRITE_SHORT 0x72 ${item.type}`, 1);
          this.add(lines, `WRITE_LONG 0x6a 0xaa`, 1);
        }
      }
      if (item.flags) {
        const flags = item.flags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x18 ${flags}`, 1);
      }
      if (item.name)
        this.add(lines, `SAY NAME1 ~${item.name}~ SAY NAME2 ~${item.name}~`, 1);
      if (item.description)
        this.add(
          lines,
          `SAY UNIDENTIFIED_DESC ~${item.description.join("\n")}~`,
          1
        );
      if (item.weight) this.add(lines, `WRITE_LONG 0x4c ${item.weight}`, 1);
      if (item.category)
        this.add(lines, `WRITE_SHORT 0x1c ${item.category}`, 1);
      if (item.animation)
        this.add(lines, `WRITE_ASCII 0x22 ~${item.animation}~ #2`, 1);
      if (item.proficiency)
        this.add(lines, `WRITE_BYTE 0x31 ${item.proficiency}`, 1);
      if (item.icon) this.add(lines, `WRITE_ASCII 0x3a ~${item.icon}~ #8`, 1);
      if (item.enchantment)
        this.add(lines, `WRITE_LONG 0x60 ${item.enchantment}`, 1);
      //this.add(lines, `LPF set_enchantment INT_VAR enchantment = ${item.enchantment} END`, 1);
      if (item.location)
        this.add(lines, `WRITE_SHORT 0x74 ${item.location}`, 1);
      if (item.target) this.add(lines, `WRITE_BYTE 0x7e ${item.target}`, 1);
      if (item.range) this.add(lines, `WRITE_SHORT 0x80 ${item.range}`, 1);
      if (item.speed) this.add(lines, `WRITE_SHORT 0x84 ${item.speed}`, 1);
      if (item.bonusToHit)
        this.add(lines, `WRITE_SHORT 0x86 ${item.bonusToHit}`, 1);
      if (item.diceSize) this.add(lines, `WRITE_BYTE 0x88 ${item.diceSize}`, 1);
      if (item.diceThrown)
        this.add(lines, `WRITE_BYTE 0x8a ${item.diceThrown}`, 1);
      if (item.damageBonus)
        this.add(lines, `WRITE_SHORT 0x8c ${item.damageBonus}`, 1);
      if (item.damageType)
        this.add(lines, `WRITE_SHORT 0x8e ${item.damageType}`, 1);
      if (item.projectile)
        this.add(
          lines,
          `WRITE_SHORT 0x9c (IDS_OF_SYMBOL (~projectl~ ~${item.projectile}~)) + 1`,
          1
        );
      if (item.type === ItemAbilityTypeEnum.Melee) {
        this.add(
          lines,
          `WRITE_SHORT 0x9e ${item.animationSwing?.overhand ?? "34"}`,
          1
        );
        this.add(
          lines,
          `WRITE_SHORT 0xa0 ${item.animationSwing?.backhand ?? "33"}`,
          1
        );
        this.add(
          lines,
          `WRITE_SHORT 0xa2 ${item.animationSwing?.thrust ?? "33"}`,
          1
        );
      } else if (item.type === ItemAbilityTypeEnum.Ranged) {
        this.add(lines, `WRITE_SHORT 0x38 1`, 1);
        this.add(lines, `WRITE_SHORT 0xa4 1`, 1);
      }
      if (item.abilityflags) {
        const flags = item.abilityflags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x98 ${flags}`, 1);
      }
      if (!item.copyFrom)
        this.add(lines, `COPY_EXISTING ~${item.file}.itm~ ~override~`, 0);
      for (const effect of item.effects) {
        this.weiduEffectService.addEffect(lines, 1, effect, 0, "ITM");
      }
      if (creature.attack.grab?.weaponFile === item.file) {
        const effect = this.grabService.getGrabEffect(
          creature,
          creature.attack.grab
        );
        this.weiduEffectService.addEffect(lines, 1, effect, 0, "ITM");
      }
      for (const name of item.immunities) {
        this.add(
          lines,
          `LPF ${this.utils.getImmunityFunctionName(name)} END`,
          1
        );
      }
      this.add(lines, "", 0);
    }
  }
}
