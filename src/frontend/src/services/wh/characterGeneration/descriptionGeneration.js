import { diceRoll, rollInTable } from "../../../utils/randomUtils";

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

function generateAge(species) {
  if (species === 0) {
    return 15 + diceRoll(10, 1);
  } else if (species === 1) {
    return 15 + diceRoll(10, 5);
  } else if (species === 2) {
    return 15 + diceRoll(10, 10);
  } else if (species === 5) {
    return 20 + diceRoll(10, 10);
  } else if (species === 6) {
    return 15 + diceRoll(10, 5);
  } else {
    return 30 + diceRoll(10, 10);
  }
}

function generateHeight(species) {
  let heightInches;
  if (species === 0) {
    heightInches = 57 + diceRoll(10, 2);
  } else if (species === 1) {
    heightInches = 37 + diceRoll(10, 1);
  } else if (species === 2) {
    heightInches = 51 + diceRoll(10, 1);
  } else if (species === 5) {
    heightInches = 40 + diceRoll(10, 1);
  } else if (species === 6) {
    heightInches = 91 + diceRoll(10, 1);
  } else {
    heightInches = 71 + diceRoll(10, 1);
  }
  return [Math.floor(heightInches / 12), heightInches % 12];
}

function generateEyes(species) {
  if (species === 0) {
    return rollInTable(10, 2, HUMAN_EYE_ROLLS);
  } else if (species === 1) {
    return rollInTable(10, 2, HALFLING_EYE_ROLLS);
  } else if (species === 2) {
    return rollInTable(10, 2, DWARF_EYE_ROLLS);
  } else if (species === 5) {
    return rollInTable(10, 2, GNOME_EYE_ROLLS);
  } else if (species === 6) {
    return rollInTable(10, 2, OGRE_EYE_ROLLS);
  } else {
    let table = species === 3 ? HIGH_ELF_EYE_ROLLS : WOOD_ELF_EYE_ROLLS;
    let color1 = rollInTable(10, 2, table);
    if (diceRoll(2, 1) === 1) {
      let color2 = color1;
      while (color1 === color2) {
        color2 = rollInTable(10, 2, table);
      }
      return color1 + " and " + color2;
    } else {
      return color1;
    }
  }
}

function generateHair(species) {
  if (species === 0) {
    return rollInTable(10, 2, HUMAN_HAIR_ROLLS);
  } else if (species === 1) {
    return rollInTable(10, 2, HALFLING_HAIR_ROLLS);
  } else if (species === 2) {
    return rollInTable(10, 2, DWARF_HAIR_ROLLS);
  } else if (species === 5) {
    return rollInTable(10, 2, GNOME_HAIR_ROLLS);
  } else if (species === 6) {
    return rollInTable(10, 2, OGRE_HAIR_ROLLS);
  } else if (species === 3) {
    return rollInTable(10, 2, HIGH_ELF_HAIR_ROLLS);
  } else {
    return rollInTable(10, 2, WOOD_ELF_HAIR_ROLLS);
  }
}

export default function generateDescription(species) {
  let height = generateHeight(species);
  let desc = `Age: ${generateAge(species)}, Height: ${height[0]}'${height[1]}", Eyes: ${generateEyes(species)}`;
  desc += `, Hair: ${generateHair(species)}`;

  return desc;
}
