import { CharacterModifiers, CharacterModifiersData } from "./characterModifiers.ts";
import { Source, copySource, sourceIsValid } from "./source.ts";
import { defineWhApi } from "./crudGenerator.ts";
import { ApiResponse, UI_EDITION, validLongDescFn, validShortDescFn, variant, Visibility, WhEntity } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/trait";

export interface TraitApiData {
  name: string;
  description: string;
  modifiers: CharacterModifiersData;
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
  const data = variant(traitApi, UI_EDITION);
  return new Trait({
    id: traitApi.id,
    ownerId: traitApi.ownerId,
    visibility: traitApi.visibility,
    name: data.name,
    description: data.description,
    modifiers: new CharacterModifiers(data.modifiers),
    source: data.source,
  });
}

export function modelToApi(trait: Trait): TraitApiData {
  return {
    name: trait.name,
    description: trait.description,
    modifiers: trait.modifiers.toData(),
    source: copySource(trait.source),
  };
}

export const traitApi = defineWhApi<Trait, TraitApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

