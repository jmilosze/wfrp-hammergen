// 5e career advancement: Career Advancement Tracker ticks and advances for levels 2–4.
import {
  Career,
  CareerLevel,
  GenerationLevel,
  getCareerAttributesByLevel,
  PerGenerationLevel,
} from "@/services/wh/content/career.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { Attributes, getAttributeValue, setAttributeValue, zeroAttributes } from "@/services/wh/core/attributes.ts";
import { calculateMaxTalentRanks } from "@/services/wh/character/generation/shared/talents.ts";
import {
  ADVANCE_POINTS_5E,
  CAREER_LEVEL_COST_5E,
  characteristicCost5e,
  skillCost5e,
  TALENT_COST_5E,
} from "./experience5e.ts";
import { takeCareerTalent5e } from "./talents5e.ts";

// Career Advancement Tracker ticks at each career level (p. 196): 10 for level 2, 12 more for level 3, 14 more
// for level 4. One running count for the current career; past careers keep no count.
export const CAREER_TICKS_5E: PerGenerationLevel<number> = [0, 10, 22, 36];

export interface CareerAdvances5eContext {
  career: Career;
  level: GenerationLevel;
  baseAttributes: Attributes;
  talentList: Talent[];
  // The career skills and talents of levels 1 to 4, with their groups settled (the same as at creation).
  careerSkillsByLevel: string[][];
  careerTalentsByLevel: string[][];
  // The skills and talents of the level 1 character.
  startingSkills: Record<string, number>;
  startingTalents: Record<string, number>;
}

export interface CareerAdvances5e {
  skills: Record<string, number>;
  talents: Record<string, number>;
  attributeAdvances: Attributes;
  spentExp: number;
}

// The ticks the trappings of a career level give when acquired (D10): one per entry and one per money item.
function trappingTicks(level: CareerLevel): number {
  return level.trappings.length + level.money.length;
}

// Starts from a level 1 character. Each higher level: at the current level, one career talent, one Advance in each
// unlocked characteristic, the next level's trappings (D8; the generator gives them) and career skill Advances until
// the tracker reaches the next level's ticks, then 100 XP to move up.
export function generateCareerAdvances5e(
  context: CareerAdvances5eContext,
  selectRandomFn: SelectRandomFn = selectRandom,
): CareerAdvances5e {
  const skills = { ...context.startingSkills };
  const talents = { ...context.startingTalents };
  const attributeAdvances = zeroAttributes();
  let spentExp = 0;

  const { careerSkillsByLevel, careerTalentsByLevel } = context;
  const careerAttributesByLevel = getCareerAttributesByLevel(context.career);
  const levels = [context.career.level1, context.career.level2, context.career.level3, context.career.level4];

  const maxRanks = () =>
    calculateMaxTalentRanks(talents, context.talentList, context.baseAttributes, attributeAdvances);

  for (let current = 1; current < context.level; ++current) {
    const unlockedSkills = [...new Set(careerSkillsByLevel.slice(0, current).flat())];
    const unlockedTalents = [...new Set(careerTalentsByLevel.slice(0, current).flat())];
    const unlockedAttributes = [...new Set(careerAttributesByLevel.slice(0, current).flat())];
    const ticksNeeded = CAREER_TICKS_5E[current] - CAREER_TICKS_5E[current - 1];
    let ticks = trappingTicks(levels[current]);

    if (takeCareerTalent5e(talents, unlockedTalents, maxRanks(), selectRandomFn)) {
      spentExp += TALENT_COST_5E;
      ++ticks;
    }

    for (const att of unlockedAttributes) {
      const points = getAttributeValue(att, attributeAdvances);
      spentExp += characteristicCost5e(points);
      setAttributeValue(att, points + ADVANCE_POINTS_5E, attributeAdvances);
      ++ticks;
    }

    for (; ticks < ticksNeeded && unlockedSkills.length > 0; ++ticks) {
      const skill = selectRandomFn(unlockedSkills);
      const points = skills[skill] ?? 0;
      spentExp += skillCost5e(points);
      skills[skill] = points + ADVANCE_POINTS_5E;
    }

    spentExp += CAREER_LEVEL_COST_5E;
  }

  return { skills, talents, attributeAdvances, spentExp };
}
