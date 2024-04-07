import { Source } from "./source.ts";
import { setValidationStatus, ValidationStatus } from "../../utils/validation.ts";

export interface WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  shared: boolean;
  source: Source;

  copy: () => WhProperty;
  isValid: () => boolean;
  validateName: () => ValidationStatus;
  validateDescription: () => ValidationStatus;
  isEqualTo: (other: WhProperty) => boolean;
  updateSource: (update: { id: string; notes: string; selected: boolean }) => void;
}

export interface WhApi<T, TApiData> {
  getElement: (id: string) => Promise<T>;
  listElements: (id: string) => Promise<T[]>;
  createElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  updateElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  deleteElement: (id: string) => Promise<void>;
}

export interface ApiResponse<WhApiData> {
  id: string;
  canEdit: boolean;
  ownerId: string;
  object: WhApiData;
}

export const VERY_SHORT_DESC_REGEX: RegExp = /^[^<>]{0,15}$/;
export const SHORT_DESC_REGEX: RegExp = /^[^<>]{0,200}$/;
export const LONG_DESC_REGEX: RegExp = /^[^<>]{0,10000}$/;

export function validVeryShortDescFn(name: string): ValidationStatus {
  return setValidationStatus(
    VERY_SHORT_DESC_REGEX.test(name),
    "This field has to be shorter than 15 characters and cannot use <> symbols.",
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

export function validFloatFn(value: number, min: number, max: number) {
  let isValid = false;

  if (value >= min && value <= max) {
    isValid = true;
  }
  return setValidationStatus(isValid, `This field a number between ${min} and ${max}.`);
}

export function copyRecordWithObject<T extends object>(source: Record<string, T>): Record<string, T> {
  const copy: Record<string, T> = {};

  for (const [key, value] of Object.entries(source)) {
    copy[key] = { ...value };
  }
  return copy;
}
