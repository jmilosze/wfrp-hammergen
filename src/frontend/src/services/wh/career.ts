import { AttributeName } from "./attributes.ts";
import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/array.ts";
import { AxiosInstance } from "axios";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { setsAreEqual, updateSet } from "../../utils/set.ts";
import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "./characterUtils.ts";

export const enum CareerClass {
  Academic = 0,
  Burghers,
  Courtier,
  Peasant,
  Ranger,
  Riverfolk,
  Rougue,
  Warrior,
  Seafarer,
}

export const careerClassList = [
  CareerClass.Academic,
  CareerClass.Burghers,
  CareerClass.Courtier,
  CareerClass.Peasant,
  CareerClass.Ranger,
  CareerClass.Rougue,
  CareerClass.Warrior,
  CareerClass.Seafarer,
];

export function printClassName(careerClass: CareerClass) {
  switch (careerClass) {
    case CareerClass.Academic:
      return "Academic";
    case CareerClass.Burghers:
      return "Burghers";
    case CareerClass.Courtier:
      return "Courtier";
    case CareerClass.Peasant:
      return "Peasant";
    case CareerClass.Ranger:
      return "Ranger";
    case CareerClass.Riverfolk:
      return "Riverfolk";
    case CareerClass.Rougue:
      return "Rougue";
    case CareerClass.Warrior:
      return "Warrior";
    case CareerClass.Seafarer:
      return "Seafarer";
    default:
      return "";
  }
}

export const enum StatusTier {
  Brass = 0,
  Silver,
  Gold,
}

export const statusTierList: StatusTier[] = [StatusTier.Brass, StatusTier.Silver, StatusTier.Gold];

export function printStatusTier(statusTier: StatusTier): string {
  switch (statusTier) {
    case StatusTier.Brass:
      return "Brass";
    case StatusTier.Silver:
      return "Silver";
    case StatusTier.Gold:
      return "Gold";
    default:
      return "";
  }
}

