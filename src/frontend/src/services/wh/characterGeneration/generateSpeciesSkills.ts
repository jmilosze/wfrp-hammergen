import { selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { EntityGroupMap, GroupPicker } from "./resolveEntityGroups.ts";

const SPECIES_ADVANCE_PACKAGES = [
  { count: 3, advances: 3 },
  { count: 3, advances: 5 },
] as const;

const SPECIES_SKILL_COUNT = SPECIES_ADVANCE_PACKAGES.reduce((sum, pkg) => sum + pkg.count, 0);

/**
 * Turns a picked species skill into a concrete skill that the character does not have yet, or null if there is none.
 * A group (e.g. Language (Any)) never resolves to a skill the species lists by name or to one already generated,
 * so a named skill and a group can't land on the same skill.
 */
function resolveNewConcreteSkill(
  pickedSkill: string,
  groupPicker: GroupPicker,
  namedSkills: string[],
  generatedSkills: Record<string, number>,
): string | null {
  if (groupPicker.isGroup(pickedSkill)) {
    return groupPicker.pick(pickedSkill, [...namedSkills, ...Object.keys(generatedSkills)]);
  }
  return pickedSkill;
}

/**
 * Generates species skills by selecting 3 skills at +3 advances and 3 skills at +5 advances, all different.
 * Grouped skills (e.g. Language (Any)) are resolved to a concrete sub-skill.
 * Throws if the species skill list can't provide 6 different skills.
 */
export function generateSpeciesSkills(
  speciesSkills: string[] | undefined,
  skillGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  if (speciesSkills === undefined) {
    return {};
  }

  const groupPicker = new GroupPicker(skillGroupMap, selectRandomFn);
  let candidatePool = [...new Set(speciesSkills)];
  const namedSkills = candidatePool.filter((skill) => !groupPicker.isGroup(skill));
  const generatedSkills: Record<string, number> = {};

  for (const pkg of SPECIES_ADVANCE_PACKAGES) {
    for (let i = 0; i < pkg.count; ++i) {
      let concreteSkill: string | null = null;
      while (concreteSkill === null) {
        if (candidatePool.length === 0) {
          throw new Error(
            `species skills must provide ${SPECIES_SKILL_COUNT} different skills, got: ${speciesSkills.join(", ")}`,
          );
        }
        const pickedSkill = selectRandomFn(candidatePool);
        candidatePool = candidatePool.filter((skill) => skill !== pickedSkill);
        concreteSkill = resolveNewConcreteSkill(pickedSkill, groupPicker, namedSkills, generatedSkills);
      }
      generatedSkills[concreteSkill] = pkg.advances;
    }
  }

  return generatedSkills;
}
