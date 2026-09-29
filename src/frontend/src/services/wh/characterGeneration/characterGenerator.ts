import { SpeciesWithRegion } from "../characterUtils.ts";
import { Career, isLevel, StatusStanding, StatusTier } from "../career.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { getSpeciesFateResilience, SpeciesFateResilience } from "./data/species.ts";
import { Talent } from "../talent.ts";
import { Skill } from "../skill.ts";
import generateName from "./generateName.ts";
import { Character } from "../character.ts";
import generateDescription from "./generateDescription.ts";
import { generateRolls } from "./generateAttributes.ts";
import { generateCareerSkills } from "./generateCareerSkills.ts";
import { generateSpeciesSkills } from "./generateSpeciesSkills.ts";
import { getAttributes, sumAttributes } from "../attributes.ts";
import { generateCareerTalents } from "./generateCareerTalents.ts";
import { generateSpeciesTalents } from "./generateSpeciesTalents.ts";
import { resolveEntityGroups } from "./resolveEntityGroups.ts";
import { IdNumber, idNumberArrayToRecord } from "../../../utils/idNumber.ts";
import { GenerationProps } from "../generationProps.ts";
import { defaultSource } from "../source.ts";
import { parseQuantityOrRoll, selectIdFromCandidates } from "./generationUtils.ts";

export { generateName, generateDescription, generateRolls, getSpeciesFateResilience, parseQuantityOrRoll, selectIdFromCandidates };
export type { SpeciesFateResilience };

export interface CharacterGenerationContext {
  species: SpeciesWithRegion;
  career: Career;
  level: 1 | 2 | 3 | 4;
  skills: Skill[];
  talents: Talent[];
  generationProps: GenerationProps;
}

export interface CharacterGenerationRandomFns {
  rollDiceFn?: RollDiceFn;
  selectRandomFn?: SelectRandomFn;
}

export function generateStatusAndStanding(
  career: Career,
  level: number,
): { status: StatusTier; standing: StatusStanding } {
  if (isLevel(level)) {
    const careerWithLevel = career.getLevel(level);
    return { status: careerWithLevel.status, standing: careerWithLevel.standing };
  }
  return { status: StatusTier.Brass, standing: 0 };
}

export function generateClassItems(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): { equipped: IdNumber[]; carried: IdNumber[] } {
  if (generationProps.classItems.length === 0 || !(career.careerClass in generationProps.classItems)) {
    return { equipped: [], carried: [] };
  }
  const classItems = generationProps.classItems[career.careerClass];
  const items: { equipped: IdNumber[]; carried: IdNumber[] } = { equipped: [], carried: [] };

  for (const [itemIds, itemNumber] of Object.entries(classItems.equipped)) {
    const id = selectIdFromCandidates(itemIds, selectRandomFn);
    const number = parseQuantityOrRoll(itemNumber, rollDiceFn);
    items.equipped.push({ id, number });
  }

  for (const [itemIds, itemNumber] of Object.entries(classItems.carried)) {
    const id = selectIdFromCandidates(itemIds, selectRandomFn);
    const number = parseQuantityOrRoll(itemNumber, rollDiceFn);
    items.carried.push({ id, number });
  }

  return items;
}

export function generateFateAndResilience(species: SpeciesWithRegion, rollDiceFn: RollDiceFn): [number, number] {
  const base = getSpeciesFateResilience(species);
  let fate = base.fate;
  let resilience = base.resilience;

  for (let pt = 0; pt < base.extra; pt++) {
    const roll = rollDiceFn(2, 1);
    fate += roll % 2;
    resilience += Math.floor(roll / 2);
  }
  return [fate, resilience];
}

export function generateCoins(
  status: StatusTier,
  standing: StatusStanding,
  rollDiceFn: RollDiceFn,
): [number, number, number] {
  if (status === StatusTier.Brass) {
    return [rollDiceFn(10, 2 * standing), 0, 0];
  } else if (status === StatusTier.Silver) {
    return [0, rollDiceFn(10, standing), 0];
  } else {
    return [0, 0, standing];
  }
}

export function generateCharacter(
  context: CharacterGenerationContext,
  randomFns: CharacterGenerationRandomFns = {},
): Character {
  const rollDiceFn = randomFns.rollDiceFn ?? rollDice;
  const selectRandomFn = randomFns.selectRandomFn ?? selectRandom;

  const character = new Character({
    id: "create",
    source: defaultSource(),
  });

  const exp = 50; // From random characteristics

  const classItems = generateClassItems(
    context.career,
    context.generationProps,
    rollDiceFn,
    selectRandomFn,
  );

  character.name = generateName(context.species);
  character.species = context.species;
  character.career = { id: context.career.id, number: context.level };
  for (let i = 1; i < context.level; ++i) {
    character.careerPath.push({ id: context.career.id, number: i });
  }
  character.description = generateDescription(context.species);
  character.notes = "";
  [character.fate, character.resilience] = generateFateAndResilience(context.species, rollDiceFn);
  character.fortune = character.fate;
  character.resolve = character.resilience;

  const { status, standing } = generateStatusAndStanding(context.career, context.level);
  character.status = status;
  character.standing = standing;
  [character.brass, character.silver, character.gold] = generateCoins(character.status, character.standing, rollDiceFn);

  character.attributeRolls = generateRolls(rollDiceFn);
  character.equippedItems = idNumberArrayToRecord(classItems.equipped);
  character.carriedItems = idNumberArrayToRecord(classItems.carried);

  const skillGroupMap = resolveEntityGroups(context.skills);

  const speciesSkills = generateSpeciesSkills(
    context.generationProps.speciesSkills[context.species],
    skillGroupMap,
    selectRandomFn,
  );

  let skillExpSpent = 0;
  [character.skills, skillExpSpent] = generateCareerSkills(
    {
      startingSkills: speciesSkills,
      career: context.career,
      skillGroupMap,
      level: context.level,
    },
    selectRandomFn,
  );

  const baseAttributes = sumAttributes(getAttributes(context.species), character.attributeRolls);

  const talentGroupMap = resolveEntityGroups(context.talents);

  const speciesTalents = generateSpeciesTalents(
    context.generationProps.speciesTalents[context.species],
    talentGroupMap,
    context.generationProps.randomTalents,
    selectRandomFn,
    rollDiceFn,
  );

  let talentAndAttExpSpent;
  [character.talents, character.attributeAdvances, talentAndAttExpSpent] = generateCareerTalents(
    {
      startingTalents: speciesTalents,
      career: context.career,
      baseAtts: baseAttributes,
      talents: context.talents,
      talentGroupMap,
      level: context.level,
    },
    selectRandomFn,
  );

  const totalExSpent = skillExpSpent + talentAndAttExpSpent + 100 * (context.level - 1);
  character.currentExp = exp - totalExSpent > 0 ? exp - totalExSpent : 0;
  character.spentExp = totalExSpent;
  return character;
}

