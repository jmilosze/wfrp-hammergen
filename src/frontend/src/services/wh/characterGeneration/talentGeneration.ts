import { Talent } from "../talent.ts";

export function getTalentGroups(listOfTalents: Talent[]) {
  const resolvedGroups: Record<string, string[]> = {};

  for (const talent of listOfTalents) {
    if (talent.group.length > 0) {
      for (const group of talent.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(talent.id);
        } else {
          resolvedGroups[group] = [talent.id];
        }
      }
    }
  }

  return resolvedGroups;
}
