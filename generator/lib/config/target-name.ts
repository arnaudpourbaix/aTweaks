export type TargetListName =
  | "Players"
  | "NearestEnemies"
  | "PCsInOrder"
  | "PCsPreferringStrong"
  | "PCsPreferringWeak"
  | "PCSpellcasters"
  | "FarthestEnemies"
  | "CloseEnemies";

export type TargetStatusName =
  | "Grabbed"
  | "Held"
  | "Stunned"
  | "Slowed"
  /**
   * panic, confused, feebleminded
   */
  | "PanicConfused"
  | "Sleep"
  /**
   * Not affected by any disabling status
   */
  | "Able"
  | "NoCheck";
