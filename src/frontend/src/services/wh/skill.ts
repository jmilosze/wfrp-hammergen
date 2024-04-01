import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { objectsAreEqual } from "../../utils/object.ts";
import { ApiResponse, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { AttributeName } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { setsAreEqual } from "../../utils/set.ts";

export const enum SkillType {
  Basic = 0,
  Advanced,
  Mixed,
}

export const skillTypeList = [SkillType.Basic, SkillType.Advanced, SkillType.Mixed];

export function printSkillType(skillType: SkillType) {
  switch (skillType) {
    case SkillType.Basic:
      return "Basic";
    case SkillType.Advanced:
      return "Advanced";
    case SkillType.Mixed:
      return "Mixed";
    default:
      return "";
  }
}

const API_BASE_PATH = "/api/wh/skill";

export interface SkillApiData {
  name: string;
  description: string;
  attribute: AttributeName;
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
  attribute: AttributeName;
  type: number;
  displayZero: boolean;
  isGroup: boolean;
  group: Set<string>;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    attribute = AttributeName.WS,
    type = SkillType.Basic,
    displayZero = false,
    isGroup = false,
    group = new Set<string>(),
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
    this.group = group;
    this.shared = shared;
    this.source = source;
  }

  copy(): Skill {
    return new Skill({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      attribute: this.attribute,
      type: this.type,
      displayZero: this.displayZero,
      isGroup: this.isGroup,
      group: new Set(this.group),
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

  isEqualTo(otherSkill: WhProperty): boolean {
    if (!(otherSkill instanceof Skill)) {
      return false;
    }
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
      setsAreEqual(this.group, otherSkill.group)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(skillApi: ApiResponse<SkillApiData>): Skill {
  const newSkill = new Skill({
    id: skillApi.id,
    canEdit: skillApi.canEdit,
    name: skillApi.object.name,
    description: skillApi.object.description,
    attribute: skillApi.object.attribute,
    type: skillApi.object.type,
    displayZero: skillApi.object.displayZero,
    isGroup: skillApi.object.isGroup,
    group: new Set(skillApi.object.group),
    shared: skillApi.object.shared,
    source: skillApi.object.source,
  });

  return newSkill.copy();
}

export function modelToApi(skill: Skill): SkillApiData {
  return {
    name: skill.name,
    description: skill.description,
    attribute: skill.attribute,
    type: skill.type,
    displayZero: skill.displayZero,
    isGroup: skill.isGroup,
    group: [...skill.group],
    shared: skill.shared,
    source: copySource(skill.source),
  };
}

export class SkillApi implements WhApi<Skill, SkillApiData> {
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
