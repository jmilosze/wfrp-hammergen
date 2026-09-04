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
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/prayer";

export interface PrayerApiData {
  name: string;
  description: string;
  range: string;
  duration: string;
  visibility?: Visibility;
  target: string;
  source: Source;
}

export class Prayer implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  range: string;
  duration: string;
  target: string;
  source: Source;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    range = "",
    target = "",
    duration = "",
    description = "",
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.range = range;
    this.target = target;
    this.duration = duration;
    this.description = description;
    this.visibility = visibility;
    this.source = source;
  }

  copy(): Prayer {
    return new Prayer({
      id: this.id,
      ownerId: this.ownerId,
      visibility: this.visibility,
      name: this.name,
      range: this.range,
      target: this.target,
      duration: this.duration,
      description: this.description,
      source: copySource(this.source),
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
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

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      this.validateRange().valid &&
      this.validateTarget().valid &&
      this.validateDuration().valid &&
      sourceIsValid(this.source)
    );
  }

  isEqualTo(otherPrayer: WhProperty): boolean {
    if (!(otherPrayer instanceof Prayer)) {
      return false;
    }
    return (
      this.id === otherPrayer.id &&
      this.visibility === otherPrayer.visibility &&
      this.name === otherPrayer.name &&
      this.range === otherPrayer.range &&
      this.target === otherPrayer.target &&
      this.duration === otherPrayer.duration &&
      this.description === otherPrayer.description &&
      objectsAreEqual(this.source, otherPrayer.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(prayerApi: ApiResponse<PrayerApiData>): Prayer {
  const newPrayer = new Prayer({
    id: prayerApi.id,
    ownerId: prayerApi.ownerId,
    visibility: prayerApi.visibility,
    name: prayerApi.object.name,
    range: prayerApi.object.range,
    target: prayerApi.object.target,
    duration: prayerApi.object.duration,
    description: prayerApi.object.description,
    source: prayerApi.object.source,
  });

  return newPrayer.copy();
}

export function modelToApi(prayer: Prayer): PrayerApiData {
  return {
    name: prayer.name,
    range: prayer.range,
    target: prayer.target,
    duration: prayer.duration,
    description: prayer.description,
    visibility: prayer.visibility,
    source: copySource(prayer.source),
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
