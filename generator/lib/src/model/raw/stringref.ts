import { StringReferenceGroup } from "../../../config/stringRef-groups";

export interface ExistingStringReference {
  id: number[];
  str: string;
  group?: StringReferenceGroup;
}
