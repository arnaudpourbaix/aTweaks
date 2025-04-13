import chalk from "chalk";
import figureSet from "figures";

export function convertMovement(movement: number, silent = true): number {
  const result = Math.round(movement * 0.85);
  const movements: { [key: number]: number } = {
    6: 5,
    9: 7,
    12: 9,
    14: 10,
    15: 11,
    18: 14,
    24: 18,
    36: 36,
    48: 48,
  };
  const match = movements[movement];
  if (result !== match && !silent)
    console.log(
      chalk.yellowBright(
        `${figureSet.warning} movement ${movement} => result:${result}, table:${match}`
      )
    );
  return result;
}

export function file(num: number, creatureId: number): string {
  return `ja#${num}m${creatureId}`;
}

export function bafFile(creatureId: number): string {
  return `ja#m${creatureId}`;
}
