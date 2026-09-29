import { Character } from "../character.ts";
import { Skill } from "../skill.ts";
import { Talent } from "../talent.ts";
import { Career, StatusTier } from "../career.ts";
import { GenerationProps } from "../generationProps.ts";
import { Sex } from "../characterUtils.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { fillUpIdNumberRecord, idNumberArrayToRecord } from "../../../utils/idNumber.ts";
import { generateSpeciesSkills } from "./generateSpeciesSkills.ts";
import { generateSpeciesTalents } from "./generateSpeciesTalents.ts";
import { resolveEntityGroups } from "./resolveEntityGroups.ts";
import {
  generateClassItems,
  generateFateAndResilience,
  generateStatusAndStanding,
} from "./characterGenerator.ts";
import generateName from "./generateName.ts";
import generateDescription from "./generateDescription.ts";

export function populateSpeciesSkills(
  character: Character,
  listOfSkills: Skill[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  if (listOfSkills.length === 0) {
    return;
  }
  const skillGroupMap = resolveEntityGroups(listOfSkills);
  const generatedSkills = generateSpeciesSkills(
    generationProps.speciesSkills[character.species],
    skillGroupMap,
    selectRandomFn,
  );
  const newSkills = { ...character.skills };
  fillUpIdNumberRecord(newSkills, generatedSkills);
  character.skills = newSkills;
}

export function populateSpeciesTalents(
  character: Character,
  listOfTalents: Talent[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
  rollDiceFn: RollDiceFn = rollDice,
): void {
  if (listOfTalents.length === 0) {
    return;
  }
  const talentGroupMap = resolveEntityGroups(listOfTalents);
  const generatedTalents = generateSpeciesTalents(
    generationProps.speciesTalents[character.species],
    talentGroupMap,
    generationProps.randomTalents,
    selectRandomFn,
    rollDiceFn,
  );
  const newTalents = { ...character.talents };
  fillUpIdNumberRecord(newTalents, generatedTalents);
  character.talents = newTalents;
  character.hydrateTalentModifiers(listOfTalents);
}

export function populateClassItems(
  character: Character,
  careerList: Career[],
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  const selectedCareer = careerList.find((x) => x.id === character.career.id);
  if (!selectedCareer) {
    return;
  }
  const generatedItems = generateClassItems(
    selectedCareer,
    generationProps,
    rollDiceFn,
    selectRandomFn,
  );
  const newEquipped = { ...character.equippedItems };
  const newCarried = { ...character.carriedItems };
  fillUpIdNumberRecord(newEquipped, idNumberArrayToRecord(generatedItems.equipped));
  fillUpIdNumberRecord(newCarried, idNumberArrayToRecord(generatedItems.carried));
  character.equippedItems = newEquipped;
  character.carriedItems = newCarried;
}

export function populateFateAndResilience(character: Character, rollDiceFn: RollDiceFn = rollDice): void {
  const [fate, resilience] = generateFateAndResilience(character.species, rollDiceFn);
  character.fate = fate;
  character.resilience = resilience;
  character.fortune = fate;
  character.resolve = resilience;
}

export function populateStatusAndStanding(character: Character, careerList: Career[]): void {
  const career = careerList.find((x) => x.id === character.career.id);
  if (!career) {
    character.status = StatusTier.Brass;
    character.standing = 0;
    return;
  }
  const { status, standing } = generateStatusAndStanding(career, character.career.number);
  character.status = status;
  character.standing = standing;
}

export function populateName(character: Character, sex?: Sex): void {
  character.name = generateName(character.species, sex);
}

export function populateDescription(character: Character): void {
  character.description = generateDescription(character.species);
}
