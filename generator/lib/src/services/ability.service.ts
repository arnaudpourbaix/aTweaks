import deepmerge from "deepmerge";
import { GLOBAL_CONFIG } from "../../config/generate";
import { ABILITY_PRESETS } from "../../config/spell";
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
    const results: CreatureAbility[] = abilities.map((ability) => {
      const preset = ABILITY_PRESETS.find((p) => p.preset === ability.preset);
      if (preset) ability = deepmerge(preset.ability, ability);
      if (preset) console.log(ability);
      const triggers: Triggers.Trigger[] = ability.triggers ?? [];
      const actions: Actions.Action[] = ability.actions ?? [];
      const result: CreatureAbility = {
        ...ability,
        name: ability.name ?? "",
        isSpell: !!ability.spell,
        triggers,
        actions,
      };
      const target = ability.target ? GLOBAL_CONFIG.tokens.target : "Myself";
      if (!ability.spell) return result;
      ability.spell.type = ability.spell.type ?? "normal";
      if (ability.spell.id) {
        triggers.push({ name: "HaveSpell", params: [ability.spell.id] });
      } else if (ability.spell.resource) {
        triggers.push({
          name: "HaveSpellRES",
          params: [ability.spell.resource],
        });
      } else throw new Error(`No spell specified for ability ${ability.name}`);

      for (const state of ability.spell.excludeStateChecks ?? []) {
        triggers.push({
          name: "StateCheck",
          params: [target, state],
          negation: true,
        });
      }
      for (const state of ability.spell.excludeSpellStates ?? []) {
        triggers.push({
          name: "CheckSpellState",
          params: [target, state],
          negation: true,
        });
      }
      if (!!ability.spell.probability && ability.spell.probability < 100) {
        triggers.push({
          name: "RandomNumGT",
          params: [
            randomPool++,
            Math.round(randomPool * (1 - ability.spell.probability / 100)),
          ],
        });
      }
      actions.unshift(
        this.getSpellAction(
          ability.spell,
          ability.spell.selfTarget ? "Myself" : target
        )
      );
      if (
        ability.spell.remove &&
        ability.spell.type !== "normal" &&
        ability.spell.id
      ) {
        actions.push({ name: "RemoveSpell", params: [ability.spell.id] });
      } else if (
        ability.spell.remove &&
        ability.spell.type !== "normal" &&
        ability.spell.resource
      ) {
        actions.push({
          name: "RemoveSpellRES",
          params: [ability.spell.resource],
        });
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
