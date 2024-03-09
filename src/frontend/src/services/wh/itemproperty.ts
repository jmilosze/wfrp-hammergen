import { copySource, Source, updateSource } from "./source.ts";
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
import { ItemType } from "./item.ts";
import { ValidationStatus } from "../../utils/validation.ts";

export const enum ItemPropertyType {
  Quality = 0,
  Flaw,
  DwarfRune,
}
export const itemPropertyTypeList = [ItemPropertyType.Quality, ItemPropertyType.Flaw, ItemPropertyType.DwarfRune];

export function printItemPropertyType(itemPropertyType: ItemPropertyType) {
  switch (itemPropertyType) {
    case ItemPropertyType.Quality:
      return "Quality";
    case ItemPropertyType.Flaw:
      return "Flaw";
    case ItemPropertyType.DwarfRune:
      return "Dwarf rune";
    default:
      return "";
  }
}

const API_BASE_PATH = "/api/wh/property";

export interface ItemPropertyApiData {
  name: string;
  description: string;
  type: ItemPropertyType;
  applicableTo: ItemType[];
  shared: boolean;
  source: Source;
}

export class ItemProperty implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  type: ItemPropertyType;
  applicableTo: ItemType[];
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    type = ItemPropertyType.Quality,
    applicableTo = [] as ItemType[],
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.type = type;
    this.applicableTo = JSON.parse(JSON.stringify(applicableTo));
    this.shared = shared;
    this.source = source;
  }

  copy(): ItemProperty {
    return new ItemProperty({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      type: this.type,
      applicableTo: JSON.parse(JSON.stringify(this.applicableTo)),
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
      this.validateName().valid && this.validateDescription().valid
      // Finish implementation
    );
  }

  isEqualTo(otherItemProperty: WhProperty): boolean {
    if (!(otherItemProperty instanceof ItemProperty)) {
      return false;
    }
    return (
      this.id === otherItemProperty.id &&
      this.canEdit === otherItemProperty.canEdit &&
      this.name === otherItemProperty.name &&
      this.description === otherItemProperty.description &&
      this.type === otherItemProperty.type &&
      this.shared === otherItemProperty.shared &&
      arraysAreEqualIgnoreOrder(this.applicableTo, otherItemProperty.applicableTo) &&
      objectsAreEqual(this.source, otherItemProperty.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(itemPropertyApi: ApiResponse<ItemPropertyApiData>): ItemProperty {
  return new ItemProperty({
    id: itemPropertyApi.id,
    canEdit: itemPropertyApi.canEdit,
    name: itemPropertyApi.object.name,
    description: itemPropertyApi.object.description,
    type: itemPropertyApi.object.type,
    applicableTo: itemPropertyApi.object.applicableTo,
    shared: itemPropertyApi.object.shared,
    source: copySource(itemPropertyApi.object.source),
  });
}

export function modelToApi(itemProperty: ItemProperty): ItemPropertyApiData {
  return {
    name: itemProperty.name,
    description: itemProperty.description,
    type: itemProperty.type,
    applicableTo: itemProperty.applicableTo,
    shared: itemProperty.shared,
    source: copySource(itemProperty.source),
  };
}

export class ItemPropertyApi implements WhApi<ItemProperty, ItemPropertyApiData> {
  getElement: (id: string) => Promise<ItemProperty>;
  listElements: (id: string) => Promise<ItemProperty[]>;
  createElement: (wh: ItemProperty) => Promise<ApiResponse<ItemPropertyApiData>>;
  updateElement: (wh: ItemProperty) => Promise<ApiResponse<ItemPropertyApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
