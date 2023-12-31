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

interface WhSpellApi {
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
}

function apiResponseToModel(whSpellApi: WhApiResponse<WhSpellApi>): WhSpell {
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

function modelToApi(whSpell: WhSpell): WhSpellApi {
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

export class SpellApi {
  getElement: (id: string) => Promise<WhSpell>;
  listElements: (id: string) => Promise<WhSpell[]>;
  createElement: (wh: WhSpell) => Promise<WhApiResponse<WhSpellApi>>;
  updateElement: (wh: WhSpell) => Promise<WhApiResponse<WhSpellApi>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}

export const compareSpell = (spell1: WhSpell, spell2: WhSpell) => {
  if (
    spell1.name != spell2.name ||
    spell1.cn != spell2.cn ||
    spell1.range != spell2.range ||
    spell1.target != spell2.target ||
    spell1.duration != spell2.duration ||
    spell1.description != spell2.description ||
    spell1.shared != spell2.shared
  ) {
    return false;
  }

  return compareWhSources(spell1.source, spell2.source);
};
