export function getFilename(
  num: number,
  creatureId: number,
  type: "f" | "m" = "m"
): string {
  return `ja#${num}${type}${creatureId}`;
}

export function bafFile(creatureId: number): string {
  return `ja#m${creatureId}`;
}
