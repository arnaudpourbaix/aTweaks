import { StringReferenceGroup } from "../../../config/stringRef-groups";
import { TranslationKey } from "../../../translations/i18n";

export interface ExistingStringReference {
  id: number[];
  str: string;
  group?: StringReferenceGroup;
}

export type StringReference = TranslationKey | number;
