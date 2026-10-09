// Talents shared by both editions: species and Random Talents, career talent picks and maximum ranks.
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn, selectWeighted } from "../../../../../utils/random.ts";
import { EntityGroupMap, GroupPicker, resolveEntityGroups } from "./groups.ts";
import { Talent } from "../../../content/talent.ts";
import { GenerationProps } from "./generationProps.ts";
import {
  Attributes,
  copyAttributes,
  multiplyAttributes,
  sumAttributes,
  zeroAttributes,
} from "../../../core/attributes.ts";
import { fillUpIdNumberRecord } from "../../../../../utils/idNumber.ts";
import { Character } from "../../character.ts";

const RANDOM_TALENTS_ROLL = 100;

export type RandomTalents = Array<{
  id: string;
  minRoll: number;
  maxRoll: number;
}>;

export type SpeciesTalents = string[];

export function generateSpeciesTalents(
  speciesTalents: SpeciesTalents | undefined,
  groupTalents: EntityGroupMap,
  randomTalents: RandomTalents,
  selectRandomFn: SelectRandomFn = selectRandom,
  rollDiceFn: RollDiceFn = rollDice,
): Record<string, number> {
  if (speciesTalents === undefined) {
    return {};
  }

  if (!randomTalentsValid(randomTalents)) {
    throw new Error("invalid random talents table");
  }

  if (!speciesTalentsValid(speciesTalents, groupTalents)) {
    throw new Error("invalid species talents object");
  }

  const groupPicker = new GroupPicker(groupTalents, selectRandomFn);
  const randomTalentPicker = new RandomTalentPicker(randomTalents, rollDiceFn, groupPicker);

  // Settle every "A,B" choice first, then add named talents before group and random picks.
  // Group and random picks skip talents already taken, so they can never take a talent
  // the species gets by name, whatever order the species talents are listed in.
  const chosenTalents = speciesTalents.map((speciesTalent) => chooseTalent(speciesTalent, selectRandomFn));
  const talents = chosenTalents.filter((talent) => talent !== "random" && !groupPicker.isGroup(talent));

  for (const group of chosenTalents.filter((talent) => groupPicker.isGroup(talent))) {
    const pickedTalent = groupPicker.pick(group, talents);
    if (pickedTalent !== null) {
      talents.push(pickedTalent);
    }
  }

  const randomTalentCount = chosenTalents.filter((talent) => talent === "random").length;
  for (let i = 0; i < randomTalentCount; ++i) {
    const pickedTalent = randomTalentPicker.pickFromRandom(talents);
    if (pickedTalent !== null) {
      talents.push(pickedTalent);
    }
  }

  const generatedTalents: Record<string, number> = {};
  for (const talent of talents) {
    generatedTalents[talent] = 1;
  }
  return generatedTalents;
}

function chooseTalent(speciesTalent: string, selectRandomFn: SelectRandomFn): string {
  const options = speciesTalent.split(",").map((s) => s.trim());
  return options.length === 1 ? options[0] : selectRandomFn(options);
}

function randomTalentsValid(randomTalents: RandomTalents): boolean {
  if (randomTalents.length === 0) {
    return true;
  }

  const uniqueTalents = new Set(randomTalents.map((x) => x.id));
  if (uniqueTalents.size !== randomTalents.length) {
    return false;
  }

  const sortedRanges = randomTalents.map((x) => [x.minRoll, x.maxRoll]);
  sortedRanges.sort((a, b) => a[0] - b[0]);

  let prevMax = 1;
  for (let i = 0; i < sortedRanges.length; i++) {
    const [start, end] = sortedRanges[i];
    if (start !== prevMax || end > RANDOM_TALENTS_ROLL + 1) {
      return false;
    }
    prevMax = end;
  }
  return prevMax === RANDOM_TALENTS_ROLL + 1;
}

function speciesTalentsValid(speciesTalents: string[], talentGroups: EntityGroupMap): boolean {
  let allTalents: string[] = [];
  for (const talents of speciesTalents) {
    for (const talent of talents.split(",").map((s) => s.trim())) {
      allTalents.push(talent);
    }
  }

  allTalents = allTalents.filter((x) => x !== "random" && !(x in talentGroups));

  return new Set(allTalents).size === allTalents.length;
}

class RandomTalentPicker {
  private remainingTalents: Array<{ id: string; weight: number }>;
  private readonly rollDiceFn: RollDiceFn;
  private readonly groupPicker: GroupPicker;

  constructor(randomTalents: RandomTalents, rollDiceFn: RollDiceFn, groupPicker: GroupPicker) {
    this.remainingTalents = randomTalents.map((t) => ({ id: t.id, weight: t.maxRoll - t.minRoll }));
    this.rollDiceFn = rollDiceFn;
    this.groupPicker = groupPicker;
  }

  pickFromRandom(selectedTalents: string[]): string | null {
    while (this.remainingTalents.length > 0) {
      const rolled = selectWeighted(this.remainingTalents, (t) => t.weight, this.rollDiceFn);
      this.remainingTalents = this.remainingTalents.filter((t) => t.id !== rolled.id);

      if (this.groupPicker.isGroup(rolled.id)) {
        const pickedTalent = this.groupPicker.pick(rolled.id, selectedTalents);
        if (pickedTalent !== null) {
          return pickedTalent;
        }
      } else if (!selectedTalents.includes(rolled.id)) {
        return rolled.id;
      }
    }
    return null;
  }
}

/**
 * Sums all attribute modifiers granted by the character's currently acquired talents.
 * Certain talents (e.g. Savvy, Suave, Very Resilient) grant flat attribute bonuses.
 */
function calculateTalentAttributeModifiers(acquiredTalents: Record<string, number>, allTalents: Talent[]): Attributes {
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
