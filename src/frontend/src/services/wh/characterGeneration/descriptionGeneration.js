import { diceRoll, rollInTable } from "../../../utils/randomUtils";
import * as c from "../characterConstants";

const HUMAN_EYE_ROLLS = [
  ["Green", 2, 3],
  ["Green", 3, 4],
  ["Pale Blue", 4, 5],
  ["Blue", 5, 8],
  ["Pale Gray", 8, 12],
  ["Grey", 12, 15],
  ["Brown", 15, 18],
  ["Hazel", 18, 19],
  ["Dark Brown", 19, 20],
  ["Black", 20, 21],
];

const HALFLING_EYE_ROLLS = [
  ["Light Grey", 2, 3],
  ["Grey", 3, 4],
  ["Pale Blue", 4, 5],
  ["Blue", 5, 8],
  ["Green", 8, 12],
  ["Hazel", 12, 15],
  ["Brown", 15, 18],
  ["Copper", 18, 19],
  ["Dark Brown", 19, 20],
  ["Dark Brown", 20, 21],
];

const DWARF_EYE_ROLLS = [
  ["Coal", 2, 3],
  ["Lead", 3, 4],
  ["Steel", 4, 5],
  ["Blue", 5, 8],
  ["Earth Brown", 8, 12],
  ["Dark Brown", 12, 15],
  ["Hazel", 15, 18],
  ["Green", 18, 19],
  ["Copper", 19, 20],
  ["Gold", 20, 21],
];

const HIGH_ELF_EYE_ROLLS = [
  ["Jet", 2, 3],
  ["Amethyst", 3, 4],
  ["Aquamarine", 4, 5],
  ["Sapphire", 5, 8],
  ["Turquoise", 8, 12],
  ["Emerald", 12, 15],
  ["Amber", 15, 18],
  ["Copper", 18, 19],
  ["Citrine", 19, 20],
  ["Gold", 20, 21],
];

const WOOD_ELF_EYE_ROLLS = [
  ["Ivory", 2, 3],
  ["Charcoal", 3, 4],
  ["Ivy Green", 4, 5],
  ["Mossy Green", 5, 8],
  ["Chestnut", 8, 12],
  ["Chestnut", 12, 15],
  ["Dark Brown", 15, 18],
  ["Tan", 18, 19],
  ["Sandy Brown", 19, 20],
  ["Violet", 20, 21],
];

const GNOME_EYE_ROLLS = [
  ["Pale Blue", 2, 3],
  ["Blue", 3, 4],
  ["Deep Blue", 4, 5],
  ["Turquoise", 5, 8],
  ["Pale Green", 8, 12],
  ["Hazel", 12, 15],
  ["Pale Brown", 15, 18],
  ["Brown", 18, 19],
  ["Dark Brown", 19, 20],
  ["Violet", 20, 21],
];

const OGRE_EYE_ROLLS = [
  ["Grey", 2, 3],
  ["Green", 3, 4],
  ["Amber", 4, 5],
  ["Hazel", 5, 8],
  ["Brown", 8, 12],
  ["Dark Brown", 12, 15],
  ["Sienna", 15, 18],
  ["Black", 18, 19],
  ["Purple Black", 19, 20],
  ["Blue Black", 20, 21],
];

const HUMAN_HAIR_ROLLS = [
  ["White Blond", 2, 3],
  ["Golden Blond", 3, 4],
  ["Red Blond", 4, 5],
  ["Golden Brown", 5, 8],
  ["Light Brown", 8, 12],
  ["Dark Brown", 12, 15],
  ["Black", 15, 18],
  ["Auburn", 18, 19],
  ["Red", 19, 20],
  ["Grey", 20, 21],
];

const HALFLING_HAIR_ROLLS = [
  ["Grey", 2, 3],
  ["Flaxen", 3, 4],
  ["Russet", 4, 5],
  ["Honey", 5, 8],
  ["Chestnut", 8, 12],
  ["Ginger", 12, 15],
  ["Mustard", 15, 18],
  ["Almond", 18, 19],
  ["Chocolate", 19, 20],
  ["Liquorice", 20, 21],
];

const DWARF_HAIR_ROLLS = [
  ["White", 2, 3],
  ["Grey", 3, 4],
  ["Pale Blond", 4, 5],
  ["Golden", 5, 8],
  ["Copper", 8, 12],
  ["Bronze", 12, 15],
  ["Brown", 15, 18],
  ["Dark Brown", 18, 19],
  ["Reddish Brown", 19, 20],
  ["Black", 20, 21],
];

