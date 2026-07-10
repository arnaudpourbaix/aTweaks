import { ScriptTarget } from "../model/constants";
import { Response, Statements } from "../model/script/script";
import { Triggers } from "../model/script/triggers";
import utils from "../services/utils/utils.service";
import responseFactory from "./response.factory";
import triggerFactory from "./trigger.factory";

class BafFactory {
  addStatementsFromTargetList = (p: {
    statements: Statements;
    triggers: Triggers.Trigger[];
    targets: string[];
    responses: Response[];
    reverse?: boolean;
    comment?: string;
  }): void => {
    p.reverse = p.reverse ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    for (const [index, target] of targets.entries()) {
      const triggers = utils.replaceTriggerTokens(p.triggers, [
        { key: ScriptTarget.token, value: target },
      ]);
      const actionTarget =
        target === ScriptTarget.myself
          ? ScriptTarget.myself
          : ScriptTarget.lastSeen;
      p.statements.push({
        comment: index === 0 ? p.comment : "",
        triggers,
        responses: utils.replaceResponseTokens(p.responses, [
          { key: ScriptTarget.token, value: actionTarget },
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
    inBetweenStatements?: Statements;
  }): void => {
    p.reverse = p.reverse ?? false;
    p.random = p.random ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    const max = 1000;
    const triggers: Triggers.Trigger[] = [...(p.triggers ?? [])];
    for (const [index, target] of targets.entries()) {
      const orTrigger: Triggers.Trigger = {
        name: "Or",
        triggers: utils
          .replaceTriggerTokens(p.targetTriggers, [
            { key: ScriptTarget.token, value: target },
          ])
          .map(triggerFactory.inverseNegation),
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
      responses: responseFactory.response([{ name: "Continue" }]),
    });
    if (p.inBetweenStatements) p.statements.push(...p.inBetweenStatements);
    const lastSeenBy = ScriptTarget.lastSeen;
    const responses = utils.replaceResponseTokens(p.responses, [
      { key: ScriptTarget.token, value: lastSeenBy },
    ]);
    const finalTriggers = [...(p.triggers ?? []), ...p.targetTriggers];
    p.statements.push({
      triggers: utils.replaceTriggerTokens(finalTriggers, [
        { key: ScriptTarget.token, value: lastSeenBy },
      ]),
      responses,
    });
  };
}

const bafFactory = new BafFactory();
export default bafFactory;
