import { Edition } from "./edition.ts";

export enum Species {
  Human = 0,
  Halfling,
  Dwarf,
  HighElf,
  WoodElf,
  Gnome,
  Ogre,
}

export const speciesList = [
  Species.Human,
  Species.Halfling,
  Species.Dwarf,
  Species.HighElf,
  Species.WoodElf,
  Species.Gnome,
  Species.Ogre,
];

// Species a career can be open to in each edition; 5e has five species.
export const careerSpeciesByEdition: Record<Edition, Species[]> = {
  "4e": speciesList,
  "5e": [Species.Human, Species.Halfling, Species.Dwarf, Species.HighElf, Species.WoodElf],
};

export function printSpeciesName(species: Species) {
  switch (species) {
    case Species.Human:
      return "Human";
    case Species.Halfling:
      return "Halfling";
    case Species.Dwarf:
      return "Dwarf";
    case Species.HighElf:
      return "High Elf";
    case Species.WoodElf:
      return "Wood Elf";
    case Species.Gnome:
      return "Gnome";
    case Species.Ogre:
      return "Ogre";
    default:
      return "";
  }
}

export function speciesWithRegionToSpecies(speciesWithRegion: SpeciesWithRegion): Species {
  if (HUMAN_LIST.includes(speciesWithRegion)) {
    return Species.Human;
  } else if (HALFLING_LIST.includes(speciesWithRegion)) {
    return Species.Halfling;
  } else if (DWARF_LIST.includes(speciesWithRegion)) {
    return Species.Dwarf;
  } else if (HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return Species.HighElf;
  } else if (WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return Species.WoodElf;
  } else if (GNOME_LIST.includes(speciesWithRegion)) {
    return Species.Gnome;
  } else if (OGRE_LIST.includes(speciesWithRegion)) {
    return Species.Ogre;
  } else {
    return Species.Human;
  }
}

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
  DwarfNorse = "0204", // Sea of Claws p. 41 Dwarf Players Guide p. 50
  DwarfKarazAKarak = "0205", // Dwarf Players Guide p. 48
  DwarfBarakVarr = "0206", // Dwarf Players Guide p. 48
  DwarfKarakAzul = "0207", // Dwarf Players Guide p. 48
  DwarfKarakEightPeaks = "0208", // Dwarf Players Guide p. 49
  DwarfKarakKadrin = "0209", // Dwarf Players Guide p. 49
  DwarfZhufbar = "0210", // Dwarf Players Guide p. 49
  DwarfKarakHirn = "0211", // Dwarf Players Guide p. 49
  DwarfKarakIzor = "0212", // Dwarf Players Guide p. 49
  DwarfKarakNorn = "0213", // Dwarf Players Guide p. 49
  DwarfImperial = "0214", // Dwarf Players Guide p. 50
  HighElfDefault = "0300", // WFRP p. 27
  HighElfCaledor = "0301", // High Elf Players Guide p. 54
  HighElfEllyrion = "0302", // High Elf Players Guide p. 54
  HighElfAvelorn = "0303", // High Elf Players Guide p. 54
  HighElfSaphery = "0304", // High Elf Players Guide p. 54
  HighElfEataine = "0305", // High Elf Players Guide p. 54
  HighElfTiranoc = "0306", // High Elf Players Guide p. 55
  HighElfShadowlands = "0307", // High Elf Players Guide p. 55
  HighElfChrace = "0308", // High Elf Players Guide p. 55
  HighElfCothique = "0309", // High Elf Players Guide p. 55
  HighElfYvresse = "0310", // High Elf Players Guide p. 55
  HighElfSeaElf = "0311", // High Elf Players Guide p. 57
  WoodElfDefault = "0400", // WFRP p. 28
  WoodElfEonirCityborn = "0401", // Archives I p. 76
  WoodElfEonirForestborn = "0402", // Archives I p. 76
  WoodElfEonirYounger = "0403", // Archives I p. 76
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
  if (species === Species.Human) {
    return SpeciesWithRegion.HumanReikland;
  }
  if (species === Species.Dwarf) {
    return SpeciesWithRegion.DwarfImperial;
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
    case SpeciesWithRegion.DwarfKarazAKarak:
      return "Dwarf (Karaz-a-Karak)";
    case SpeciesWithRegion.DwarfBarakVarr:
      return "Dwarf (Barak Varr)";
    case SpeciesWithRegion.DwarfKarakAzul:
      return "Dwarf (Karak Azul)";
    case SpeciesWithRegion.DwarfKarakEightPeaks:
      return "Dwarf (Karak Eight Peaks)";
    case SpeciesWithRegion.DwarfKarakKadrin:
      return "Dwarf (Karak Kadrin)";
    case SpeciesWithRegion.DwarfZhufbar:
      return "Dwarf (Zhufbar)";
    case SpeciesWithRegion.DwarfKarakHirn:
      return "Dwarf (Karak Hirn/Black Mountains)";
    case SpeciesWithRegion.DwarfKarakIzor:
      return "Dwarf (Karak Izor/The Vaults)";
    case SpeciesWithRegion.DwarfKarakNorn:
      return "Dwarf (Karak Norn/Grey Mountains)";
    case SpeciesWithRegion.DwarfImperial:
      return "Dwarf (Imperial)";
    case SpeciesWithRegion.HighElfDefault:
      return "High Elf";
    case SpeciesWithRegion.HighElfCaledor:
      return "High Elf (Caledor)";
    case SpeciesWithRegion.HighElfEllyrion:
      return "High Elf (Ellyrion)";
    case SpeciesWithRegion.HighElfAvelorn:
      return "High Elf (Avelorn)";
    case SpeciesWithRegion.HighElfSaphery:
      return "High Elf (Saphery)";
    case SpeciesWithRegion.HighElfEataine:
      return "High Elf (Eataine)";
    case SpeciesWithRegion.HighElfTiranoc:
      return "High Elf (Tiranoc)";
    case SpeciesWithRegion.HighElfShadowlands:
      return "High Elf (Shadowlands)";
    case SpeciesWithRegion.HighElfChrace:
      return "High Elf (Chrace)";
    case SpeciesWithRegion.HighElfCothique:
      return "High Elf (Cothique)";
    case SpeciesWithRegion.HighElfYvresse:
      return "High Elf (Yvresse)";
    case SpeciesWithRegion.HighElfSeaElf:
      return "High Elf (Sea Elf)";
    case SpeciesWithRegion.WoodElfDefault:
      return "Wood Elf";
    case SpeciesWithRegion.WoodElfEonirCityborn:
      return "Wood Elf (Eonir Cityborn)";
    case SpeciesWithRegion.WoodElfEonirForestborn:
      return "Wood Elf (Eonir Forestborn)";
    case SpeciesWithRegion.WoodElfEonirYounger:
      return "Wood Elf (Eonir Younger)";
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
  SpeciesWithRegion.DwarfImperial,
  SpeciesWithRegion.DwarfDefault,
  SpeciesWithRegion.DwarfAtldorf,
  SpeciesWithRegion.DwarfCragforgeClan,
  SpeciesWithRegion.DwarfGrumssonClan,
  SpeciesWithRegion.DwarfNorse,
  SpeciesWithRegion.DwarfKarazAKarak,
  SpeciesWithRegion.DwarfBarakVarr,
  SpeciesWithRegion.DwarfKarakAzul,
  SpeciesWithRegion.DwarfKarakEightPeaks,
  SpeciesWithRegion.DwarfKarakKadrin,
  SpeciesWithRegion.DwarfZhufbar,
  SpeciesWithRegion.DwarfKarakHirn,
  SpeciesWithRegion.DwarfKarakIzor,
  SpeciesWithRegion.DwarfKarakNorn,
];

export const HIGH_ELF_LIST = [
  SpeciesWithRegion.HighElfDefault,
  SpeciesWithRegion.HighElfCaledor,
  SpeciesWithRegion.HighElfEllyrion,
  SpeciesWithRegion.HighElfAvelorn,
  SpeciesWithRegion.HighElfSaphery,
  SpeciesWithRegion.HighElfEataine,
  SpeciesWithRegion.HighElfTiranoc,
  SpeciesWithRegion.HighElfShadowlands,
  SpeciesWithRegion.HighElfChrace,
  SpeciesWithRegion.HighElfCothique,
  SpeciesWithRegion.HighElfYvresse,
  SpeciesWithRegion.HighElfSeaElf,
];

export const WOOD_ELF_LIST = [
  SpeciesWithRegion.WoodElfDefault,
  SpeciesWithRegion.WoodElfEonirCityborn,
  SpeciesWithRegion.WoodElfEonirForestborn,
  SpeciesWithRegion.WoodElfEonirYounger,
];

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
