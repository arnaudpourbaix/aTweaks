export function convertMovement(movement: number): number {
  // aVENGER was using a coef of 0.75
  const result = Math.round(movement * 0.8);
  return result;
}

export function getFilename(num: number, creatureId: number): string {
  return `ja#${num}m${creatureId}`;
}

export function bafFile(creatureId: number): string {
  return `ja#m${creatureId}`;
}
