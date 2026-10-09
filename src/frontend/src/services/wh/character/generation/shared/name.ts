// Random names by species (lists in data/names.ts).
import { selectRandom } from "../../../../../utils/random.ts";
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
  DWARF_ELEMENT_1,
  DWARF_ELEMENT_FEMALE,
  DWARF_ELEMENT_MALE,
  DWARF_NICKNAME_PROB,
  DWARF_NICKNAMES,
  ELF_ELEMENT_1,
  ELF_ELEMENT_2,
  GNOME_CLANS,
  GNOME_FEMALE_FORENAMES,
  GNOME_MALE_FORENAMES,
  GNOME_NICKNAME_PROB,
  GNOME_NICKNAMES,
  HALFLING_FEMALE_FORENAMES,
  HALFLING_MALE_FORENAMES,
  HALFLING_SURNAMES,
  HIGH_ELF_ENDINGS,
  HIGH_ELF_SURNAMES,
  HUMAN_EMPIRE_FEMALE_FORENAMES,
  HUMAN_EMPIRE_MALE_FORENAMES,
  HUMAN_EMPIRE_SURNAMES,
  HUMAN_NORSCA_FEMALE_FORENAMES,
  HUMAN_NORSCA_MALE_FORENAMES,
  HUMAN_TILEA_FEMALE_FORENAMES,
  HUMAN_TILEA_MALE_FORENAMES,
  HUMAN_TILEA_SURNAMES,
  OGRE_BIG_NAME_PROB,
  OGRE_BIG_NAMES,
  OGRE_CLANS,
  OGRE_ELEMENT_1,
  OGRE_ELEMENT_2,
  WOOD_ELF_ENDINGS,
  WOOD_ELF_SURNAMES,
} from "./data/names.ts";
import { Character } from "../../character.ts";

export const enum Sex {
  Male = 0,
  Female,
}

function generateHumanEmpireName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(HUMAN_EMPIRE_MALE_FORENAMES);
  } else {
    forename = selectRandom(HUMAN_EMPIRE_FEMALE_FORENAMES);
  }
  return forename + " " + selectRandom(HUMAN_EMPIRE_SURNAMES);
}

function generateHumanTileaName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(HUMAN_TILEA_MALE_FORENAMES);
  } else {
    forename = selectRandom(HUMAN_TILEA_FEMALE_FORENAMES);
  }
  return forename + " " + selectRandom(HUMAN_TILEA_SURNAMES);
}

function generateHumanNorscaName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(HUMAN_NORSCA_MALE_FORENAMES);
  } else {
    forename = selectRandom(HUMAN_NORSCA_FEMALE_FORENAMES);
  }

  let surname;
  const ancestorSex = selectRandom([Sex.Male, Sex.Female]);
  if (ancestorSex === Sex.Male) {
    const ancestorForename = selectRandom(HUMAN_NORSCA_MALE_FORENAMES);
    surname = ancestorForename + selectRandom(["sson", "snev"]);
  } else {
    const ancestorForename = selectRandom(HUMAN_NORSCA_FEMALE_FORENAMES);
    surname = ancestorForename + selectRandom(["sdottir", "sniz"]);
  }
  return forename + " " + surname;
}

function generateHalflingName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(HALFLING_MALE_FORENAMES);
  } else {
    forename = selectRandom(HALFLING_FEMALE_FORENAMES);
  }
  return forename + " " + selectRandom(HALFLING_SURNAMES);
}

function generateHighElfName(): string {
  const forename = selectRandom(ELF_ELEMENT_1) + selectRandom(ELF_ELEMENT_2) + selectRandom(HIGH_ELF_ENDINGS);
  return forename + " " + selectRandom(HIGH_ELF_SURNAMES);
}

function generateWoodElfName(): string {
  const forename = selectRandom(ELF_ELEMENT_1) + selectRandom(ELF_ELEMENT_2) + selectRandom(WOOD_ELF_ENDINGS);
  return forename + " " + selectRandom(WOOD_ELF_SURNAMES);
}

function generateDwarfName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(DWARF_ELEMENT_1) + selectRandom(DWARF_ELEMENT_MALE);
  } else {
    forename = selectRandom(DWARF_ELEMENT_1) + selectRandom(DWARF_ELEMENT_FEMALE);
  }

  let surname;
  if (Math.random() < DWARF_NICKNAME_PROB) {
    surname = selectRandom(DWARF_NICKNAMES);
  } else {
    const ancestorSex = selectRandom([Sex.Male, Sex.Female]);

    let ancForename;
    if (ancestorSex === Sex.Male) {
      ancForename = selectRandom(DWARF_ELEMENT_1) + selectRandom(DWARF_ELEMENT_MALE);
    } else {
      ancForename = selectRandom(DWARF_ELEMENT_1) + selectRandom(DWARF_ELEMENT_FEMALE);
    }

    const suffix = sex === Sex.Male ? selectRandom(["sson", "snev"]) : selectRandom(["sdottir", "sniz"]);
    surname = ancForename + suffix;
  }
  return forename + " " + surname;
}

function generateGnomeName(sex: Sex): string {
  let forename;
  if (sex === Sex.Male) {
    forename = selectRandom(GNOME_MALE_FORENAMES);
  } else {
    forename = selectRandom(GNOME_FEMALE_FORENAMES);
  }

  const surname = selectRandom(GNOME_CLANS);

  if (Math.random() < GNOME_NICKNAME_PROB) {
    return forename + " (" + selectRandom(GNOME_NICKNAMES) + ") " + surname;
  } else {
    return forename + " " + surname;
  }
}

function generateOgreName(): string {
  const forename = selectRandom(OGRE_ELEMENT_1) + selectRandom(OGRE_ELEMENT_2);
  const clan = selectRandom(OGRE_CLANS);

  if (Math.random() < OGRE_BIG_NAME_PROB) {
    return forename + " " + clan + ", the " + selectRandom(OGRE_BIG_NAMES);
  } else {
    return forename + " " + clan;
  }
}

export function generateName(species: SpeciesWithRegion, sex?: Sex): string {
  let selectedSex: Sex;
  if (typeof sex === "undefined") {
    selectedSex = selectRandom([Sex.Male, Sex.Female]);
  } else {
    selectedSex = sex;
  }

  if (HUMAN_LIST.includes(species)) {
    if (species === SpeciesWithRegion.HumanTilea) {
      return generateHumanTileaName(selectedSex);
    }

    if (
      [
        SpeciesWithRegion.HumanNorseBjornling,
        SpeciesWithRegion.HumanNorseSarl,
        SpeciesWithRegion.HumanNorseSkaeling,
      ].includes(species)
    ) {
      return generateHumanNorscaName(selectedSex);
    }

    return generateHumanEmpireName(selectedSex);
  }

  if (HALFLING_LIST.includes(species)) {
    return generateHalflingName(selectedSex);
  }

  if (DWARF_LIST.includes(species)) {
    return generateDwarfName(selectedSex);
  }

  if (HIGH_ELF_LIST.includes(species)) {
    return generateHighElfName();
  }

  if (WOOD_ELF_LIST.includes(species)) {
    return generateWoodElfName();
  }

  if (GNOME_LIST.includes(species)) {
    return generateGnomeName(selectedSex);
  }

  if (OGRE_LIST.includes(species)) {
    return generateOgreName();
  }

  return "";
}

export function populateName(character: Character, sex?: Sex): void {
  character.name = generateName(character.species, sex);
}
