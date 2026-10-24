// Talents shared by both editions: species and Random Talents, career talent picks and maximum ranks.
import { randomOptions, rollDice, RollDiceFn, selectRandom, SelectRandomFn, selectWeighted } from "@/utils/random.ts";
import { availableMembers, EntityGroupMap, GroupPicker, resolveEntityGroups } from "./groups.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { GenerationProps } from "./generationProps.ts";
import { RollTable, rollTableValid } from "./rollTables.ts";
import {
  Attributes,
  copyAttributes,
  multiplyAttributes,
  sumAttributes,
  zeroAttributes,
} from "@/services/wh/core/attributes.ts";
import { fillUpIdNumberRecord } from "@/utils/idNumber.ts";
import { Character } from "@/services/wh/character/character.ts";

export type RandomTalents = RollTable;

export type SpeciesTalents = string[];

// The option of a species talent entry that means a roll on the Random Talents table.
export const RANDOM_TALENT = "random";

// speciesTalentEntries splits the species talents into entries: one option, or several the player chooses from
// ("A,B"). An option is a talent, a group (one of its members) or RANDOM_TALENT.
export function speciesTalentEntries(speciesTalents: SpeciesTalents): { options: string[] }[] {
  return speciesTalents.map((entry) => ({ options: entry.split(",").map((s) => s.trim()) }));
}

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

  if (!rollTableValid(randomTalents)) {
    throw new Error("invalid random talents table");
  }

  if (!speciesTalentsValid(speciesTalents, groupTalents)) {
    throw new Error("invalid species talents object");
  }

  const groupPicker = new GroupPicker(groupTalents, selectRandomFn);

  // Settle every "A,B" choice first, then add named talents before group and random picks.
  // Group and random picks skip talents already taken, so they can never take a talent
  // the species gets by name, whatever order the species talents are listed in.
  const entries = speciesTalentEntries(speciesTalents);
  const chosenTalents = randomOptions(entries, selectRandomFn).map((option, index) => entries[index].options[option]);
  const talents = chosenTalents.filter((talent) => talent !== RANDOM_TALENT && !groupPicker.isGroup(talent));

  for (const group of chosenTalents.filter((talent) => groupPicker.isGroup(talent))) {
    const pickedTalent = groupPicker.pick(group, talents);
    if (pickedTalent !== null) {
      talents.push(pickedTalent);
    }
  }

  const randomTalentCount = chosenTalents.filter((talent) => talent === RANDOM_TALENT).length;
  const rolledTalents: string[] = [];
  for (let i = 0; i < randomTalentCount; ++i) {
    const pickedTalent = rollRandomTalent(
      randomTalents,
      talents,
      rolledTalents,
      groupTalents,
      rollDiceFn,
      selectRandomFn,
    );
    if (pickedTalent !== null) {
      talents.push(pickedTalent);
      rolledTalents.push(pickedTalent);
    }
  }

  const generatedTalents: Record<string, number> = {};
  for (const talent of talents) {
    generatedTalents[talent] = 1;
  }
  return generatedTalents;
}

// rollRandomTalent rolls once on the Random Talents table, given the talents the character has (taken) and those its
// earlier Random Talent rolls gave (rolled). A talent already taken is rolled again, so only the rest of the table is
// rolled on; a group row gives one of its members not taken yet, and is rolled at most once (no second Artistic). Null
// when nothing is left.
export function rollRandomTalent(
  randomTalents: RandomTalents,
  taken: string[],
  rolled: string[],
  groupTalents: EntityGroupMap,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): string | null {
  const remaining = randomTalents
    .filter((x) => !(x.id in groupTalents && groupTalents[x.id].some((member) => rolled.includes(member))))
    .map((x) => ({
      options:
        x.id in groupTalents ? availableMembers(groupTalents, x.id, taken) : [x.id].filter((id) => !taken.includes(id)),
      weight: x.maxRoll - x.minRoll,
    }))
    .filter((x) => x.options.length > 0);
  if (remaining.length === 0) {
    return null;
  }
  const row = selectWeighted(remaining, (x) => x.weight, rollDiceFn);
  return row.options.length === 1 ? row.options[0] : selectRandomFn(row.options);
}

function speciesTalentsValid(speciesTalents: string[], talentGroups: EntityGroupMap): boolean {
  let allTalents: string[] = [];
  for (const talents of speciesTalents) {
    for (const talent of talents.split(",").map((s) => s.trim())) {
      allTalents.push(talent);
    }
  }

  allTalents = allTalents.filter((x) => x !== RANDOM_TALENT && !(x in talentGroups));

  return new Set(allTalents).size === allTalents.length;
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
