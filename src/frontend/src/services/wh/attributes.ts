import * as c from "./characterUtils.ts";
import { SpeciesWithRegion } from "./characterUtils.ts";

export interface Attributes extends Record<string, number> {
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

export const enum AttributeName {
  None = 0,
  WS,
  BS,
  S,
  T,
  I,
  Ag,
  Dex,
  Int,
  WP,
  Fel,
  Various,
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

export const getAttributes = (species = SpeciesWithRegion.None): Attributes => {
  if (c.HUMAN_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.human));
  } else if (c.HALFLING_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.halfling));
  } else if (c.DWARF_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.dwarf));
  } else if (c.HIGH_ELF_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.WOOD_ELF_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.GNOME_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.gnome));
  } else if (c.OGRE_LIST.includes(species)) {
    return JSON.parse(JSON.stringify(racialAttributes.ogre));
  } else {
    return JSON.parse(JSON.stringify(racialAttributes.none));
  }
};

export function sumAttributes(...args: Attributes[]): Attributes {
  const returnAtts = JSON.parse(JSON.stringify(racialAttributes.none));
  for (const attributes of args)
    for (const key of Object.keys(returnAtts)) {
      returnAtts[key] += attributes[key];
    }
  return returnAtts;
}

export function multiplyAttributes(multiplier: number, attributes: Attributes): Attributes {
  const returnAtts = JSON.parse(JSON.stringify(attributes));
  for (const key of Object.keys(returnAtts)) {
    returnAtts[key] = multiplier * attributes[key];
  }
  return returnAtts;
}

export function attributesAreEqual(att1: Attributes, att2: Attributes): boolean {
  for (const key of Object.keys(att1)) {
    if (att1[key] !== att2[key]) {
      return false;
    }
  }
  return true;
}
