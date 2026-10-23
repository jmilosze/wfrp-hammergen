// Marks of the skills, talents and trappings a character's current career, species and class give (HG-54): the
// character editor's pickers show them in the rows' notes and filter by them. The career's characteristics are
// highlighted in the characteristics table.
import { Career, CareerLevel } from "@/services/wh/content/career.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { AttributeName } from "@/services/wh/core/attributes.ts";
import { Character } from "./character.ts";
import { GenerationProps, GenerationProps5e } from "./generation/shared/generationProps.ts";
import { EntityGroupMap, resolveEntityGroups } from "./generation/shared/groups.ts";
import { rulesFor } from "./rules/rules.ts";

// randomSpecies: a talent the species may get from the Random Talents table.
export type Mark = "career" | "species" | "randomSpecies" | "class";

// The marks in the order the pickers show them.
export const markList: Mark[] = ["career", "species", "randomSpecies", "class"];

export function printMark(mark: Mark): string {
  switch (mark) {
    case "career":
      return "Career";
    case "species":
      return "Species";
    case "randomSpecies":
      return "Species (Random)";
    case "class":
      return "Class";
  }
}

// The mark a picker filters a mark by: the Species filter covers Random Talents too.
export function filterMark(mark: Mark): Mark {
  return mark === "randomSpecies" ? "species" : mark;
}

// The marks by id; only ids with at least one mark are in it.
export type Marks = Map<string, Set<Mark>>;

// The names of an id's marks, in the order of markList.
export function printMarks(marks: Marks, id: string): string[] {
  const idMarks = marks.get(id);
  return idMarks === undefined ? [] : markList.filter((mark) => idMarks.has(mark)).map(printMark);
}

// The character's current career with its level.
export type CurrentCareer = { career: Career; level: number };

const CAREER_LEVELS = [1, 2, 3, 4, 5] as const;

export function findCurrentCareer(character: Character, careers: Career[]): CurrentCareer | undefined {
  const current = character.career;
  if (current === undefined) {
    return undefined;
  }
  const career = careers.find((x) => x.id === current.id);
  return career === undefined ? undefined : { career: career, level: current.number };
}

// The levels of the current career whose content counts: the current level and, with lowerLevels, each lower level the
// character's past careers have (levels skipped when entering the career don't count).
function countedLevels(character: Character, current: CurrentCareer | undefined, lowerLevels: boolean): CareerLevel[] {
  if (current === undefined) {
    return [];
  }
  return CAREER_LEVELS.filter(
    (level) =>
      level === current.level ||
      (lowerLevels &&
        level < current.level &&
        character.careerPath.some((x) => x.id === current.career.id && x.number === level)),
  )
    .map((level) => current.career.getLevel(level))
    .filter((x) => x.exists);
}

// The ids of a list of entries: a choice ("A,B") gives each option, a group each of its members; "random" (a Random
// Talent) gives none.
function expandIds(entries: Iterable<string>, groups: EntityGroupMap): string[] {
  return [...entries]
    .flatMap((entry) => entry.split(",").map((x) => x.trim()))
    .filter((id) => id !== "random")
    .flatMap((id) => (id in groups ? groups[id] : [id]));
}

function addMarks(marks: Marks, ids: string[], mark: Mark) {
  for (const id of ids) {
    const idMarks = marks.get(id);
    if (idMarks === undefined) {
      marks.set(id, new Set([mark]));
    } else {
      idMarks.add(mark);
    }
  }
}

// Career characteristics, as career skills: the current level's and those of the lower levels the character went
// through (each level of the Advance Scheme adds its characteristics).
export function careerAttributes(character: Character, current: CurrentCareer | undefined): Set<AttributeName> {
  return new Set(countedLevels(character, current, true).flatMap((level) => level.attributes));
}

// Career skills come from the current level and the lower levels the character went through, in both editions. 5e
// species' fluent languages count as species skills.
export function skillMarks(
  character: Character,
  current: CurrentCareer | undefined,
  skills: Skill[],
  generationProps: GenerationProps | GenerationProps5e,
): Marks {
  const groups = resolveEntityGroups(skills);
  const marks: Marks = new Map();
  addMarks(
    marks,
    countedLevels(character, current, true).flatMap((level) => expandIds(level.skills, groups)),
    "career",
  );
  const speciesSkills = [
    ...(generationProps.speciesSkills[character.species] ?? []),
    ...("speciesLanguages" in generationProps ? (generationProps.speciesLanguages[character.species] ?? []) : []),
  ];
  addMarks(marks, expandIds(speciesSkills, groups), "species");
  return marks;
}

// Career talents come from the current level, and in 5e also from the lower levels the character went through. Species
// talents are the species' talents and choices, and the Random Talents table when the species gets Random Talents.
export function talentMarks(
  character: Character,
  current: CurrentCareer | undefined,
  talents: Talent[],
  generationProps: GenerationProps,
): Marks {
  const groups = resolveEntityGroups(talents);
  const lowerLevels = rulesFor(character.edition).careerTalentsFromLowerLevels;
  const marks: Marks = new Map();
  addMarks(
    marks,
    countedLevels(character, current, lowerLevels).flatMap((level) => expandIds(level.talents, groups)),
    "career",
  );
  const speciesTalents = generationProps.speciesTalents[character.species] ?? [];
  addMarks(marks, expandIds(speciesTalents, groups), "species");
  // A species with Random Talents may get any talent of the table; a talent it has anyway stays only Species.
  if (speciesTalents.includes("random")) {
    const randomTalents = expandIds(
      generationProps.randomTalents.map((x) => x.id),
      groups,
    ).filter((id) => !marks.get(id)?.has("species"));
    addMarks(marks, randomTalents, "randomSpecies");
  }
  return marks;
}

// Career trappings come from the current level only (every option of its entries); class trappings from the current
// career's class.
export function itemMarks(
  character: Character,
  current: CurrentCareer | undefined,
  generationProps: GenerationProps,
): Marks {
  const marks: Marks = new Map();
  if (current === undefined) {
    return marks;
  }
  addMarks(
    marks,
    countedLevels(character, current, false).flatMap((level) =>
      level.trappings.flatMap((entry) => entry.options.flat().map((trapping) => trapping.id)),
    ),
    "career",
  );
  const classItems = generationProps.classItems[current.career.careerClass];
  if (classItems !== undefined) {
    addMarks(marks, expandIds([...Object.keys(classItems.equipped), ...Object.keys(classItems.carried)], {}), "class");
  }
  return marks;
}
