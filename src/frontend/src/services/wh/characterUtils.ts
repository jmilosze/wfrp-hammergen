import { Species } from "./career.ts";

export enum SpeciesWithRegion {
  HumanDefault = "0000",
  HumanReikland = "0001", // WFRP p. 25
  HumanAltdorfSouthBank = "0002", // Archives III p. 83
  HumanAltdorfEastend = "0003", // Archives III p. 83
  HumanAltdorfHexxerbezrik = "0004", // Archives III p. 84
  HumanAltdorfDocklands = "0005", // Archives III p. 84
  HumanMiddenheim = "0006", // Middenheim p. 151
  HumanMiddenland = "0007", // Middenheim p. 152, Salzenmund p. 142
  HumanNordland = "0008", // Middenheim p. 153
  HumanSalzenmund = "0009", // Salzenmund p. 142
  HumanTilea = "0010", // Up in Arms p. 55
  HumanNorseBjornling = "0011", // Sea of Claws p. 56
  HumanNorseSarl = "0012", // Sea of Claws p. 56
  HumanNorseSkaeling = "0013", // Sea of Claws p. 56
  HalflingDefault = "0100", // WFRP p. 26
  HalflingAshfield = "0101", // Archives I p. 32
  HalflingBrambledown = "0102", // Archives I p. 32
  HalflingBrandysnap = "0103", // Archives I p. 32
  HalflingHayfoot = "0104", // Archives I p. 32
  HalflingHollyfoot = "0105", // Archives I p. 32
  HalflingHayfootHollyfoot = "0106", // Archives I p. 32
  HalflingLostpockets = "0107", // Archives I p. 32
  HalflingLowhaven = "0108", // Archives I p. 32
  HalflingRumster = "0109", // Archives I p. 32
  HalflingSkelfsider = "0110", // Archives I p. 32
  HalflingThorncobble = "0111", // Archives I p. 32
  HalflingTumbleberry = "0112", // Archives I p. 32
  DwarfDefault = "0200", // WFRP p. 25
  DwarfAtldorf = "0201", // Archives III p. 83
  DwarfCragforgeClan = "0202", // Salzenmund p. 142
  DwarfGrumssonClan = "0203", // Salzenmund p. 142
  DwarfNorse = "0204", // Sea of Claws p. 41
  HighElfDefault = "0300", // WFRP p. 27
  WoodElfDefault = "0400", // WFRP p. 28
  GnomeDefault = "0500", // Rough Nights and Hard Days p. 86
  OgreDefault = "0600", // Archives II p. 18
  None = "9999",
}

export function getSpeciesWithRegionList(species: Species): SpeciesWithRegion[] {
  const prefix = "0" + species.toString();
  const ret: SpeciesWithRegion[] = [];

  for (const speciesWithRegion of speciesWithRegionList) {
    if (speciesWithRegion.substring(0, 2) === prefix) {
      ret.push(speciesWithRegion);
    }
  }
  return ret;
}

export function getDefaultSpeciesWithRegion(species: Species): SpeciesWithRegion {
  if (species === 0) {
    return SpeciesWithRegion.HumanReikland;
  }
  return ("0" + species.toString() + "00") as SpeciesWithRegion;
}

export function getSpeciesFromSpeciesWithRegion(speciesWithRegion: SpeciesWithRegion): Species {
  return parseInt(speciesWithRegion.substring(0, 2));
}

export function printSpeciesRegion(species: SpeciesWithRegion) {
  const match = printSpeciesWithRegion(species).match(/\((.*?)\)/);
  return match ? match[1] : "Unspecified";
}

export function printSpeciesWithRegion(species: SpeciesWithRegion) {
  switch (species) {
    case SpeciesWithRegion.HumanDefault:
      return "Human";
    case SpeciesWithRegion.HumanReikland:
      return "Human (Reikland)";
    case SpeciesWithRegion.HumanAltdorfSouthBank:
      return "Human (Altdorf South Bank)";
    case SpeciesWithRegion.HumanAltdorfEastend:
      return "Human (Altdorf Eastend)";
    case SpeciesWithRegion.HumanAltdorfHexxerbezrik:
      return "Human (Altdorf Hexxerbezrik)";
    case SpeciesWithRegion.HumanAltdorfDocklands:
      return "Human (Altdorf Docklands)";
    case SpeciesWithRegion.HumanMiddenheim:
      return "Human (Middenheim)";
    case SpeciesWithRegion.HumanMiddenland:
      return "Human (Middenland)";
    case SpeciesWithRegion.HumanNordland:
      return "Human (Nordland)";
    case SpeciesWithRegion.HumanSalzenmund:
      return "Human (Salzenmund)";
    case SpeciesWithRegion.HumanTilea:
      return "Human (Tilea)";
    case SpeciesWithRegion.HumanNorseBjornling:
      return "Human (Norse Bjornling)";
    case SpeciesWithRegion.HumanNorseSarl:
      return "Human (Norse Sarl)";
    case SpeciesWithRegion.HumanNorseSkaeling:
      return "Human (Norse Skaeling)";
    case SpeciesWithRegion.HalflingDefault:
      return "Halfling";
    case SpeciesWithRegion.HalflingAshfield:
      return "Halfling (Ashfield)";
    case SpeciesWithRegion.HalflingBrambledown:
      return "Halfling (Brambledown)";
    case SpeciesWithRegion.HalflingBrandysnap:
      return "Halfling (Brandysnap)";
    case SpeciesWithRegion.HalflingHayfoot:
      return "Halfling (Hayfoot)";
    case SpeciesWithRegion.HalflingHollyfoot:
      return "Halfling (Hollyfoot)";
    case SpeciesWithRegion.HalflingHayfootHollyfoot:
      return "Halfling (Hayfoot-Hollyfoot)";
    case SpeciesWithRegion.HalflingLostpockets:
      return "Halfling (Lostpockets)";
    case SpeciesWithRegion.HalflingLowhaven:
      return "Halfling (Lowhaven)";
    case SpeciesWithRegion.HalflingRumster:
      return "Halfling (Rumster)";
    case SpeciesWithRegion.HalflingSkelfsider:
      return "Halfling (Skelfsider)";
    case SpeciesWithRegion.HalflingThorncobble:
      return "Halfling (Thorncobble)";
    case SpeciesWithRegion.HalflingTumbleberry:
      return "Halfling (Tumbleberry)";
    case SpeciesWithRegion.DwarfDefault:
      return "Dwarf";
    case SpeciesWithRegion.DwarfAtldorf:
      return "Dwarf (Atldorf)";
    case SpeciesWithRegion.DwarfCragforgeClan:
      return "Dwarf (Cragforge Clan)";
    case SpeciesWithRegion.DwarfGrumssonClan:
      return "Dwarf (Grumsson Clan)";
    case SpeciesWithRegion.DwarfNorse:
      return "Dwarf (Norse)";
    case SpeciesWithRegion.HighElfDefault:
      return "High Elf";
    case SpeciesWithRegion.WoodElfDefault:
      return "Wood Elf";
    case SpeciesWithRegion.GnomeDefault:
      return "Gnome";
    case SpeciesWithRegion.OgreDefault:
      return "Ogre";
    case SpeciesWithRegion.None:
      return "None";
    default:
      return "";
  }
}

