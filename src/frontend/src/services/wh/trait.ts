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
import { ApiResponse, validLongDescFn, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/trait";

export interface TraitApiData {
  name: string;
  description: string;
  modifiers: CharacterModifiersData;
  shared: boolean;
  source: Source;
}

export class Trait implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    modifiers = new CharacterModifiers(),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.modifiers = modifiers;
    this.shared = shared;
    this.source = source;
  }

  copy(): Trait {
    return new Trait({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      modifiers: this.modifiers.copy(),
      shared: this.shared,
      source: copySource(this.source),
    });
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

  isEqualTo(otherTrait: WhProperty): boolean {
    if (!(otherTrait instanceof Trait)) {
      return false;
    }
    if (
      this.id !== otherTrait.id ||
      this.canEdit !== otherTrait.canEdit ||
      this.name !== otherTrait.name ||
      this.description !== otherTrait.description ||
      this.shared !== otherTrait.shared ||
      !objectsAreEqual(this.source, otherTrait.source)
    ) {
      return false;
    }

    return this.modifiers.isEqualTo(otherTrait.modifiers);
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(traitApi: ApiResponse<TraitApiData>): Trait {
  const newTrait = new Trait({
    id: traitApi.id,
    canEdit: traitApi.canEdit,
    name: traitApi.object.name,
    description: traitApi.object.description,
    modifiers: new CharacterModifiers(traitApi.object.modifiers),
    shared: traitApi.object.shared,
    source: traitApi.object.source,
  });

  return newTrait.copy();
}

export function modelToApi(trait: Trait): TraitApiData {
  return {
    name: trait.name,
    description: trait.description,
    modifiers: trait.modifiers.toData(),
    shared: trait.shared,
    source: copySource(trait.source),
  };
}

export class TraitApi implements WhApi<Trait, TraitApiData> {
  getElement: (id: string) => Promise<Trait>;
  listElements: (id: string) => Promise<Trait[]>;
  createElement: (wh: Trait) => Promise<ApiResponse<TraitApiData>>;
  updateElement: (wh: Trait) => Promise<ApiResponse<TraitApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
