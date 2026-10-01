import { Source, sourceForEdition, updateSource } from "./source.ts";
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
  forEdition(edition: Edition): this;
  // isValid checks the model as the variant of the given edition.
  isValid: (edition: Edition) => boolean;
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

  protected constructor({
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

  // forEdition returns a copy to start the edition's variant from (pre-filled from this variant).
  // Types with edition-specific rules adjust it further.
  forEdition(edition: Edition): this {
    const variant = this.copy();
    variant.source = sourceForEdition(this.source, edition);
    return variant;
  }

  isEqualTo(other: unknown): boolean {
    return isEqualEntity(this, other);
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  abstract isValid(edition: Edition): boolean;
  abstract validateName(): ValidationStatus;
  abstract validateDescription(): ValidationStatus;
}

export type Edition = "4e" | "5e";

export const EDITIONS: Edition[] = ["4e", "5e"];

export function printEditionName(edition: Edition): string {
  return edition === "4e" ? "4th Edition" : "5th Edition";
}

// Characters stay 4e until 5e characters are added (phase 3.2); character pages use 4e content.
export const CHARACTER_EDITION: Edition = "4e";

// One model per edition variant of a content document.
export type Variants<T> = Partial<Record<Edition, T>>;

export interface ApiHeaders {
  id: string;
  ownerId: string;
  visibility?: Visibility;
}

// Content document as returned by the API: one variant per edition.
export interface ApiResponse<WhApiData> extends ApiHeaders {
  editions: Partial<Record<Edition, WhApiData>>;
}

// Character as returned by the API; its fixed edition is part of the character data.
export interface CharacterApiResponse<CharacterData> extends ApiHeaders {
  object: CharacterData;
}

// Content document as sent to the API; variants not included are left unchanged on update.
export interface ContentRequest<WhApiData> {
  visibility: Visibility;
  editions: Partial<Record<Edition, WhApiData>>;
}

// variant returns the edition variant of a content document. Reads ask for an edition, so the API
// only returns documents that have it.
export function variant<WhApiData>(api: ApiResponse<WhApiData>, edition: Edition): WhApiData {
  const data = api.editions[edition];
  if (data === undefined) {
    throw new Error(`${api.id} has no ${edition} variant`);
  }
  return data;
}

// API of a content type: lists one edition, reads and writes whole documents (all variants).
export interface ContentApi<T> {
  listElements: (edition: Edition) => Promise<T[]>;
  getDocument: (id: string) => Promise<Variants<T>>;
  createDocument: (visibility: Visibility, variants: Variants<T>) => Promise<ApiHeaders>;
  updateDocument: (id: string, visibility: Visibility, variants: Variants<T>) => Promise<ApiHeaders>;
  // Deletes the whole document, all variants.
  deleteElement: (id: string) => Promise<void>;
}

// API of characters: one character, one edition.
export interface WhApi<T, TResponse extends ApiHeaders> {
  getElement: (id: string, edition: Edition) => Promise<T>;
  listElements: (edition: Edition) => Promise<T[]>;
  createElement: (wh: T) => Promise<TResponse>;
  updateElement: (wh: T) => Promise<TResponse>;
  deleteElement: (id: string, edition: Edition) => Promise<void>;
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