export const HUMAN_LIST = [
  SpeciesWithRegion.HumanReikland,
  SpeciesWithRegion.HumanDefault,
  SpeciesWithRegion.HumanAltdorfSouthBank,
  SpeciesWithRegion.HumanAltdorfEastend,
  SpeciesWithRegion.HumanAltdorfHexxerbezrik,
  SpeciesWithRegion.HumanAltdorfDocklands,
  SpeciesWithRegion.HumanMiddenheim,
  SpeciesWithRegion.HumanMiddenland,
  SpeciesWithRegion.HumanNordland,
  SpeciesWithRegion.HumanSalzenmund,
  SpeciesWithRegion.HumanTilea,
  SpeciesWithRegion.HumanNorseBjornling,
  SpeciesWithRegion.HumanNorseSarl,
  SpeciesWithRegion.HumanNorseSkaeling,
];

export const HALFLING_LIST = [
  SpeciesWithRegion.HalflingDefault,
  SpeciesWithRegion.HalflingAshfield,
  SpeciesWithRegion.HalflingBrambledown,
  SpeciesWithRegion.HalflingBrandysnap,
  SpeciesWithRegion.HalflingHayfoot,
  SpeciesWithRegion.HalflingHollyfoot,
  SpeciesWithRegion.HalflingHayfootHollyfoot,
  SpeciesWithRegion.HalflingLostpockets,
  SpeciesWithRegion.HalflingLowhaven,
  SpeciesWithRegion.HalflingRumster,
  SpeciesWithRegion.HalflingSkelfsider,
  SpeciesWithRegion.HalflingThorncobble,
  SpeciesWithRegion.HalflingTumbleberry,
];

export const DWARF_LIST = [
  SpeciesWithRegion.DwarfDefault,
  SpeciesWithRegion.DwarfAtldorf,
  SpeciesWithRegion.DwarfCragforgeClan,
  SpeciesWithRegion.DwarfGrumssonClan,
  SpeciesWithRegion.DwarfNorse,
];

export const HIGH_ELF_LIST = [SpeciesWithRegion.HighElfDefault];

export const WOOD_ELF_LIST = [SpeciesWithRegion.WoodElfDefault];

export const GNOME_LIST = [SpeciesWithRegion.GnomeDefault];

export const OGRE_LIST = [SpeciesWithRegion.OgreDefault];

export const speciesWithRegionList = [
  ...HUMAN_LIST,
  ...HALFLING_LIST,
  ...DWARF_LIST,
  ...HIGH_ELF_LIST,
  ...WOOD_ELF_LIST,
  ...GNOME_LIST,
  ...OGRE_LIST,
];

export const enum Sex {
  Male = 0,
  Female,
}

export function getMovementFormula(species: SpeciesWithRegion, mods: number): number {
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

export const enum Size {
  Tiny = 0,
  Little,
  Small,
  Average,
  Large,
  Enormous,
  Monstrous,
}

export function printSize(size: number): string {
  if (size <= Size.Tiny) {
    return "Tiny";
  } else if (size === Size.Little) {
    return "Little";
  } else if (size === Size.Small) {
    return "Small";
  } else if (size === Size.Average) {
    return "Average";
  } else if (size === Size.Large) {
    return "Large";
  } else if (size === Size.Enormous) {
    return "Enormous";
  } else {
    return "Monstrous";
  }
}

export const DEFAULT_SIZE = Size.Average;

export function getWoundsFormula(size: number, T: number, WP: number, S: number, hardyRanks: number): number {
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

export function getSizeFormula(mods: number) {
  const size = DEFAULT_SIZE + mods;
  return size <= Size.Tiny ? Size.Tiny : size >= Size.Monstrous ? Size.Monstrous : size;
}

export const DEFAULT_CAREER_ID = "5d16a8ad9ae1c87a18017578";
