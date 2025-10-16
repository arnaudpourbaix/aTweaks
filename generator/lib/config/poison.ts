import { RawPnPPoisonType } from "../src/model/raw/enum";

export interface PoisonModel {
  type: RawPnPPoisonType;
  damage: number;
  saveDamage: number;
  duration: number;
}

const fatalDamage = 240;
const fatalDuration = 6;

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
    damage: fatalDamage,
    saveDamage: 20,
    duration: fatalDuration,
  },
  {
    // Immediate	Death/0
    type: "F",
    damage: fatalDamage,
    saveDamage: 0,
    duration: fatalDuration,
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
    damage: fatalDamage,
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
    damage: fatalDamage,
    saveDamage: 25,
    duration: 60,
  },
  {
    // 2–24 minutes	Paralytic.
    type: "O",
    damage: 0,
    saveDamage: 0,
    duration: 2 * 60,
  },
  {
    // 1–3 hours	Debilitative.
    type: "P",
    damage: 0,
    saveDamage: 0,
    duration: 60 * 60,
  },
];
