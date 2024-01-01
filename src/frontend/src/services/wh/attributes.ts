import * as c from "./characterConstants";

export interface Attributes {
  WS: number;
  BS: number;
  S: number;
  T: number;
  I: number;
  Ag: number;
  Dex: number;
  Int: number;
  WP: number;
  Fel: number;
}

export const racialAttributes: Record<string, Attributes> = {
  none: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  human: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  halfling: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
  dwarf: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
  elf: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
  gnome: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
  ogre: { WS: 20, BS: 10, S: 35, T: 35, I: 0, Ag: 15, Dex: 10, Int: 10, WP: 20, Fel: 10 },
};

export const getAttributes = (speciesWithRegion = ""): Attributes => {
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.human));
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.halfling));
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.dwarf));
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.gnome));
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.ogre));
  } else {
    return JSON.parse(JSON.stringify(racialAttributes.none));
  }
};

export function sumAndMultiplyAttributes(attsAndMults: { multiplier: number; attributes: Attributes }[]): Attributes {
  const returnAtts = JSON.parse(JSON.stringify(racialAttributes.none));
  for (const attAndMult of attsAndMults) {
    returnAtts.WS += attAndMult.multiplier * attAndMult.attributes.WS;
    returnAtts.BS += attAndMult.multiplier * attAndMult.attributes.BS;
    returnAtts.S += attAndMult.multiplier * attAndMult.attributes.S;
    returnAtts.T += attAndMult.multiplier * attAndMult.attributes.T;
    returnAtts.I += attAndMult.multiplier * attAndMult.attributes.I;
    returnAtts.Ag += attAndMult.multiplier * attAndMult.attributes.Ag;
    returnAtts.Dex += attAndMult.multiplier * attAndMult.attributes.Dex;
    returnAtts.Int += attAndMult.multiplier * attAndMult.attributes.Int;
    returnAtts.WP += attAndMult.multiplier * attAndMult.attributes.WP;
    returnAtts.Fel += attAndMult.multiplier * attAndMult.attributes.Fel;
  }
  return returnAtts;
}
