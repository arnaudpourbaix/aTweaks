import { SPELL_PRIORITY_ORDER } from "../../../config/spell-priority-order";
import { AbilityAnchor, AbilityEntry, RawCreatureAbility } from "../../model/creature/ability";
import { Creature } from "../../model/creature/creature";
import creatureService from "../creature.service";

interface OrderedAbility {
  identity: string;
  ability: RawCreatureAbility;
}

class AbilityOrderService {
  resolve(creature: Creature): RawCreatureAbility[] {
    const entries = creature.pendingAbilityEntries ?? [];
    const explicitFiles = new Set(
      entries.filter((e) => e.spell).map((e) => e.spell!.file),
    );
    const memorizedFiles = creatureService.memorizedSpellFiles(creature);
    const autoFiles = memorizedFiles.filter((file) => !explicitFiles.has(file));

    const ordered: OrderedAbility[] = autoFiles
      .map((file) => ({ identity: file, index: SPELL_PRIORITY_ORDER.indexOf(file) }))
      .filter(({ index }) => index !== -1)
      .sort((a, b) => a.index - b.index)
      .map(({ identity }): OrderedAbility => ({ identity, ability: { preset: identity } }));

    for (const entry of entries) {
      const identity = entry.spell ? entry.spell.file : creature.spell(entry.abilityId!).file;
      const ability: RawCreatureAbility = entry.spell
        ? { preset: entry.spell.file }
        : creature.ability(entry.abilityId!);
      this.splice(ordered, { identity, ability }, entry, creature);
    }

    return ordered.map((o) => o.ability);
  }

  private splice(
    ordered: OrderedAbility[],
    item: OrderedAbility,
    entry: AbilityEntry,
    creature: Creature,
  ): void {
    if (entry.insertFirst) {
      ordered.unshift(item);
      return;
    }
    const anchor = entry.insertBefore ?? entry.insertAfter;
    if (anchor === undefined) {
      ordered.push(item);
      return;
    }
    const anchorIdentity = this.resolveAnchor(anchor, creature);
    const anchorIndex = ordered.findIndex((o) => o.identity === anchorIdentity);
    ordered.splice(entry.insertBefore !== undefined ? anchorIndex : anchorIndex + 1, 0, item);
  }

  private resolveAnchor(anchor: AbilityAnchor, creature: Creature): string {
    if (typeof anchor === "number") return creature.spell(anchor).file;
    if (typeof anchor === "string") return anchor;
    return anchor.file;
  }
}

const abilityOrderService = new AbilityOrderService();
export default abilityOrderService;
