import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import { Source, copySource, updateSource, sourceIsValid } from "./source.ts";
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
import { AttributeName, printAttributeName } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { areEqual } from "../../utils/set.ts";

const API_BASE_PATH = "/api/wh/talent";

export interface TalentApiData {
  name: string;
  description: string;
  tests: string;
  maxRank: number;
  attribute: AttributeName;
  isGroup: boolean;
  group: string[];
  modifiers: CharacterModifiersData;
  shared: boolean;
  source: Source;
}

export class Talent implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  tests: string;
  maxRank: number;
  attribute: AttributeName;
  isGroup: boolean;
  group: Set<string>;
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    tests = "",
    maxRank = 0,
    attribute = AttributeName.None,
    isGroup = false,
    group = new Set<string>(),
    modifiers = new CharacterModifiers(),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.tests = tests;
    this.maxRank = maxRank;
    this.attribute = attribute;
    this.isGroup = isGroup;
    this.group = group;
    this.modifiers = modifiers;
    this.shared = shared;
    this.source = source;
  }

  copy(): Talent {
    return new Talent({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      tests: this.tests,
      maxRank: this.maxRank,
      attribute: this.attribute,
      isGroup: this.isGroup,
      group: new Set(...[this.group]),
      modifiers: this.modifiers.copy(),
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

  isEqualTo(otherTalent: WhProperty): boolean {
    if (!(otherTalent instanceof Talent)) {
      return false;
    }
    if (
      this.id !== otherTalent.id ||
      this.canEdit !== otherTalent.canEdit ||
      this.name !== otherTalent.name ||
      this.description !== otherTalent.description ||
      this.isGroup !== otherTalent.isGroup ||
      this.shared !== otherTalent.shared ||
      !objectsAreEqual(this.source, otherTalent.source)
    ) {
      return false;
    }

    if (this.isGroup) {
      return true;
    }

    if (
      this.tests !== otherTalent.tests ||
      this.maxRank !== otherTalent.maxRank ||
      this.attribute !== otherTalent.attribute
    ) {
      return false;
    }

    if (!areEqual(this.group, otherTalent.group)) {
      return false;
    }

    return this.modifiers.isEqualTo(otherTalent.modifiers);
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  maxRankDisplay(): string {
    if (this.isGroup) {
      return "";
    }

    const constPart: string = this.maxRank > 0 ? this.maxRank.toString() : "";
    const attName: string = printAttributeName(this.attribute);
    const bonusPart: string = this.attribute !== AttributeName.None ? attName + " Bonus" : "";

    if (constPart !== "" && bonusPart !== "") {
      return constPart + " + " + bonusPart;
    } else {
      return constPart + bonusPart;
    }
  }
}

export function apiResponseToModel(talentApi: ApiResponse<TalentApiData>): Talent {
  return new Talent({
    id: talentApi.id,
    canEdit: talentApi.canEdit,
    name: talentApi.object.name,
    description: talentApi.object.description,
    tests: talentApi.object.tests,
    maxRank: talentApi.object.maxRank,
    attribute: talentApi.object.attribute,
    isGroup: talentApi.object.isGroup,
    group: new Set(talentApi.object.group),
    modifiers: new CharacterModifiers(talentApi.object.modifiers),
    shared: talentApi.object.shared,
    source: copySource(talentApi.object.source),
  });
}

export function modelToApi(talent: Talent): TalentApiData {
  return {
    name: talent.name,
    description: talent.description,
    tests: talent.tests,
    maxRank: talent.maxRank,
    attribute: talent.attribute,
    isGroup: talent.isGroup,
    group: [...talent.group],
    modifiers: talent.modifiers.copy(),
    shared: talent.shared,
    source: copySource(talent.source),
  };
}

export class TalentApi implements WhApi<Talent, TalentApiData> {
  getElement: (id: string) => Promise<Talent>;
  listElements: (id: string) => Promise<Talent[]>;
  createElement: (wh: Talent) => Promise<ApiResponse<TalentApiData>>;
  updateElement: (wh: Talent) => Promise<ApiResponse<TalentApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
