import { copySource, Source } from "./source.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/arrayUtils.ts";
import { AxiosInstance } from "axios";
import { objectsAreEqual } from "../../utils/objectUtils.ts";
import { ApiResponse, WhProperty } from "./common.ts";

export const enum SkillAttribute {
  WS = 1,
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

export const enum SkillType {
  Basic = 0,
  Advanced,
  Mixed,
}

const API_BASE_PATH = "/api/wh/skill";

export interface SkillApiData {
  name: string;
  description: string;
  attribute: SkillAttribute;
  type: SkillType;
  displayZero: boolean;
  isGroup: boolean;
  group: string[];
  shared: boolean;
  source: Source;
}

export class Skill implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  attribute: SkillAttribute;
  type: number;
  displayZero: boolean;
  isGroup: boolean;
  group: string[];
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    attribute = SkillAttribute.Ag,
    type = SkillType.Basic,
    displayZero = false,
    isGroup = false,
    group = [] as string[],
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.attribute = attribute;
    this.type = type;
    this.displayZero = displayZero;
    this.isGroup = isGroup;
    this.group = JSON.parse(JSON.stringify(group));
    this.shared = shared;
    this.source = source;
  }

  copy() {
    return new Skill({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      attribute: this.attribute,
      type: this.type,
      displayZero: this.displayZero,
      isGroup: this.isGroup,
      group: JSON.parse(JSON.stringify(this.group)),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  isEqualTo(otherSkill: Skill): boolean {
    return (
      this.id === otherSkill.id &&
      this.canEdit === otherSkill.canEdit &&
      this.name === otherSkill.name &&
      this.description === otherSkill.description &&
      this.attribute === otherSkill.attribute &&
      this.type === otherSkill.type &&
      this.displayZero === otherSkill.displayZero &&
      this.isGroup === otherSkill.isGroup &&
      this.shared === otherSkill.shared &&
      objectsAreEqual(this.source, otherSkill.source) &&
      arraysAreEqualIgnoreOrder(this.group, otherSkill.group)
    );
  }
}

export function apiResponseToModel(talentApi: ApiResponse<SkillApiData>): Skill {
  return new Skill({
    id: talentApi.id,
    canEdit: talentApi.canEdit,
    name: talentApi.object.name,
    description: talentApi.object.description,
    attribute: talentApi.object.attribute,
    type: talentApi.object.type,
    displayZero: talentApi.object.displayZero,
    isGroup: talentApi.object.isGroup,
    group: JSON.parse(JSON.stringify(talentApi.object.group)),
    shared: talentApi.object.shared,
    source: copySource(talentApi.object.source),
  });
}

export function modelToApi(skill: Skill): SkillApiData {
  return {
    name: skill.name,
    description: skill.description,
    attribute: skill.attribute,
    type: skill.type,
    displayZero: skill.displayZero,
    isGroup: skill.isGroup,
    group: JSON.parse(JSON.stringify(skill.group)),
    shared: skill.shared,
    source: copySource(skill.source),
  };
}

export class SkillApi {
  getElement: (id: string) => Promise<Skill>;
  listElements: (id: string) => Promise<Skill[]>;
  createElement: (wh: Skill) => Promise<ApiResponse<SkillApiData>>;
  updateElement: (wh: Skill) => Promise<ApiResponse<SkillApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
