import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { Source, copySource, updateSource, sourceIsValid } from "./source.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { ApiResponse, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/spell";

export interface SpellApiData {
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: Source;
}

export class Spell implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: Source;

  constructor({
    id = "",
    name = "",
    cn = 0,
    range = "",
    target = "",
    duration = "",
    description = "",
    canEdit = false,
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.name = name;
    this.cn = cn;
    this.range = range;
    this.target = target;
    this.duration = duration;
    this.description = description;
    this.canEdit = canEdit;
    this.shared = shared;
    this.source = source;
  }

  copy(): Spell {
    return new Spell({
      id: this.id,
      name: this.name,
      cn: this.cn,
      range: this.range,
      target: this.target,
      duration: this.duration,
      description: this.description,
      canEdit: this.canEdit,
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
      this.validateName().valid && this.validateDescription().valid && sourceIsValid(this.source)
      // Finish implementation
    );
  }

  isEqualTo(otherSpell: WhProperty): boolean {
    if (!(otherSpell instanceof Spell)) {
      return false;
    }
    return (
      this.id === otherSpell.id &&
      this.canEdit === otherSpell.canEdit &&
      this.name === otherSpell.name &&
      this.cn === otherSpell.cn &&
      this.range === otherSpell.range &&
      this.target === otherSpell.target &&
      this.duration === otherSpell.duration &&
      this.description === otherSpell.description &&
      this.shared === otherSpell.shared &&
      objectsAreEqual(this.source, otherSpell.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(spellApi: ApiResponse<SpellApiData>): Spell {
  return new Spell({
    id: spellApi.id,
    canEdit: spellApi.canEdit,
    name: spellApi.object.name,
    cn: spellApi.object.cn,
    range: spellApi.object.range,
    target: spellApi.object.target,
    duration: spellApi.object.duration,
    description: spellApi.object.description,
    shared: spellApi.object.shared,
    source: spellApi.object.source,
  });
}

export function modelToApi(spell: Spell): SpellApiData {
  return {
    name: spell.name,
    cn: spell.cn,
    range: spell.range,
    target: spell.target,
    duration: spell.duration,
    description: spell.description,
    shared: spell.shared,
    source: spell.source,
  };
}

export class SpellApi implements WhApi<Spell, SpellApiData> {
  getElement: (id: string) => Promise<Spell>;
  listElements: (id: string) => Promise<Spell[]>;
  createElement: (wh: Spell) => Promise<ApiResponse<SpellApiData>>;
  updateElement: (wh: Spell) => Promise<ApiResponse<SpellApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
