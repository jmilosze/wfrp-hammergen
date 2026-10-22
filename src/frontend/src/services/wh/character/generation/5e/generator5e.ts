import { NEW_ID } from "@/services/wh/core/entity.ts";
// 5e character generator (rules pp. 22–44, 191, 196).
// Species and career are chosen; characteristics are always "kept in order".
import { Character } from "@/services/wh/character/character.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Career, GenerationLevel, getCareerAttributesByLevel } from "@/services/wh/content/career.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { Item } from "@/services/wh/content/item.ts";
import { GenerationProps5e } from "@/services/wh/character/generation/shared/generationProps.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { sumAttributes } from "@/services/wh/core/attributes.ts";
import { getSpeciesAttributes5e } from "@/services/wh/character/rules/rules5e.ts";
import { generateSpeciesTalents } from "@/services/wh/character/generation/shared/talents.ts";
import { resolveEntityGroups } from "@/services/wh/character/generation/shared/groups.ts";
import {
  generateCareerCoins,
  generateCareerItems,
  generateClassItems,
} from "@/services/wh/character/generation/shared/trappings.ts";
import { mergeEntries } from "@/utils/idNumberValue.ts";
import { generateStatusAndStanding } from "@/services/wh/character/generation/shared/status.ts";
import { generateName } from "@/services/wh/character/generation/shared/name.ts";
import { generateDescription } from "@/services/wh/character/generation/shared/description.ts";
import { generateRolls5e } from "./characteristics5e.ts";
import { getFateFortune5e } from "./fate5e.ts";
import { generateCoins5e } from "./wealth5e.ts";
import { generateSpeciesSkills5e } from "./skills5e.ts";
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
  const { species, career, level, generationProps } = context;

  const character = new Character({
    id: NEW_ID,
    edition: "5e",
    source: defaultSource(),
  });

  character.name = generateName(species);
  character.species = species;
  character.career = { id: career.id, number: level };
  for (let i = 1; i < level; ++i) {
    character.careerPath.push({ id: career.id, number: i });
  }
  character.description = generateDescription(species);
  character.notes = "";

  const { fate, fortune } = getFateFortune5e(species);
  character.fate = fate;
  character.fortune = fortune;

  const { status, standing } = generateStatusAndStanding(career, level);
  character.status = status;
  character.standing = standing;
  const startingCoins = generateCoins5e(status, standing, rollDiceFn);
  const careerCoins = generateCareerCoins(career, level, rollDiceFn);
  [character.brass, character.silver, character.gold] = startingCoins.map((x, i) => x + careerCoins[i]);

  character.attributeRolls = generateRolls5e(getCareerAttributesByLevel(career)[0], rollDiceFn, selectRandomFn);

  const classItems = generateClassItems(career, generationProps, rollDiceFn, selectRandomFn);
  const careerItems = generateCareerItems(career, level, context.items, rollDiceFn, selectRandomFn);
  character.carriedItems = mergeEntries([...classItems, ...careerItems.carried]);
  character.storedItems = careerItems.stored;

  const skillGroupMap = resolveEntityGroups(context.skills);
  const talentGroupMap = resolveEntityGroups(context.talents);

  const speciesSkills = generateSpeciesSkills5e(
    generationProps.speciesSkills[species],
    generationProps.speciesLanguages[species],
    skillGroupMap,
    selectRandomFn,
  );
  const speciesTalents = generateSpeciesTalents(
    generationProps.speciesTalents[species],
    talentGroupMap,
    generationProps.randomTalents,
    selectRandomFn,
    rollDiceFn,
  );

  const advances = generateCareerAdvances5e(
    {
      career,
      level,
      baseAttributes: sumAttributes(getSpeciesAttributes5e(species), character.attributeRolls),
      talentList: context.talents,
      skillGroupMap,
      talentGroupMap,
      startingSkills: speciesSkills,
      startingTalents: speciesTalents,
    },
    selectRandomFn,
  );
  character.skills = advances.skills;
  character.talents = advances.talents;
  character.attributeAdvances = advances.attributeAdvances;
  character.careerTicks = CAREER_TICKS_5E[level - 1];
  character.spentExp = advances.spentExp;
  character.currentExp = 0;

  return character;
}
