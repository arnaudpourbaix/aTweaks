import {
  GRAB_IMMUNE_CREATURES,
  HUGE_CREATURES,
  LARGE_CREATURES,
} from "../../config/creatures";
import { RAW_EFFECTS_FUNCTION } from "../../config/grab";
import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { CastSpellEffect, RawEffect } from "../model/raw/effect";
import { GrabConfig } from "../model/raw/grab";
import { EffectService } from "./effect.service";

export class GrabService {
  static instance = new GrabService();

  private effectService = EffectService.instance;

  getGrabEffect(grab: GrabConfig): Effect {
    const rawEffect: CastSpellEffect = {
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      probability1: grab.probability,
      saveTypes: grab.saveTypes,
      saveBonus: grab.saveBonus,
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
    const rawEffects: RawEffect[] = RAW_EFFECTS_FUNCTION(grab);
    const effects = this.effectService.getEffects(rawEffects);
    const immunityEffects = this.getGrabImmuneEffects(creature, grab);
    return [...immunityEffects, ...effects];
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
