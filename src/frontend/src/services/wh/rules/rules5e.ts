// 5e character rules: species characteristics (pp. 26–35), movement (p. 40), size (five steps, p. 360) and
// wounds by size (p. 361).
import { Attributes, copyAttributes, zeroAttributes } from "../attributes.ts";
import {
  DEFAULT_SIZE,
  DWARF_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  Size,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../characterUtils.ts";
import type { CharacterRules } from "./rules.ts";

// The five 5e species (R12); a 5e Human uses the Human (Reikland) code.
export const SPECIES_5E: SpeciesWithRegion[] = [
  SpeciesWithRegion.HumanReikland,
  SpeciesWithRegion.HalflingDefault,
  SpeciesWithRegion.DwarfDefault,
  SpeciesWithRegion.HighElfDefault,
  SpeciesWithRegion.WoodElfDefault,
];

export const speciesAttributes5e = {
  human: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  halfling: { WS: 10, BS: 30, S: 10, T: 10, I: 40, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
  dwarf: { WS: 30, BS: 20, S: 20, T: 30, I: 10, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
  elf: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
};

export function getSpeciesAttributes5e(species: SpeciesWithRegion): Attributes {
  if (HUMAN_LIST.includes(species)) {
    return copyAttributes(speciesAttributes5e.human);
  } else if (HALFLING_LIST.includes(species)) {
    return copyAttributes(speciesAttributes5e.halfling);
  } else if (DWARF_LIST.includes(species)) {
    return copyAttributes(speciesAttributes5e.dwarf);
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    return copyAttributes(speciesAttributes5e.elf);
  } else {
    return zeroAttributes();
  }
}

export function getMovement5e(species: SpeciesWithRegion, mods: number): number {
  let movement = 0;
  if (HALFLING_LIST.includes(species) || DWARF_LIST.includes(species)) {
    movement = 3 + mods;
  } else if (HUMAN_LIST.includes(species)) {
    movement = 4 + mods;
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    movement = 5 + mods;
  }

  return movement <= 0 ? 0 : movement;
}

// 5e has five size steps, Small to Monstrous.
export function getSize5e(mods: number): number {
  const size = DEFAULT_SIZE + mods;
  return size <= Size.Small ? Size.Small : size >= Size.Monstrous ? Size.Monstrous : size;
}

export function getWounds5e(size: number, T: number, WP: number, S: number, hardyRanks: number): number {
  const TB = Math.floor(T / 10);
  const WPB = Math.floor(WP / 10);
  const SB = Math.floor(S / 10);

  let base;

  if (size <= Size.Small) {
    base = 2 * TB;
  } else if (size === Size.Average) {
    base = SB + 2 * TB + WPB;
  } else if (size === Size.Large) {
    base = (SB + 2 * TB + WPB) * 2;
  } else if (size === Size.Enormous) {
    base = (SB + 2 * TB + WPB) * 4;
  } else {
    base = (SB + 2 * TB + WPB) * 8;
  }

  return base + TB * hardyRanks;
}

export const rules5e: CharacterRules = {
  getSpeciesAttributes: getSpeciesAttributes5e,
  getMovement: getMovement5e,
  getSize: getSize5e,
  getWounds: getWounds5e,
};
