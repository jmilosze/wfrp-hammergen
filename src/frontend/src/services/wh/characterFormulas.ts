import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "./characterConstants.ts";

export function getMovementFormula(species: SpeciesWithRegion) {
  if (HALFLING_LIST.includes(species) || DWARF_LIST.includes(species) || GNOME_LIST.includes(species)) {
    return 3;
  } else if (HUMAN_LIST.includes(species)) {
    return 4;
  } else if (OGRE_LIST.includes(species)) {
    return 6;
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    return 5;
  } else {
    return 0;
  }
}
