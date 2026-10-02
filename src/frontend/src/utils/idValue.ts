import { setValidationStatus, ValidationStatus } from "./validation.ts";

// IdValue references an entity together with its value, e.g. Ward with "8" or Hatred with "Elves".
export interface IdValue {
  id: string;
  value: string;
}

export const MAX_VALUE_LENGTH = 20;

const VALUE_REGEX = new RegExp(`^[^<>]{0,${MAX_VALUE_LENGTH}}$`);

export function validateValues(fieldName: string, values: Iterable<string>): ValidationStatus {
  let isValid = true;
  for (const value of values) {
    if (!VALUE_REGEX.test(value)) {
      isValid = false;
      break;
    }
  }
  return setValidationStatus(
    isValid,
    `${fieldName} values can have at most ${MAX_VALUE_LENGTH} characters and cannot use <> symbols.`,
  );
}

// printWithValue shows the value in brackets after the name, e.g. "Ward (8)", for entities that take a value.
export function printWithValue(name: string, hasValue: boolean, value: string): string {
  return hasValue && value !== "" ? `${name} (${value})` : name;
}
