import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { Source, copySource } from "./source.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { ApiResponse, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

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

  constructor({
    id = "",
    name = "",
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
    this.range = range;
    this.target = target;
    this.duration = duration;
    this.description = description;
    this.canEdit = canEdit;
    this.shared = shared;
    this.source = source;
  }

  copy(): Prayer {
    return new Prayer({
      id: this.id,
      name: this.name,
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

  validateRange(): ValidationStatus {
    return validShortDescFn(this.range);
  }

  validateTarget(): ValidationStatus {
    return validShortDescFn(this.target);
  }

  validateDuration(): ValidationStatus {
    return validShortDescFn(this.duration);
  }

  isEqualTo(otherPrayer: Prayer): boolean {
    return (
      this.id === otherPrayer.id &&
      this.canEdit === otherPrayer.canEdit &&
      this.name === otherPrayer.name &&
      this.range === otherPrayer.range &&
      this.target === otherPrayer.target &&
      this.duration === otherPrayer.duration &&
      this.description === otherPrayer.description &&
      this.shared === otherPrayer.shared &&
      objectsAreEqual(this.source, otherPrayer.source)
    );
  }
}

export function apiResponseToModel(prayerApi: ApiResponse<PrayerApiData>): Prayer {
  return new Prayer({
    id: prayerApi.id,
    canEdit: prayerApi.canEdit,
    name: prayerApi.object.name,
    range: prayerApi.object.range,
    target: prayerApi.object.target,
    duration: prayerApi.object.duration,
    description: prayerApi.object.description,
    shared: prayerApi.object.shared,
    source: prayerApi.object.source,
  });
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

export class PrayerApi implements WhApi<Prayer, PrayerApiData> {
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
