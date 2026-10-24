// 5e skills at creation: fluent languages, species skills and career skill advances.
import { Character } from "@/services/wh/character/character.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { GenerationProps5e } from "@/services/wh/character/generation/shared/generationProps.ts";
import { selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { fillUpIdNumberRecord } from "@/utils/idNumber.ts";
import {
  availableMembers,
  EntityGroupMap,
  GroupPicker,
  resolveEntityGroups,
} from "@/services/wh/character/generation/shared/groups.ts";
import { isEqualEntity } from "@/utils/equal.ts";
import { ADVANCE_POINTS_5E } from "./experience5e.ts";

// Fluent languages: six Advances (+30) each.
const FLUENT_LANGUAGE_POINTS = 6 * ADVANCE_POINTS_5E;

// Species skills: one Advance in any five of the species' skills.
export const SPECIES_SKILL_COUNT_5E = 5;

// Career skills: eight Advances, no skill above three Advances (+15) at creation (p. 38–39).
export const CREATION_CAREER_SKILL_ADVANCES_5E = 8;

const CREATION_MAX_SKILL_POINTS = 3 * ADVANCE_POINTS_5E;

// applySpeciesSkills5e gives the fluent languages +30 and the chosen species skills (concrete skills) +5.
export function applySpeciesSkills5e(
  chosenSkills: string[],
  speciesLanguages: string[] | undefined,
): Record<string, number> {
  const skills: Record<string, number> = {};
  for (const language of speciesLanguages ?? []) {
    skills[language] = FLUENT_LANGUAGE_POINTS;
  }
  for (const skill of chosenSkills) {
    skills[skill] = ADVANCE_POINTS_5E;
  }
  return skills;
}

// Fluent languages at +30, then +5 in five skills picked at random from the species' list. A group skill in the
// list (e.g. Stealth) means any of its specialisations.
export function generateSpeciesSkills5e(
  speciesSkills: string[] | undefined,
  speciesLanguages: string[] | undefined,
  skillGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  const groupPicker = new GroupPicker(skillGroupMap, selectRandomFn);
  const picked: string[] = [];
  let candidates = [...(speciesSkills ?? [])];
  while (picked.length < SPECIES_SKILL_COUNT_5E && candidates.length > 0) {
    const candidate = selectRandomFn(candidates);
    candidates = candidates.filter((x) => x !== candidate);
    const taken = [...picked, ...(speciesLanguages ?? [])];
    const skill = groupPicker.isGroup(candidate) ? groupPicker.pick(candidate, taken) : candidate;
    if (skill === null || taken.includes(skill)) {
      continue;
    }
    picked.push(skill);
  }
  return applySpeciesSkills5e(picked, speciesLanguages);
}

// careerSkillAdvanceLimit5e gives how many of the eight career skill Advances a skill can still take: species
// Advances count towards the +15 limit (a fluent language at +30 takes none).
export function careerSkillAdvanceLimit5e(speciesSkills: Record<string, number>, skill: string): number {
  return Math.max(0, (CREATION_MAX_SKILL_POINTS - (speciesSkills[skill] ?? 0)) / ADVANCE_POINTS_5E);
}

// applyCareerSkillAdvances5e adds the career skill Advances (number of Advances per skill) to the species skills.
export function applyCareerSkillAdvances5e(
  speciesSkills: Record<string, number>,
  advances: Record<string, number>,
): Record<string, number> {
  const skills = { ...speciesSkills };
  for (const [skill, count] of Object.entries(advances)) {
    skills[skill] = (skills[skill] ?? 0) + count * ADVANCE_POINTS_5E;
  }
  return skills;
}

// randomCareerSkillAdvances5e spreads the eight career skill Advances over the level 1 career skills at random.
export function randomCareerSkillAdvances5e(
  speciesSkills: Record<string, number>,
  level1Skills: string[],
  selectRandomFn: SelectRandomFn,
): Record<string, number> {
  const advances: Record<string, number> = {};
  for (let i = 0; i < CREATION_CAREER_SKILL_ADVANCES_5E; ++i) {
    const available = [...new Set(level1Skills)].filter(
      (s) => (advances[s] ?? 0) < careerSkillAdvanceLimit5e(speciesSkills, s),
    );
    if (available.length === 0) {
      break;
    }
    const skill = selectRandomFn(available);
    advances[skill] = (advances[skill] ?? 0) + 1;
  }
  return advances;
}

// The skills step of guided creation.
export interface GuidedSkills5e {
  // The species skills taken, by entry of the species' list: the entry itself, or for a group (e.g. Stealth) the
  // specialisation picked ("" until one is).
  species: Record<string, string>;
  // The level 1 career group skills (e.g. Lore (Any)) with the specialisation picked.
  specialisations: Record<string, string>;
  // The eight career skill Advances: number of Advances per level 1 career skill.
  advances: Record<string, number>;
}

export function newGuidedSkills5e(): GuidedSkills5e {
  return { species: {}, specialisations: {}, advances: {} };
}

// What the skills step works with: the species' skill list and fluent languages, the career's level 1 skills and the
// skill groups.
export interface SkillsContext5e {
  speciesSkills: string[];
  speciesLanguages: string[];
  level1Skills: string[];
  skillGroupMap: EntityGroupMap;
}

// The level 1 career skills with their groups settled; a group without a specialisation yet is left out.
export function concreteCareerSkills5e(g: GuidedSkills5e, context: SkillsContext5e): string[] {
  return [
    ...new Set(
      context.level1Skills
        .map((id) => (id in context.skillGroupMap ? (g.specialisations[id] ?? "") : id))
        .filter((id) => id !== ""),
    ),
  ];
}

// The specialisations a career group skill can take: not a skill the career lists itself, nor one another group took (as
// the generator settles them).
export function careerGroupMembers5e(g: GuidedSkills5e, context: SkillsContext5e, group: string): string[] {
  const listed = context.level1Skills.filter((id) => !(id in context.skillGroupMap));
  const taken = Object.entries(g.specialisations)
    .filter(([other]) => other !== group)
    .map(([, pick]) => pick);
  return availableMembers(context.skillGroupMap, group, [...listed, ...taken]);
}

// The languages and species skills with their points.
export function guidedSpeciesSkills5e(g: GuidedSkills5e, context: SkillsContext5e): Record<string, number> {
  return applySpeciesSkills5e(
    Object.values(g.species).filter((id) => id !== ""),
    context.speciesLanguages,
  );
}

function speciesPickFits(entry: string, pick: string, context: SkillsContext5e): boolean {
  if (!context.speciesSkills.includes(entry) || context.speciesLanguages.includes(pick)) {
    return false;
  }
  return entry in context.skillGroupMap ? pick === "" || context.skillGroupMap[entry].includes(pick) : pick === entry;
}

// fitGuidedSkills5e keeps the picks that still fit the species and the career (D8): species picks from the species'
// list, specialisations of the career's group skills, and Advances on its skills, cut down to the +15 limit.
export function fitGuidedSkills5e(g: GuidedSkills5e, context: SkillsContext5e): GuidedSkills5e {
  const species = Object.fromEntries(
    Object.entries(g.species).filter(([entry, pick]) => speciesPickFits(entry, pick, context)),
  );
  const specialisations = Object.fromEntries(
    Object.entries(g.specialisations).filter(
      ([group, pick]) =>
        context.level1Skills.includes(group) &&
        group in context.skillGroupMap &&
        careerGroupMembers5e(g, context, group).includes(pick),
    ),
  );
  const fitted = { species: species, specialisations: specialisations, advances: {} };
  const careerSkills = concreteCareerSkills5e(fitted, context);
  const speciesSkills = guidedSpeciesSkills5e(fitted, context);
  const advances: Record<string, number> = {};
  for (const [skill, count] of Object.entries(g.advances)) {
    const kept = Math.min(count, careerSkillAdvanceLimit5e(speciesSkills, skill));
    if (careerSkills.includes(skill) && kept > 0) {
      advances[skill] = kept;
    }
  }
  return { ...fitted, advances: advances };
}

// guidedSkillsValid5e tells whether the step is settled: five species skills (fewer if the list is shorter), every
// career group skill specialised, and the eight career Advances spent.
export function guidedSkillsValid5e(g: GuidedSkills5e, context: SkillsContext5e): boolean {
  const picks = Object.values(g.species);
  const careerSkills = concreteCareerSkills5e(g, context);
  const groupsSettled = context.level1Skills.every((id) => !(id in context.skillGroupMap) || id in g.specialisations);
  const speciesSkills = guidedSpeciesSkills5e(g, context);
  const room = careerSkills.reduce((sum, skill) => sum + careerSkillAdvanceLimit5e(speciesSkills, skill), 0);
  const advances = Object.values(g.advances).reduce((sum, x) => sum + x, 0);
  return (
    isEqualEntity(fitGuidedSkills5e(g, context), g) &&
    picks.length === Math.min(SPECIES_SKILL_COUNT_5E, context.speciesSkills.length) &&
    picks.every((x) => x !== "") &&
    new Set(picks).size === picks.length &&
    groupsSettled &&
    advances === Math.min(CREATION_CAREER_SKILL_ADVANCES_5E, room)
  );
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
