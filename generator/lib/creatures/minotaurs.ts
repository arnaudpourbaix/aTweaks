import { Creature } from "../src/model/creature/creature";
import { CreatureFamily } from "../src/model/creature/family";
import { MonsterEnum, MonsterFamilyEnum } from "./monster";

enum Ids {}

class Minotaur extends Creature {}

class MinotaurFamily extends CreatureFamily<Minotaur> {
  constructor() {
    super(MonsterFamilyEnum.Minotaur);
    this.addCreature(this.minotaur());
  }

  createCreature(id: MonsterEnum): Minotaur {
    return new Minotaur(id);
  }

  /**
   * Wolf
   */
  private minotaur() {
    const minotaur = this.create({
      monster: MonsterEnum.Minotaur,
      name: "monster.wolf.name.wolf",
      files: [
        "L#MCMIN", // Minotaur
      ],
      logging: true,
      data: {
        level1: 3,
        bonusHp: 0,
        strength: 12,
        dexterity: 15,
        constitution: 12,
        intelligence: 4,
        wisdom: 12,
        charisma: 6,
        ac: 7,
        apr: 1,
        xpv: 65,
        alignment: "NEUTRAL",
        morale: 10,
        general: "ANIMAL",
        race: "WOLF",
        class: "WOLF",
        gender: "MALE",
        size: "Small",
      },
    });
    minotaur.setAdditionalData({
      movement: { value: 18 },
      removeItems: ["P1-6"],
    });
    // minotaur.createJaws({
    //   diceThrown: 1,
    //   diceSize: 4,
    // });
    return minotaur;
  }
}

export const createMinotaurs = () => new MinotaurFamily();