export type StatusStanding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const statusStandingList: StatusStanding[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function printStatusStanding(statusStanding: StatusStanding): string {
  return statusStanding.toString();
}

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

export type CareerLevel = {
  exists: boolean;
  name: string;
  status: StatusTier;
  standing: StatusStanding;
  attributes: AttributeName[];
  skills: Set<string>;
  talents: Set<string>;
  items: string;
};

export type CareerLevelApiData = {
  exists: boolean;
  name: string;
  status: StatusTier;
  standing: StatusStanding;
  attributes: AttributeName[];
  skills: string[];
  talents: string[];
  items: string;
};

const API_BASE_PATH = "/api/wh/career";

export interface CareerApiData {
  name: string;
  description: string;
  species: Species[];
  class: CareerClass;
  level1: CareerLevelApiData;
  level2: CareerLevelApiData;
  level3: CareerLevelApiData;
  level4: CareerLevelApiData;
  level5: CareerLevelApiData;
  shared: boolean;
  source: Source;
}

export const zeroCareerLevel: CareerLevel = {
  exists: false,
  name: "",
  status: StatusTier.Brass,
  standing: 0,
  attributes: [],
  skills: new Set<string>(),
  talents: new Set<string>(),
  items: "",
};

const careerLevelEqual = (careerLevel: CareerLevel, OtherCareerLevel: CareerLevel): boolean => {
  return (
    careerLevel.exists === OtherCareerLevel.exists &&
    careerLevel.name === OtherCareerLevel.name &&
    careerLevel.status === OtherCareerLevel.status &&
    careerLevel.standing === OtherCareerLevel.standing &&
    arraysAreEqualIgnoreOrder(careerLevel.attributes, OtherCareerLevel.attributes) &&
    setsAreEqual(careerLevel.skills, OtherCareerLevel.skills) &&
    setsAreEqual(careerLevel.talents, OtherCareerLevel.talents) &&
    careerLevel.items === OtherCareerLevel.items
  );
};

export function isLevel(x: number): x is 1 | 2 | 3 | 4 | 5 {
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
}

export class Career implements WhProperty {
  id: string;
  ownerId: string;
  canEdit: boolean;
  name: string;
  description: string;
  species: Species[];
  careerClass: CareerClass;
  level1: CareerLevel;
  level2: CareerLevel;
  level3: CareerLevel;
  level4: CareerLevel;
  level5: CareerLevel;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    ownerId = "",
    canEdit = false,
    name = "",
    description = "",
    species = [Species.Human],
    careerClass = CareerClass.Academic,
    level1 = copyCareerLevel(zeroCareerLevel),
    level2 = copyCareerLevel(zeroCareerLevel),
    level3 = copyCareerLevel(zeroCareerLevel),
    level4 = copyCareerLevel(zeroCareerLevel),
    level5 = copyCareerLevel(zeroCareerLevel),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.species = species;
    this.careerClass = careerClass;
    this.level1 = level1;
    this.level2 = level2;
    this.level3 = level3;
    this.level4 = level4;
    this.level5 = level5;
    this.shared = shared;
    this.source = source;
  }

  copy(): Career {
    return new Career({
      id: this.id,
      ownerId: this.ownerId,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      species: [...this.species],
      careerClass: this.careerClass,
      level1: copyCareerLevel(this.level1),
      level2: copyCareerLevel(this.level2),
      level3: copyCareerLevel(this.level3),
      level4: copyCareerLevel(this.level4),
      level5: copyCareerLevel(this.level5),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validateLevel1Name(): ValidationStatus {
    return validShortDescFn(this.level1.name);
  }

  validateLevel2Name(): ValidationStatus {
    return validShortDescFn(this.level2.name);
  }

  validateLevel3Name(): ValidationStatus {
    return validShortDescFn(this.level3.name);
  }

  validateLevel4Name(): ValidationStatus {
    return validShortDescFn(this.level4.name);
  }

  validateLevel5Name(): ValidationStatus {
    return validShortDescFn(this.level5.name);
  }

  validateLevel1Items(): ValidationStatus {
    return validLongDescFn(this.level1.items);
  }

  validateLevel2Items(): ValidationStatus {
    return validLongDescFn(this.level2.items);
  }

  validateLevel3Items(): ValidationStatus {
    return validLongDescFn(this.level3.items);
  }

  validateLevel4Items(): ValidationStatus {
    return validLongDescFn(this.level4.items);
  }

  validateLevel5Items(): ValidationStatus {
    return validLongDescFn(this.level5.items);
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      sourceIsValid(this.source) &&
      this.validateLevel1Name().valid &&
      this.validateLevel2Name().valid &&
      this.validateLevel3Name().valid &&
      this.validateLevel4Name().valid &&
      this.validateLevel5Name().valid &&
      this.validateLevel1Items().valid &&
      this.validateLevel2Items().valid &&
      this.validateLevel3Items().valid &&
      this.validateLevel4Items().valid &&
      this.validateLevel5Items().valid
    );
  }

  isEqualTo(otherCareer: WhProperty): boolean {
    if (!(otherCareer instanceof Career)) {
      return false;
    }
    return (
      this.id === otherCareer.id &&
      this.canEdit === otherCareer.canEdit &&
      this.name === otherCareer.name &&
      this.description === otherCareer.description &&
      arraysAreEqualIgnoreOrder(this.species, otherCareer.species) &&
      this.careerClass === otherCareer.careerClass &&
      careerLevelEqual(this.level1, otherCareer.level1) &&
      careerLevelEqual(this.level2, otherCareer.level2) &&
      careerLevelEqual(this.level3, otherCareer.level3) &&
      careerLevelEqual(this.level4, otherCareer.level4) &&
      careerLevelEqual(this.level5, otherCareer.level5) &&
      this.shared === otherCareer.shared &&
      objectsAreEqual(this.source, otherCareer.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  getLevel(level: 1 | 2 | 3 | 4 | 5): CareerLevel {
    switch (level) {
      case 1:
        return this.level1;
      case 2:
        return this.level2;
      case 3:
        return this.level3;
      case 4:
        return this.level4;
      case 5:
        return this.level5;
      default:
        return zeroCareerLevel;
    }
  }

  updateLevelSkills(level: 1 | 2 | 3 | 4 | 5, id: string, selected: boolean): void {
    const careerLevel = this.getLevel(level);
    updateSet(careerLevel.skills, id, selected);
  }

  updateLevelTalents(level: 1 | 2 | 3 | 4 | 5, id: string, selected: boolean): void {
    const careerLevel = this.getLevel(level);
    updateSet(careerLevel.talents, id, selected);
  }

  allowedForSpeciesWithRegion(speciesWithRegion: SpeciesWithRegion): boolean {
    const species = speciesWithRegionToSpecies(speciesWithRegion);
    return this.species.includes(species);
  }
}

export function copyCareerLevel(careerLevel: CareerLevel): CareerLevel {
  return {
    exists: careerLevel.exists,
    name: careerLevel.name,
    status: careerLevel.status,
    standing: careerLevel.standing,
    attributes: [...careerLevel.attributes],
    skills: new Set(careerLevel.skills),
    talents: new Set(careerLevel.talents),
    items: careerLevel.items,
  };
}

export function apiResponseToModel(careerApi: ApiResponse<CareerApiData>): Career {
  return new Career({
    id: careerApi.id,
    ownerId: careerApi.ownerId,
    canEdit: careerApi.canEdit,
    name: careerApi.object.name,
    description: careerApi.object.description,
    careerClass: careerApi.object.class,
    species: [...careerApi.object.species],
    level1: careerLevelApiDataToCareerLevel(careerApi.object.level1),
    level2: careerLevelApiDataToCareerLevel(careerApi.object.level2),
    level3: careerLevelApiDataToCareerLevel(careerApi.object.level3),
    level4: careerLevelApiDataToCareerLevel(careerApi.object.level4),
    level5: careerLevelApiDataToCareerLevel(careerApi.object.level5),
    shared: careerApi.object.shared,
    source: copySource(careerApi.object.source),
  });
}

function careerLevelApiDataToCareerLevel(apiData: CareerLevelApiData): CareerLevel {
  return {
    exists: apiData.exists,
    name: apiData.name,
    status: apiData.status,
    standing: apiData.standing,
    attributes: [...apiData.attributes],
    skills: new Set(apiData.skills),
    talents: new Set(apiData.talents),
    items: apiData.items,
  };
}

export function modelToApi(career: Career): CareerApiData {
  return {
    name: career.name,
    description: career.description,
    class: career.careerClass,
    species: [...career.species],
    level1: careerLevelToCareerLevelApiData(career.level1),
    level2: careerLevelToCareerLevelApiData(career.level2),
    level3: careerLevelToCareerLevelApiData(career.level3),
    level4: careerLevelToCareerLevelApiData(career.level4),
    level5: careerLevelToCareerLevelApiData(career.level5),
    shared: career.shared,
    source: copySource(career.source),
  };
}

function careerLevelToCareerLevelApiData(careerLevel: CareerLevel): CareerLevelApiData {
  return {
    exists: careerLevel.exists,
    name: careerLevel.name,
    status: careerLevel.status,
    standing: careerLevel.standing,
    attributes: [...careerLevel.attributes],
    skills: [...careerLevel.skills],
    talents: [...careerLevel.talents],
    items: careerLevel.items,
  };
}

export class CareerApi implements WhApi<Career, CareerApiData> {
  getElement: (id: string) => Promise<Career>;
  listElements: (id: string) => Promise<Career[]>;
  createElement: (wh: Career) => Promise<ApiResponse<CareerApiData>>;
  updateElement: (wh: Career) => Promise<ApiResponse<CareerApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
