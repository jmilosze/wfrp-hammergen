import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhApi, WhProperty } from "./common.ts";
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

export class Rune implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  labels: RuneLabel[];
  applicableTo: ItemType[];
  source: Source;

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
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.labels = labels;
    this.applicableTo = applicableTo;
    this.visibility = visibility;
    this.source = source;
  }

  copy(): Rune {
    return new Rune({
      id: this.id,
      ownerId: this.ownerId,
      visibility: this.visibility,
      name: this.name,
      description: this.description,
      labels: [...this.labels],
      applicableTo: [...this.applicableTo],
      source: copySource(this.source),
    });
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

  isEqualTo(otherRune: WhProperty): boolean {
    if (!(otherRune instanceof Rune)) {
      return false;
    }
    return (
      this.id === otherRune.id &&
      this.visibility === otherRune.visibility &&
      this.name === otherRune.name &&
      this.description === otherRune.description &&
      arraysAreEqualIgnoreOrder(this.applicableTo, otherRune.applicableTo) &&
      arraysAreEqualIgnoreOrder(this.labels, otherRune.labels) &&
      objectsAreEqual(this.source, otherRune.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(itemRuneApi: ApiResponse<RuneApiData>): Rune {
  const newRune = new Rune({
    id: itemRuneApi.id,
    ownerId: itemRuneApi.ownerId,
    visibility: itemRuneApi.visibility,
    name: itemRuneApi.object.name,
    description: itemRuneApi.object.description,
    labels: itemRuneApi.object.labels,
    applicableTo: itemRuneApi.object.applicableTo,
    source: itemRuneApi.object.source,
  });

  return newRune.copy();
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

export class RuneApi implements WhApi<Rune, RuneApiData> {
  getElement: (id: string) => Promise<Rune>;
  listElements: (id: string) => Promise<Rune[]>;
  createElement: (wh: Rune) => Promise<ApiResponse<RuneApiData>>;
  updateElement: (wh: Rune) => Promise<ApiResponse<RuneApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
