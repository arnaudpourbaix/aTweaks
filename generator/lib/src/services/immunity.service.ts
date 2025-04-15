import chalk from "chalk";
import figureSet from "figures";
import { Creature, CreatureAdditionalData } from "../model/final/creature";
import { ImmunityConfig } from "../model/final/immunity";
import { State } from "../state";

export class ImmunityService {
  static instance = new ImmunityService();

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
      //TODO: when an immunity has an itemSlot defined and is not helmet, we need to check if it contains immunity to critical hits (current or children).
      // if it does, we need to make sure that a helmet is equipped (don't forget adjustments). If no helmet is equipped, add ja#i5 (invisible helmet)
      if (!immunity) throw new Error(`Immunity ${name} not configured !`);
      if (immunity.itemSlot) {
        const overwrittingItem = creature.items.find(
          (i) => i.copyFrom === immunity.name
        );
        if (overwrittingItem)
          console.log(
            chalk.yellowBright(
              `${figureSet.arrowRight} skipping ${immunity.itemSlot.file} because ${overwrittingItem.file} overwrites it`
            )
          );
        else
          additionalData.itemSlots.push({
            file: immunity.itemSlot.file,
            slot: immunity.itemSlot.slot,
          });
      }
    }
  }
}
