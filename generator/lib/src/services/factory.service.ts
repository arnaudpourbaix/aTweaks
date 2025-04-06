import { GLOBAL_CONFIG } from "../../config/generate";
import { CreatureAttackAction } from "../model/final/attack";
import {
  Action,
  BasicStatement,
  OrTrigger,
  Response,
  Statements,
  Trigger,
} from "../model/raw/script";
import { State } from "../state";
import { UtilsService } from "./utils.service";

export class FactoryService {
  static instance = new FactoryService();

  private utils = UtilsService.instance;

  response = (actions: Action[], weight = 100): Response[] => [
    { weight, actions },
  ];

  global = (name: string, value: number): Trigger => ({
    name: "Global",
    params: [name, "LOCALS", value],
  });

  setGlobal = (name: string, value: number): Action => ({
    name: "SetGlobal",
    params: [name, "LOCALS", value],
  });

  setGlobalTimer = (name: string, value: number): Action => ({
    name: "SetGlobalTimer",
    params: [name, "LOCALS", value],
  });

  globalTimerExpired = (name: string): Trigger => ({
    name: "GlobalTimerExpired",
    params: [name, "LOCALS"],
  });

  globalTimerNotExpired = (name: string): Trigger => ({
    name: "GlobalTimerNotExpired",
    params: [name, "LOCALS"],
    negation: true,
  });

  globalRoundTimerNotExpired = (): Trigger => ({
    name: "GlobalTimerNotExpired",
    params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS"],
    negation: true,
  });

  setGlobalRoundTimer = (): Action => ({
    name: "SetGlobalTimer",
    params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS", 6],
  });

  enableInterrupt = (): Action => ({ name: "SetInterrupt", params: ["TRUE"] });

  disableInterrupt = (): Action => ({
    name: "SetInterrupt",
    params: ["FALSE"],
  });

  attackResponses = (p: {
    attacks: CreatureAttackAction[];
    optActions?: Action[];
    oncePerRound: boolean;
  }): Response[] => {
    const responses: Response[] = p.attacks.map((a) => {
      const actions: Action[] = [...(p.optActions ?? [])];
      if (a.weaponSlot)
        actions.push({
          name: "SelectWeaponAbility",
          params: [a.weaponSlot, 0],
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

  moveToTarget = (): BasicStatement => {
    const result: BasicStatement = {
      triggers: [
        {
          name: "Range",
          params: [GLOBAL_CONFIG.tokens.target, 5],
          negation: true,
        },
      ],
      actions: [
        { name: "MoveToObject", params: [GLOBAL_CONFIG.tokens.target] },
      ],
    };
    return result;
  };

  validTrackTarget = ({
    isTargetPlayer,
    seeInvisible,
  }: {
    isTargetPlayer: boolean;
    seeInvisible: boolean;
  }): Trigger[] => {
    const results: Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, StatsIdentifiers.SANCTUARY],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_CHARMED],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [
          GLOBAL_CONFIG.tokens.target,
          StateIdentifiers.STATE_REALLY_DEAD,
        ],
        negation: true,
      },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_INVISIBLE],
        negation: true,
      });
      results.unshift({
        name: "StateCheck",
        params: [
          GLOBAL_CONFIG.tokens.target,
          StateIdentifiers.STATE_IMPROVEDINVISIBILITY,
        ],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, GeneralIdentifiers.WEAPON],
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
  }): Trigger[] => {
    const results: Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, StatsIdentifiers.SANCTUARY],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_CHARMED],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [
          GLOBAL_CONFIG.tokens.target,
          StateIdentifiers.STATE_REALLY_DEAD,
        ],
        negation: true,
      },
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    if (!seeInvisible) {
      results.unshift({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_INVISIBLE],
        negation: true,
      });
      results.unshift({
        name: "StateCheck",
        params: [
          GLOBAL_CONFIG.tokens.target,
          StateIdentifiers.STATE_IMPROVEDINVISIBILITY,
        ],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, GeneralIdentifiers.WEAPON],
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
  }): Trigger[] => {
    const results: Trigger[] = [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, StatsIdentifiers.SANCTUARY],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_CHARMED],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [
          GLOBAL_CONFIG.tokens.target,
          StateIdentifiers.STATE_REALLY_DEAD,
        ],
        negation: true,
      },
      { name: "See", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    if (!seeInvisible) {
      results.push({
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, StateIdentifiers.STATE_INVISIBLE],
        negation: true,
      });
    }
    if (!isTargetPlayer)
      results.unshift({
        name: "General",
        params: [GLOBAL_CONFIG.tokens.target, GeneralIdentifiers.WEAPON],
        negation: true,
      });
    return results;
  };

  addStatementsFromTargetList = (p: {
    statements: Statements;
    triggers: (Trigger | OrTrigger)[];
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
      const triggers: (Trigger | OrTrigger)[] = this.utils.replaceTriggerToken(
        p.triggers,
        GLOBAL_CONFIG.tokens.target,
        target
      );
      if (p.random && index < targets.length - 1)
        triggers.push({
          name: "RandomNumGT",
          params: [max, Math.round(max / (targets.length - index))],
        });
      p.statements.list.push({
        comment: index === 0 ? p.comment : "",
        triggers,
        responses: p.responses.map((r) => ({
          weight: r.weight,
          actions: r.actions.map((a) =>
            this.utils.replaceTargetTokens(a, target)
          ),
        })),
      });
    }
  };

  addOneBlockTargetList = (p: {
    statements: Statements;
    triggers?: Trigger[];
    targets: string[];
    targetTriggers: Trigger[];
    responses: Response[];
    reverse?: boolean;
    random?: boolean;
    comment?: string;
    noTargetSelect?: boolean;
    noResponse?: boolean;
  }): void => {
    p.noTargetSelect = p.noTargetSelect ?? false;
    p.noResponse = p.noResponse ?? false;
    p.reverse = p.reverse ?? false;
    p.random = p.random ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    const max = 1000;
    const triggers: (Trigger | OrTrigger)[] = [...(p.triggers ?? [])];
    for (const [index, target] of targets.entries()) {
      const orTrigger: OrTrigger = {
        triggers: p.targetTriggers
          .map((t) => this.utils.replaceTargetTokens(t, target))
          .map(this.utils.inverseNegation),
      };
      if (p.random && index < targets.length - 1)
        orTrigger.triggers.push({
          name: "RandomNumGT",
          params: [max, Math.round(max / (targets.length - index))],
        });
      triggers.push(orTrigger);
    }
    if (!p.noTargetSelect) {
      p.statements.list.push({
        comment: p.comment,
        triggers,
        responses: this.response([{ name: "Continue" }]),
      });
    }
    for (const response of p.responses) {
      response.actions = response.actions.map((a) =>
        this.utils.replaceTargetTokens(a, ObjectIdentifiers.LastSeenBy)
      );
    }
    const finalTriggers = [...(p.triggers ?? []), ...p.targetTriggers];
    if (!p.noResponse) {
      p.statements.list.push({
        triggers: finalTriggers.map((t) =>
          this.utils.replaceTargetTokens(t, ObjectIdentifiers.LastSeenBy)
        ),
        responses: p.responses,
      });
    }
  };
}
