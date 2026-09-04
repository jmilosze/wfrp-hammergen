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

export const enum ItemPropertyType {
  Quality = 0,
  Flaw,
}
export const itemPropertyTypeList = [ItemPropertyType.Quality, ItemPropertyType.Flaw];

export function printItemPropertyType(itemPropertyType: ItemPropertyType) {
  switch (itemPropertyType) {
    case ItemPropertyType.Quality:
      return "Quality";
    case ItemPropertyType.Flaw:
      return "Flaw";
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
  visibility?: Visibility;
  source: Source;
}

export class ItemProperty implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  type: ItemPropertyType;
  applicableTo: ItemType[];
  source: Source;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    type = ItemPropertyType.Quality,
    applicableTo = [] as ItemType[],
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.type = type;
    this.applicableTo = applicableTo;
    this.visibility = visibility;
    this.source = source;
  }

  copy(): ItemProperty {
    return new ItemProperty({
      id: this.id,
      ownerId: this.ownerId,
      visibility: this.visibility,
      name: this.name,
      description: this.description,
      type: this.type,
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

  isEqualTo(otherItemProperty: WhProperty): boolean {
    if (!(otherItemProperty instanceof ItemProperty)) {
      return false;
    }
    return (
      this.id === otherItemProperty.id &&
      this.visibility === otherItemProperty.visibility &&
      this.name === otherItemProperty.name &&
      this.description === otherItemProperty.description &&
      this.type === otherItemProperty.type &&
      arraysAreEqualIgnoreOrder(this.applicableTo, otherItemProperty.applicableTo) &&
      objectsAreEqual(this.source, otherItemProperty.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(itemPropertyApi: ApiResponse<ItemPropertyApiData>): ItemProperty {
  const newProperty = new ItemProperty({
    id: itemPropertyApi.id,
    ownerId: itemPropertyApi.ownerId,
    visibility: itemPropertyApi.visibility,
    name: itemPropertyApi.object.name,
    description: itemPropertyApi.object.description,
    type: itemPropertyApi.object.type,
    applicableTo: itemPropertyApi.object.applicableTo,
    source: itemPropertyApi.object.source,
  });

  return newProperty.copy();
}

export function modelToApi(itemProperty: ItemProperty): ItemPropertyApiData {
  return {
    name: itemProperty.name,
    description: itemProperty.description,
    type: itemProperty.type,
    applicableTo: [...itemProperty.applicableTo],
    visibility: itemProperty.visibility,
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
