import { GLOBAL_CONFIG } from "../../config/generate";
import { ScriptTarget } from "../model/constants";
import { ObjectIdentifier } from "../model/ids/object";
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
    random?: boolean;
    comment?: string;
  }): void => {
    p.reverse = p.reverse ?? false;
    p.random = p.random ?? false;
    const targets = p.reverse ? [...p.targets].reverse() : [...p.targets];
    const max = 1000;
    for (const [index, target] of targets.entries()) {
      const triggers = utils.replaceTriggerTokens(p.triggers, [
        { key: ScriptTarget.token, value: target },
      ]);
      if (p.random && index < targets.length - 1) {
        // FIXME: random is disabled because it has a critical issue.
        // let's say it targets 6 nearest enemies, each enemy has an equal chance to be selected
        // if there are 6 enemies, this is working as intended
        // if there are 3 enemies, there is 50% of no target selection, which is not intended
        // NumCreatureGT could help but it would make code more complex
        // triggers.push({
        //   name: "RandomNumLT",
        //   params: [max, Math.round(max / (targets.length - index))],
        // });
      }
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
