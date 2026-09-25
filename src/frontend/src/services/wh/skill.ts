import { copySource, Source, sourceIsValid } from "./source.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhEntity } from "./common.ts";
import { AttributeName, attributeNameList } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { updateSet } from "../../utils/set.ts";

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
  visibility?: Visibility;
  source: Source;
}

export class Skill extends WhEntity {
  attribute: AttributeName;
  type: number;
  displayZero: boolean;
  isGroup: boolean;
  group: Set<string>;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    attribute = AttributeName.WS,
    type = SkillType.Basic,
    displayZero = false,
    isGroup = false,
    group = new Set<string>(),
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.attribute = attribute;
    this.type = type;
    this.displayZero = displayZero;
    this.isGroup = isGroup;
    this.group = group;
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  isValid(): boolean {
    return this.validateName().valid && this.validateDescription().valid && sourceIsValid(this.source);
  }

  modifyGroup(id: string, selected: boolean): void {
    updateSet(this.group, id, selected);
  }
}

export function apiResponseToModel(skillApi: ApiResponse<SkillApiData>): Skill {
  return new Skill({
    id: skillApi.id,
    ownerId: skillApi.ownerId,
    visibility: skillApi.visibility,
    name: skillApi.object.name,
    description: skillApi.object.description,
    attribute: skillApi.object.attribute,
    type: skillApi.object.type,
    displayZero: skillApi.object.displayZero,
    isGroup: skillApi.object.isGroup,
    group: new Set(skillApi.object.group),
    source: skillApi.object.source,
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
    group: [...skill.group],
    visibility: skill.visibility,
    source: copySource(skill.source),
  };
}

export const skillApi = defineWhApi<Skill, SkillApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);


export function getSkillAttributeNameList(isGroup: boolean): AttributeName[] {
  if (isGroup) {
    return attributeNameList.filter((x) => x !== AttributeName.None);
  } else {
    return attributeNameList.filter((x) => x !== AttributeName.None && x !== AttributeName.Various);
  }
}

export function getSkillTypeList(isGroup: boolean): SkillType[] {
  return isGroup ? skillTypeList : skillTypeList.filter((x) => x !== SkillType.Mixed);
}
