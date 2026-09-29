import { selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { EntityGroupMap } from "./resolveEntityGroups.ts";

const SPECIES_ADVANCE_PACKAGES = [
  { count: 3, advances: 3 },
  { count: 3, advances: 5 },
] as const;

function resolveConcreteSkill(skillId: string, skillGroupMap: EntityGroupMap, selectRandomFn: SelectRandomFn): string {
  if (skillId in skillGroupMap) {
    return selectRandomFn(skillGroupMap[skillId]);
  }
  return skillId;
}

/**
 * Generates species skills by selecting 3 skills at +3 advances and 3 skills at +5 advances.
 * Grouped skills (e.g. Language (Any)) are resolved to a concrete sub-skill.
 */
export function generateSpeciesSkills(
  speciesSkills: string[] | undefined,
  skillGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  if (speciesSkills === undefined) {
    return {};
  }

  const generatedSkills: Record<string, number> = {};
  let candidatePool = [...new Set(speciesSkills)];

  for (const pkg of SPECIES_ADVANCE_PACKAGES) {
    for (let i = 0; i < pkg.count; ++i) {
      const pickedSkill = selectRandomFn(candidatePool);
      candidatePool = candidatePool.filter((skill) => skill !== pickedSkill);

      const concreteSkillId = resolveConcreteSkill(pickedSkill, skillGroupMap, selectRandomFn);
      generatedSkills[concreteSkillId] = pkg.advances;
    }
  }

  return generatedSkills;
}
