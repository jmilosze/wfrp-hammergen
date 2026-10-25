// 5e character generator (rules pp. 22–44, 191, 196): level 1 creation (creation5e.ts) with every choice made at
// random, then levels 2–4 bought on top. Species and career are chosen; characteristics are always "kept in order".
import { Character } from "@/services/wh/character/character.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import {
  Career,
  GenerationLevel,
  getCareerAttributesByLevel,
  getCareerSkillsByLevel,
  getCareerTalentsByLevel,
} from "@/services/wh/content/career.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { Item } from "@/services/wh/content/item.ts";
import { GenerationProps5e } from "@/services/wh/character/generation/shared/generationProps.ts";
import { randomOptions, rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { sumAttributes, zeroAttributes } from "@/services/wh/core/attributes.ts";
import { mergeEntries } from "@/utils/idNumberValue.ts";
import { getSpeciesAttributes5e } from "@/services/wh/character/rules/rules5e.ts";
import { resolveEntityGroups } from "@/services/wh/character/generation/shared/groups.ts";
import { chooseConcreteCareerSkills } from "@/services/wh/character/generation/shared/skills.ts";
import {
  calculateMaxTalentRanks,
  generateSpeciesTalents,
  resolveAvailableTalents,
} from "@/services/wh/character/generation/shared/talents.ts";
import {
  generateCareerCoins,
  generateClassItems,
  rollCareerTrappings,
} from "@/services/wh/character/generation/shared/trappings.ts";
import { generateStatusAndStanding } from "@/services/wh/character/generation/shared/status.ts";
import { generateName } from "@/services/wh/character/generation/shared/name.ts";
import { generateDescription } from "@/services/wh/character/generation/shared/description.ts";
import { generateRolls } from "@/services/wh/character/generation/shared/characteristics.ts";
import { buildCharacter5e, CreationChoices5e } from "./creation5e.ts";
import { CREATION_CHARACTERISTIC_POINTS_5E, randomCreationPoints5e } from "./characteristics5e.ts";
import { generateSpeciesSkills5e, randomCareerSkillAdvances5e } from "./skills5e.ts";
import { randomCareerTalent5e } from "./talents5e.ts";
import { generateCoins5e } from "./wealth5e.ts";
import { CAREER_TICKS_5E, generateCareerAdvances5e } from "./advancement5e.ts";

export interface CharacterGeneration5eContext {
  species: SpeciesWithRegion;
  career: Career;
  level: GenerationLevel;
  skills: Skill[];
  talents: Talent[];
  items: Item[];
  generationProps: GenerationProps5e;
}

export interface CharacterGeneration5eRandomFns {
  rollDiceFn?: RollDiceFn;
  selectRandomFn?: SelectRandomFn;
}

export function generateCharacter5e(
  context: CharacterGeneration5eContext,
  randomFns: CharacterGeneration5eRandomFns = {},
): Character {
  const rollDiceFn = randomFns.rollDiceFn ?? rollDice;
  const selectRandomFn = randomFns.selectRandomFn ?? selectRandom;
  const { species, career, level } = context;

  // Group skills and talents (e.g. Lore (Any)) are settled once for all levels, so higher levels build on the same
  // specialisations as level 1.
  const careerSkillsByLevel = chooseConcreteCareerSkills(
    getCareerSkillsByLevel(career),
    resolveEntityGroups(context.skills),
    selectRandomFn,
  );
  const talentGroupMap = resolveEntityGroups(context.talents);
  const careerTalentsByLevel = getCareerTalentsByLevel(career).map((x) =>
    resolveAvailableTalents(x, talentGroupMap, selectRandomFn),
  );

  const choices = randomCreationChoices5e(
    context,
    careerSkillsByLevel[0],
    careerTalentsByLevel[0],
    rollDiceFn,
    selectRandomFn,
  );
  const character = buildCharacter5e(choices);
  if (level === 1) {
    return character;
  }

  character.career = { id: career.id, number: level };
  for (let i = 1; i < level; ++i) {
    character.careerPath.push({ id: career.id, number: i });
  }

  // Starting wealth goes by the status of the generated level, plus the money of every level up to it.
  const { status, standing } = generateStatusAndStanding(career, level);
  character.status = status;
  character.standing = standing;
  const startingCoins = generateCoins5e(status, standing, rollDiceFn);
  const careerCoins = generateCareerCoins(career, level, rollDiceFn);
  [character.brass, character.silver, character.gold] = startingCoins.map((x, i) => x + careerCoins[i]);

  const higherTrappings = [career.level2, career.level3, career.level4].slice(0, level - 1).flatMap((x) => x.trappings);
  const higherItems = rollCareerTrappings(
    higherTrappings,
    randomOptions(higherTrappings, selectRandomFn),
    context.items,
    rollDiceFn,
  );
  character.carriedItems = mergeEntries([...character.carriedItems, ...higherItems.carried]);
  character.storedItems = mergeEntries([...character.storedItems, ...higherItems.stored]);

  const advances = generateCareerAdvances5e(
    {
      career,
      level,
      baseAttributes: sumAttributes(getSpeciesAttributes5e(species), character.attributeRolls),
      talentList: context.talents,
      careerSkillsByLevel,
      careerTalentsByLevel,
      startingSkills: character.skills,
      startingTalents: character.talents,
    },
    selectRandomFn,
  );
  character.skills = advances.skills;
  character.talents = advances.talents;
  character.attributeAdvances = advances.attributeAdvances;
  character.careerTicks = CAREER_TICKS_5E[level - 1];
  character.spentExp = advances.spentExp;

  return character;
}

// Every level 1 choice at random: characteristics kept in order, no bonuses (species and career are chosen, not
// rolled). level1Skills and level1Talents are the career's level 1 lists with their groups settled.
function randomCreationChoices5e(
  context: CharacterGeneration5eContext,
  level1Skills: string[],
  level1Talents: string[],
  rollDiceFn: RollDiceFn,
  selectRandomFn: SelectRandomFn,
): CreationChoices5e {
  const { species, career, generationProps } = context;

  const attributeRolls = generateRolls(rollDiceFn);
  const attributePoints = randomCreationPoints5e(
    getCareerAttributesByLevel(career)[0],
    CREATION_CHARACTERISTIC_POINTS_5E.inOrder,
    selectRandomFn,
  );

  const speciesSkills = generateSpeciesSkills5e(
    generationProps.speciesSkills[species],
    generationProps.speciesLanguages[species],
    resolveEntityGroups(context.skills),
    selectRandomFn,
  );
  const speciesTalents = generateSpeciesTalents(
    generationProps.speciesTalents[species],
    resolveEntityGroups(context.talents),
    generationProps.randomTalents,
    selectRandomFn,
    rollDiceFn,
  );
  const baseAttributes = sumAttributes(getSpeciesAttributes5e(species), attributeRolls, attributePoints);
  const maxRanks = calculateMaxTalentRanks(speciesTalents, context.talents, baseAttributes, zeroAttributes());

  const level1Trappings = career.level1.trappings;
  const { status, standing } = generateStatusAndStanding(career, 1);
  const startingCoins = generateCoins5e(status, standing, rollDiceFn);
  const careerCoins = generateCareerCoins(career, 1, rollDiceFn);

  return {
    species: species,
    career: career,
    name: generateName(species),
    description: generateDescription(species),
    notes: "",
    attributeRolls: attributeRolls,
    attributePoints: attributePoints,
    speciesSkills: speciesSkills,
    careerSkillAdvances: randomCareerSkillAdvances5e(speciesSkills, level1Skills, selectRandomFn),
    speciesTalents: Object.keys(speciesTalents),
    careerTalent: randomCareerTalent5e(level1Talents, speciesTalents, maxRanks, selectRandomFn),
    classTrappings: generateClassItems(career, generationProps, rollDiceFn, selectRandomFn),
    careerTrappings: rollCareerTrappings(
      level1Trappings,
      randomOptions(level1Trappings, selectRandomFn),
      context.items,
      rollDiceFn,
    ),
    bonusTicks: 0,
    coins: [startingCoins[0] + careerCoins[0], startingCoins[1] + careerCoins[1], startingCoins[2] + careerCoins[2]],
    bonusFortune: 0,
    bonusFate: 0,
  };
}
