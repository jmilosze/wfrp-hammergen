// 5e skills at creation: fluent languages, species skills and career skill advances.
import { Character } from "../../character.ts";
import { Skill } from "../../../content/skill.ts";
import { GenerationProps5e } from "../shared/generationProps.ts";
import { selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { fillUpIdNumberRecord } from "../../../../../utils/idNumber.ts";
import { EntityGroupMap, GroupPicker, resolveEntityGroups } from "../shared/groups.ts";
import { ADVANCE_POINTS_5E } from "./experience5e.ts";

// Fluent languages: six Advances (+30) each.
const FLUENT_LANGUAGE_POINTS = 6 * ADVANCE_POINTS_5E;

// Species skills: one Advance in any five of the species' skills.
const SPECIES_SKILL_COUNT = 5;

// Career skills: eight Advances, no skill above three Advances (+15) at creation (p. 38–39).
const CREATION_CAREER_SKILL_ADVANCES = 8;

const CREATION_MAX_SKILL_POINTS = 3 * ADVANCE_POINTS_5E;

// Fluent languages at +30, then +5 in five skills picked at random from the species' list. A group skill in the
// list (e.g. Stealth) means any of its specialisations.
export function generateSpeciesSkills5e(
  speciesSkills: string[] | undefined,
  speciesLanguages: string[] | undefined,
  skillGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  const skills: Record<string, number> = {};
  for (const language of speciesLanguages ?? []) {
    skills[language] = FLUENT_LANGUAGE_POINTS;
  }

  const groupPicker = new GroupPicker(skillGroupMap, selectRandomFn);
  let candidates = [...(speciesSkills ?? [])];
  let picked = 0;
  while (picked < SPECIES_SKILL_COUNT && candidates.length > 0) {
    const candidate = selectRandomFn(candidates);
    candidates = candidates.filter((x) => x !== candidate);
    const skill = groupPicker.isGroup(candidate) ? groupPicker.pick(candidate, Object.keys(skills)) : candidate;
    if (skill === null || skill in skills) {
      continue;
    }
    skills[skill] = ADVANCE_POINTS_5E;
    ++picked;
  }
  return skills;
}

// Eight career skill Advances over the level 1 career skills; species Advances count towards the +15 limit.
export function allocateCreationCareerAdvances5e(
  skills: Record<string, number>,
  level1Skills: string[],
  selectRandomFn: SelectRandomFn,
): void {
  for (let i = 0; i < CREATION_CAREER_SKILL_ADVANCES; ++i) {
    const available = [...new Set(level1Skills)].filter(
      (s) => (skills[s] ?? 0) + ADVANCE_POINTS_5E <= CREATION_MAX_SKILL_POINTS,
    );
    if (available.length === 0) {
      return;
    }
    const skill = selectRandomFn(available);
    skills[skill] = (skills[skill] ?? 0) + ADVANCE_POINTS_5E;
  }
}

export function populateSpeciesSkills5e(
  character: Character,
  listOfSkills: Skill[],
  generationProps: GenerationProps5e,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  if (listOfSkills.length === 0) {
    return;
  }
  const generatedSkills = generateSpeciesSkills5e(
    generationProps.speciesSkills[character.species],
    generationProps.speciesLanguages[character.species],
    resolveEntityGroups(listOfSkills),
    selectRandomFn,
  );
  const newSkills = { ...character.skills };
  fillUpIdNumberRecord(newSkills, generatedSkills);
  character.skills = newSkills;
}
