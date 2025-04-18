import { Actions } from "./actions";
import { Triggers } from "./triggers";

export interface RawPotionConfig {
  files: string[];
  triggers?: Triggers.Trigger[];
  actions?: Actions.Action[];
}
