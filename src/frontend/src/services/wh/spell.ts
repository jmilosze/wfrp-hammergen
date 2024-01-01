import {
  ApiResponse,
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
  WhProperty,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { compareWhSources, defaultSource, Source } from "./source.ts";

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

  constructor() {
    this.id = "";
    this.name = "name";
    this.cn = 0;
    this.range = "";
    this.target = "";
    this.duration = "";
    this.description = "";
    this.canEdit = false;
    this.shared = false;
    this.source = {};
  }

  newSpell(canEdit: boolean) {
    const spell = new Spell();
    spell.name = "New spell";
    spell.canEdit = canEdit;
    spell.shared = true;
    spell.source = defaultSource();
    return spell;
  }

  copy() {
    const newSpell = new Spell();
    newSpell.id = this.id;
    newSpell.name = this.name;
    newSpell.cn = this.cn;
    newSpell.range = this.range;
    newSpell.target = this.target;
    newSpell.duration = this.duration;
    newSpell.description = this.description;
    newSpell.canEdit = this.canEdit;
    newSpell.shared = this.shared;
    newSpell.source = JSON.parse(JSON.stringify(this.source));

    return newSpell;
  }

  isEqualTo(otherSpell: Spell): boolean {
    if (
      this.id !== otherSpell.id ||
      this.canEdit !== otherSpell.canEdit ||
      this.name !== otherSpell.name ||
      this.cn !== otherSpell.cn ||
      this.range !== otherSpell.range ||
      this.target !== otherSpell.target ||
      this.duration !== otherSpell.duration ||
      this.description !== otherSpell.description ||
      this.shared !== otherSpell.shared
    ) {
      return false;
    }

    return compareWhSources(this.source, otherSpell.source);
  }
}

export function apiResponseToModel(spellApi: ApiResponse<SpellApiData>): Spell {
  const spell = new Spell();
  spell.id = spellApi.id;
  spell.canEdit = spellApi.canEdit;
  spell.name = spellApi.object.name;
  spell.cn = spellApi.object.cn;
  spell.range = spellApi.object.range;
  spell.target = spellApi.object.target;
  spell.duration = spellApi.object.duration;
  spell.description = spellApi.object.description;
  spell.shared = spellApi.object.shared;
  spell.source = spellApi.object.source;

  return spell;
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

export class SpellApi {
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
