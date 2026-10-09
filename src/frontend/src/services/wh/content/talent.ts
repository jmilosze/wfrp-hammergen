import { CharacterModifiers, CharacterModifiersData, effectsForEdition } from "../core/characterModifiers.ts";
import { Source, copySource, sourceIsValid } from "../core/source.ts";
import { defineContentApi, ApiResponse } from "../core/api.ts";
import { Edition, variant } from "../core/edition.ts";
import { validIntegerFn, validLongDescFn, validShortDescFn } from "../core/validators.ts";
import { Visibility, WhEntity } from "../core/entity.ts";
import { AttributeName, Attributes, getAttributeValue, printAttributeName } from "../core/attributes.ts";
import { ValidationStatus } from "../../../utils/validation.ts";
import { updateSet } from "../../../utils/set.ts";
import { isEqualEntity } from "../../../utils/equal.ts";

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

  // validateMaxRank: 999 means unlimited; a 5e talent (not a group) has a max rank of at least 1.
  validateMaxRank(edition: Edition): ValidationStatus {
    const min = edition === "5e" && !this.isGroup ? 1 : 0;
    return validIntegerFn(this.maxRank, min, 999);
  }

  // forEdition: a 5e talent has a fixed max rank only (no characteristic bonuses, at least 1) and no tests.
  forEdition(edition: Edition): this {
    const variant = super.forEdition(edition);
    variant.modifiers.effects = effectsForEdition(variant.modifiers.effects, edition);
    if (edition === "5e") {
      variant.tests = "";
      variant.attribute = AttributeName.None;
      variant.attribute2 = AttributeName.None;
      if (!variant.isGroup && variant.maxRank < 1) {
        variant.maxRank = 1;
      }
    }
    return variant;
  }

  isValid(edition: Edition): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      this.validateTests().valid &&
      this.validateMaxRank(edition).valid &&
      sourceIsValid(this.source)
    );
  }

  override isEqualTo(otherTalent: unknown): boolean {
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

export function apiResponseToModel(talentApi: ApiResponse<TalentApiData>, edition: Edition): Talent {
  const data = variant(talentApi, edition);
  return new Talent({
    id: talentApi.id,
    ownerId: talentApi.ownerId,
    visibility: talentApi.visibility,
    name: data.name,
    description: data.description,
    tests: data.tests,
    maxRank: data.maxRank,
    attribute: data.attribute,
    attribute2: data.attribute2,
    isGroup: data.isGroup,
    group: new Set(data.group),
    modifiers: new CharacterModifiers(data.modifiers),
    source: data.source,
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
    source: copySource(talent.source),
  };
}

export const talentApi = defineContentApi<Talent, TalentApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);
