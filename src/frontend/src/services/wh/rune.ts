import { copySource, Source, sourceIsValid } from "./source.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhEntity } from "./common.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ItemType } from "./item.ts";
import { ValidationStatus } from "../../utils/validation.ts";

export const enum RuneLabel {
  RuneLabelWeapon = 0,
  RuneLabelArmour = 1,
  RuneLabelTalisman = 2,
  RuneLabelProtection = 3,
  RuneLabelEngineering = 4,
  RuneLabelDoom = 5,
  RuneLabelMaster = 6,
}

export const runeLabelList = [
  RuneLabel.RuneLabelWeapon,
  RuneLabel.RuneLabelArmour,
  RuneLabel.RuneLabelTalisman,
  RuneLabel.RuneLabelProtection,
  RuneLabel.RuneLabelEngineering,
  RuneLabel.RuneLabelDoom,
  RuneLabel.RuneLabelMaster,
];

export function printRuneLabel(runeLabel: RuneLabel) {
  switch (runeLabel) {
    case RuneLabel.RuneLabelWeapon:
      return "Weapon Rune";
    case RuneLabel.RuneLabelArmour:
      return "Armour Rune";
    case RuneLabel.RuneLabelTalisman:
      return "Runic Talisman";
    case RuneLabel.RuneLabelProtection:
      return "Protection Rune";
    case RuneLabel.RuneLabelEngineering:
      return "Engineering Rune";
    case RuneLabel.RuneLabelDoom:
      return "Doom Rune";
    case RuneLabel.RuneLabelMaster:
      return "Master Rune";
    default:
      return "";
  }
}

const API_BASE_PATH = "/api/wh/rune";

export interface RuneApiData {
  name: string;
  description: string;
  labels: RuneLabel[];
  applicableTo: ItemType[];
  visibility?: Visibility;
  source: Source;
}

export class Rune extends WhEntity {
  labels: RuneLabel[];
  applicableTo: ItemType[];

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    labels = [] as RuneLabel[],
    applicableTo = [] as ItemType[],
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.labels = labels;
    this.applicableTo = applicableTo;
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  // Other fields are selected from list, so no need for client side validation.

  isValid(): boolean {
    return this.validateName().valid && this.validateDescription().valid && sourceIsValid(this.source);
  }
}

export function apiResponseToModel(itemRuneApi: ApiResponse<RuneApiData>): Rune {
  return new Rune({
    id: itemRuneApi.id,
    ownerId: itemRuneApi.ownerId,
    visibility: itemRuneApi.visibility,
    name: itemRuneApi.object.name,
    description: itemRuneApi.object.description,
    labels: itemRuneApi.object.labels,
    applicableTo: itemRuneApi.object.applicableTo,
    source: itemRuneApi.object.source,
  });
}

export function modelToApi(itemRune: Rune): RuneApiData {
  return {
    name: itemRune.name,
    description: itemRune.description,
    labels: itemRune.labels,
    applicableTo: [...itemRune.applicableTo],
    visibility: itemRune.visibility,
    source: copySource(itemRune.source),
  };
}

export const runeApi = defineWhApi<Rune, RuneApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

