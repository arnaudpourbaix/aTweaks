import { Actions } from "./actions";
import { Triggers } from "./triggers";

export interface KitAbilityConfig {
  name: string;
  files: string[];
  triggers?: Triggers.Trigger[];
  actions?: Actions.Action[];
}
