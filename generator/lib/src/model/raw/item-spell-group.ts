import { SpellGroupName } from "../../../config/spell-group-name";
import { SpellIdentifier } from "../ids/spell";

export interface SpellGroup {
  name: SpellGroupName;
  idsSpells?: {
    id: SpellIdentifier | string;
    suffixes?: string[];
  }[];
  spells?: string[];
}
