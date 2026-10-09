// 4e skills: species skills (3 × +3, 3 × +5) and career skill advances by level.
import { selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { EntityGroupMap, GroupPicker, resolveEntityGroups } from "../shared/groups.ts";
import { Career, GenerationLevel, getCareerSkillsByLevel } from "../../../content/career.ts";
import { skillCost4e } from "./experience4e.ts";
import { chooseConcreteCareerSkills } from "../shared/skills.ts";
import { Character } from "../../character.ts";
import { Skill } from "../../../content/skill.ts";
import { GenerationProps } from "../shared/generationProps.ts";
import { fillUpIdNumberRecord } from "../../../../../utils/idNumber.ts";

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
export function generateSpeciesSkills4e(
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

const STARTING_CAREER_ADVANCES = 40;

const STARTING_CAREER_MAX_ADVANCES_PER_SKILL = 10;

const REQUIRED_PREREQUISITE_SKILLS = 8;

const ADVANCES_PER_LEVEL = 5;

const HIGHER_LEVELS = [2, 3, 4] as const;

const LEVEL_ADVANCE_BUDGETS: Record<(typeof HIGHER_LEVELS)[number], number> = {
  2: 30,
  3: 20,
  4: 10,
};

export interface CareerSkillsContext {
  career: Career;
  skillGroupMap: EntityGroupMap;
  level: GenerationLevel;
  startingSkills: Record<string, number>;
}

/**
 * Purchases a single advance in a skill, incrementing its rank by 1
 * and calculating the XP cost based on the pre-advance rank.
 */
export function purchaseSingleAdvance(skills: Record<string, number>, skillId: string): number {
  const currentRank = skills[skillId] ?? 0;
  const cost = skillCost4e(currentRank);
  skills[skillId] = currentRank + 1;
  return cost;
}

/**
 * Distributes starting advances among Level 1 career skills (no more than 10 advances in any single skill).
 * Initial creation advances cost 0 XP.
 */
function allocateStartingCareerAdvances(
  skills: Record<string, number>,
  level1Skills: string[],
  selectRandomFn: SelectRandomFn,
): void {
  let availableSkills = [...new Set(level1Skills)];
  const advanceCounts: Record<string, number> = {};

  for (let adv = 0; adv < STARTING_CAREER_ADVANCES; ++adv) {
    if (availableSkills.length === 0) {
      break;
    }

    const skill = selectRandomFn(availableSkills);
    purchaseSingleAdvance(skills, skill);

    const count = (advanceCounts[skill] ?? 0) + 1;
    advanceCounts[skill] = count;

    if (count === STARTING_CAREER_MAX_ADVANCES_PER_SKILL) {
      availableSkills = availableSkills.filter((s) => s !== skill);
    }
  }
}

/**
 * Ensures at least 8 career skills from previous levels have reached
 * the prerequisite threshold of (level - 1) * 5 advances, spending XP for each advance.
 *
 * The 8 skills are chosen at random rather than cheapest-first. This is deliberate: the generator
 * produces varied NPCs, so XP spent to reach a level differs between characters instead of always
 * being the minimum.
 */
function satisfyLevelPrerequisites(
  skills: Record<string, number>,
  eligibleCareerSkills: string[],
  targetAdvanceThreshold: number,
  selectRandomFn: SelectRandomFn,
): number {
  let availableSkills = [...new Set(eligibleCareerSkills)];
  let xpSpent = 0;

  for (let skillNo = 0; skillNo < REQUIRED_PREREQUISITE_SKILLS; ++skillNo) {
    if (availableSkills.length === 0) {
      break;
    }

    const skill = selectRandomFn(availableSkills);
    availableSkills = availableSkills.filter((s) => s !== skill);

    while ((skills[skill] ?? 0) < targetAdvanceThreshold) {
      xpSpent += purchaseSingleAdvance(skills, skill);
    }
  }

  return xpSpent;
}

/**
 * Distributes the level advance budget randomly among the newly unlocked skills of that level, spending XP.
 */
function allocateLevelAdvances(
  skills: Record<string, number>,
  levelSkills: string[],
  advanceBudget: number,
  selectRandomFn: SelectRandomFn,
): number {
  const availableSkills = [...new Set(levelSkills)];
  let xpSpent = 0;

  for (let adv = 0; adv < advanceBudget; ++adv) {
    if (availableSkills.length === 0) {
      break;
    }

    const skill = selectRandomFn(availableSkills);
    xpSpent += purchaseSingleAdvance(skills, skill);
  }

  return xpSpent;
}

/**
 * Generates career skills and advances across career levels (Levels 1 to 4).
 * Builds on top of existing starting skills (e.g. species skills).
 */
export function generateCareerSkills4e(
  context: CareerSkillsContext,
  selectRandomFn: SelectRandomFn = selectRandom,
): [Record<string, number>, number] {
  const skills: Record<string, number> = { ...context.startingSkills };

  // Career skill lists may contain group placeholders like 'Melee (Any)' or 'Trade (Any)'.
  // Pick concrete specializations (e.g. 'Melee (Basic)') for each career level (1 to 4).
  const careerSkillsByLevel = chooseConcreteCareerSkills(
    getCareerSkillsByLevel(context.career),
    context.skillGroupMap,
    selectRandomFn,
  );

  // --- Step 1: Allocate Starting Career Advances (Creation / Level 1) ---
  // In WFRP 4e, a starting character receives 40 advances to distribute among their
  // Level 1 career skills. No single skill may receive more than 10 advances at creation.
  // These initial advances cost 0 XP.
  allocateStartingCareerAdvances(skills, careerSkillsByLevel[0], selectRandomFn);

  let totalXpSpent = 0;
  let accumulatedCareerSkills = [...careerSkillsByLevel[0]];

  // --- Step 2: Progress Through Higher Career Levels (Levels 2 to 4) ---
  // Characters created at or advanced to higher levels must satisfy level qualification
  // prerequisites and spend XP to purchase advances in each level.
  for (const level of HIGHER_LEVELS.filter((l) => l <= context.level)) {
    // 2a. Satisfy Level Prerequisites:
    // To qualify for an advanced career level, WFRP 4e requires having at least 8 career skills
    // from previous levels with at least (level - 1) * 5 advances (e.g. 5 advances for Level 2,
    // 10 for Level 3, 15 for Level 4). Any skills below this threshold are backfilled, spending XP.
    const prerequisiteThreshold = (level - 1) * ADVANCES_PER_LEVEL;
    totalXpSpent += satisfyLevelPrerequisites(skills, accumulatedCareerSkills, prerequisiteThreshold, selectRandomFn);

    // 2b. Unlock New Level Skills:
    // The skills of this new level are now unlocked and added to the pool of career skills.
    const newLevelSkills = careerSkillsByLevel[level - 1];
    accumulatedCareerSkills = accumulatedCareerSkills.concat(newLevelSkills);

    // 2c. Allocate Level Advance Budget:
    // Distribute advances from the level's budget (Level 2: 30, Level 3: 20, Level 4: 10)
    // randomly among the newly unlocked skills of this level, spending XP.
    totalXpSpent += allocateLevelAdvances(skills, newLevelSkills, LEVEL_ADVANCE_BUDGETS[level], selectRandomFn);
  }

  return [skills, totalXpSpent];
}

export function populateSpeciesSkills4e(
  character: Character,
  listOfSkills: Skill[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  if (listOfSkills.length === 0) {
    return;
  }
  const skillGroupMap = resolveEntityGroups(listOfSkills);
  const generatedSkills = generateSpeciesSkills4e(
    generationProps.speciesSkills[character.species],
    skillGroupMap,
    selectRandomFn,
  );
  const newSkills = { ...character.skills };
  fillUpIdNumberRecord(newSkills, generatedSkills);
  character.skills = newSkills;
}
