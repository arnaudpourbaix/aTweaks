import { GLOBAL_CONFIG } from "../../config/generate";
import { CreatureAttackAction } from "../model/creature/attack";
import { WEAPON_SLOTS, WeaponSlot } from "../model/creature/item";
import { Actions } from "../model/script/actions";
import { Response } from "../model/script/script";
import actionFactory from "./action.factory";

class ResponseFactory {
  response(actions: Actions.Action[], weight = 100): Response[] {
    return [{ weight, actions }];
  }

  attackResponses(p: {
    attacks: CreatureAttackAction[];
    oncePerRound: boolean;
    optActions?: Actions.Action[];
    weaponAttackSlot?: WeaponSlot;
  }): Response[] {
    const responses: Response[] = p.attacks.map((a) => {
      const actions: Actions.Action[] = [...(p.optActions ?? [])];
      let slot = WEAPON_SLOTS.find((s) => s.slot === a.weaponSlot);
      if (!slot) slot = WEAPON_SLOTS.find((s) => s.slot === p.weaponAttackSlot);
      if (slot) {
        actions.push({
          name: "SelectWeaponAbility",
          params: [slot.id, 0],
        });
      }
      actions.push({
        name: "AttackOneRound",
        params: [GLOBAL_CONFIG.tokens.target],
      });
      if (a.disableInterrupt) {
        actions.unshift(actionFactory.disableInterrupt());
        actions.push(actionFactory.enableInterrupt());
      }
      return {
        weight: a.responseWeight ?? 100,
        actions,
      };
    });
    return responses;
  }
}

const responseFactory = new ResponseFactory();
export default responseFactory;
