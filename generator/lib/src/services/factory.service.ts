import { GLOBAL_CONFIG } from "../../config/generate";
import { CreatureAttackAction } from "../model/final/attack";
import { Response, Statements } from "../model/final/script";
import { ObjectIdentifier } from "../model/ids/object";
import { SlotIdentifier, WeaponSlot } from "../model/ids/slot";
import { StatsIdentifier } from "../model/ids/stats";
import { Actions } from "../model/raw/actions";
import { Triggers } from "../model/raw/triggers";
import { UtilsService } from "./utils.service";

export class FactoryService {
  static instance = new FactoryService();

  private utils = UtilsService.instance;

  response = (actions: Actions.Action[], weight = 100): Response[] => [
    { weight, actions },
  ];

  global = (
    name: string,
    value: number,
    area = "LOCALS"
  ): Triggers.Trigger => ({
    name: "Global",
    params: [name, area, value],
  });

  setGlobal = (name: string, value: number): Actions.Action => ({
    name: "SetGlobal",
    params: [name, "LOCALS", value],
  });

  setGlobalTimer = (name: string, value: number): Actions.Action => ({
    name: "SetGlobalTimer",
    params: [name, "LOCALS", value],
  });

  globalTimerReallyExpired = (name: string): Triggers.Trigger => ({
    name: "GlobalTimerExpired",
    params: [name, "LOCALS"],
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

  setGlobalRoundTimer = (): Actions.Action => ({
    name: "SetGlobalTimer",
    params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS", 6],
  });

  enableInterrupt = (): Actions.Action => ({
    name: "SetInterrupt",
    params: ["TRUE"],
  });

  disableInterrupt = (): Actions.Action => ({
    name: "SetInterrupt",
    params: ["FALSE"],
  });

  attackResponses = (p: {
    attacks: CreatureAttackAction[];
    oncePerRound: boolean;
    optActions?: Actions.Action[];
    weaponAttackSlot?: WeaponSlot;
  }): Response[] => {
    const responses: Response[] = p.attacks.map((a) => {
      const actions: Actions.Action[] = [...(p.optActions ?? [])];
      if (a.weaponSlot || p.weaponAttackSlot)
        actions.push({
          name: "SelectWeaponAbility",
          params: [a.weaponSlot || (p.weaponAttackSlot as SlotIdentifier), 0],
        });
      if (a.duration === 6)
        actions.push({
          name: "AttackOneRound",
          params: [GLOBAL_CONFIG.tokens.target],
        });
      else
        actions.push({
          name: "AttackReevaluate",
          params: [GLOBAL_CONFIG.tokens.target, a.duration],
        });
      if (a.disableInterrupt) {
        actions.unshift(this.disableInterrupt());
        actions.push(this.enableInterrupt());
      }
      return {
        weight: a.responseWeight,
        actions,
      };
    });
    return responses;
  };

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
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
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

  validAttackTarget = ({
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
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_INVISIBLE"],
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

  addStatementsFromTargetList = (p: {
    statements: Statements;
    triggers: Triggers.Trigger[];
    targets: string[];
    responses: Response[];
    reverse?: boolean;
    random?: boolean;
    comment?: string;
  }): void => {
    p.reverse = p.reverse ?? false;
    p.random = p.random ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    const max = 1000;
    for (const [index, target] of targets.entries()) {
      const triggers = this.utils.replaceTriggerTokens(p.triggers, [
        { key: GLOBAL_CONFIG.tokens.target, value: target },
      ]);
      if (p.random && index < targets.length - 1)
        triggers.push({
          name: "RandomNumGT",
          params: [max, Math.round(max / (targets.length - index))],
        });
      p.statements.push({
        comment: index === 0 ? p.comment : "",
        triggers,
        responses: this.utils.replaceResponseTokens(p.responses, [
          { key: GLOBAL_CONFIG.tokens.target, value: target },
        ]),
      });
    }
  };

  addOneBlockTargetList = (p: {
    statements: Statements;
    triggers?: Triggers.Trigger[];
    targets: string[];
    targetTriggers: Triggers.Trigger[];
    responses: Response[];
    reverse?: boolean;
    random?: boolean;
    comment?: string;
  }): void => {
    p.reverse = p.reverse ?? false;
    p.random = p.random ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    const max = 1000;
    const triggers: Triggers.Trigger[] = [...(p.triggers ?? [])];
    for (const [index, target] of targets.entries()) {
      const orTrigger: Triggers.Trigger = {
        name: "Or",
        triggers: this.utils
          .replaceTriggerTokens(p.targetTriggers, [
            { key: GLOBAL_CONFIG.tokens.target, value: target },
          ])
          .map(this.utils.inverseNegation),
      };
      if (p.random && index < targets.length - 1)
        orTrigger.triggers.push({
          name: "RandomNumGT",
          params: [max, Math.round(max / (targets.length - index))],
        });
      triggers.push(orTrigger);
    }
    p.statements.push({
      comment: p.comment,
      triggers,
      responses: this.response([{ name: "Continue" }]),
    });
    const lastSeenBy: ObjectIdentifier = "LastSeenBy";
    const responses = this.utils.replaceResponseTokens(p.responses, [
      { key: GLOBAL_CONFIG.tokens.target, value: lastSeenBy },
    ]);
    const finalTriggers = [...(p.triggers ?? []), ...p.targetTriggers];
    p.statements.push({
      triggers: this.utils.replaceTriggerTokens(finalTriggers, [
        { key: GLOBAL_CONFIG.tokens.target, value: lastSeenBy },
      ]),
      responses,
    });
  };
}
