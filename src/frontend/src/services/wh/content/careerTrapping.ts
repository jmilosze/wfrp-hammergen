import { setValidationStatus, ValidationStatus } from "@/utils/validation.ts";
import { ITEM_VALUE_REGEX, MAX_ITEM_VALUE_LENGTH, printItemWithValue } from "@/utils/idNumberValue.ts";

// A career level's trappings as data (HG-40): entries, each a single option or several options the player chooses
// from. An option is one or more trappings, e.g. Bow and 10 Arrows. A trapping has a quantity, a number or dice ("10", "1d10", "2d6+3"), and a value, the note the
// character's trapping gets ("with a Footman"; empty for none).
export interface CareerTrapping {
  id: string;
  number: string;
  value: string;
}

export interface CareerTrappingEntry {
  options: CareerTrapping[][];
}

// Money a career level gives, rolled into the character's coins.
export type CareerCoin = "gold" | "silver" | "brass";

export const careerCoinList: CareerCoin[] = ["gold", "silver", "brass"];

export interface CareerMoney {
  coin: CareerCoin;
  number: string;
}

// The most entries and money items of a level, options of an entry and trappings of an option.
export const MAX_CAREER_TRAPPINGS = 100;

const DICE_REGEX = /^([1-9][0-9]{0,3}|[1-9][0-9]{0,2}d[1-9][0-9]{0,2}([+-][1-9][0-9]{0,3})?)$/;

export function copyCareerTrappingEntries(entries: CareerTrappingEntry[]): CareerTrappingEntry[] {
  return entries.map((entry) => ({
    options: entry.options.map((option) => option.map((trapping) => ({ ...trapping }))),
  }));
}

export function copyCareerMoney(money: CareerMoney[]): CareerMoney[] {
  return money.map((x) => ({ ...x }));
}

export function validateCareerTrappings(
  fieldName: string,
  entries: CareerTrappingEntry[],
  money: CareerMoney[],
): ValidationStatus {
  const options = entries.flatMap((entry) => entry.options);
  const trappings = options.flat();
  if (
    entries.length > MAX_CAREER_TRAPPINGS ||
    money.length > MAX_CAREER_TRAPPINGS ||
    options.some((option) => option.length > MAX_CAREER_TRAPPINGS) ||
    entries.some((entry) => entry.options.length > MAX_CAREER_TRAPPINGS)
  ) {
    return setValidationStatus(
      false,
      `${fieldName} can have at most ${MAX_CAREER_TRAPPINGS} trappings and money items.`,
    );
  }
  if (entries.some((entry) => entry.options.length === 0) || options.some((option) => option.length === 0)) {
    return setValidationStatus(false, `${fieldName} cannot have an empty trapping or option.`);
  }
  if (!trappings.every((x) => DICE_REGEX.test(x.number)) || !money.every((x) => DICE_REGEX.test(x.number))) {
    return setValidationStatus(
      false,
      `${fieldName} quantities have to be a number from 1 to 9999 or dice, such as 1d10 or 2d6+3.`,
    );
  }
  return setValidationStatus(
    trappings.every((x) => ITEM_VALUE_REGEX.test(x.value)),
    `${fieldName} notes can have at most ${MAX_ITEM_VALUE_LENGTH} characters and cannot use <> symbols.`,
  );
}

// printCareerTrapping writes a trapping as "10 × Arrow" or "Hand Weapon (Sickle)"; a quantity of 1 is left out.
export function printCareerTrapping(trapping: CareerTrapping, name: string): string {
  const named = printItemWithValue(name, trapping.value);
  return trapping.number === "1" ? named : `${trapping.number} × ${named}`;
}

// printCareerTrappingEntry writes an entry as its options joined by "or", each its trappings joined by commas:
// "Bow, 10 × Arrow or Pistol, 10 × Bullet and Powder". nameOf gives the name of an item.
export function printCareerTrappingEntry(entry: CareerTrappingEntry, nameOf: (id: string) => string): string {
  return entry.options
    .map((option) => option.map((trapping) => printCareerTrapping(trapping, nameOf(trapping.id))).join(", "))
    .join(" or ");
}
