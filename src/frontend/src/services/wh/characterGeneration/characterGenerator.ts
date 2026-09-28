import { Career, isLevel, StatusStanding, StatusTier } from "../career.ts";
import { Sex, SpeciesWithRegion } from "../characterUtils.ts";
import { Skill } from "../skill.ts";
import { Talent } from "../talent.ts";
import { Character } from "../character.ts";
import { GenerationProps } from "../generationProps.ts";
import {
  generateCharacter,
  generateClassItems,
  generateFateAndResilience,
} from "./generateCharacter.ts";
import generateName from "./generateName.ts";
import generateDescription from "./generateDescription.ts";
import { generateRolls } from "./generateAttributes.ts";
import { generateSpeciesSkills, resolveSkillGroups } from "./generateSkills.ts";
import { generateSpeciesTalents } from "./generateSpeciesTalents.ts";
import { getTalentGroups } from "./generateTalents.ts";
import { rollDice, RollDiceFn, rollInTable, RollInTableFn, selectRandom, SelectRandomFn } from "../../../utils/random.ts";
import { fillUpIdNumberRecord, IdNumber, idNumberArrayToRecord } from "../../../utils/idNumber.ts";

export {
  generateCharacter,
  generateClassItems,
  generateFateAndResilience,
  generateName,
  generateDescription,
  generateRolls,
};

export function generateSpeciesSkillsForSpecies(
  species: SpeciesWithRegion,
  listOfSkills: Skill[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  if (!(species in generationProps.speciesSkills) || listOfSkills.length === 0) {
    return {};
  }
  const speciesSkills = generationProps.speciesSkills[species];
  const resolvedSkillGroups = resolveSkillGroups(listOfSkills);
  return generateSpeciesSkills(speciesSkills, resolvedSkillGroups, selectRandomFn);
}

export function applySpeciesSkills(
  character: Character,
  listOfSkills: Skill[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  const generatedSkills = generateSpeciesSkillsForSpecies(
    character.species,
    listOfSkills,
    generationProps,
    selectRandomFn,
  );
  const newSkills = { ...character.skills };
  fillUpIdNumberRecord(newSkills, generatedSkills);
  character.skills = newSkills;
}

export function generateSpeciesTalentsForSpecies(
  species: SpeciesWithRegion,
  listOfTalents: Talent[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
  rollInTableFn: RollInTableFn = rollInTable,
): Record<string, number> {
  if (!(species in generationProps.speciesTalents) || listOfTalents.length === 0) {
    return {};
  }
  const speciesTalents = generationProps.speciesTalents[species];
  const resolvedTalentGroups = getTalentGroups(listOfTalents);
  const generatedTalents = generateSpeciesTalents(
    speciesTalents,
    resolvedTalentGroups,
    generationProps.randomTalents,
    selectRandomFn,
    rollInTableFn,
  );
  return idNumberArrayToRecord(generatedTalents);
}

export function applySpeciesTalents(
  character: Character,
  listOfTalents: Talent[],
  generationProps: GenerationProps,
  selectRandomFn: SelectRandomFn = selectRandom,
  rollInTableFn: RollInTableFn = rollInTable,
): void {
  const generatedTalents = generateSpeciesTalentsForSpecies(
    character.species,
    listOfTalents,
    generationProps,
    selectRandomFn,
    rollInTableFn,
  );
  const newTalents = { ...character.talents };
  fillUpIdNumberRecord(newTalents, generatedTalents);
  character.talents = newTalents;
  character.hydrateTalentModifiers(listOfTalents);
}

export function generateClassItemsForCareer(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): { equipped: IdNumber[]; carried: IdNumber[] } {
  if (generationProps.classItems.length === 0 || !(career.careerClass in generationProps.classItems)) {
    return { equipped: [], carried: [] };
  }
  const classItems = generationProps.classItems[career.careerClass];
  return generateClassItems(classItems, rollDiceFn, selectRandomFn);
}

export function applyClassItems(
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
  const generatedItems = generateClassItemsForCareer(
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

export function applyFateAndResilience(character: Character, rollDiceFn: RollDiceFn = rollDice): void {
  const [fate, resilience] = generateFateAndResilience(character.species, rollDiceFn);
  character.fate = fate;
  character.resilience = resilience;
  character.fortune = fate;
  character.resolve = resilience;
}

export function generateStatusAndStanding(
  career: Career,
  level: number,
): { status: StatusTier; standing: StatusStanding } {
  if (isLevel(level)) {
    const careerWithLevel = career.getLevel(level);
    return { status: careerWithLevel.status, standing: careerWithLevel.standing };
  }
  return { status: StatusTier.Brass, standing: 0 as StatusStanding };
}

export function applyStatusAndStanding(character: Character, careerList: Career[]): void {
  const career = careerList.find((x) => x.id === character.career.id);
  if (!career) {
    character.status = StatusTier.Brass;
    character.standing = 0 as StatusStanding;
    return;
  }
  const { status, standing } = generateStatusAndStanding(career, character.career.number);
  character.status = status;
  character.standing = standing;
}

export function applyName(character: Character, sex?: Sex): void {
  character.name = generateName(character.species, sex);
}

export function applyDescription(character: Character): void {
  character.description = generateDescription(character.species);
}
