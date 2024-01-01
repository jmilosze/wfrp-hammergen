import { compareWhSources, defaultSource, WhProperty, ApiResponse, Source } from "./common.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";

const API_BASE_PATH = "/api/wh/prayer";

export interface PrayerApiData {
  name: string;
  description: string;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: Source;
}

export class Prayer implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  source: Source;

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
    const prayer = new Prayer();
    prayer.name = "New prayer";
    prayer.canEdit = canEdit;
    prayer.shared = true;
    prayer.source = defaultSource();
    return prayer;
  }

  copy() {
    const newPrayer = new Prayer();
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

  isEqualTo(otherPrayer: Prayer): boolean {
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

export function apiResponseToModel(prayerApi: ApiResponse<PrayerApiData>): Prayer {
  const prayer = new Prayer();
  prayer.id = prayerApi.id;
  prayer.canEdit = prayerApi.canEdit;
  prayer.name = prayerApi.object.name;
  prayer.range = prayerApi.object.range;
  prayer.target = prayerApi.object.target;
  prayer.duration = prayerApi.object.duration;
  prayer.description = prayerApi.object.description;
  prayer.shared = prayerApi.object.shared;
  prayer.source = prayerApi.object.source;

  return prayer;
}

export function modelToApi(prayer: Prayer): PrayerApiData {
  return {
    name: prayer.name,
    range: prayer.range,
    target: prayer.target,
    duration: prayer.duration,
    description: prayer.description,
    shared: prayer.shared,
    source: prayer.source,
  };
}

export class PrayerApi {
  getElement: (id: string) => Promise<Prayer>;
  listElements: (id: string) => Promise<Prayer[]>;
  createElement: (wh: Prayer) => Promise<ApiResponse<PrayerApiData>>;
  updateElement: (wh: Prayer) => Promise<ApiResponse<PrayerApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}