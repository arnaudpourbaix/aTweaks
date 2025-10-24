import {
  GRAB_IMMUNE_CREATURES,
  HUGE_CREATURES,
  LARGE_CREATURES,
} from "../../config/creatures";
import {
  GRAB_CHECK_CREATURE_SIZE,
  GRAB_EFFECTS_FUNCTION,
} from "../../config/grab";
import { Creature } from "../model/final/creature";
import { CastSpellEffect, Effect } from "../model/final/effect";
import { GrabConfig } from "../model/raw/grab";
import creatureService from "./creature.service";
import descriptionService from "./description.service";
import effectService from "./effect.service";
import spellService from "./spell.service";

class GrabService {
  addGrabEffects(creature: Creature) {
    if (!creature.attack.grab) return;
    const grab = creature.attack.grab;
    const item = creature.items.find((i) => i.file === grab.weaponFile);
    if (!item) {
      throw new Error(`grab: item ${grab.weaponFile} not found!`);
    }
    const grabEffect = this.getGrabEffect(creature, creature.attack.grab);
    item.effects.push(grabEffect);
    const effectFile = this.getGrabProtectionEffect(grab);
    creature.effectFiles.push({ ...effectFile, file: grab.file });
    // const saveText = this.descriptionService.getSaveText(grabEffect);
    const spell = spellService.mapSpell(
      {
        name: "Grab",
        description: [
          `Grab and hold your target for ${descriptionService.getDuration(
            grab.duration
          )}.`,
          "Grabbed creature will suffer these effects:",
          "- can not move",
          "- loose armor class from dexterity bonus",
          `- -4 AC (opponents get +4 bonus on their attack rolls against grabbed target)`,
          "- -4 THAC0",
        ],
        stringRef: grab.grabStringRef,
        file: grab.file,
        headers: [
          {
            type: "Melee",
            target: "LivingActor",
            range: 5,
          },
        ],
      },
      []
    );
    spell.headers[0].effects = this.getGrabbedEffects(creature, grab);
    creature.spells.push(spell);
  }

  private getGrabEffect(creature: Creature, grab: GrabConfig): Effect {
    const strModifier = creatureService.getStrengthModifier(creature.data);
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
      saveTypes: [grab.saveType],
      saveBonus,
      resource: grab.file,
    };
    const effect = effectService.getEffect(rawEffect);
    return effect;
  }

  private getGrabProtectionEffect(grab: GrabConfig): Effect {
    const rawEffect: RawEffect = {
      opcode: "ProtectionFromSpell",
      resource: grab.file,
      duration: 1,
    };
    const effect = effectService.getEffect(rawEffect);
    return effect;
  }

  private getGrabbedEffects(creature: Creature, grab: GrabConfig): Effect[] {
    const rawEffects: RawEffect[] = GRAB_EFFECTS_FUNCTION(grab);
    const effects = effectService.getEffects(rawEffects);
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
    const effects = effectService.getEffects(rawEffects);
    return effects;
  }
}

const grabService = new GrabService();
export default grabService;
