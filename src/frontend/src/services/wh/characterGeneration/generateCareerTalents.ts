import { Talent } from "../talent.ts";
import { Career, GenerationLevel, getCareerAttributesByLevel, getCareerTalentsByLevel } from "../career.ts";
import { Attributes, copyAttributes, multiplyAttributes, sumAttributes, zeroAttributes } from "../attributes.ts";
import { selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { fillUpAdv, generateAdv } from "./generateAttributes.ts";
import { EntityGroupMap, GroupPicker } from "./resolveEntityGroups.ts";

// Number of free attribute advances received at character creation (Level 1)
const STARTING_ATTRIBUTE_ADVANCES = 5;

// Required advance threshold per completed career tier: (level - 1) * 5
// Level 2 requires 5 advances in prior attributes; Level 3 requires 10; Level 4 requires 15
const ADVANCES_PER_LEVEL = 5;

// Number of attribute advances distributed among accumulated career attributes at each higher level
const LEVEL_ATTRIBUTE_ADVANCES = 5;

// Number of free career talents chosen at character creation (Level 1)
const STARTING_CAREER_TALENTS = 1;

// Additional talent from Level 1 required to advance beyond Tier 1
const ADVANCEMENT_PREREQUISITE_TALENTS = 1;

// Number of career talents acquired at each higher career level (Levels 2 to 4)
const HIGHER_LEVEL_CAREER_TALENTS = 2;

// In WFRP 4e, talent advances cost 100 XP per new rank (rank 1 = 100, rank 2 = 200, etc.)
const TALENT_XP_COST_PER_RANK = 100;

const HIGHER_LEVELS = [2, 3, 4] as const;

export interface CareerTalentsContext {
  career: Career;
  baseAtts: Attributes;
  talents: Talent[];
  talentGroupMap: EntityGroupMap;
  level: GenerationLevel;
  startingTalents: Record<string, number>;
}

/**
 * Sums all attribute modifiers granted by the character's currently acquired talents.
 * Certain talents (e.g. Savvy, Suave, Very Resilient) grant flat attribute bonuses.
 */
export function calculateTalentAttributeModifiers(
  acquiredTalents: Record<string, number>,
  allTalents: Talent[],
): Attributes {
  let totalModifiers = zeroAttributes();

  for (const talent of allTalents) {
    if (talent.id in acquiredTalents) {
      totalModifiers = sumAttributes(
        totalModifiers,
        multiplyAttributes(acquiredTalents[talent.id], copyAttributes(talent.modifiers.attributes)),
      );
    }
  }

  return totalModifiers;
}

/**
 * Calculates the maximum allowed rank for each talent based on effective attributes.
 * Effective attributes = base attributes + attribute advances + talent attribute modifiers.
 */
export function calculateMaxTalentRanks(
  acquiredTalents: Record<string, number>,
  allTalents: Talent[],
  baseAttributes: Attributes,
  advances: Attributes,
): Record<string, number> {
  const talentModifiers = calculateTalentAttributeModifiers(acquiredTalents, allTalents);
  const effectiveAttributes = sumAttributes(baseAttributes, advances, talentModifiers);

  const maxRanks: Record<string, number> = {};
  for (const talent of allTalents) {
    maxRanks[talent.id] = talent.getMaxRank(effectiveAttributes);
  }
  return maxRanks;
}

/**
 * Resolves group talent placeholders (e.g. 'Etiquette (Any)') in a career level's talent list
 * to concrete specialization talents, ensuring no duplicate talents are selected.
 */
export function resolveAvailableTalents(
  careerTalents: string[],
  talentGroupMap: EntityGroupMap,
  selectRandomFn: SelectRandomFn,
): string[] {
  const groupPicker = new GroupPicker(talentGroupMap, selectRandomFn);
  const resolvedTalents: string[] = [];

  for (const talent of careerTalents) {
    if (groupPicker.isGroup(talent)) {
      const chosenTalent = groupPicker.pick(talent, []);
      if (chosenTalent !== null) {
        resolvedTalents.push(chosenTalent);
      }
    } else {
      resolvedTalents.push(talent);
    }
  }

  return [...new Set(resolvedTalents)];
}

/**
 * Advances a talent's rank by 1 and returns the XP cost.
 * In WFRP 4e, talent advances cost 100 XP per new rank.
 */
export function purchaseSingleTalentAdvance(talents: Record<string, number>, talentId: string): number {
  const nextRank = (talents[talentId] ?? 0) + 1;
  talents[talentId] = nextRank;
  return nextRank * TALENT_XP_COST_PER_RANK;
}

/**
 * Randomly selects and advances talents from the available pool up to their maximum rank,
 * accumulating and returning the total XP spent.
 */
export function allocateCareerTalents(
  talents: Record<string, number>,
  availableTalents: string[],
  maxRanks: Record<string, number>,
  advancesToAllocate: number,
  selectRandomFn: SelectRandomFn,
): number {
  let eligibleTalents = availableTalents.filter((id) => {
    if (!(id in maxRanks)) {
      return false;
    }
    const currentRank = talents[id] ?? 0;
    return currentRank < maxRanks[id];
  });

  let totalXpSpent = 0;

  for (let i = 0; i < advancesToAllocate; ++i) {
    if (eligibleTalents.length === 0) {
      break;
    }

    const chosenTalent = selectRandomFn(eligibleTalents);
    totalXpSpent += purchaseSingleTalentAdvance(talents, chosenTalent);

    if (talents[chosenTalent] >= maxRanks[chosenTalent]) {
      eligibleTalents = eligibleTalents.filter((id) => id !== chosenTalent);
    }
  }

  return totalXpSpent;
}

/**
 * Generates career talents and attribute advances across career levels (Levels 1 to 4).
 * Builds on top of pre-existing talents (e.g. species talents).
 *
 * In WFRP 4e, attributes and talents are mutually dependent:
 * - Talents often scale their max rank with attribute bonuses.
 * - Certain talents grant bonuses to attributes.
 * - Career tier progression requires meeting attribute advance thresholds and acquiring tier talents.
 */
export function generateCareerTalents(
  context: CareerTalentsContext,
  selectRandomFn: SelectRandomFn = selectRandom,
): [Record<string, number>, Attributes, number] {
  const careerTalentsByLevel = getCareerTalentsByLevel(context.career);
  const careerAttributesByLevel = getCareerAttributesByLevel(context.career);
  const { talentGroupMap } = context;

  const talents: Record<string, number> = { ...context.startingTalents };
  let advances: Attributes = zeroAttributes();
  let totalXpSpent = 0;

  // --- Step 1: Character Creation (Level 1) ---
  // In WFRP 4e, a starting character receives:
  // 1a. 5 free advances distributed among Level 1 career attributes (0 XP).
  const level1Attributes = careerAttributesByLevel[0];
  if (level1Attributes.length > 0) {
    advances = generateAdv(level1Attributes, STARTING_ATTRIBUTE_ADVANCES, advances, 0, selectRandomFn)[0];
  }

  // 1b. 1 free career talent selected from Level 1 career talents (0 XP).
  let maxRanks = calculateMaxTalentRanks(talents, context.talents, context.baseAtts, advances);
  const level1Talents = resolveAvailableTalents(careerTalentsByLevel[0], talentGroupMap, selectRandomFn);
  allocateCareerTalents(talents, level1Talents, maxRanks, STARTING_CAREER_TALENTS, selectRandomFn);

  // If character stays at Level 1, creation advances and talent cost 0 XP.
  if (context.level === 1) {
    return [talents, advances, 0];
  }

  // --- Step 2: Progress Through Higher Career Levels (Levels 2 to 4) ---
  // 2a. Prerequisite Tier 1 Talent Investment:
  // To qualify for advancement beyond Career Tier 1, the character must acquire an additional
  // talent from Tier 1 (bringing Tier 1 talents to 2). This advance costs XP.
  maxRanks = calculateMaxTalentRanks(talents, context.talents, context.baseAtts, advances);
  const advancementTalents = resolveAvailableTalents(careerTalentsByLevel[0], talentGroupMap, selectRandomFn);
  totalXpSpent += allocateCareerTalents(
    talents,
    advancementTalents,
    maxRanks,
    ADVANCEMENT_PREREQUISITE_TALENTS,
    selectRandomFn,
  );

  let accumulatedCareerAttributes = [...level1Attributes];

  // 2b. Advance through each subsequent career level:
  for (const level of HIGHER_LEVELS.filter((l) => l <= context.level)) {
    const levelIndex = level - 1;

    // Prerequisite Attribute Threshold:
    // To advance to Tier N, all career attributes from previous tiers must have reached at least
    // (level - 1) * 5 advances (e.g. 5 for Level 2, 10 for Level 3, 15 for Level 4).
    const prerequisiteThreshold = (level - 1) * ADVANCES_PER_LEVEL;
    [advances, totalXpSpent] = fillUpAdv(accumulatedCareerAttributes, prerequisiteThreshold, advances, totalXpSpent);

    // Unlock New Level Attributes:
    const newLevelAttributes = careerAttributesByLevel[levelIndex];
    accumulatedCareerAttributes = accumulatedCareerAttributes.concat(newLevelAttributes);

    // Allocate Level Attribute Advances:
    // Distribute 5 advances randomly across all unlocked career attributes, spending XP.
    if (accumulatedCareerAttributes.length > 0) {
      [advances, totalXpSpent] = generateAdv(
        accumulatedCareerAttributes,
        LEVEL_ATTRIBUTE_ADVANCES,
        advances,
        totalXpSpent,
        selectRandomFn,
      );
    }

    // Allocate Level Talents:
    // Recalculate max ranks (attribute advances may have raised caps) and pick 2 talents
    // from this level's career talents, spending XP.
    maxRanks = calculateMaxTalentRanks(talents, context.talents, context.baseAtts, advances);
    const currentLevelTalents = resolveAvailableTalents(
      careerTalentsByLevel[levelIndex],
      talentGroupMap,
      selectRandomFn,
    );
    totalXpSpent += allocateCareerTalents(
      talents,
      currentLevelTalents,
      maxRanks,
      HIGHER_LEVEL_CAREER_TALENTS,
      selectRandomFn,
    );
  }

  return [talents, advances, totalXpSpent];
}
