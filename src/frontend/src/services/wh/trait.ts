import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import { Source, copySource, sourceIsValid } from "./source.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhEntity } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/trait";

export interface TraitApiData {
  name: string;
  description: string;
  modifiers: CharacterModifiersData;
  visibility?: Visibility;
  source: Source;
}

export class Trait extends WhEntity {
  modifiers: CharacterModifiers;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    modifiers = new CharacterModifiers(),
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.modifiers = modifiers;
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
}

export function apiResponseToModel(traitApi: ApiResponse<TraitApiData>): Trait {
  return new Trait({
    id: traitApi.id,
    ownerId: traitApi.ownerId,
    visibility: traitApi.visibility,
    name: traitApi.object.name,
    description: traitApi.object.description,
    modifiers: new CharacterModifiers(traitApi.object.modifiers),
    source: traitApi.object.source,
  });
}

export function modelToApi(trait: Trait): TraitApiData {
  return {
    name: trait.name,
    description: trait.description,
    modifiers: trait.modifiers.toData(),
    visibility: trait.visibility,
    source: copySource(trait.source),
  };
}

export const traitApi = defineWhApi<Trait, TraitApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

