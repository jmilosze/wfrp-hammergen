import { defineWhApi } from "./crudGenerator.ts";
import { Source, copySource, sourceIsValid } from "./source.ts";
import { ApiResponse, UI_EDITION, validLongDescFn, validShortDescFn, variant, Visibility, WhEntity } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";

const API_BASE_PATH = "/api/wh/prayer";

export interface PrayerApiData {
  name: string;
  description: string;
  range: string;
  duration: string;
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
  const data = variant(prayerApi, UI_EDITION);
  return new Prayer({
    id: prayerApi.id,
    ownerId: prayerApi.ownerId,
    visibility: prayerApi.visibility,
    name: data.name,
    range: data.range,
    target: data.target,
    duration: data.duration,
    description: data.description,
    source: data.source,
  });
}

export function modelToApi(prayer: Prayer): PrayerApiData {
  return {
    name: prayer.name,
    range: prayer.range,
    target: prayer.target,
    duration: prayer.duration,
    description: prayer.description,
    source: copySource(prayer.source),
  };
}

export const prayerApi = defineWhApi<Prayer, PrayerApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

