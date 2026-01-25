import deepmerge from "deepmerge";
import { ABILITY_PRESETS } from "../../../config/ability-presets";
import { GLOBAL_CONFIG } from "../../../config/generate";
import {
  CreatureAbility,
  CreatureAbilitySpell,
  RawCreatureAbility,
} from "../../model/creature/ability";
import { Actions } from "../../model/script/actions";
import { CustomCode, PartialCustomCode } from "../../model/script/script";
import { Triggers } from "../../model/script/triggers";
import { ScriptTarget } from "../../model/constants";

class AbilityService {
  getAbilities(abilities: RawCreatureAbility[] | undefined): CreatureAbility[] {
    if (!abilities) return [];
    const randomGenerator = this.getNumberGenerator();
    const results: CreatureAbility[] = abilities.map((abil) =>
      this.getAbility(abil, randomGenerator)
    );
    return results;
  }

  getCustomCodes(customCodes: PartialCustomCode[] | undefined): CustomCode[] {
    if (!customCodes) return [];
    const results: CustomCode[] = [];
    for (const customCode of customCodes) {
      results.push({
        ...customCode,
        statements: customCode.statements ?? [],
        abilities: this.getAbilities(customCode.abilities),
      });
    }
    return results;
  }

  private *getNumberGenerator() {
    let num = 800;
    while (num < 10000) yield num++;
  }

  private getAbility(
    abil: RawCreatureAbility,
    randomGenerator: Generator<number>
  ): CreatureAbility {
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
      infiniteUse: false,
      requireVocal: false,
      disableInterrupt: false,
      canUseWhenPolymorphed: false,
      ...ability,
      targets: targets ?? [],
      name: ability.name ?? "ability.unknown",
      isSpell: !!ability.spell && !ability.spell.isAttack,
      triggers,
      actions: ability.actionsBefore ?? [],
    };
    const target = ability.targets ? ScriptTarget.token : ScriptTarget.myself;
    if (!ability.spell) return result;
    result.infiniteUse =
      ability.spell.type !== "normal" && !ability.spell.remove;
    result.resource = ability.spell.resource ?? ability.preset;
    ability.spell.type ??= "normal";
    ability.spell.memorizedSpellCheck ??= true;
    if (!ability.spell.id && !ability.spell.resource)
      throw new Error(`No spell specified for ability ${ability.name}`);
    if (ability.spell.memorizedSpellCheck && ability.spell.id) {
      triggers.unshift({ name: "HaveSpell", params: [ability.spell.id] });
    } else if (ability.spell.memorizedSpellCheck && ability.spell.resource) {
      triggers.unshift({
        name: "HaveSpellRES",
        params: [ability.spell.resource],
      });
    }

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
      const num = randomGenerator.next().value;
      triggers.push({
        name: "RandomNumGT",
        params: [num, Math.round(num * (1 - ability.spell.probability / 100))],
      });
    }
    let spellTarget: string = ability.spell.selfTarget
      ? ScriptTarget.myself
      : ScriptTarget.lastSeen;
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
