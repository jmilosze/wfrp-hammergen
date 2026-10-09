// Career skills shared by both editions: concrete picks for group skills in a career.
import { PerGenerationLevel } from "../../../content/career.ts";
import { SelectRandomFn } from "../../../../../utils/random.ts";
import { EntityGroupMap, GroupPicker } from "./groups.ts";

function chooseSkillsForLevel(careerSkills: string[], groupPicker: GroupPicker, allSelectedSkills: string[]): string[] {
  const levelSkills = new Set<string>();
  for (const skill of careerSkills) {
    if (groupPicker.isGroup(skill)) {
      const pickedSkill = groupPicker.pick(skill, allSelectedSkills);
      if (pickedSkill !== null) {
        levelSkills.add(pickedSkill);
        allSelectedSkills.push(pickedSkill);
      }
    } else {
      levelSkills.add(skill);
      allSelectedSkills.push(skill);
    }
  }
  return [...levelSkills];
}

/**
 * Career skill lists often contain generic group placeholders like 'Melee (Any)' or 'Trade (Any)'.
 * This function picks a concrete specialization (e.g. 'Melee (Basic)') for each placeholder,
 * never choosing a skill that is already a career skill, whether it was listed explicitly or picked
 * for an earlier placeholder, in the same or an earlier career level.
 * Species skills are deliberately not excluded: they can't be advanced after character creation unless
 * they are also career skills, so a placeholder may pick a skill the character only has from its species.
 */
export function chooseConcreteCareerSkills(
  careerSkillsByLevel: PerGenerationLevel<string[]>,
  skillGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn,
): PerGenerationLevel<string[]> {
  const groupPicker = new GroupPicker(skillGroupMap, selectRandomFn);
  const allSelectedSkills: string[] = [];

  return [
    chooseSkillsForLevel(careerSkillsByLevel[0], groupPicker, allSelectedSkills),
    chooseSkillsForLevel(careerSkillsByLevel[1], groupPicker, allSelectedSkills),
    chooseSkillsForLevel(careerSkillsByLevel[2], groupPicker, allSelectedSkills),
    chooseSkillsForLevel(careerSkillsByLevel[3], groupPicker, allSelectedSkills),
  ];
}
