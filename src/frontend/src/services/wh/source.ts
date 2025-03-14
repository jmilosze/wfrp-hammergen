import { ValidationStatus } from "../../utils/validation.ts";
import { validVeryShortDescFn } from "./common.ts";

export const source: Record<string, string> = {
  0: "Custom",
  1: "WFRP",
  2: "Rough Nights & Hard Days",
  3: "Archives Volume I",
  4: "Archives Volume II",
  5: "Archives Volume III",
  6: "Up in Arms",
  7: "Winds of Magic",
  8: "Middenheim",
  9: "Salzenmund",
  10: "Sea of Claws",
  11: "Lustria",
  12: "Enemy in Shadows Companion",
  13: "Death on the Reik Companion",
  14: "Enemy in Shadows",
  15: "Death on the Reik",
  16: "Power Behind the Throne",
  17: "Power Behind the Throne Companion",
  18: "The Horned Rat",
  19: "The Horned Rat Companion",
  20: "Empire in Ruins",
  21: "Empire in Ruins Companion",
  22: "The Imperial Zoo",
  23: "Altdorf Crown of the Empire",
  24: "Ubersreik Adventures",
  25: "Ubersreik Adventures 2",
  26: "Guide to Ubersreik (Starter Set)",
  27: "Adventure Book (Starter Set)",
  28: "Ubersreik Adventures 3",
  29: "Tribes and Tribulations",
  30: "Reikland Miscellanea",
  31: "Patrons Of The Old World",
  32: "Buildings Of The Reikland",
  33: "One Shots Of The Reikland",
  34: "Monuments Of The Reikland",
  35: "Shrines Of Sigmar",
  36: "Sullasara's Spells",
  37: "Blood And Bramble",
  38: "Dwarf Player's Guide",
  39: "Deft Steps Light Fingers",
  40: "High Elf Player's Guide",
};

export type Source = Record<string, string>;

export function copySource(source: Source): Source {
  return { ...source };
}

export function defaultSource(): Source {
  return { 0: "" };
}

export function updateSource(source: Source, update: { id: string; notes: string; selected: boolean }) {
  if (!update.selected && update.id in source) {
    delete source[update.id];
  }
  if (update.selected) {
    source[update.id] = update.notes;
  }
}

export function validateSourceRecord(record: string): ValidationStatus {
  return validVeryShortDescFn(record);
}

export function sourceIsValid(source: Source): boolean {
  for (const notes of Object.values(source)) {
    if (!validateSourceRecord(notes).valid) {
      return false;
    }
  }
  return true;
}
