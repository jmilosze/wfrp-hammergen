import { Source, updateSource } from "./source.ts";
import { setValidationStatus, ValidationStatus } from "../../utils/validation.ts";
import { Attributes } from "./attributes.ts";
import { isKey } from "../../utils/object.ts";
import { cloneEntity } from "../../utils/clone.ts";
import { isEqualEntity } from "../../utils/equal.ts";

export enum Visibility {
  Private = 0,
  Shared = 1,
  Public = 2,
}

export interface WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  source: Source;

  copy: <T extends WhProperty>(this: T) => T;
  isValid: () => boolean;
  validateName: () => ValidationStatus;
  validateDescription: () => ValidationStatus;
  isEqualTo: (other: unknown) => boolean;
  updateSource: (update: { id: string; notes: string; selected: boolean }) => void;
}

export abstract class WhEntity implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  source: Source;

  constructor({
    id = "",
    ownerId = "",
    visibility = Visibility.Private,
    name = "",
    description = "",
    source = {},
  }: {
    id?: string;
    ownerId?: string;
    visibility?: Visibility;
    name?: string;
    description?: string;
    source?: Source;
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.visibility = visibility;
    this.name = name;
    this.description = description;
    this.source = source;
  }

  copy<T extends WhEntity>(this: T): T {
    return cloneEntity(this);
  }

  isEqualTo(other: unknown): boolean {
    return isEqualEntity(this, other);
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  abstract isValid(): boolean;
  abstract validateName(): ValidationStatus;
  abstract validateDescription(): ValidationStatus;
}

export interface WhApi<T, TApiData> {
  getElement: (id: string) => Promise<T>;
  listElements: () => Promise<T[]>;
  createElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  updateElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  deleteElement: (id: string) => Promise<void>;
}

export interface ApiResponse<WhApiData> {
  id: string;
  ownerId: string;
  visibility?: Visibility;
  object: WhApiData;
}

export const VERY_SHORT_DESC_REGEX: RegExp = /^[^<>]{0,25}$/;
export const SHORT_DESC_LENGTH = 200;
export const SHORT_DESC_REGEX: RegExp = /^[^<>]{0,200}$/;
export const LONG_DESC_REGEX: RegExp = /^[^<>]{0,10000}$/;

export function validVeryShortDescFn(name: string): ValidationStatus {
  return setValidationStatus(
    VERY_SHORT_DESC_REGEX.test(name),
    "This field has to be shorter than 25 characters and cannot use <> symbols.",
  );
}

export function validShortDescFn(name: string): ValidationStatus {
  return setValidationStatus(
    SHORT_DESC_REGEX.test(name),
    "This field has to be shorter than 200 characters and cannot use <> symbols.",
  );
}

export function validLongDescFn(name: string): ValidationStatus {
  return setValidationStatus(
    LONG_DESC_REGEX.test(name),
    "This field has to be shorter than 10,000 characters characters and cannot use <> symbols.",
  );
}

export function validIntegerFn(value: number, min: number, max: number): ValidationStatus {
  let isValid = true;
  if (value > max || value < min || !Number.isInteger(value)) {
    isValid = false;
  }

  return setValidationStatus(isValid, `This field an integer between ${min} and ${max}.`);
}

export function validFloatFn(value: number, min: number, max: number): ValidationStatus {
  let isValid = false;
  if (value >= min && value <= max) {
    isValid = true;
  }
  return setValidationStatus(isValid, `This field a number between ${min} and ${max}.`);
}

export function validAttributesFn(
  fieldName: string,
  attributes: Attributes,
  min: number,
  max: number,
): ValidationStatus {
  let isValid = true;

  for (const value of Object.values(attributes)) {
    if (value > max || value < min || !Number.isInteger(value)) {
      isValid = false;
      break;
    }
  }

  return setValidationStatus(isValid, `${fieldName} attributes have to be integer numbers between ${min} and ${max}.`);
}

export function validateIdNumber(
  fieldName: string,
  record: Record<string, number>,
  min: number,
  max: number,
): ValidationStatus {
  let isValid = true;
  for (const [id, number] of Object.entries(record)) {
    if (isKey(record, id)) {
      if (!Number.isInteger(number) || number < min || number > max) {
        isValid = false;
        break;
      }
    }
  }
  return setValidationStatus(isValid, `${fieldName} has to be an integer between ${min} and ${max}.`);
}
