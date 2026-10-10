// 5e career advancement: Career Advancement Tracker ticks and advances for levels 2–4.
import {
  Career,
  GenerationLevel,
  getCareerAttributesByLevel,
  getCareerSkillsByLevel,
  getCareerTalentsByLevel,
  PerGenerationLevel,
} from "../../../content/career.ts";
import { Talent } from "../../../content/talent.ts";
import { selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { Attributes, getAttributeValue, setAttributeValue, zeroAttributes } from "../../../core/attributes.ts";
import { calculateMaxTalentRanks, resolveAvailableTalents } from "../shared/talents.ts";
import { EntityGroupMap } from "../shared/groups.ts";
import { chooseConcreteCareerSkills } from "../shared/skills.ts";
import {
  ADVANCE_POINTS_5E,
  CAREER_LEVEL_COST_5E,
  characteristicCost5e,
  skillCost5e,
  TALENT_COST_5E,
} from "./experience5e.ts";
import { allocateCreationCareerAdvances5e } from "./skills5e.ts";
import { takeCareerTalent5e } from "./talents5e.ts";

// Career Advancement Tracker ticks at each career level (p. 196): 10 for level 2, 12 more for level 3, 14 more
// for level 4. One running count for the current career; past careers keep no count.
export const CAREER_TICKS_5E: PerGenerationLevel<number> = [0, 10, 22, 36];

export interface CareerAdvances5eContext {
  career: Career;
  level: GenerationLevel;
  baseAttributes: Attributes;
  talentList: Talent[];
  skillGroupMap: EntityGroupMap;
  talentGroupMap: EntityGroupMap;
  startingSkills: Record<string, number>;
  startingTalents: Record<string, number>;
}

export interface CareerAdvances5e {
  skills: Record<string, number>;
  talents: Record<string, number>;
  attributeAdvances: Attributes;
  spentExp: number;
}

// Level 1: eight career skill Advances and one level 1 career talent (free). Each higher level: at the current
// level, one career talent, one Advance in each unlocked characteristic and career skill Advances until the
// tracker reaches the next level's ticks, then 100 XP to move up.
export function generateCareerAdvances5e(
  context: CareerAdvances5eContext,
  selectRandomFn: SelectRandomFn = selectRandom,
): CareerAdvances5e {
  const skills = { ...context.startingSkills };
  const talents = { ...context.startingTalents };
  const attributeAdvances = zeroAttributes();
  let spentExp = 0;

  const careerSkillsByLevel = chooseConcreteCareerSkills(
    getCareerSkillsByLevel(context.career),
    context.skillGroupMap,
    selectRandomFn,
  );
  const careerTalentsByLevel = getCareerTalentsByLevel(context.career).map((x) =>
    resolveAvailableTalents(x, context.talentGroupMap, selectRandomFn),
  );
  const careerAttributesByLevel = getCareerAttributesByLevel(context.career);

  const maxRanks = () =>
    calculateMaxTalentRanks(talents, context.talentList, context.baseAttributes, attributeAdvances);

  allocateCreationCareerAdvances5e(skills, careerSkillsByLevel[0], selectRandomFn);
  takeCareerTalent5e(talents, careerTalentsByLevel[0], maxRanks(), selectRandomFn);

  for (let current = 1; current < context.level; ++current) {
    const unlockedSkills = [...new Set(careerSkillsByLevel.slice(0, current).flat())];
    const unlockedTalents = [...new Set(careerTalentsByLevel.slice(0, current).flat())];
    const unlockedAttributes = [...new Set(careerAttributesByLevel.slice(0, current).flat())];
    const ticksNeeded = CAREER_TICKS_5E[current] - CAREER_TICKS_5E[current - 1];
    let ticks = 0;

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
