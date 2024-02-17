import { Source, copySource } from "./source.ts";
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
import { ApiResponse, WhApi, WhProperty } from "./common.ts";

const API_BASE_PATH = "/api/wh/mutation";

export const enum MutationType {
  Physical = 0,
  Mental,
}

export function printMutationType(mutationType: MutationType) {
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
  shared: boolean;
  source: Source;
}

export class Mutation implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  type: MutationType;
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    type = MutationType.Physical,
    modifiers = new CharacterModifiers(),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.type = type;
    this.modifiers = modifiers;
    this.shared = shared;
    this.source = source;
  }

  copy() {
    return new Mutation({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      type: this.type,
      modifiers: this.modifiers.copy(),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  isEqualTo(otherMutation: Mutation): boolean {
    return (
      this.id === otherMutation.id &&
      this.canEdit === otherMutation.canEdit &&
      this.name === otherMutation.name &&
      this.description === otherMutation.description &&
      this.type === otherMutation.type &&
      this.shared === otherMutation.shared &&
      this.modifiers.isEqualTo(otherMutation.modifiers) &&
      objectsAreEqual(this.source, otherMutation.source)
    );
  }
}

export function apiResponseToModel(mutationApi: ApiResponse<MutationApiData>): Mutation {
  return new Mutation({
    id: mutationApi.id,
    canEdit: mutationApi.canEdit,
    name: mutationApi.object.name,
    description: mutationApi.object.description,
    type: mutationApi.object.type,
    modifiers: new CharacterModifiers(mutationApi.object.modifiers),
    shared: mutationApi.object.shared,
    source: copySource(mutationApi.object.source),
  });
}

export function modelToApi(mutation: Mutation): MutationApiData {
  return {
    name: mutation.name,
    description: mutation.description,
    type: mutation.type,
    modifiers: mutation.modifiers.copy(),
    shared: mutation.shared,
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
