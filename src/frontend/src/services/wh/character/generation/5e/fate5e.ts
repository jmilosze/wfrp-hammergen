// 5e Fate and Fortune of each species.
import { Character } from "../../character.ts";
import {
  DWARF_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../../../core/species.ts";

export interface FateFortune5e {
  fate: number;
  fortune: number;
}

// Fate and Fortune of each species (pp. 26–35).
export function getFateFortune5e(species: SpeciesWithRegion): FateFortune5e {
  if (HUMAN_LIST.includes(species)) {
    return { fate: 4, fortune: 3 };
  } else if (DWARF_LIST.includes(species)) {
    return { fate: 2, fortune: 2 };
  } else if (HALFLING_LIST.includes(species)) {
    return { fate: 2, fortune: 3 };
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    return { fate: 1, fortune: 2 };
  }
  throw new Error(`species ${species} is not a 5e species`);
}

export function populateFateFortune5e(character: Character): void {
  const { fate, fortune } = getFateFortune5e(character.species);
  character.fate = fate;
  character.fortune = fortune;
}
