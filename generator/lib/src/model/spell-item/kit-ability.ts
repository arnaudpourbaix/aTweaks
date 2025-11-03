import { Actions } from "../script/actions";
import { Triggers } from "../script/triggers";

export interface KitAbilityConfig {
  name: string;
  files: string[];
  triggers?: Triggers.Trigger[];
  actions?: Actions.Action[];
}
