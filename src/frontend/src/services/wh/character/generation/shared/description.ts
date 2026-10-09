// Random descriptions (age, height, eyes, hair) by species (tables in data/descriptions.ts).
import { rollDice, rollInTable } from "../../../../../utils/random.ts";
import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../../../core/species.ts";
import {
  DWARF_EYE_ROLLS,
  DWARF_HAIR_ROLLS,
  GNOME_EYE_ROLLS,
  GNOME_HAIR_ROLLS,
  HALFLING_EYE_ROLLS,
  HALFLING_HAIR_ROLLS,
  HIGH_ELF_EYE_ROLLS,
  HIGH_ELF_HAIR_ROLLS,
  HUMAN_EYE_ROLLS,
  HUMAN_HAIR_ROLLS,
  OGRE_EYE_ROLLS,
  OGRE_HAIR_ROLLS,
  RollTable,
  WOOD_ELF_EYE_ROLLS,
  WOOD_ELF_HAIR_ROLLS,
} from "./data/descriptions.ts";
import { Character } from "../../character.ts";

function generateAge(species: SpeciesWithRegion): number {
  if (HUMAN_LIST.includes(species)) {
    return 15 + rollDice(10, 1);
  } else if (HALFLING_LIST.includes(species)) {
    return 15 + rollDice(10, 5);
  } else if (DWARF_LIST.includes(species)) {
    return 15 + rollDice(10, 10);
  } else if (HIGH_ELF_LIST.includes(species)) {
    return 30 + rollDice(10, 10);
  } else if (WOOD_ELF_LIST.includes(species)) {
    return 30 + rollDice(10, 10);
  } else if (GNOME_LIST.includes(species)) {
    return 20 + rollDice(10, 10);
  } else if (OGRE_LIST.includes(species)) {
    return 15 + rollDice(10, 5);
  }

  return 0;
}

function generateHeight(species: SpeciesWithRegion): number[] {
  let heightInches;
  if (HUMAN_LIST.includes(species)) {
    heightInches = 57 + rollDice(10, 2);
  } else if (HALFLING_LIST.includes(species)) {
    heightInches = 37 + rollDice(10, 1);
  } else if (DWARF_LIST.includes(species)) {
    heightInches = 51 + rollDice(10, 1);
  } else if (HIGH_ELF_LIST.includes(species)) {
    heightInches = 71 + rollDice(10, 1);
  } else if (WOOD_ELF_LIST.includes(species)) {
    heightInches = 71 + rollDice(10, 1);
  } else if (GNOME_LIST.includes(species)) {
    heightInches = 40 + rollDice(10, 1);
  } else if (OGRE_LIST.includes(species)) {
    heightInches = 91 + rollDice(10, 1);
  } else {
    heightInches = 0;
  }
  return [Math.floor(heightInches / 12), heightInches % 12];
}

function rollElfEyes(table: RollTable): string {
  const color1 = rollInTable(10, 2, table);
  if (rollDice(2, 1) === 1) {
    let color2 = color1;
    while (color1 === color2) {
      color2 = rollInTable(10, 2, table);
    }
    return color1 + " and " + color2;
  }
  return color1;
}

function generateEyes(species: SpeciesWithRegion): string {
  if (HUMAN_LIST.includes(species)) {
    return rollInTable(10, 2, HUMAN_EYE_ROLLS);
  } else if (HALFLING_LIST.includes(species)) {
    return rollInTable(10, 2, HALFLING_EYE_ROLLS);
  } else if (DWARF_LIST.includes(species)) {
    return rollInTable(10, 2, DWARF_EYE_ROLLS);
  } else if (HIGH_ELF_LIST.includes(species)) {
    return rollElfEyes(HIGH_ELF_EYE_ROLLS);
  } else if (WOOD_ELF_LIST.includes(species)) {
    return rollElfEyes(WOOD_ELF_EYE_ROLLS);
  } else if (GNOME_LIST.includes(species)) {
    return rollInTable(10, 2, GNOME_EYE_ROLLS);
  } else if (OGRE_LIST.includes(species)) {
    return rollInTable(10, 2, OGRE_EYE_ROLLS);
  }

  return "";
}

function generateHair(species: SpeciesWithRegion): string {
  if (HUMAN_LIST.includes(species)) {
    return rollInTable(10, 2, HUMAN_HAIR_ROLLS);
  } else if (HALFLING_LIST.includes(species)) {
    return rollInTable(10, 2, HALFLING_HAIR_ROLLS);
  } else if (DWARF_LIST.includes(species)) {
    return rollInTable(10, 2, DWARF_HAIR_ROLLS);
  } else if (HIGH_ELF_LIST.includes(species)) {
    return rollInTable(10, 2, HIGH_ELF_HAIR_ROLLS);
  } else if (WOOD_ELF_LIST.includes(species)) {
    return rollInTable(10, 2, WOOD_ELF_HAIR_ROLLS);
  } else if (GNOME_LIST.includes(species)) {
    return rollInTable(10, 2, GNOME_HAIR_ROLLS);
  } else if (OGRE_LIST.includes(species)) {
    return rollInTable(10, 2, OGRE_HAIR_ROLLS);
  }

  return "";
}

export function generateDescription(species: SpeciesWithRegion) {
  const height = generateHeight(species);
  let desc = `Age: ${generateAge(species)}, Height: ${height[0]}'${height[1]}", Eyes: ${generateEyes(species)}`;
  desc += `, Hair: ${generateHair(species)}`;

  return desc;
}

export function populateDescription(character: Character): void {
  character.description = generateDescription(character.species);
}
