// 5e character generator (rules pp. 22–44, 191, 196).
// Species and career are chosen; characteristics are always "kept in order".
import { Character } from "../../character.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Career, GenerationLevel, getCareerAttributesByLevel } from "../../../content/career.ts";
import { Skill } from "../../../content/skill.ts";
import { Talent } from "../../../content/talent.ts";
import { GenerationProps5e } from "../shared/generationProps.ts";
import { defaultSource } from "../../../core/source.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { idNumberArrayToRecord } from "../../../../../utils/idNumber.ts";
import { sumAttributes } from "../../../core/attributes.ts";
import { getSpeciesAttributes5e } from "../../rules/rules5e.ts";
import { generateSpeciesTalents } from "../shared/talents.ts";
import { resolveEntityGroups } from "../shared/groups.ts";
import { generateClassItems } from "../shared/trappings.ts";
import { generateStatusAndStanding } from "../shared/status.ts";
import { generateName } from "../shared/name.ts";
import { generateDescription } from "../shared/description.ts";
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
    id: "create",
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
  [character.brass, character.silver, character.gold] = generateCoins5e(status, standing, rollDiceFn);

  character.attributeRolls = generateRolls5e(getCareerAttributesByLevel(career)[0], rollDiceFn, selectRandomFn);

  const classItems = generateClassItems(career, generationProps, rollDiceFn, selectRandomFn);
  character.equippedItems = idNumberArrayToRecord(classItems.equipped);
  character.carriedItems = idNumberArrayToRecord(classItems.carried);

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
