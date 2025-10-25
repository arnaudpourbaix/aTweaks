import chalk from "chalk";
import figureSet from "figures";
import { Creature, CreatureAdditionalData } from "../model/creature/creature";
import { ImmunityConfig } from "../model/final/immunity";
import { State } from "../state";
import { EquippedItem } from "../model/spell-item/spell-item";
import utils from "./utils.service";

class ImmunityService {
  handleImmunities(creature: Creature): void {
    this.checkImmunities(creature.additionalData, creature);
    for (const a of creature.adjustments) {
      if (a.additionalData?.immunities.length) {
        this.checkImmunities(a.additionalData, creature);
      }
    }
  }

  private checkImmunities(
    additionalData: CreatureAdditionalData,
    creature: Creature
  ): void {
    for (const name of additionalData.immunities) {
      const immunity = State.immunities.find(
        (i) => i.name === name
      ) as ImmunityConfig;
      if (immunity.itemSlot) {
        this.checkImmunity(
          immunity.itemSlot,
          immunity,
          additionalData,
          creature
        );
      }
    }
  }

  private checkImmunity(
    itemSlot: EquippedItem,
    immunity: ImmunityConfig,
    additionalData: CreatureAdditionalData,
    creature: Creature
  ): void {
    const hasCriticalHitImmunity = utils.hasCriticalHitImmunity(immunity);
    const hasHelmet = utils.isSlotIncluded(
      [
        ...additionalData.equippedItems,
        ...creature.additionalData.equippedItems,
      ],
      "HELMET"
    );
    if (hasCriticalHitImmunity && itemSlot.slot !== "HELMET" && !hasHelmet) {
      console.log(
        chalk.yellowBright(
          `${figureSet.arrowRight} ${immunity.name} needs a helmet to cover immunity from critical hits. Adding a helmet to cover it.`
        )
      );
      additionalData.immunities.push("criticalHit");
    }
    const overwrittingItem = creature.items.find(
      (i) => i.copyFrom === immunity.name
    );
    const overwrittingSlot = utils.isSlotIncluded(
      [
        ...additionalData.equippedItems,
        ...creature.additionalData.equippedItems,
      ],
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
      additionalData.equippedItems.push({
        file: itemSlot.file,
        slot: itemSlot.slot,
      });
  }
}

const immunityService = new ImmunityService();
export default immunityService;
