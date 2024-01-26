import { AttributeName, racialAttributes } from "./attributes.ts";
import { copySource, Source } from "./source.ts";
import { ApiResponse, WhProperty } from "./common.ts";
import { objectsAreEqual } from "../../utils/objectUtils.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/arrayUtils.ts";
import { AxiosInstance } from "axios";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";

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
      return "None";
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

export type CareerLevel = {
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
  level1: CareerLevel;
  level2: CareerLevel;
  level3: CareerLevel;
  level4: CareerLevel;
  shared: boolean;
  source: Source;
}

const zeroCareerLevel: CareerLevel = {
  name: "",
  status: StatusTier.Brass,
  standing: 0,
  attributes: JSON.parse(JSON.stringify(racialAttributes.none)),
  skills: [],
  talents: [],
  items: "",
};

const careerLevelEqual = (careerLevel: CareerLevel, OtherCareerLevel: CareerLevel): boolean => {
  return (
    careerLevel.name === OtherCareerLevel.name &&
    careerLevel.status === OtherCareerLevel.status &&
    careerLevel.standing === OtherCareerLevel.standing &&
    arraysAreEqualIgnoreOrder(careerLevel.attributes, OtherCareerLevel.attributes) &&
    arraysAreEqualIgnoreOrder(careerLevel.skills, OtherCareerLevel.skills) &&
    arraysAreEqualIgnoreOrder(careerLevel.talents, OtherCareerLevel.talents) &&
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
    level1 = zeroCareerLevel,
    level2 = zeroCareerLevel,
    level3 = zeroCareerLevel,
    level4 = zeroCareerLevel,
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.species = JSON.parse(JSON.stringify(species));
    this.careerClass = careerClass;
    this.level1 = JSON.parse(JSON.stringify(level1));
    this.level2 = JSON.parse(JSON.stringify(level2));
    this.level3 = JSON.parse(JSON.stringify(level3));
    this.level4 = JSON.parse(JSON.stringify(level4));
    this.shared = shared;
    this.source = source;
  }

  copy(): Career {
    return new Career({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      species: this.species,
      careerClass: this.careerClass,
      level1: JSON.parse(JSON.stringify(this.level1)),
      level2: JSON.parse(JSON.stringify(this.level2)),
      level3: JSON.parse(JSON.stringify(this.level3)),
      level4: JSON.parse(JSON.stringify(this.level4)),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  isEqualTo(otherCareer: Career): boolean {
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
}

export function apiResponseToModel(careerApi: ApiResponse<CareerApiData>): Career {
  return new Career({
    id: careerApi.id,
    canEdit: careerApi.canEdit,
    name: careerApi.object.name,
    description: careerApi.object.description,
    careerClass: careerApi.object.class,
    species: JSON.parse(JSON.stringify(careerApi.object.species)),
    level1: JSON.parse(JSON.stringify(careerApi.object.level1)),
    level2: JSON.parse(JSON.stringify(careerApi.object.level2)),
    level3: JSON.parse(JSON.stringify(careerApi.object.level3)),
    level4: JSON.parse(JSON.stringify(careerApi.object.level4)),
    shared: careerApi.object.shared,
    source: copySource(careerApi.object.source),
  });
}

export function modelToApi(career: Career): CareerApiData {
  return {
    name: career.name,
    description: career.description,
    class: career.careerClass,
    species: JSON.parse(JSON.stringify(career.species)),
    level1: JSON.parse(JSON.stringify(career.level1)),
    level2: JSON.parse(JSON.stringify(career.level2)),
    level3: JSON.parse(JSON.stringify(career.level3)),
    level4: JSON.parse(JSON.stringify(career.level4)),
    shared: career.shared,
    source: copySource(career.source),
  };
}

export class CareerApi {
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
