import { EXISTING_STRING_REFERENCES } from "../../config/stringRef";
import { StringReferenceGroup } from "../../config/stringRef-groups";

export namespace StringRefUtils {
  export function getStringIds(
    groups: StringReferenceGroup | StringReferenceGroup[]
  ): string[] {
    groups = typeof groups === "string" ? [groups] : groups;
    const results = EXISTING_STRING_REFERENCES.filter(
      (s) => !!s.group && groups.includes(s.group)
    )
      .map((s) => s.id.map((i) => `${i}`))
      .flat();
    return results;
  }
  export function getStringId(str: string): string {
    const result = EXISTING_STRING_REFERENCES.find(
      (s) => s.str.toLowerCase() === str.toLowerCase()
    );
    if (!result) throw new Error(`Stringref ${str} not found !`);
    if (!result.id[0])
      throw new Error(`Stringref ${str} has been found but no id configured !`);
    return `${result.id[0]}`;
  }
}
