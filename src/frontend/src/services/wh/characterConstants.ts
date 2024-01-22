export enum SpeciesWithRegion {
  HumanDefault = "0000",
  HumanReikland = "0001", // WFRP p. 25
  HumanAltdorfSouthBank = "0002", // Archives III p. 83
  HumanAltdorfEastend = "0003", // Archives III p. 83
  AltdorfHexxerbezrik = "0004", // Archives III p. 84
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

export const HUMAN_LIST = [
  SpeciesWithRegion.HumanDefault,
  SpeciesWithRegion.HumanReikland,
  SpeciesWithRegion.HumanAltdorfSouthBank,
  SpeciesWithRegion.HumanAltdorfEastend,
  SpeciesWithRegion.HumanAltdorfEastend,
  SpeciesWithRegion.AltdorfHexxerbezrik,
  SpeciesWithRegion.HumanAltdorfDocklands,
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

export enum Sex {
  Male = 0,
  Female,
}
