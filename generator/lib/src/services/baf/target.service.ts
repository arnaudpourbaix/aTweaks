import {
  DEFAULT_STATUS_ORDER,
  TARGET_LISTS,
  TARGET_STATUS,
} from "../../../config/target-config";
import { TargetListName, TargetStatusName } from "../../../config/target-name";
import { Creature } from "../../model/creature/creature";
import {
  TargetList,
  TargetPriority,
  TargetStatus,
} from "../../model/script/target";
import { AlignIdentifier } from "../../model/ids/align";
import { AllegianceIdentifier } from "../../model/ids/allegiance";
import { ClassIdentifier } from "../../model/ids/class";
import { GenderIdentifier } from "../../model/ids/gender";
import { GeneralIdentifier } from "../../model/ids/general";
import { ObjectIdentifier } from "../../model/ids/object";
import { RaceIdentifier } from "../../model/ids/race";
import { SpecificIdentifier } from "../../model/ids/specific";
import { Triggers } from "../../model/script/triggers";
import utils from "../utils/utils.service";
import { GRAB_DEFAULT_CONFIG } from "../../model/creature/grab";
import { PartialCreatureAttack } from "../../model/creature/attack";

class TargetService {
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
    limit: number | undefined,
    randomOrder: boolean | undefined
  ): ObjectIdentifier | AllegianceIdentifier | string[] {
    try {
      let results = this.getList(target as TargetListName);
      if (randomOrder) {
        // results = utils.shuffleArray(results); // TODO: disable to prevent file changes (since generated sources are committed)
      }
      return results.slice(0, limit ?? results.length);
    } catch {
      return target as ObjectIdentifier | AllegianceIdentifier;
    }
  }

  getTriggersFromTargetList(target: TargetList): {
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
      targetTriggers.push(...utils.inverseNegations(status.targetTriggers));
    }
    return { triggers, targetTriggers };
  }

  getTargetPriorities(
    creature: Creature,
    attack: PartialCreatureAttack
  ): TargetPriority[] {
    const defaults = this.getDefaultStatus(creature);
    const targetPriorities = attack.targetPriorities ?? [];
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
    // console.log("targets:", results);
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

  private getDefaultStatus(creature: Creature): {
    allStatus: TargetStatusName[];
    targetStatus: TargetStatusName[];
    playerStatus: TargetStatusName[];
  } {
    const allStatus = DEFAULT_STATUS_ORDER.filter((status) => {
      const statusDetails = TARGET_STATUS.find(
        (t) => t.status === status
      ) as TargetStatus;
      const validStatus =
        status !== "Grabbed" ||
        creature.spells.some(
          (s) => s.name === GRAB_DEFAULT_CONFIG.grabStringRef
        );
      const intelligence =
        !statusDetails.requireIntelligence ||
        (!!creature.data.intelligence && creature.data.intelligence >= 8);
      return validStatus && intelligence;
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

const targetService = new TargetService();
export default targetService;
