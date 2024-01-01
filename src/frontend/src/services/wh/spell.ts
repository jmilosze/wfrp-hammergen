import { compareWhSources, defaultSource, Wh, WhApiResponse, WhSource } from "./common.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";

const API_BASE_PATH = "/api/wh/spell";

export interface WhSpellApiData {
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: WhSource;
}

export class WhSpell implements Wh {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: WhSource;

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
    const spell = new WhSpell();
    spell.canEdit = canEdit;
    spell.shared = true;
    spell.source = defaultSource();
    return spell;
  }

  copy() {
    const newSpell = new WhSpell();
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

  isEqualTo(otherSpell: WhSpell): boolean {
    if (
      this.id != otherSpell.id ||
      this.canEdit != otherSpell.canEdit ||
      this.name != otherSpell.name ||
      this.cn != otherSpell.cn ||
      this.range != otherSpell.range ||
      this.target != otherSpell.target ||
      this.duration != otherSpell.duration ||
      this.description != otherSpell.description ||
      this.shared != otherSpell.shared
    ) {
      return false;
    }

    return compareWhSources(this.source, otherSpell.source);
  }
}

export function apiResponseToModel(whSpellApi: WhApiResponse<WhSpellApiData>): WhSpell {
  const spell = new WhSpell();
  spell.id = whSpellApi.id;
  spell.canEdit = whSpellApi.canEdit;
  spell.name = whSpellApi.object.name;
  spell.cn = whSpellApi.object.cn;
  spell.range = whSpellApi.object.range;
  spell.target = whSpellApi.object.target;
  spell.duration = whSpellApi.object.duration;
  spell.description = whSpellApi.object.description;
  spell.shared = whSpellApi.object.shared;
  spell.source = whSpellApi.object.source;

  return spell;
}

export function modelToApi(whSpell: WhSpell): WhSpellApiData {
  return {
    name: whSpell.name,
    cn: whSpell.cn,
    range: whSpell.range,
    target: whSpell.target,
    duration: whSpell.duration,
    description: whSpell.description,
    shared: whSpell.shared,
    source: whSpell.source,
  };
}

export class WhSpellApi {
  getElement: (id: string) => Promise<WhSpell>;
  listElements: (id: string) => Promise<WhSpell[]>;
  createElement: (wh: WhSpell) => Promise<WhApiResponse<WhSpellApiData>>;
  updateElement: (wh: WhSpell) => Promise<WhApiResponse<WhSpellApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
