import deepmerge from "deepmerge";
import { GLOBAL_CONFIG } from "../../../config/generate";
import {
  CreatureAbility,
  CreatureAbilitySpell,
  RawCreatureAbility,
} from "../../model/creature/ability";
import { Actions } from "../../model/script/actions";
import { Triggers } from "../../model/script/triggers";
import { ABILITY_PRESETS } from "../../../config/ability-presets";

class AbilityService {
  getAbilities(abilities: RawCreatureAbility[] | undefined): CreatureAbility[] {
    if (!abilities) return [];
    let randomPool = 800;
    const results: CreatureAbility[] = abilities.map((abil) => {
      let ability = structuredClone(abil);
      if (ability.preset) ability = this.applyPreset(ability, ability.preset);
      const triggers: Triggers.Trigger[] = ability.triggers ?? [];
      let targets =
        !ability.targets || Array.isArray(ability.targets)
          ? ability.targets
          : undefined;
      if (!!ability.targets && !Array.isArray(ability.targets))
        targets = [ability.targets];
      const actionsAfter: Actions.Action[] = ability.actionsAfter ?? [];
      const result: CreatureAbility = {
        requireVocal: false,
        disableInterrupt: false,
        canUseWhenPolymorphed: false,
        ...ability,
        targets: targets ?? [],
        name: ability.name ?? "",
        isSpell: !!ability.spell && !ability.spell.isAttack,
        triggers,
        actions: ability.actionsBefore ?? [],
      };
      const target = ability.targets ? GLOBAL_CONFIG.tokens.target : "Myself";
      if (!ability.spell) return result;
      ability.spell.type = ability.spell.type ?? "normal";
      if (ability.spell.id) {
        triggers.unshift({ name: "HaveSpell", params: [ability.spell.id] });
      } else if (ability.spell.resource) {
        triggers.unshift({
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
      for (const stat of ability.spell.excludeStatsChecks ?? []) {
        triggers.push({
          name: "CheckStatGT",
          params: [target, 0, stat],
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
      let spellTarget = ability.spell.selfTarget ? "Myself" : "LastSeenBy";
      if (ability.spell.targetName) spellTarget = ability.spell.targetName;
      result.actions.push(this.getSpellAction(ability.spell, spellTarget));
      if (
        ability.spell.remove &&
        ability.spell.type !== "normal" &&
        ability.spell.id
      ) {
        result.actions.push({
          name: "RemoveSpell",
          params: [ability.spell.id],
        });
      } else if (
        ability.spell.remove &&
        ability.spell.type !== "normal" &&
        ability.spell.resource
      ) {
        result.actions.push({
          name: "RemoveSpellRES",
          params: [ability.spell.resource],
        });
      }
      result.actions.push(...actionsAfter);
      return result;
    });
    return results;
  }

  private applyPreset(
    ability: RawCreatureAbility,
    presetName: string
  ): RawCreatureAbility {
    const preset = ABILITY_PRESETS.find((p) => p.preset === ability.preset);
    if (!preset) throw new Error(`Unknown preset ${presetName}`);
    const result: RawCreatureAbility = deepmerge(preset.ability, ability, {});
    if (result.spell && preset.ability.spell?.id && ability.spell?.resource)
      result.spell.id = undefined;
    else if (
      result.spell &&
      preset.ability.spell?.resource &&
      ability.spell?.id
    )
      result.spell.resource = undefined;
    return result;
  }

  private getSpellAction(
    spell: CreatureAbilitySpell,
    target: string
  ): Actions.Action {
    if (spell.resource && spell.type === "normal")
      return { name: "SpellRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "noDec")
      return { name: "SpellNoDecRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "force")
      return { name: "ForceSpellRES", params: [spell.resource, target] };
    else if (spell.resource && spell.type === "reallyForce")
      return { name: "ReallyForceSpellRES", params: [spell.resource, target] };
    else if (spell.id && spell.type === "normal")
      return { name: "Spell", params: [target, spell.id] };
    else if (spell.id && spell.type === "noDec")
      return { name: "SpellNoDec", params: [target, spell.id] };
    else if (spell.id && spell.type === "force")
      return { name: "ForceSpell", params: [target, spell.id] };
    else if (spell.id && spell.type === "reallyForce")
      return { name: "ReallyForceSpell", params: [target, spell.id] };

    throw new Error("getSpellAction: unexpected combination");
  }
}

const abilityService = new AbilityService();
export default abilityService;
