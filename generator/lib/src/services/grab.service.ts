import {
  GRAB_IMMUNE_CREATURES,
  HUGE_CREATURES,
  LARGE_CREATURES,
} from "../../config/creatures";
import {
  GRAB_CHECK_CREATURE_SIZE,
  GRAB_EFFECTS_FUNCTION,
  RELEASE_GRAB_EFFECTS_FUNCTION,
} from "../../config/grab";
import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { CastSpellEffect, RawEffect } from "../model/raw/effect";
import { GrabConfig } from "../model/raw/grab";
import { CreatureService } from "./creature.service";
import { EffectService } from "./effect.service";

export class GrabService {
  static instance = new GrabService();

  private effectService = EffectService.instance;
  private creatureService = CreatureService.instance;

  getGrabEffect(creature: Creature, grab: GrabConfig): Effect {
    const strModifier = this.creatureService.getStrengthModifier(creature.data);
    const sizeModifier = GRAB_CHECK_CREATURE_SIZE.find(
      (s) => s.size === creature.data.size
    )?.bonus as number;
    const calculatedSaveBonus =
      (strModifier + sizeModifier + (grab.onlyGrabProneTarget ? 4 : 0)) * -1;
    const saveBonus =
      grab.saveBonus === 99 ? calculatedSaveBonus : grab.saveBonus;
    const rawEffect: CastSpellEffect = {
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      probability1: grab.probability,
      saveTypes: grab.saveTypes,
      saveBonus: saveBonus,
      resource: grab.file,
    };
    const effect = this.effectService.getEffect(rawEffect);
    return effect;
  }

  getGrabProtectionEffect(grab: GrabConfig): Effect {
    const rawEffect: RawEffect = {
      opcode: "ProtectionFromSpell",
      resource: grab.file,
      duration: 1,
    };
    const effect = this.effectService.getEffect(rawEffect);
    return effect;
  }

  getGrabbedEffects(creature: Creature, grab: GrabConfig): Effect[] {
    const rawEffects: RawEffect[] = GRAB_EFFECTS_FUNCTION(grab);
    const effects = this.effectService.getEffects(rawEffects);
    const immunityEffects = this.getGrabImmuneEffects(creature, grab);
    return [...immunityEffects, ...effects];
  }

  getReleaseGrabbedEffects(grab: GrabConfig): Effect[] {
    const rawEffects: RawEffect[] = RELEASE_GRAB_EFFECTS_FUNCTION(grab);
    const effects = this.effectService.getEffects(rawEffects);
    return effects;
  }

  private getGrabImmuneEffects(creature: Creature, grab: GrabConfig): Effect[] {
    if (!creature.data.size)
      throw new Error(`Creature size is needed to add grab immunities`);
    const list = [...GRAB_IMMUNE_CREATURES];
    if (["Huge", "Large"].includes(creature.data.size)) {
      list.push(...HUGE_CREATURES);
    }
    if (creature.data.size === "Large") {
      list.push(...LARGE_CREATURES);
    }
    const rawEffects: RawEffect[] = list.map((i) => ({
      opcode: "UseEFFFile",
      idsFile: i[0],
      idsEntry: i[1],
      duration: 1,
      target: "PresetTarget",
      resource: grab.file,
    }));
    const effects = this.effectService.getEffects(rawEffects);
    return effects;
  }
}
