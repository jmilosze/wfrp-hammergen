// 4e character generator: species and career are chosen; level 1 creation follows the 4e rulebook, higher
// levels buy the advances needed to move up each career level.
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Career, GenerationLevel } from "../../../content/career.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { generateFateAndResilience } from "./fate4e.ts";
import { Talent } from "../../../content/talent.ts";
import { Skill } from "../../../content/skill.ts";
import { Character } from "../../character.ts";
import { generateName } from "../shared/name.ts";
import { generateDescription } from "../shared/description.ts";
import { generateRolls } from "../shared/characteristics.ts";
import { generateClassItems } from "../shared/trappings.ts";
import { generateStatusAndStanding } from "../shared/status.ts";
import { generateSpeciesTalents } from "../shared/talents.ts";
import { resolveEntityGroups } from "../shared/groups.ts";
import { generateCareerSkills4e, generateSpeciesSkills4e } from "./skills4e.ts";
import { generateCareerTalents4e } from "./talents4e.ts";
import { sumAttributes } from "../../../core/attributes.ts";
import { getSpeciesAttributes4e } from "../../rules/rules4e.ts";
import { idNumberArrayToRecord } from "../../../../../utils/idNumber.ts";
import { GenerationProps } from "../shared/generationProps.ts";
import { defaultSource } from "../../../core/source.ts";
import { generateCoins4e } from "./wealth4e.ts";

export interface CharacterGeneration4eContext {
  species: SpeciesWithRegion;
  career: Career;
  level: GenerationLevel;
  skills: Skill[];
  talents: Talent[];
  generationProps: GenerationProps;
}

export interface CharacterGeneration4eRandomFns {
  rollDiceFn?: RollDiceFn;
  selectRandomFn?: SelectRandomFn;
}

export function generateCharacter4e(
  context: CharacterGeneration4eContext,
  randomFns: CharacterGeneration4eRandomFns = {},
): Character {
  const rollDiceFn = randomFns.rollDiceFn ?? rollDice;
  const selectRandomFn = randomFns.selectRandomFn ?? selectRandom;

  const character = new Character({
    id: "create",
    edition: "4e",
    source: defaultSource(),
  });

  const exp = 50; // From random characteristics

  const classItems = generateClassItems(context.career, context.generationProps, rollDiceFn, selectRandomFn);

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
  [character.brass, character.silver, character.gold] = generateCoins4e(
    character.status,
    character.standing,
    rollDiceFn,
  );

  character.attributeRolls = generateRolls(rollDiceFn);
  character.equippedItems = idNumberArrayToRecord(classItems.equipped);
  character.carriedItems = idNumberArrayToRecord(classItems.carried);

  const skillGroupMap = resolveEntityGroups(context.skills);

  const speciesSkills = generateSpeciesSkills4e(
    context.generationProps.speciesSkills[context.species],
    skillGroupMap,
    selectRandomFn,
  );

  const [skills, skillExpSpent] = generateCareerSkills4e(
    {
      startingSkills: speciesSkills,
      career: context.career,
      skillGroupMap,
      level: context.level,
    },
    selectRandomFn,
  );
  character.skills = skills;

  const baseAttributes = sumAttributes(getSpeciesAttributes4e(context.species), character.attributeRolls);

  const talentGroupMap = resolveEntityGroups(context.talents);

  const speciesTalents = generateSpeciesTalents(
    context.generationProps.speciesTalents[context.species],
    talentGroupMap,
    context.generationProps.randomTalents,
    selectRandomFn,
    rollDiceFn,
  );

  const [talents, attributeAdvances, talentAndAttExpSpent] = generateCareerTalents4e(
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
  character.talents = talents;
  character.attributeAdvances = attributeAdvances;

  const totalExSpent = skillExpSpent + talentAndAttExpSpent + 100 * (context.level - 1);
  character.currentExp = exp - totalExSpent > 0 ? exp - totalExSpent : 0;
  character.spentExp = totalExSpent;
  return character;
}
