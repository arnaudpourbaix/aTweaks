import chalk from "chalk";
import figureSet from "figures";
import { ImmunityConfig, ImmunityName } from "../../model/final/immunity";
import { State } from "../../state";
import { Creature } from "../../model/creature/creature";
import { EquippedItem } from "../../model/creature/item";
import utils from "../utils/utils.service";
import itemService from "../item.service";
import { CreatureAdjustment } from "../../model/creature/adjustment";
import { CreatureData } from "../../model/creature/data";

class ImmunityService {
  handleImmunities(creature: Creature): void {
    this.checkImmunities(creature.data, creature);
    for (const a of creature.adjustments) {
      if (a.data?.immunities.length) {
        this.checkImmunities(a.data, creature);
      }
    }
  }

  getOverrides(
    immunity: ImmunityName,
    adjustments: CreatureAdjustment[]
  ): string[] {
    const files = adjustments.reduce((acc, a) => {
      const immunities = this.getImmunities(a.data.immunities);
      if (immunities.some((i) => i.overrides.includes(immunity))) {
        acc.push(...a.files);
      }
      return acc;
    }, [] as string[]);
    return files;
  }

  private getImmunities(names: ImmunityName[]): ImmunityConfig[] {
    return names.map(
      (n) => State.immunities.find((i) => i.name === n) as ImmunityConfig
    );
  }

  private checkImmunities(data: CreatureData, creature: Creature): void {
    for (const name of data.immunities) {
      const immunity = State.immunities.find(
        (i) => i.name === name
      ) as ImmunityConfig;
      if (immunity.itemSlot) {
        this.checkImmunity(immunity.itemSlot, immunity, data, creature);
      }
    }
  }

  private checkImmunity(
    itemSlot: EquippedItem,
    immunity: ImmunityConfig,
    data: CreatureData,
    creature: Creature
  ): void {
    const hasCriticalHitImmunity = utils.hasCriticalHitImmunity(immunity);
    const hasHelmet = itemService.isSlotIncluded(
      [...data.items.equipped, ...creature.data.items.equipped],
      "HELMET"
    );
    if (hasCriticalHitImmunity && itemSlot.slot !== "HELMET" && !hasHelmet) {
      console.log(
        chalk.yellowBright(
          `${figureSet.arrowRight} ${immunity.name} needs a helmet to cover immunity from critical hits. Adding a helmet to cover it.`
        )
      );
      data.immunities.push("criticalHit");
    }
    const overwrittingItem = creature.items.find(
      (i) => i.copyFrom === immunity.name
    );
    const overwrittingSlot = itemService.isSlotIncluded(
      [...data.items.equipped, ...creature.data.items.equipped],
      itemSlot.slot
    );
    if (overwrittingItem)
      console.log(
        chalk.yellowBright(
          `${figureSet.arrowRight} skipping ${itemSlot.file} because ${overwrittingItem.file} overwrites it`
        )
      );
    else if (overwrittingSlot)
      console.log(
        chalk.redBright(
          `${figureSet.arrowRight} skipping ${immunity.name} (${itemSlot.file}) because slot ${itemSlot.slot} is already assigned`
        )
      );
    else
      data.items.equipped.push({
        file: itemSlot.file,
        slot: itemSlot.slot,
      });
  }
}

const immunityService = new ImmunityService();
export default immunityService;
