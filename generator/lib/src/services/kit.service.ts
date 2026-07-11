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
    this.applyKitImmunities(creature, base, kit.immunities(level.pnpValue));
    this.applyKitAbilities(creature, base, kit.abilities, level.pnpValue);
  }

  applyKitImmunities(
    creature: Creature,
    baseCreature: BaseCreature,
    immunities: ImmunityName[]
  ) {
    baseCreature.data.immunities ??= [];
    for (const name of immunities) {
      if (
        !creature.data.immunities.includes(name) &&
        !baseCreature.data.immunities.includes(name)
      ) {
        baseCreature.data.immunities.push(name);
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
        memorizedCount -= ability.count(creature.data.level1.pnpValue);
      }
      if (memorizedCount > 0) {
        baseCreature.data.spells?.memorized.push({
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
    if (typeof baseCreature.data.spells?.removeMemorized === "boolean") {
      throw new Error(`removeMemorized already set`);
    } else if (!baseCreature.data.spells?.removeMemorized) {
      baseCreature.data.spells.removeMemorized = [];
    }
    for (const ability of kit.abilities) {
      baseCreature.data.spells.removeMemorized.push(ability.resource);
    }
  }
}

const kitService = new KitService();
export default kitService;
