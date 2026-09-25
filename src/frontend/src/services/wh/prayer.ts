import { defineWhApi } from "./crudGenerator.ts";
import { Source, copySource, sourceIsValid } from "./source.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, Visibility, WhEntity } from "./common.ts";
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

export class Prayer extends WhEntity {
  range: string;
  duration: string;
  target: string;

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
    super({ id, ownerId, visibility, name, description, source });
    this.range = range;
    this.target = target;
    this.duration = duration;
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
}

export function apiResponseToModel(prayerApi: ApiResponse<PrayerApiData>): Prayer {
  return new Prayer({
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

export const prayerApi = defineWhApi<Prayer, PrayerApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

