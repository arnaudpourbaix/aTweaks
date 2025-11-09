import { GLOBAL_CONFIG } from "../../config/generate";
import { StatsIdentifier } from "../model/ids/stats";
import { Triggers } from "../model/script/triggers";

class TriggerFactory {
  global = (
    name: string,
    value: number,
    area = "LOCALS"
  ): Triggers.Trigger => ({
    name: "Global",
    params: [name, area, value],
  });

  globalTimerReallyExpired = (name: string): Triggers.Trigger => ({
    name: "GlobalTimerExpired",
    params: [name, "LOCALS"],
  });

  globalTimerExpired = (name: string): Triggers.Trigger => ({
    name: "GlobalTimerNotExpired",
    params: [name, "LOCALS"],
    negation: true,
  });

  globalRoundTimerExpired = (): Triggers.Trigger => ({
    name: "GlobalTimerNotExpired",
    params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS"],
    negation: true,
  });

  checkStatGT = (value: number, stat: StatsIdentifier): Triggers.Trigger => ({
    name: "CheckStatGT",
    params: [GLOBAL_CONFIG.tokens.target, value, stat],
  });

  checkStatLT = (value: number, stat: StatsIdentifier): Triggers.Trigger => ({
    name: "CheckStatLT",
    params: [GLOBAL_CONFIG.tokens.target, value, stat],
  });

  checkStat = (value: number, stat: StatsIdentifier): Triggers.Trigger => ({
    name: "CheckStat",
    params: [GLOBAL_CONFIG.tokens.target, value, stat],
  });

  validTrackTarget = ({
    isTargetPlayer,
    seeInvisible,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
  }): Triggers.Trigger[] => {
    const results: Triggers.Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "SANCTUARY"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_CHARMED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_REALLY_DEAD"],
        negation: true,
      },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_INVISIBLE"],
        negation: true,
      });
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_IMPROVEDINVISIBILITY"],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, "WEAPON"],
        negation: true,
      });
    return results;
  };

  validSpellTarget = ({
    isTargetPlayer,
    seeInvisible,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
  }): Triggers.Trigger[] => {
    const results: Triggers.Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "SANCTUARY"],
        negation: true,
      },
      // {
      //   name: "StateCheck",
      //   params: [GLOBAL_CONFIG.tokens.target, "STATE_CHARMED"],
      //   negation: true,
      // },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_REALLY_DEAD"],
        negation: true,
      },
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_IMPROVEDINVISIBILITY"],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, "WEAPON"],
        negation: true,
      });
    return results;
  };

  validAttackTarget = ({
    isTargetPlayer,
    seeInvisible,
    maxRange,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
    maxRange?: number;
  }): Triggers.Trigger[] => {
    const results: Triggers.Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "SANCTUARY"],
        negation: true,
      },
      // {
      //   name: "StateCheck",
      //   params: [GLOBAL_CONFIG.tokens.target, "STATE_CHARMED"],
      //   negation: true,
      // },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_REALLY_DEAD"],
        negation: true,
      },
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, "WEAPON"],
        negation: true,
      });
    if (maxRange) {
      results.push({
        name: "Range",
        params: [GLOBAL_CONFIG.tokens.target, maxRange],
      });
    }
    return results;
  };
}

const triggerFactory = new TriggerFactory();
export default triggerFactory;
