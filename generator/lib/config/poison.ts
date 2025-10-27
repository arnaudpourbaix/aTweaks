import { PnPPoisonType } from "../src/model/spell-item/effect.enums";

export interface PoisonModel {
  type: PnPPoisonType;
  damage: number;
  saveDamage: number;
  duration: number;
}

export const poisonFatalDamage = 250;
export const poisonImmediateDeathDuration = 18; // 3 rounds so it gives some time to cure it

export const POISONS: PoisonModel[] = [
  {
    // 10–30 minutes	15/0
    type: "A",
    damage: 15,
    saveDamage: 0,
    duration: 10 * 60,
  },
  {
    // 2–12 minutes	20/1-3
    type: "B",
    damage: 20,
    saveDamage: 2,
    duration: 2 * 60,
  },
  {
    // 2–5 minutes	25/2-8
    type: "C",
    damage: 25,
    saveDamage: 5,
    duration: 2 * 60,
  },
  {
    // 1–2 minutes	30/2-12
    type: "D",
    damage: 30,
    saveDamage: 7,
    duration: 60,
  },
  {
    // Immediate	Death/20
    type: "E",
    damage: poisonFatalDamage,
    saveDamage: 20,
    duration: poisonImmediateDeathDuration,
  },
  {
    // Immediate	Death/0
    type: "F",
    damage: poisonFatalDamage,
    saveDamage: 0,
    duration: poisonImmediateDeathDuration,
  },
  {
    // 2–12 hours	20/10
    type: "G",
    damage: 20,
    saveDamage: 10,
    duration: 2 * 60 * 60,
  },
  {
    // 1–4 hours	20/10
    type: "H",
    damage: 20,
    saveDamage: 10,
    duration: 60 * 60,
  },
  {
    // 2–12 minutes	30/15
    type: "I",
    damage: 30,
    saveDamage: 15,
    duration: 2 * 60,
  },
  {
    // 1–4 minutes	Death/20
    type: "J",
    damage: poisonFatalDamage,
    saveDamage: 20,
    duration: 60,
  },
  {
    // 2–8 minutes	5/0
    type: "K",
    damage: 5,
    saveDamage: 0,
    duration: 2 * 60,
  },
  {
    // 2–8 minutes	10/0
    type: "L",
    damage: 10,
    saveDamage: 0,
    duration: 2 * 60,
  },
  {
    // 1–4 minutes	20/5
    type: "M",
    damage: 20,
    saveDamage: 5,
    duration: 60,
  },
  {
    // 1 minute	Death/25
    type: "N",
    damage: poisonFatalDamage,
    saveDamage: 25,
    duration: 60,
  },
  {
    // 2–24 minutes	Paralytic.
    // Paralytic poisons leave the character unable to move for 2d6 hours.
    type: "O",
    damage: 0,
    saveDamage: 0,
    duration: 2 * 60,
  },
  {
    // 1–3 hours	Debilitative.
    // Weaken the character for 1d3 days.
    // All of the character's ability scores are reduced by half during this time.
    // All appropriate adjustments to attack rolls, damage, Armor Class, etc., from the lowered ability scores are applied during the course of the illness.
    // In addition, the character moves at one-half his normal movement rate.
    // Finally, the character cannot heal by normal or magical means until the poison is neutralized or the duration of the debilitation is elapsed.
    type: "P",
    damage: 0,
    saveDamage: 0,
    duration: 60 * 60,
  },
];