const HIGH_ELF_HAIR_ROLLS = [
  ["Silver", 2, 3],
  ["White", 3, 4],
  ["Pale Blond", 4, 5],
  ["Blond", 5, 8],
  ["Yellow Blond", 8, 12],
  ["Copper Blond", 12, 15],
  ["Red Blond", 15, 18],
  ["Auburn", 18, 19],
  ["Red", 19, 20],
  ["Black", 20, 21],
];

const WOOD_ELF_HAIR_ROLLS = [
  ["Birch Silver", 2, 3],
  ["Ash Blond", 3, 4],
  ["Rose Gold", 4, 5],
  ["Honey Blond", 5, 8],
  ["Brown", 8, 12],
  ["Mahogany Brown", 12, 15],
  ["Dark Brown", 15, 18],
  ["Sienna", 18, 19],
  ["Ebony", 19, 20],
  ["Blue-Black", 20, 21],
];

const GNOME_HAIR_ROLLS = [
  ["Black", 2, 3],
  ["Dark Brown", 3, 4],
  ["Auburn", 4, 5],
  ["Brown", 5, 8],
  ["Light Brown", 8, 12],
  ["Ginger", 12, 15],
  ["Red Blond", 15, 18],
  ["Golden Blond", 18, 19],
  ["White Blond", 19, 20],
  ["White", 20, 21],
];

const OGRE_HAIR_ROLLS = [
  ["Brown", 2, 3],
  ["Red Brown", 3, 4],
  ["Terracotta", 4, 5],
  ["Sienna", 5, 8],
  ["Burgundy", 8, 12],
  ["Dark Brown", 12, 15],
  ["Black", 15, 18],
  ["Charcoal", 18, 19],
  ["Jet Black", 19, 20],
  ["Blue Black", 20, 21],
];

function generateAge(speciesWithRegion) {
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    return 15 + diceRoll(10, 1);
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    return 15 + diceRoll(10, 5);
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    return 15 + diceRoll(10, 10);
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return 30 + diceRoll(10, 10);
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return 30 + diceRoll(10, 10);
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    return 20 + diceRoll(10, 10);
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    return 15 + diceRoll(10, 5);
  }

  return 0;
}

function generateHeight(speciesWithRegion) {
  let heightInches;
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    heightInches = 57 + diceRoll(10, 2);
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    heightInches = 37 + diceRoll(10, 1);
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    heightInches = 51 + diceRoll(10, 1);
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    heightInches = 71 + diceRoll(10, 1);
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    heightInches = 71 + diceRoll(10, 1);
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    heightInches = 40 + diceRoll(10, 1);
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    heightInches = 91 + diceRoll(10, 1);
  } else {
    heightInches = 0;
  }
  return [Math.floor(heightInches / 12), heightInches % 12];
}

function generateEyes(speciesWithRegion) {
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, HUMAN_EYE_ROLLS);
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, HALFLING_EYE_ROLLS);
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, DWARF_EYE_ROLLS);
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    let color1 = rollInTable(10, 2, HIGH_ELF_EYE_ROLLS);
    if (diceRoll(2, 1) === 1) {
      let color2 = color1;
      while (color1 === color2) {
        color2 = rollInTable(10, 2, HIGH_ELF_EYE_ROLLS);
      }
      return color1 + " and " + color2;
    } else {
      return color1;
    }
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    let color1 = rollInTable(10, 2, WOOD_ELF_EYE_ROLLS);
    if (diceRoll(2, 1) === 1) {
      let color2 = color1;
      while (color1 === color2) {
        color2 = rollInTable(10, 2, WOOD_ELF_EYE_ROLLS);
      }
      return color1 + " and " + color2;
    } else {
      return color1;
    }
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, GNOME_EYE_ROLLS);
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, OGRE_EYE_ROLLS);
  }

  return "";
}

function generateHair(speciesWithRegion) {
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, HUMAN_HAIR_ROLLS);
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, HALFLING_HAIR_ROLLS);
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, DWARF_HAIR_ROLLS);
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, HIGH_ELF_HAIR_ROLLS);
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, WOOD_ELF_HAIR_ROLLS);
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, GNOME_HAIR_ROLLS);
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    return rollInTable(10, 2, OGRE_HAIR_ROLLS);
  }

  return "";
}

export default function generateDescription(speciesWithRegion) {
  let height = generateHeight(speciesWithRegion);
  let desc = `Age: ${generateAge(speciesWithRegion)}, Height: ${height[0]}'${height[1]}", Eyes: ${generateEyes(
    speciesWithRegion
  )}`;
  desc += `, Hair: ${generateHair(speciesWithRegion)}`;

  return desc;
}
