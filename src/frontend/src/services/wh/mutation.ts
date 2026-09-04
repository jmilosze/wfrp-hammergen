import { Source, copySource, updateSource, sourceIsValid } from "./source.ts";
import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { objectsAreEqual } from "../../utils/object.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/mutation";

export const enum MutationType {
  Physical = 0,
  Mental,
}

export const mutationTypeList = [MutationType.Physical, MutationType.Mental];

export function printMutationType(mutationType: MutationType): string {
  switch (mutationType) {
    case MutationType.Physical:
      return "Physical";
    case MutationType.Mental:
      return "Mental";
    default:
      return "";
  }
}

export interface MutationApiData {
  name: string;
  description: string;
  type: MutationType;
  modifiers: CharacterModifiersData;
  visibility?: Visibility;
  source: Source;
}

export class Mutation implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  type: MutationType;
  modifiers: CharacterModifiers;
  source: Source;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    type = MutationType.Physical,
    modifiers = new CharacterModifiers(),
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.type = type;
    this.modifiers = modifiers;
    this.visibility = visibility;
    this.source = source;
  }

  copy(): Mutation {
    return new Mutation({
      id: this.id,
      ownerId: this.ownerId,
      visibility: this.visibility,
      name: this.name,
      description: this.description,
      type: this.type,
      modifiers: this.modifiers.copy(),
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
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      this.modifiers.isValid() &&
      sourceIsValid(this.source)
    );
  }

  isEqualTo(otherMutation: WhProperty): boolean {
    if (!(otherMutation instanceof Mutation)) {
      return false;
    }
    return (
      this.id === otherMutation.id &&
      this.visibility === otherMutation.visibility &&
      this.name === otherMutation.name &&
      this.description === otherMutation.description &&
      this.type === otherMutation.type &&
      this.modifiers.isEqualTo(otherMutation.modifiers) &&
      objectsAreEqual(this.source, otherMutation.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(mutationApi: ApiResponse<MutationApiData>): Mutation {
  const newMutation = new Mutation({
    id: mutationApi.id,
    ownerId: mutationApi.ownerId,
    visibility: mutationApi.visibility,
    name: mutationApi.object.name,
    description: mutationApi.object.description,
    type: mutationApi.object.type,
    modifiers: new CharacterModifiers(mutationApi.object.modifiers),
    source: mutationApi.object.source,
  });

  return newMutation.copy();
}

export function modelToApi(mutation: Mutation): MutationApiData {
  return {
    name: mutation.name,
    description: mutation.description,
    type: mutation.type,
    modifiers: mutation.modifiers.toData(),
    visibility: mutation.visibility,
    source: copySource(mutation.source),
  };
}

export class MutationApi implements WhApi<Mutation, MutationApiData> {
  getElement: (id: string) => Promise<Mutation>;
  listElements: (id: string) => Promise<Mutation[]>;
  createElement: (wh: Mutation) => Promise<ApiResponse<MutationApiData>>;
  updateElement: (wh: Mutation) => Promise<ApiResponse<MutationApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
