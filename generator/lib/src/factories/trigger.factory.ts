import { GLOBAL_CONFIG } from "../../config/generate";
import { TargetListName } from "../../config/target-name";
import { ScriptTarget } from "../model/constants";
import { StatsIdentifier } from "../model/ids/stats";
import { Triggers } from "../model/script/triggers";
import targetService from "../services/baf/target.service";

class TriggerFactory {
  haveSpellRES(resources: string[], negation = false): Triggers.Trigger[] {
    return resources.map((r) => ({
      name: "HaveSpellRES",
      params: [r],
      negation,
    }));
  }

  hasItem(resources: string[], negation = false): Triggers.Trigger[] {
    return resources.map((r) => ({
      name: "HasItem",
      params: [r, ScriptTarget.myself],
      negation,
    }));
  }

  global(name: string, value: number, area = "LOCALS"): Triggers.Trigger {
    return {
      name: "Global",
      params: [name, area, value],
    };
  }

  globalTimerReallyExpired(name: string): Triggers.Trigger {
    return {
      name: "GlobalTimerExpired",
      params: [name, "LOCALS"],
    };
  }

  globalTimerExpired(name: string): Triggers.Trigger {
    return {
      name: "GlobalTimerNotExpired",
      params: [name, "LOCALS"],
      negation: true,
    };
  }

  globalRoundTimerExpired(): Triggers.Trigger {
    return {
      name: "GlobalTimerNotExpired",
      params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS"],
      negation: true,
    };
  }

  checkStatGT(value: number, stat: StatsIdentifier): Triggers.Trigger {
    return {
      name: "CheckStatGT",
      params: [ScriptTarget.token, value, stat],
    };
  }

  checkStatLT(value: number, stat: StatsIdentifier): Triggers.Trigger {
    return {
      name: "CheckStatLT",
      params: [ScriptTarget.token, value, stat],
    };
  }

  checkStat(value: number, stat: StatsIdentifier): Triggers.Trigger {
    return {
      name: "CheckStat",
      params: [ScriptTarget.token, value, stat],
    };
  }

  validTrackTarget({
    isTargetPlayer,
    seeInvisible,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
  }): Triggers.Trigger[] {
    const results: Triggers.Trigger[] = [
      {
        name: "CheckStatGT",
        params: [ScriptTarget.token, 0, "SANCTUARY"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [ScriptTarget.token, "STATE_CHARMED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [ScriptTarget.token, "STATE_REALLY_DEAD"],
        negation: true,
      },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [ScriptTarget.token, "STATE_INVISIBLE"],
        negation: true,
      });
      results.unshift({
        name: "StateCheck",
        params: [ScriptTarget.token, "STATE_IMPROVEDINVISIBILITY"],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [ScriptTarget.token, "WEAPON"],
        negation: true,
      });
    return results;
  }

  validSpellTarget({
    isTargetPlayer,
    seeInvisible,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
  }): Triggers.Trigger[] {
    const results: Triggers.Trigger[] = [
      { name: "See", params: [ScriptTarget.token] },
      {
        name: "CheckStatGT",
        params: [ScriptTarget.lastSeen, 0, "SANCTUARY"],
        negation: true,
      },
      // {
      //   name: "StateCheck",
      //   params: [ScriptTarget.token, "STATE_CHARMED"],
      //   negation: true,
      // },
      {
        name: "StateCheck",
        params: [ScriptTarget.lastSeen, "STATE_REALLY_DEAD"],
        negation: true,
      },
    ];
    if (!seeInvisible) {
      results.push({
        name: "StateCheck",
        params: [ScriptTarget.lastSeen, "STATE_IMPROVEDINVISIBILITY"],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.push({
        name: "General",
        params: [ScriptTarget.lastSeen, "WEAPON"],
        negation: true,
      });
    return results;
  }

  validAttackTarget({
    isTargetPlayer,
    seeInvisible,
    maxRange,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
    maxRange?: number;
  }): Triggers.Trigger[] {
    const results: Triggers.Trigger[] = [
      {
        name: "CheckStatGT",
        params: [ScriptTarget.token, 0, "SANCTUARY"],
        negation: true,
      },
      // {
      //   name: "StateCheck",
      //   params: [ScriptTarget.token, "STATE_CHARMED"],
      //   negation: true,
      // },
      {
        name: "StateCheck",
        params: [ScriptTarget.token, "STATE_REALLY_DEAD"],
        negation: true,
      },
      { name: "See", params: [ScriptTarget.token] },
    ];
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [ScriptTarget.token, "WEAPON"],
        negation: true,
      });
    if (maxRange) {
      results.push({
        name: "Range",
        params: [ScriptTarget.token, maxRange],
      });
    }
    return results;
  }

  inverseNegation(trigger: Triggers.Trigger): Triggers.Trigger {
    return { ...trigger, negation: !trigger.negation };
  }

  inverseNegations(triggers: Triggers.Trigger[]): Triggers.Trigger[] {
    return triggers.reduce((acc, trigger) => {
      if ("triggers" in trigger) {
        acc.push(
          ...(this.inverseNegations(trigger.triggers) as Triggers.Trigger[]),
        );
      } else {
        acc.push(this.inverseNegation(trigger));
      }
      return acc;
    }, [] as Triggers.Trigger[]);
  }

  seeOneInTargetList(targetListName: TargetListName): Triggers.Trigger[] {
    const list = targetService.getList(targetListName);
    const triggers = list.targets.map<Triggers.Trigger>((t) => ({
      name: "See",
      params: [t],
    }));
    return [{ name: "Or", triggers }];
  }
}

const triggerFactory = new TriggerFactory();
export default triggerFactory;
