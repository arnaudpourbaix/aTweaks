import { KITS } from "../../config/kit-ability";
import { BaseCreature, Creature } from "../model/creature/creature";
import { KitAbility, KitConfig } from "../model/creature/kit";
import { ImmunityName } from "../model/final/immunity";

class KitService {
  applyKit(creature: Creature, baseCreature: BaseCreature | undefined) {
    const base = baseCreature ?? creature;
    const rootKit = KITS.find((k) => creature.data.kit === k.name);
    const childKit = KITS.find((k) => base.data.kit === k.name);
    if (!rootKit && !childKit) return;
    if (rootKit && childKit && baseCreature) {
      this.removeKit(baseCreature, rootKit);
    }
    const level = base.data.level1 ?? creature.data.level1;
    const kit = childKit! ?? rootKit!;
    this.applyKitImmunities(creature, base, kit.immunities(level));
    this.applyKitAbilities(creature, base, kit.abilities, level);
  }

  applyKitImmunities(
    creature: Creature,
    baseCreature: BaseCreature,
    immunities: ImmunityName[]
  ) {
    baseCreature.additionalData.immunities ??= [];
    for (const name of immunities) {
      if (!creature.additionalData.immunities.includes(name)) {
        baseCreature.additionalData.immunities.push(name);
      }
    }
  }

  applyKitAbilities(
    creature: Creature,
    baseCreature: BaseCreature,
    abilities: KitAbility[],
    level: number
  ) {
    for (const ability of abilities) {
      let memorizedCount = ability.count(level);
      if (baseCreature && !baseCreature.data.kit) {
        memorizedCount -= ability.count(creature.data.level1);
      }
      if (memorizedCount > 0) {
        baseCreature.additionalData.memorizedSpells.push({
          file: ability.resource,
          memorizedCount,
        });
      }
      if (ability.ability.spell && !ability.ability.spell?.resource) {
        ability.ability.spell.resource = ability.resource;
      }
      if (
        !creature.behavior.abilities.some(
          (a) => a.resource === ability.resource
        )
      ) {
        creature.setBehavior({ abilities: [ability.ability] });
      }
    }
  }

  removeKit(baseCreature: BaseCreature, kit: KitConfig) {
    if (
      typeof baseCreature.additionalData.removeMemorizedSpells === "boolean"
    ) {
      throw new Error(`removeMemorizedSpells already set`);
    } else if (!baseCreature.additionalData.removeMemorizedSpells) {
      baseCreature.additionalData.removeMemorizedSpells = [];
    }
    for (const ability of kit.abilities) {
      baseCreature.additionalData.removeMemorizedSpells.push(ability.resource);
    }
  }
}

const kitService = new KitService();
export default kitService;
