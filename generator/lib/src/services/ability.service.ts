import { GLOBAL_CONFIG } from "../../config/generate";
import { CreatureAbility } from "../model/final/ability";
import {
  RawCreatureAbility,
  RawCreatureAbilitySpell,
} from "../model/raw/ability";
import { Actions } from "../model/raw/actions";
import { Triggers } from "../model/raw/triggers";

export class AbilityService {
  static instance = new AbilityService();

  getAbilities(abilities: RawCreatureAbility[] | undefined): CreatureAbility[] {
    if (!abilities) return [];
    let randomPool = 800;
    const results: CreatureAbility[] = abilities.map((a) => {
      const triggers: Triggers.Trigger[] = a.triggers ?? [];
      const actions: Actions.Action[] = a.actions ?? [];
      const result: CreatureAbility = {
        ...a,
        isSpell: !!a.spell,
        triggers,
        actions,
      };
      const target = a.target ? GLOBAL_CONFIG.tokens.target : "Myself";
      if (!a.spell) return result;
      a.spell.type = a.spell.type ?? "normal";
      if (a.spell.id) {
        triggers.push({ name: "HaveSpell", params: [a.spell.id] });
      } else if (a.spell.resource) {
        triggers.push({ name: "HaveSpellRES", params: [a.spell.resource] });
      } else throw new Error(`No spell specified for ability ${a.name}`);

      for (const state of a.spell.excludeStateChecks ?? []) {
        triggers.push({
          name: "StateCheck",
          params: [target, state],
          negation: true,
        });
      }
      for (const state of a.spell.excludeSpellStates ?? []) {
        triggers.push({
          name: "CheckSpellState",
          params: [target, state],
          negation: true,
        });
      }
      if (!!a.spell.probability && a.spell.probability < 100) {
        triggers.push({
          name: "RandomNumGT",
          params: [
            randomPool++,
            Math.round(randomPool * (1 - a.spell.probability / 100)),
          ],
        });
      }
      actions.unshift(
        this.getSpellAction(a.spell, a.spell.selfTarget ? "Myself" : target)
      );
      if (a.spell.remove && a.spell.type !== "normal" && a.spell.id) {
        actions.push({ name: "RemoveSpell", params: [a.spell.id] });
      } else if (
        a.spell.remove &&
        a.spell.type !== "normal" &&
        a.spell.resource
      ) {
        actions.push({ name: "RemoveSpellRES", params: [a.spell.resource] });
      }

      return result;
    });
    return results;
  }

  private getSpellAction(
    spell: RawCreatureAbilitySpell,
    target: string
  ): Actions.Action {
    if (spell.id && spell.type === "normal")
      return { name: "Spell", params: [target, spell.id] };
    else if (spell.id && spell.type === "noDec")
      return { name: "SpellNoDec", params: [target, spell.id] };
    else if (spell.id && spell.type === "force")
      return { name: "ForceSpell", params: [target, spell.id] };
    else if (spell.id && spell.type === "reallyForce")
      return { name: "ReallyForceSpell", params: [target, spell.id] };
    else if (spell.resource && spell.type === "normal")
      return { name: "SpellRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "noDec")
      return { name: "SpellNoDecRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "force")
      return { name: "ForceSpellRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "reallyForce")
      return { name: "ReallyForceSpellRES", params: [spell.resource, target] };
    throw new Error("getSpellAction: unexpected combination");
  }
}
