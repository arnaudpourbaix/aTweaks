import {
  TARGET_LISTS,
  TARGET_STATUS,
  TargetListName,
} from "../../config/target";
import { AlignIdentifier } from "../model/ids/align";
import { AllegianceIdentifier } from "../model/ids/allegiance";
import { ClassIdentifier } from "../model/ids/class";
import { GenderIdentifier } from "../model/ids/gender";
import { GeneralIdentifier } from "../model/ids/general";
import { ObjectIdentifier } from "../model/ids/object";
import { RaceIdentifier } from "../model/ids/race";
import { SpecificIdentifier } from "../model/ids/specific";
import { RawCreature } from "../model/raw/creature";
import {
  RawTargetList,
  TargetStatus,
  TargetStatusName,
} from "../model/raw/target";
import { Triggers } from "../model/raw/triggers";
import { UtilsService } from "./utils.service";

export class TargetService {
  static instance = new TargetService();

  utils = UtilsService.instance;

  targetObject(p: {
    ea?: AllegianceIdentifier;
    general?: GeneralIdentifier;
    race?: RaceIdentifier;
    clazz?: ClassIdentifier;
    specific?: SpecificIdentifier;
    gender?: GenderIdentifier;
    align?: AlignIdentifier;
  }): string {
    const list = [
      p.ea ?? 0,
      p.general ?? 0,
      p.race ?? 0,
      p.clazz ?? 0,
      p.specific ?? 0,
      p.gender ?? 0,
      p.align ?? 0,
    ];
    for (let i = list.length - 1; i >= 0 && list[i] === 0; i--) {
      list.pop();
    }
    return `${list.join(".")}`;
  }

  getTargetFromAbility(
    target: ObjectIdentifier | AllegianceIdentifier | TargetListName,
    limit: number | undefined
  ): ObjectIdentifier | AllegianceIdentifier | string[] {
    try {
      const results = this.getList(target as TargetListName);
      return results.slice(0, limit ?? 6);
    } catch {
      return target as ObjectIdentifier | AllegianceIdentifier;
    }
  }

  getTriggersFromTargetList(target: RawTargetList): {
    triggers: Triggers.Trigger[];
    targetTriggers: Triggers.Trigger[];
  } {
    const targetTriggers: Triggers.Trigger[] = target.triggers ?? [];
    const triggers: Triggers.Trigger[] = [];
    const statuses = TARGET_STATUS;
    for (const name of target.includeStatus ?? []) {
      const status = statuses.find((s) => s.status === name) as TargetStatus;
      triggers.push(...status.triggers);
      targetTriggers.push(...status.targetTriggers);
    }
    for (const name of target.excludeStatus ?? []) {
      const status = statuses.find((s) => s.status === name) as TargetStatus;
      triggers.push(...status.triggers);
      targetTriggers.push(
        ...this.utils.inverseNegations(status.targetTriggers)
      );
    }
    return { triggers, targetTriggers };
  }

  getTargetPriorities(creature: RawCreature): TargetStatusName[] {
    if (creature.attack?.targetPriorities)
      return creature.attack.targetPriorities;
    const results: TargetStatusName[] = [];
    if (creature.attack?.grab) results.push("Grabbed");
    if (!!creature.data.intelligence && creature.data.intelligence >= 8) {
      results.push(
        ...(["Slowed", "Able", "Held", "Stunned"] as TargetStatusName[])
      );
    }
    results.push(...(["NoCheck", "Sleep"] as TargetStatusName[]));
    return results;
  }

  getList(name: TargetListName): string[] {
    const list = TARGET_LISTS.find((l) => l.name === name);
    if (!list) throw new Error(`Target list ${name} is not defined !`);
    return list.value;
  }
}
