// The 5e species at creation (p. 23): the Species Table, and rolling or choosing the species in guided creation.
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { rollOnTable, RollTable } from "@/services/wh/character/generation/shared/rollTables.ts";
import { rollDice, RollDiceFn } from "@/utils/random.ts";

// 01–90 Human, 91–94 Halfling, 95–98 Dwarf, 99 High Elf, 00 Wood Elf.
export const SPECIES_TABLE_5E: RollTable<SpeciesWithRegion> = [
  { id: SpeciesWithRegion.HumanReikland, minRoll: 1, maxRoll: 91 },
  { id: SpeciesWithRegion.HalflingDefault, minRoll: 91, maxRoll: 95 },
  { id: SpeciesWithRegion.DwarfDefault, minRoll: 95, maxRoll: 99 },
  { id: SpeciesWithRegion.HighElfDefault, minRoll: 99, maxRoll: 100 },
  { id: SpeciesWithRegion.WoodElfDefault, minRoll: 100, maxRoll: 101 },
];

export interface SpeciesRoll5e {
  roll: number;
  species: SpeciesWithRegion;
}

// How the species was settled: one of the rolls kept (its index), or chosen.
export type SpeciesPick5e = { fromRoll: number } | { chosen: SpeciesWithRegion };

export function rollSpecies5e(rollDiceFn: RollDiceFn = rollDice): SpeciesRoll5e {
  const { roll, id } = rollOnTable(SPECIES_TABLE_5E, rollDiceFn);
  return { roll: roll, species: id };
}

export function pickedSpecies5e(rolls: SpeciesRoll5e[], pick: SpeciesPick5e): SpeciesWithRegion {
  return "chosen" in pick ? pick.chosen : rolls[pick.fromRoll].species;
}

// Keeping the first roll gives +1 Fortune: the first roll is kept and no other roll was made.
export function speciesFortuneBonus5e(rolls: SpeciesRoll5e[], pick: SpeciesPick5e): number {
  return "fromRoll" in pick && pick.fromRoll === 0 && rolls.length === 1 ? 1 : 0;
}
