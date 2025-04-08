import * as fs from "fs";
import path from "path";
import { CR, TAB } from "../model/constants";
import { Creature } from "../model/final/creature";
import { GenericScriptParameterData } from "../model/final/data";
import { ALLEGIANCE_IDENTIFIERS } from "../model/ids/allegiance";
import { GENERAL_IDENTIFIERS } from "../model/ids/general";
import { OBJECT_IDENTIFIERS, ObjectIdentifier } from "../model/ids/object";
import { RACE_IDENTIFIERS } from "../model/ids/race";
import { ConditionalStatement, Statements } from "../model/raw/script";
import { TARGET_FINAL_OBJECTS } from "../model/raw/target";
import { State } from "../state";
import { StatementService } from "./statement-builder.service";
import { CLASS_IDENTIFIERS } from "../model/ids/class";
import { SPECIFIC_IDENTIFIERS } from "../model/ids/specific";
import { GENDER_IDENTIFIER } from "../model/ids/gender";
import { ALIGN_IDENTIFIERS } from "../model/ids/align";
import { Triggers } from "../model/raw/triggers";
import { Actions } from "../model/raw/actions";

export class BafGeneratorService {
  static instance = new BafGeneratorService();

  private statementService = StatementService.instance;

  generateBafScript(creature: Creature): void {
    const statements: Statements = this.statementService.buildStatements(
      creature,
      { summon: false }
    );
    const content = statements
      .map((statement) => this.generateStatement(statement))
      .join("");
    fs.writeFileSync(
      `${path.join(State.modFolder, creature.bafFile as string)}.baf`,
      content
    );
    if (creature.adjustments.some((a) => !!a.summon)) {
      const statements: Statements = this.statementService.buildStatements(
        creature,
        { summon: true }
      );
      const content = statements
        .map((statement) => this.generateStatement(statement))
        .join("");
      fs.writeFileSync(
        `${path.join(State.modFolder, `${creature.bafFile}su.baf`)}`,
        content
      );
    }
  }

  generateStatement(statement: ConditionalStatement): string {
    const lines: string[] = [];
    if (statement.comment) lines.push(`// ${statement.comment}`);
    lines.push("IF");
    lines.push(...this.generateTriggers(statement.triggers, false));
    lines.push("THEN");
    for (const r of statement.responses) {
      lines.push(`${TAB}RESPONSE #${r.weight}`);
      lines.push(...this.generateActions(r.actions));
    }
    lines.push("END");
    lines.push(CR);
    return lines.join(CR);
  }

  generateTriggers(triggers: Triggers.Trigger[], isOr: boolean): string[] {
    const lines: string[] = [];
    for (const t of triggers) {
      if ("triggers" in t) {
        if (t.triggers.length < 2)
          throw new Error(
            `OR trigger should have at least 2 conditions: ${JSON.stringify(
              t.triggers
            )}`
          );
        lines.push(`${TAB}OR(${t.triggers.length})`);
        lines.push(...this.generateTriggers(t.triggers, true));
      } else {
        lines.push(this.generateTrigger(t, isOr));
      }
    }
    return lines;
  }

  generateTrigger(trigger: Triggers.Trigger, isOr: boolean): string {
    const params: string[] = [];
    const paramsRef = this.getTriggerParameters(trigger.name);
    const triggerParams = "params" in trigger ? trigger.params : [];
    if (triggerParams.length !== paramsRef.length)
      throw new Error(
        `Not enough parameters for trigger\n ${JSON.stringify(
          trigger,
          null,
          4
        )}\nExpected: ${paramsRef.length} from\n${JSON.stringify(
          paramsRef,
          null,
          4
        )})`
      );
    for (const [index, p] of triggerParams.entries()) {
      const paramRef = paramsRef[index];
      if (!paramRef)
        throw new Error(
          `Unexpected parameter ${p} for trigger ${trigger.name}`
        );
      params.push(this.getParamValue(p, paramRef));
    }
    return `${TAB.repeat(isOr ? 2 : 1)}${trigger.negation ? "!" : ""}${
      trigger.name
    }(${params.join(",")})`;
  }

  generateActions(actions: Actions.Action[]): string[] {
    const lines: string[] = [];
    for (const a of actions) {
      lines.push(this.generateAction(a));
    }
    return lines;
  }

  generateAction(action: Actions.Action): string {
    const params: string[] = [];
    const paramsRef = this.getActionParameters(action.name);
    const actionParams = "params" in action ? action.params : [];
    if (actionParams.length !== paramsRef.length)
      throw new Error(
        `Not enough parameters for action\n ${JSON.stringify(
          action,
          null,
          4
        )}\nExpected: ${paramsRef.length} from\n${JSON.stringify(
          paramsRef,
          null,
          4
        )})`
      );
    for (const [index, p] of actionParams.entries()) {
      const paramRef = paramsRef[index];
      if (!paramRef)
        throw new Error(`Unexpected parameter ${p} for action ${action.name}`);
      const value = this.getParamValue(p, paramRef);
      params.push(value);
    }
    return `${TAB.repeat(2)}${action.name}(${params.join(",")})`;
  }

  getParamValue(
    value: string | number,
    param: GenericScriptParameterData
  ): string {
    const val = typeof value === "string" ? value : value.toString();

    if (param.isNumber) return val;
    else if (param.isObject) return this.getObjectParamValue(val, param);
    return `"${val}"`;
  }

  getObjectParamValue(
    value: string,
    param: GenericScriptParameterData
  ): string {
    if (value.startsWith("[") || value.endsWith(")")) return value;
    const startsWithObject = OBJECT_IDENTIFIERS.some((v) =>
      value.startsWith(v)
    );
    const containsObjectTypes =
      ALLEGIANCE_IDENTIFIERS.some((v) => value.indexOf(v) !== -1) ||
      GENERAL_IDENTIFIERS.some((v) => value.indexOf(v) !== -1) ||
      RACE_IDENTIFIERS.some((v) => value.indexOf(v) !== -1) ||
      CLASS_IDENTIFIERS.some((v) => value.indexOf(v) !== -1) ||
      SPECIFIC_IDENTIFIERS.some((v) => value.indexOf(v) !== -1) ||
      GENDER_IDENTIFIER.some((v) => value.indexOf(v) !== -1) ||
      ALIGN_IDENTIFIERS.some((v) => value.indexOf(v) !== -1);
    if (!startsWithObject && containsObjectTypes) return `[${value}]`;
    else if (
      !TARGET_FINAL_OBJECTS.includes(value as ObjectIdentifier) &&
      !containsObjectTypes
    )
      return `${value}(Myself)`;
    else if (
      Object.values(OBJECT_IDENTIFIERS).includes(value as ObjectIdentifier)
    )
      return `${value}`;
    return value;
  }

  getActionParameters(name: string): GenericScriptParameterData[] {
    const actionRef = State.actions.find((a) => a.name === name);
    if (!actionRef) throw new Error(`Unknown action ${name}`);
    return actionRef.parameters;
  }

  getTriggerParameters(name: string): GenericScriptParameterData[] {
    const triggerRef = State.triggers.find((a) => a.name === name);
    if (!triggerRef) throw new Error(`Unknown trigger ${name}`);
    return triggerRef.parameters;
  }
}
