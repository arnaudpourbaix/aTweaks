import { CR } from "../model/constants";
import { Creature } from "../model/final/creature";
import { ItemAbilityTypeEnum } from "../model/final/effect.enums";
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
        this.write(lines, 0x64, 4, "0x72", 1);
        if (item.type) {
          this.add(lines, `INSERT_BYTES 0x72 0x38`, 1);
          this.write(lines, 0x68, 2, 1, 1);
          this.write(lines, 0x72, 2, item.type, 1);
          this.write(lines, 0x6a, 4, "0xaa", 1);
        }
      }
      this.writeStringRef(lines, 0x8, item.stringRef, 1);
      this.writeStringRef(lines, 0xc, item.stringRef, 1);
      this.writeFlag(lines, 0x18, 4, item.flags, 1);
      this.write(lines, 0x1c, 2, item.category, 1);
      this.writeAscii(lines, 0x22, 2, item.animation, 1);
      this.write(lines, 0x31, 1, item.proficiency, 1);
      this.writeAscii(lines, 0x3a, 8, item.icon, 1);
      this.write(lines, 0x4c, 4, item.weight, 1);
      this.writeStringRef(lines, 0x50, (item.description ?? []).join(CR), 1);
      this.write(lines, 0x60, 4, item.enchantment, 1);
      //this.add(lines, `LPF set_enchantment INT_VAR enchantment = ${item.enchantment} END`, 1);

      if (!item.copyFrom)
        this.add(lines, `COPY_EXISTING ~${item.file}.itm~ ~override~`, 0);
      this.add(lines, `READ_SHORT 0x68 abicount`, 1);
      this.add(lines, `PATCH_IF (%abicount% > 0) BEGIN`, 1);
      this.write(lines, 0x74, 1, item.location, 2);
      this.writeAscii(lines, 0x76, 8, item.icon, 2);
      this.write(lines, 0x7e, 1, item.target, 2);
      this.write(lines, 0x80, 2, item.range, 2);
      this.write(lines, 0x84, 1, item.speed, 2);
      this.write(lines, 0x86, 2, item.bonusToHit, 2);
      this.write(lines, 0x88, 1, item.diceSize, 2);
      this.write(lines, 0x8a, 1, item.diceThrown, 2);
      this.write(lines, 0x8c, 2, item.damageBonus, 2);
      this.write(lines, 0x8e, 2, item.damageType, 2);
      const projectile = item.projectile
        ? `(IDS_OF_SYMBOL (~projectl~ ~${item.projectile}~)) + 1`
        : "";
      this.write(lines, 0x9c, 2, projectile, 2);
      if (item.type === ItemAbilityTypeEnum.Melee) {
        this.write(lines, 0x9e, 2, item.animationSwing?.overhand ?? 34, 2);
        this.write(lines, 0xa0, 2, item.animationSwing?.backhand ?? 33, 2);
        this.write(lines, 0xa2, 2, item.animationSwing?.thrust ?? 33, 2);
      } else if (item.type === ItemAbilityTypeEnum.Ranged) {
        this.write(lines, 0x38, 2, 1, 1);
        this.write(lines, 0xa4, 2, 1, 1);
        this.write(lines, 0x9e, 2, item.animationSwing?.overhand ?? 0, 2);
        this.write(lines, 0xa0, 2, item.animationSwing?.backhand ?? 0, 2);
        this.write(lines, 0xa2, 2, item.animationSwing?.thrust ?? 0, 2);
      }
      this.writeFlag(lines, 0x98, 4, item.abilityflags, 2);
      this.add(lines, `END`, 1);
      for (const effect of item.effects) {
        if (!item.type && !effect.global)
          throw new Error(
            `Can't add a non-global effect to an item without extended header: ${item.file} -> ${effect.opcode}`
          );
        this.weiduEffectService.addEffect({
          lines,
          tab: 1,
          effect,
          type: "ITM",
        });
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
