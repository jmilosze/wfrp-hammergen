import { Wh, WhSource } from "./common.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";

const API_BASE_PATH = "/api/wh/spell";

interface WhSpellApi extends Wh {
  object: {
    name: string;
    description: string;
    cn: number;
    range: string;
    shared: boolean;
    target: string;
    source: WhSource;
  };
}

export interface WhSpell extends Wh {
  name: string;
  description: string;
  cn: number;
  range: string;
  shared: boolean;
  target: string;
  source: WhSource;
}

function convertApiToModelData(whSpellApi: WhSpellApi): WhSpell {
  return {
    id: whSpellApi.id,
    canEdit: whSpellApi.canEdit,
    name: whSpellApi.object.name,
    cn: whSpellApi.object.cn,
    range: whSpellApi.object.range,
    target: whSpellApi.object.target,
    duration: whSpellApi.object.duration,
    description: whSpellApi.object.description,
    shared: whSpellApi.object.shared,
    source: whSpellApi.object.source,
  };
}

function convertModelToApiData(whSpell: WhSpell): WhSpellApi {
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

class SpellApi {
  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(API_BASE_APTH, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(API_BASE_APTH, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(API_BASE_APTH, axiosInstance);
  }
}
