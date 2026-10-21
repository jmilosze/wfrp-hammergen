import { setValidationStatus, ValidationStatus } from "./validation.ts";

// IdNumberValue is a character's trapping: the item, how many, and a value (a note, empty for none), e.g. Hand Weapon
// with "Axe". Each entry is a row of its own: the same item can be listed more than once, with the same or different
// values.
export interface IdNumberValue {
  id: string;
  number: number;
  value: string;
}

export const MAX_ITEM_VALUE_LENGTH = 40;

const ITEM_VALUE_REGEX = new RegExp(`^[^<>]{0,${MAX_ITEM_VALUE_LENGTH}}$`);

export function copyIdNumberValueArray(list: IdNumberValue[]): IdNumberValue[] {
  return list.map((x) => ({ id: x.id, number: x.number, value: x.value }));
}

function findEntry(list: IdNumberValue[], id: string, value: string): number {
  return list.findIndex((x) => x.id === id && x.value === value);
}

// numberOf is the number of the entry with this id and value, 0 when there is none.
function numberOf(list: IdNumberValue[], id: string, value: string): number {
  const i = findEntry(list, id, value);
  return i === -1 ? 0 : list[i].number;
}

// setNumber sets the number of the entry with this id and value, adding the entry if needed; 0 removes it.
function setNumber(list: IdNumberValue[], id: string, value: string, number: number): void {
  const i = findEntry(list, id, value);
  if (number === 0) {
    if (i !== -1) {
      list.splice(i, 1);
    }
    return;
  }
  if (i === -1) {
    list.push({ id: id, number: number, value: value });
  } else {
    list[i].number = number;
  }
}

// addNumber adds to the entry with this id and value (a negative number takes away; at 0 the entry is removed).
export function addNumber(list: IdNumberValue[], id: string, value: string, number: number): void {
  setNumber(list, id, value, numberOf(list, id, value) + number);
}

// fillUp raises the list to at least the numbers in newEntries: rows with the same id and value count together, and
// what is missing is added to the first of them (or as a new row).
export function fillUp(list: IdNumberValue[], newEntries: IdNumberValue[]): void {
  for (const entry of newEntries) {
    const rows = list.filter((x) => x.id === entry.id && x.value === entry.value);
    const total = rows.reduce((sum, x) => sum + x.number, 0);
    if (total >= entry.number) {
      continue;
    }
    if (rows.length === 0) {
      list.push({ id: entry.id, number: entry.number, value: entry.value });
    } else {
      rows[0].number += entry.number - total;
    }
  }
}

// mergeEntries joins entries with the same id and value, adding up their numbers; the first one keeps its place.
export function mergeEntries(list: IdNumberValue[]): IdNumberValue[] {
  const merged: IdNumberValue[] = [];
  for (const entry of list) {
    const i = findEntry(merged, entry.id, entry.value);
    if (i === -1) {
      merged.push({ id: entry.id, number: entry.number, value: entry.value });
    } else {
      merged[i].number += entry.number;
    }
  }
  return merged;
}

export function validateIdNumberValues(fieldName: string, list: IdNumberValue[]): ValidationStatus {
  const numbersValid = list.every((x) => Number.isInteger(x.number) && x.number >= 1 && x.number <= 1000);
  if (!numbersValid) {
    return setValidationStatus(false, `${fieldName} number has to be an integer between 1 and 1000.`);
  }
  return setValidationStatus(
    list.every((x) => ITEM_VALUE_REGEX.test(x.value)),
    `${fieldName} notes can have at most ${MAX_ITEM_VALUE_LENGTH} characters and cannot use <> symbols.`,
  );
}

// printItemWithValue adds the value in brackets after the item's name: "Hand Weapon (Axe)". Unlike trait values it
// never replaces a bracket of the name ("Courtly Garb (Servant)" stays).
export function printItemWithValue(name: string, value: string): string {
  return value === "" ? name : `${name} (${value})`;
}
