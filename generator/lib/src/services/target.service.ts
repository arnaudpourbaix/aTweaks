import {
  DEFAULT_STATUS_ORDER,
  TARGET_LISTS,
  TARGET_STATUS,
} from "../../config/target-config";
import { TargetListName, TargetStatusName } from "../../config/target-name";
import { TargetList, TargetPriority } from "../model/final/target";
import { AlignIdentifier } from "../model/ids/align";
import { AllegianceIdentifier } from "../model/ids/allegiance";
import { ClassIdentifier } from "../model/ids/class";
import { GenderIdentifier } from "../model/ids/gender";
import { GeneralIdentifier } from "../model/ids/general";
import { ObjectIdentifier } from "../model/ids/object";
import { RaceIdentifier } from "../model/ids/race";
import { SpecificIdentifier } from "../model/ids/specific";
import { RawCreature } from "../model/raw/creature";
import { RawTargetList, TargetStatus } from "../model/raw/target";
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
      return results.slice(0, limit ?? results.length);
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

  getTargetPriorities(creature: RawCreature): TargetPriority[] {
    const defaults = this.getDefaultStatus(creature);
    const targetPriorities = creature.attack?.targetPriorities ?? [];
    const results: TargetPriority[] = [];
    for (const t of targetPriorities) {
      if (!t.status && !t.targets)
        throw new Error(`Empty targetPriority is not allowed !`);
      else if (!t.targets) {
        results.push(...this.getTargetPrioritiesFromStatusList(t.status!));
      } else if (!t.status) {
        results.push({
          targets: t.targets,
          status: t.targets.every((i) => i === "Players")
            ? defaults.allStatus
            : defaults.targetStatus,
        });
      } else {
        results.push({
          status: t.status,
          targets: t.targets,
        });
      }
    }
    const defaultTargetStatus = this.getLeftoversStatusList(
      defaults.targetStatus,
      "NearestEnemies",
      results
    );
    if (defaultTargetStatus.length) {
      results.push({
        targets: ["NearestEnemies"],
        status: defaultTargetStatus,
      });
    }
    const defaultPlayerStatus = this.getLeftoversStatusList(
      defaults.playerStatus,
      "Players",
      results
    );
    if (defaultPlayerStatus.length) {
      results.push({ targets: ["Players"], status: defaultPlayerStatus });
    }
    return results;
  }

  private getLeftoversStatusList(
    list: TargetStatusName[],
    target: TargetListName,
    priorities: TargetPriority[]
  ): TargetStatusName[] {
    const results = list.filter(
      (s) =>
        !priorities.some(
          (p) => p.targets.includes(target) && p.status.includes(s)
        )
    );
    return results;
  }

  getList(name: TargetListName): string[] {
    const list = TARGET_LISTS.find((l) => l.name === name);
    if (!list) throw new Error(`Target list ${name} is not defined !`);
    return list.value;
  }

  private getDefaultStatus(creature: RawCreature): {
    allStatus: TargetStatusName[];
    targetStatus: TargetStatusName[];
    playerStatus: TargetStatusName[];
  } {
    const allStatus = DEFAULT_STATUS_ORDER.filter((status) => {
      const statusDetails = TARGET_STATUS.find(
        (t) => t.status === status
      ) as TargetStatus;
      const grab = status !== "Grabbed" || !!creature.attack?.grab;
      const intelligence =
        !statusDetails.requireIntelligence ||
        (!!creature.data.intelligence && creature.data.intelligence >= 8);
      return grab && intelligence;
    });
    const targetStatus = this.getFilteredStatusNameList(allStatus, false);
    const playerStatus = this.getFilteredStatusNameList(allStatus, true);
    return { targetStatus, playerStatus, allStatus };
  }

  private getTargetPrioritiesFromStatusList(
    status: TargetStatusName[]
  ): TargetPriority[] {
    const results: TargetPriority[] = [];
    const targetStatus = this.getFilteredStatusNameList(status, false);
    const playerStatus = this.getFilteredStatusNameList(status, true);
    if (targetStatus.length) {
      results.push({
        targets: ["NearestEnemies"],
        status: targetStatus,
      });
    }
    if (playerStatus.length) {
      results.push({ targets: ["Players"], status: playerStatus });
    }
    return results;
  }

  private getFilteredStatusNameList(
    list: TargetStatusName[],
    canOnlyTargetPlayer: boolean
  ): TargetStatusName[] {
    return list.filter((status) => {
      const statusDetails = TARGET_STATUS.find(
        (t) => t.status === status
      ) as TargetStatus;
      return statusDetails.canOnlyTargetPlayer === canOnlyTargetPlayer;
    });
  }
}
