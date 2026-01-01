import creatureService from "../../services/creature.service";

export class Movement {
  pnpValue: number;
  bonus: number;
  hasImprovedHaste: boolean;
  itemFile?: string;

  constructor(pnpValue: number) {
    this.pnpValue = pnpValue;
    this.hasImprovedHaste = false;
    this.bonus = 0;
  }

  clone(): Movement {
    const result = new Movement(this.pnpValue);
    result.bonus = this.bonus;
    result.hasImprovedHaste = this.hasImprovedHaste;
    result.itemFile = this.itemFile;
    return result;
  }

  hasValue() {
    return this.pnpValue !== undefined;
  }

  hasItem() {
    return this.itemFile !== undefined;
  }

  bindItem(file: string) {
    this.itemFile = file;
  }

  getGameValue() {
    let value = creatureService.convertMovement(this.pnpValue);
    if (this.hasImprovedHaste) {
      value = Math.round(value / 2);
    }
    return value + this.bonus;
  }
}
