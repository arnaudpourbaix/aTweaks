import { getTargetPriorityDetails, TARGET_LISTS, TargetListName } from "../../config/target";
import { CreatureAbility } from "../model/final/ability";
import { TargetList } from "../model/final/target";
import { AlignIdentifiers } from "../model/ids/align";
import { AllegianceIdentifiers } from "../model/ids/allegiance";
import { ClassIdentifiers } from "../model/ids/class";
import { GenderIdentifiers } from "../model/ids/gender";
import { GeneralIdentifiers } from "../model/ids/general";
import { ObjectIdentifiers } from "../model/ids/object";
import { RaceIdentifiers } from "../model/ids/race";
import { SpecificIdentifiers } from "../model/ids/specific";
import { RawCreature } from "../model/raw/creature";
import { OrTrigger, Trigger } from "../model/raw/script";
import { RawTargetList, TargetPriority, TargetStatusEnum } from "../model/raw/target";
import { UtilsService } from "./utils.service";

export class TargetService {
    static instance = new TargetService();

    utils = UtilsService.instance;

    targetObject = (p: {
        ea?: AllegianceIdentifiers;
        general?: GeneralIdentifiers;
        race?: RaceIdentifiers;
        clazz?: ClassIdentifiers;
        specific?: SpecificIdentifiers;
        gender?: GenderIdentifiers;
        align?: AlignIdentifiers;
    }): string => {
        const list = [
            p.ea ?? 0,
            p.general ?? 0,
            p.race ?? 0,
            p.clazz ?? 0,
            p.specific ?? 0,
            p.gender ?? 0,
            p.align ?? 0
        ];
        for (let i = list.length - 1; i >= 0 && list[i] === 0; i--) {
            list.pop();
        }
        return `${list.join('.')}`;
    }

    getTargetFromAbility(target: ObjectIdentifiers | AllegianceIdentifiers | TargetListName, limit: number | undefined): ObjectIdentifiers | AllegianceIdentifiers | string[] {
        try {
            const results = this.getList(target as TargetListName);
            return results.slice(0, limit ?? 6);
        } catch {
            return target as ObjectIdentifiers | AllegianceIdentifiers;
        }
    }

    getTriggersFromTargetList(target: RawTargetList): { triggers: (Trigger | OrTrigger)[], targetTriggers: (Trigger | OrTrigger)[] } {
        const targetTriggers: (Trigger | OrTrigger)[] = target.triggers ?? [];
        const triggers: (Trigger | OrTrigger)[] = [];
        const statuses = getTargetPriorityDetails();
        for (const name of target.includeStatus ?? []) {
            const status = statuses.find(s => s.status === name) as TargetPriority;
            triggers.push(...status.triggers);
            targetTriggers.push(...status.targetTriggers);
        }
        for (const name of target.excludeStatus ?? []) {
            const status = statuses.find(s => s.status === name) as TargetPriority;
            triggers.push(...status.triggers);
            targetTriggers.push(...this.utils.inverseNegations(status.targetTriggers));
        }
        return { triggers, targetTriggers };
    }

    getTargetPriorities(creature: RawCreature): TargetStatusEnum[] {
        if (creature.attack?.targetPriorities) return creature.attack.targetPriorities;
        const results: TargetStatusEnum[] = [];
        if (creature.attack?.grab) results.push(TargetStatusEnum.Grabbed);
        if (!!creature.data.intelligence && creature.data.intelligence >= 8) {
            results.push(...[
                TargetStatusEnum.Slowed,
                TargetStatusEnum.Able,
                TargetStatusEnum.Held,
                TargetStatusEnum.Stunned,
            ]);
        }
        results.push(...[
            TargetStatusEnum.NoCheck,
            TargetStatusEnum.Sleep,
        ]);
        // console.log(results);
        return results;
    }

    getList(name: TargetListName): string[] {
        const list = TARGET_LISTS.find(l => l.name === name);
        if (!list) throw new Error(`Target list ${name} is not defined !`);
        return list.value;
    }

}
