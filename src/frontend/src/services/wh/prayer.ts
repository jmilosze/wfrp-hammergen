import { compareWhSources, defaultSource, Wh, WhApiResponse, WhSource } from "./common.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";

const API_BASE_PATH = "/api/wh/prayer";

export interface WhPrayerApiData {
  name: string;
  description: string;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: WhSource;
}

export class WhPrayer implements Wh {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: WhSource;

  constructor() {
    this.id = "";
    this.name = "name";
    this.range = "";
    this.target = "";
    this.duration = "";
    this.description = "";
    this.canEdit = false;
    this.shared = false;
    this.source = {};
  }

  newPrayer(canEdit: boolean) {
    const prayer = new WhPrayer();
    prayer.name = "New prayer";
    prayer.canEdit = canEdit;
    prayer.shared = true;
    prayer.source = defaultSource();
    return prayer;
  }

  copy() {
    const newPrayer = new WhPrayer();
    newPrayer.id = this.id;
    newPrayer.name = this.name;
    newPrayer.range = this.range;
    newPrayer.target = this.target;
    newPrayer.duration = this.duration;
    newPrayer.description = this.description;
    newPrayer.canEdit = this.canEdit;
    newPrayer.shared = this.shared;
    newPrayer.source = JSON.parse(JSON.stringify(this.source));

    return newPrayer;
  }

  isEqualTo(otherPrayer: WhPrayer): boolean {
    if (
      this.id != otherPrayer.id ||
      this.canEdit != otherPrayer.canEdit ||
      this.name != otherPrayer.name ||
      this.range != otherPrayer.range ||
      this.target != otherPrayer.target ||
      this.duration != otherPrayer.duration ||
      this.description != otherPrayer.description ||
      this.shared != otherPrayer.shared
    ) {
      return false;
    }

    return compareWhSources(this.source, otherPrayer.source);
  }
}

export function apiResponseToModel(whPrayerApi: WhApiResponse<WhPrayerApiData>): WhPrayer {
  const prayer = new WhPrayer();
  prayer.id = whPrayerApi.id;
  prayer.canEdit = whPrayerApi.canEdit;
  prayer.name = whPrayerApi.object.name;
  prayer.range = whPrayerApi.object.range;
  prayer.target = whPrayerApi.object.target;
  prayer.duration = whPrayerApi.object.duration;
  prayer.description = whPrayerApi.object.description;
  prayer.shared = whPrayerApi.object.shared;
  prayer.source = whPrayerApi.object.source;

  return prayer;
}

export function modelToApi(whPrayer: WhPrayer): WhPrayerApiData {
  return {
    name: whPrayer.name,
    range: whPrayer.range,
    target: whPrayer.target,
    duration: whPrayer.duration,
    description: whPrayer.description,
    shared: whPrayer.shared,
    source: whPrayer.source,
  };
}

export class WhPrayerApi {
  getElement: (id: string) => Promise<WhPrayer>;
  listElements: (id: string) => Promise<WhPrayer[]>;
  createElement: (wh: WhPrayer) => Promise<WhApiResponse<WhPrayerApiData>>;
  updateElement: (wh: WhPrayer) => Promise<WhApiResponse<WhPrayerApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
