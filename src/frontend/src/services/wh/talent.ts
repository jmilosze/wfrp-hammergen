import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import { Source, copySource, sourceIsValid } from "./source.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ApiResponse, validIntegerFn, validLongDescFn, validShortDescFn, Visibility, WhEntity } from "./common.ts";
import { AttributeName, Attributes, getAttributeValue, printAttributeName } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { updateSet } from "../../utils/set.ts";
import { isEqualEntity } from "../../utils/equal.ts";

const API_BASE_PATH = "/api/wh/talent";

const TALENT_GROUP_IGNORED_KEYS: ReadonlySet<string> = new Set([
  "tests",
  "maxRank",
  "attribute",
  "attribute2",
  "group",
  "modifiers",
]);

export interface TalentApiData {
  name: string;
  description: string;
  tests: string;
  maxRank: number;
  attribute: AttributeName;
  attribute2: AttributeName;
  isGroup: boolean;
  group: string[];
  modifiers: CharacterModifiersData;
  visibility?: Visibility;
  source: Source;
}

export class Talent extends WhEntity {
  tests: string;
  maxRank: number;
  attribute: AttributeName;
  attribute2: AttributeName;
  isGroup: boolean;
  group: Set<string>;
  modifiers: CharacterModifiers;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    tests = "",
    maxRank = 0,
    attribute = AttributeName.None,
    attribute2 = AttributeName.None,
    isGroup = false,
    group = new Set<string>(),
    modifiers = new CharacterModifiers(),
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.tests = tests;
    this.maxRank = maxRank;
    this.attribute = attribute;
    this.attribute2 = attribute2;
    this.isGroup = isGroup;
    this.group = group;
    this.modifiers = modifiers;
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validateTests(): ValidationStatus {
    return validShortDescFn(this.tests);
  }

  validateMaxRank(): ValidationStatus {
    return validIntegerFn(this.maxRank, 0, 99);
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      this.validateTests().valid &&
      this.validateMaxRank().valid &&
      sourceIsValid(this.source)
    );
  }

  override isEqualTo(otherTalent: unknown): boolean {
    if (!(otherTalent instanceof Talent) || this.isGroup !== otherTalent.isGroup) {
      return false;
    }
    if (this.isGroup) {
      return isEqualEntity(this, otherTalent, { ignoredKeys: TALENT_GROUP_IGNORED_KEYS });
    }
    return isEqualEntity(this, otherTalent);
  }

  getMaxRank(attributes: Attributes): number {
    return (
      this.maxRank +
      Math.floor(getAttributeValue(this.attribute, attributes) / 10) +
      Math.floor(getAttributeValue(this.attribute2, attributes) / 10)
    );
  }

  getMaxRankDisplay(): string {
    if (this.isGroup) {
      return "";
    }

    const constPart: string = this.maxRank > 0 ? this.maxRank.toString() : "";
    const attName: string = printAttributeName(this.attribute);
    const att2Name: string = printAttributeName(this.attribute2);
    let bonusPart: string = this.attribute !== AttributeName.None ? attName + " Bonus" : "";
    bonusPart += this.attribute2 !== AttributeName.None ? ` + ${att2Name} Bonus` : "";

    if (constPart !== "" && bonusPart !== "") {
      return constPart + " + " + bonusPart;
    } else {
      return constPart + bonusPart;
    }
  }

  updateGroup(id: string, selected: boolean): void {
    updateSet(this.group, id, selected);
  }
}

export function apiResponseToModel(talentApi: ApiResponse<TalentApiData>): Talent {
  return new Talent({
    id: talentApi.id,
    ownerId: talentApi.ownerId,
    visibility: talentApi.visibility,
    name: talentApi.object.name,
    description: talentApi.object.description,
    tests: talentApi.object.tests,
    maxRank: talentApi.object.maxRank,
    attribute: talentApi.object.attribute,
    attribute2: talentApi.object.attribute2,
    isGroup: talentApi.object.isGroup,
    group: new Set(talentApi.object.group),
    modifiers: new CharacterModifiers(talentApi.object.modifiers),
    source: talentApi.object.source,
  });
}

export function modelToApi(talent: Talent): TalentApiData {
  return {
    name: talent.name,
    description: talent.description,
    tests: talent.tests,
    maxRank: talent.maxRank,
    attribute: talent.attribute,
    attribute2: talent.attribute2,
    isGroup: talent.isGroup,
    group: [...talent.group],
    modifiers: talent.modifiers.toData(),
    visibility: talent.visibility,
    source: copySource(talent.source),
  };
}

export const talentApi = defineWhApi<Talent, TalentApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

