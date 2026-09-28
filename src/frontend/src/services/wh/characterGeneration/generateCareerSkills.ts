import { Skill } from "../skill.ts";
import { Career, getCareerSkillsByLevel } from "../career.ts";
import { selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { skillCost } from "./calculateExperience.ts";

export type SkillGroupMap = Record<string, string[]>;

const STARTING_CAREER_ADVANCES = 40;
const STARTING_CAREER_MAX_ADVANCES_PER_SKILL = 10;
const REQUIRED_PREREQUISITE_SKILLS = 8;
const ADVANCES_PER_LEVEL = 5;

const LEVEL_ADVANCE_BUDGETS: Record<number, number> = {
  2: 30,
  3: 20,
  4: 10,
};

export interface CareerSkillsContext {
  career: Career;
  skillGroupMap: SkillGroupMap;
  level: number;
  startingSkills?: Record<string, number>;
}

/**
 * Purchases a single advance in a skill, incrementing its rank by 1
 * and calculating the XP cost based on the pre-advance rank.
 */
export function purchaseSingleAdvance(skills: Record<string, number>, skillId: string): number {
  const currentRank = skills[skillId] ?? 0;
  const cost = skillCost(currentRank);
  skills[skillId] = currentRank + 1;
  return cost;
}

/**
 * Indexes skills by their group identifiers (e.g. 'melee' -> ['melee_basic', 'melee_brawling']).
 */
export function resolveSkillGroups(listOfWhSkills: Skill[]): SkillGroupMap {
  const resolvedGroups: SkillGroupMap = {};

  for (const skill of listOfWhSkills) {
    if (skill.group) {
      for (const group of skill.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(skill.id);
        } else {
          resolvedGroups[group] = [skill.id];
        }
      }
    }
  }
  return resolvedGroups;
}

function pickConcreteSubskill(
  group: string,
  skillGroupMap: SkillGroupMap,
  chosenSpecializations: Set<string>,
  selectRandomFn: SelectRandomFn,
): string | null {
  const allSubskills = skillGroupMap[group];
  if (!allSubskills) {
    return null;
  }

  const available = allSubskills.filter((skill) => !chosenSpecializations.has(skill));
  if (available.length === 0) {
    return null;
  }

  const picked = selectRandomFn(available);
  chosenSpecializations.add(picked);
  return picked;
}

function chooseSkillsForLevel(
  careerSkills: string[],
  skillGroupMap: SkillGroupMap,
  chosenSpecializations: Set<string>,
  selectRandomFn: SelectRandomFn,
): string[] {
  const levelSkills = new Set<string>();

  for (const skill of careerSkills) {
    if (skill in skillGroupMap) {
      const concreteSubskill = pickConcreteSubskill(
        skill,
        skillGroupMap,
        chosenSpecializations,
        selectRandomFn,
      );
      if (concreteSubskill !== null) {
        levelSkills.add(concreteSubskill);
      }
    } else {
      levelSkills.add(skill);
    }
  }

  return Array.from(levelSkills);
}

/**
 * Career skill lists often contain generic group placeholders like 'Melee (Any)' or 'Trade (Any)'.
 * This function picks a concrete specialization (e.g. 'Melee (Basic)') for each placeholder,
 * ensuring no duplicate specializations are chosen within or across career levels.
 */
export function chooseConcreteCareerSkills(
  careerSkillsByLevel: Record<number, string[]>,
  skillGroupMap: SkillGroupMap,
  selectRandomFn: SelectRandomFn,
): Record<number, string[]> {
  // Tracks chosen specializations across levels so that picking e.g. "Melee (Basic)"
  // at Level 1 prevents picking the same specialization again at higher levels,
  // ensuring each "(Any)" placeholder unlocks a distinct new specialization.
  const chosenSpecializations = new Set<string>();

  return {
    1: chooseSkillsForLevel(careerSkillsByLevel[1], skillGroupMap, chosenSpecializations, selectRandomFn),
    2: chooseSkillsForLevel(careerSkillsByLevel[2], skillGroupMap, chosenSpecializations, selectRandomFn),
    3: chooseSkillsForLevel(careerSkillsByLevel[3], skillGroupMap, chosenSpecializations, selectRandomFn),
    4: chooseSkillsForLevel(careerSkillsByLevel[4], skillGroupMap, chosenSpecializations, selectRandomFn),
  };
}

/**
 * Distributes starting advances among Level 1 career skills (no more than 10 advances in any single skill).
 * Initial creation advances cost 0 XP.
 */
export function allocateStartingCareerAdvances(
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
 */
export function satisfyLevelPrerequisites(
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
export function allocateLevelAdvances(
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
export function generateCareerSkills(
  context: CareerSkillsContext,
  selectRandomFn: SelectRandomFn = selectRandom,
): [Record<string, number>, number] {
  const skills: Record<string, number> = context.startingSkills ? { ...context.startingSkills } : {};

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
  allocateStartingCareerAdvances(skills, careerSkillsByLevel[1], selectRandomFn);

  let totalXpSpent = 0;
  let accumulatedCareerSkills = [...careerSkillsByLevel[1]];

  // --- Step 2: Progress Through Higher Career Levels (Levels 2 to 4) ---
  // Characters created at or advanced to higher levels must satisfy level qualification
  // prerequisites and spend XP to purchase advances in each level.
  for (let level = 2; level <= context.level; ++level) {
    // 2a. Satisfy Level Prerequisites:
    // To qualify for an advanced career level, WFRP 4e requires having at least 8 career skills
    // from previous levels with at least (level - 1) * 5 advances (e.g. 5 advances for Level 2,
    // 10 for Level 3, 15 for Level 4). Any skills below this threshold are backfilled, spending XP.
    const prerequisiteThreshold = (level - 1) * ADVANCES_PER_LEVEL;
    totalXpSpent += satisfyLevelPrerequisites(
      skills,
      accumulatedCareerSkills,
      prerequisiteThreshold,
      selectRandomFn,
    );

    // 2b. Unlock New Level Skills:
    // The skills of this new level are now unlocked and added to the pool of career skills.
    const newLevelSkills = careerSkillsByLevel[level];
    accumulatedCareerSkills = accumulatedCareerSkills.concat(newLevelSkills);

    // 2c. Allocate Level Advance Budget:
    // Distribute advances from the level's budget (Level 2: 30, Level 3: 20, Level 4: 10)
    // randomly among the newly unlocked skills of this level, spending XP.
    totalXpSpent += allocateLevelAdvances(
      skills,
      newLevelSkills,
      LEVEL_ADVANCE_BUDGETS[level],
      selectRandomFn,
    );
  }

  return [skills, totalXpSpent];
}

