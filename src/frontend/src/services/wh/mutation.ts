import { Source } from "./source.ts";
import { CharacterModifiers } from "./characterModifiers.ts";
import { WhProperty } from "./crudGenerator.ts";

// const API_BASE_PATH = "/api/wh/mutation";

type MutationType = 0 | 1;
export interface MutationApiData {
  name: string;
  description: string;
  type: MutationType;
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;
}

export class Mutation implements WhProperty {
  id: string;
  canEdit: boolean;
  hasModifiers: boolean;
  name: string;
  description: string;
  type: MutationType;
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    hasModifiers = false,
    name = "",
    description = "",
    type = 0 as MutationType,
    modifiers = new CharacterModifiers(),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.hasModifiers = hasModifiers;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.type = type;
    this.modifiers = modifiers;
    this.shared = shared;
    this.source = source;
  }

  copy() {}
}
