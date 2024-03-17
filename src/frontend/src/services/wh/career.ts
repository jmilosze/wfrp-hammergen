import { AttributeName, racialAttributes } from "./attributes.ts";
import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import { ApiResponse, validShortDescFn, WhApi, WhProperty } from "./common.ts";
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
import { setsAreEqual } from "../../utils/set.ts";

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

export function printStatusTier(statusTier: StatusTier) {
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

export type StatusStanding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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

export type CareerLevel = {
  name: string;
  status: StatusTier;
  standing: StatusStanding;
  attributes: AttributeName[];
  skills: Set<string>;
  talents: Set<string>;
  items: string;
};

export type CareerLevelApiData = {
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
  shared: boolean;
  source: Source;
}

const zeroCareerLevel: CareerLevel = {
  name: "",
  status: StatusTier.Brass,
  standing: 0,
  attributes: JSON.parse(JSON.stringify(racialAttributes.none)),
  skills: new Set<string>(),
  talents: new Set<string>(),
  items: "",
};

const careerLevelEqual = (careerLevel: CareerLevel, OtherCareerLevel: CareerLevel): boolean => {
  return (
    careerLevel.name === OtherCareerLevel.name &&
    careerLevel.status === OtherCareerLevel.status &&
    careerLevel.standing === OtherCareerLevel.standing &&
    arraysAreEqualIgnoreOrder(careerLevel.attributes, OtherCareerLevel.attributes) &&
    setsAreEqual(careerLevel.skills, OtherCareerLevel.skills) &&
    setsAreEqual(careerLevel.talents, OtherCareerLevel.talents) &&
    careerLevel.items === OtherCareerLevel.items
  );
};

export class Career implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  species: Species[];
  careerClass: CareerClass;
  level1: CareerLevel;
  level2: CareerLevel;
  level3: CareerLevel;
  level4: CareerLevel;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    species = [Species.Human],
    careerClass = CareerClass.Academic,
    level1 = copyCareerLevel(zeroCareerLevel),
    level2 = copyCareerLevel(zeroCareerLevel),
    level3 = copyCareerLevel(zeroCareerLevel),
    level4 = copyCareerLevel(zeroCareerLevel),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.species = species;
    this.careerClass = careerClass;
    this.level1 = level1;
    this.level2 = level2;
    this.level3 = level3;
    this.level4 = level4;
    this.shared = shared;
    this.source = source;
  }

  copy(): Career {
    return new Career({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      species: [...this.species],
      careerClass: this.careerClass,
      level1: copyCareerLevel(this.level1),
      level2: copyCareerLevel(this.level2),
      level3: copyCareerLevel(this.level3),
      level4: copyCareerLevel(this.level4),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validShortDescFn(this.description);
  }

  isValid(): boolean {
    return (
      this.validateName().valid && this.validateDescription().valid && sourceIsValid(this.source)
      // Finish implementation
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
      this.shared === otherCareer.shared &&
      objectsAreEqual(this.source, otherCareer.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  getLevel(level: 1 | 2 | 3 | 4): CareerLevel {
    switch (level) {
      case 1:
        return this.level1;
      case 2:
        return this.level2;
      case 3:
        return this.level3;
      case 4:
        return this.level4;
      default:
        return zeroCareerLevel;
    }
  }
}

function copyCareerLevel(careerLevel: CareerLevel): CareerLevel {
  return {
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
    canEdit: careerApi.canEdit,
    name: careerApi.object.name,
    description: careerApi.object.description,
    careerClass: careerApi.object.class,
    species: [...careerApi.object.species],
    level1: careerLevelApiDataToCareerLevel(careerApi.object.level1),
    level2: careerLevelApiDataToCareerLevel(careerApi.object.level2),
    level3: careerLevelApiDataToCareerLevel(careerApi.object.level3),
    level4: careerLevelApiDataToCareerLevel(careerApi.object.level4),
    shared: careerApi.object.shared,
    source: copySource(careerApi.object.source),
  });
}

function careerLevelApiDataToCareerLevel(apiData: CareerLevelApiData): CareerLevel {
  return {
    name: apiData.name,
    status: apiData.status,
    standing: apiData.standing,
    attributes: [...apiData.attributes],
    skills: new Set([...apiData.skills]),
    talents: new Set([...apiData.talents]),
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
    shared: career.shared,
    source: copySource(career.source),
  };
}

function careerLevelToCareerLevelApiData(careerLevel: CareerLevel): CareerLevelApiData {
  return {
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
