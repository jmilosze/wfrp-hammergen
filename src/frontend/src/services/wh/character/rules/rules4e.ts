// 4e character rules: species characteristics, movement, size and wounds.
import { Attributes, copyAttributes, zeroAttributes } from "../../core/attributes.ts";
import { DEFAULT_SIZE, Size } from "../size.ts";
import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../../core/species.ts";
import type { CharacterRules } from "./rules.ts";

export const speciesAttributes4e = {
  human: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  halfling: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
  dwarf: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
  elf: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
  gnome: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
  ogre: { WS: 20, BS: 10, S: 35, T: 35, I: 0, Ag: 15, Dex: 10, Int: 10, WP: 20, Fel: 10 },
};

export function getSpeciesAttributes4e(species: SpeciesWithRegion): Attributes {
  if (HUMAN_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.human);
  } else if (HALFLING_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.halfling);
  } else if (DWARF_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.dwarf);
  } else if (HIGH_ELF_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.elf);
  } else if (WOOD_ELF_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.elf);
  } else if (GNOME_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.gnome);
  } else if (OGRE_LIST.includes(species)) {
    return copyAttributes(speciesAttributes4e.ogre);
  } else {
    return zeroAttributes();
  }
}

export function getMovement4e(species: SpeciesWithRegion, mods: number): number {
  let movement = 0;
  if (HALFLING_LIST.includes(species) || DWARF_LIST.includes(species) || GNOME_LIST.includes(species)) {
    movement = 3 + mods;
  } else if (HUMAN_LIST.includes(species)) {
    movement = 4 + mods;
  } else if (OGRE_LIST.includes(species)) {
    movement = 6 + mods;
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    movement = 5 + mods;
  }

  return movement <= 0 ? 0 : movement;
}

export function getSize4e(mods: number): number {
  const size = DEFAULT_SIZE + mods;
  return size <= Size.Tiny ? Size.Tiny : size >= Size.Monstrous ? Size.Monstrous : size;
}

export function getWounds4e(size: number, T: number, WP: number, S: number, hardyRanks: number): number {
  const TB = Math.floor(T / 10);
  const WPB = Math.floor(WP / 10);
  const SB = Math.floor(S / 10);

  let base;

  if (size <= Size.Tiny) {
    base = 1;
  } else if (size === Size.Little) {
    base = TB;
  } else if (size === Size.Small) {
    base = 2 * TB + WPB;
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

export const rules4e: CharacterRules = {
  getSpeciesAttributes: getSpeciesAttributes4e,
  getMovement: getMovement4e,
  getSize: getSize4e,
  getWounds: getWounds4e,
};
