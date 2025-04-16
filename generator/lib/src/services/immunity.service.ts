import chalk from "chalk";
import figureSet from "figures";
import { Creature, CreatureAdditionalData } from "../model/final/creature";
import { ImmunityConfig } from "../model/final/immunity";
import { State } from "../state";
import { RawItemSlot } from "../model/raw/item";
import { UtilsService } from "./utils.service";

export class ImmunityService {
  static instance = new ImmunityService();
  private utils = UtilsService.instance;

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
    itemSlot: RawItemSlot,
    immunity: ImmunityConfig,
    additionalData: CreatureAdditionalData,
    creature: Creature
  ): void {
    const hasCriticalHitImmunity = this.utils.hasCriticalHitImmunity(immunity);
    const hasHelmet = [
      ...additionalData.itemSlots,
      ...creature.additionalData.itemSlots,
    ].some((i) => i.slot === "HELMET");
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
    const overwrittingSlot = [
      ...additionalData.itemSlots,
      ...creature.additionalData.itemSlots,
    ].some((i) => i.slot === itemSlot.slot);
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
      additionalData.itemSlots.push({
        file: itemSlot.file,
        slot: itemSlot.slot,
      });
  }
}
