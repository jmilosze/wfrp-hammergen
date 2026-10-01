import { copySource, Source, sourceIsValid } from "./source.ts";
import { ApiResponse, Edition, validLongDescFn, validShortDescFn, variant, Visibility, WhEntity } from "./common.ts";
import { defineContentApi } from "./crudGenerator.ts";
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
  source: Source;
}

export class ItemProperty extends WhEntity {
  type: ItemPropertyType;
  applicableTo: ItemType[];

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
    super({ id, ownerId, visibility, name, description, source });
    this.type = type;
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

export function apiResponseToModel(itemPropertyApi: ApiResponse<ItemPropertyApiData>, edition: Edition): ItemProperty {
  const data = variant(itemPropertyApi, edition);
  return new ItemProperty({
    id: itemPropertyApi.id,
    ownerId: itemPropertyApi.ownerId,
    visibility: itemPropertyApi.visibility,
    name: data.name,
    description: data.description,
    type: data.type,
    applicableTo: data.applicableTo,
    source: data.source,
  });
}

export function modelToApi(itemProperty: ItemProperty): ItemPropertyApiData {
  return {
    name: itemProperty.name,
    description: itemProperty.description,
    type: itemProperty.type,
    applicableTo: [...itemProperty.applicableTo],
    source: copySource(itemProperty.source),
  };
}

export const itemPropertyApi = defineContentApi<ItemProperty, ItemPropertyApiData>(
  API_BASE_PATH,
  apiResponseToModel,
  modelToApi,
);
