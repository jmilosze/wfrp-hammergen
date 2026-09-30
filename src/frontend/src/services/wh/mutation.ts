import { Source, copySource, sourceIsValid } from "./source.ts";
import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ApiResponse, UI_EDITION, validLongDescFn, validShortDescFn, variant, Visibility, WhEntity } from "./common.ts";
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
  source: Source;
}

export class Mutation extends WhEntity {
  type: MutationType;
  modifiers: CharacterModifiers;

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
    super({ id, ownerId, visibility, name, description, source });
    this.type = type;
    this.modifiers = modifiers;
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
}

export function apiResponseToModel(mutationApi: ApiResponse<MutationApiData>): Mutation {
  const data = variant(mutationApi, UI_EDITION);
  return new Mutation({
    id: mutationApi.id,
    ownerId: mutationApi.ownerId,
    visibility: mutationApi.visibility,
    name: data.name,
    description: data.description,
    type: data.type,
    modifiers: new CharacterModifiers(data.modifiers),
    source: data.source,
  });
}

export function modelToApi(mutation: Mutation): MutationApiData {
  return {
    name: mutation.name,
    description: mutation.description,
    type: mutation.type,
    modifiers: mutation.modifiers.toData(),
    source: copySource(mutation.source),
  };
}

export const mutationApi = defineWhApi<Mutation, MutationApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

