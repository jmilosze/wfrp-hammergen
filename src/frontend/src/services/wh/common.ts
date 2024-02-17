import { Source } from "./source.ts";
import { setValidationStatus, ValidationStatus } from "../../utils/validation.ts";

export interface WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  shared: boolean;
  source: Source;
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

export interface IdNumber {
  id: string;
  number: number;
}

export const SHORT_DESC_REGEX: RegExp = /^[^<>]{0,200}$/;

export function validNameFn(name: string): ValidationStatus {
  return setValidationStatus(
    SHORT_DESC_REGEX.test(name),
    "Name has to be shorter than 200 characters and cannot use <> symbols.",
  );
}

export function validDescFn(name: string): ValidationStatus {
  return setValidationStatus(
    SHORT_DESC_REGEX.test(name),
    "Description has to be shorter than 10,000 characters characters and cannot use <> symbols.",
  );
}

export function compareIdNumber(x: IdNumber, y: IdNumber): -1 | 0 | 1 {
  const xIdNumber = `${x.id}_${x.number}`;
  const yIdNumber = `${y.id}_${y.number}`;

  if (xIdNumber === yIdNumber) {
    return 0;
  } else {
    return xIdNumber < yIdNumber ? -1 : 1;
  }
}
