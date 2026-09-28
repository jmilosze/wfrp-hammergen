import { describe, expect, test } from "vitest";
import { Source } from "../services/wh/source.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { Visibility } from "../services/wh/common.ts";
import { RollInTableFn, SelectRandomFn } from "../utils/random.ts";

export interface WhPropertyExtended {
  id: string;
  name: string;
  description: string;
  visibility: Visibility;
  source: Source;
  isEqualTo(otherWhProperty: WhPropertyExtended): boolean;
  copy(): WhPropertyExtended;
}

/**
 * Creates a deterministic mock for `rollInTable` that simulates table rolls using a predetermined sequence of numbers.
 *
 * Each time the returned mock is called:
 * 1. It takes the next roll value from `rolls` (or repeats the last roll if `rolls` is exhausted).
 * 2. It finds the entry in `table` where `roll >= min && roll < max` and returns its value (`element[0]`).
 */
export function getRollInTableTest(...rolls: number[]): RollInTableFn {
  const expectedRolls = [...rolls];
  let currentRoll = 0;

  return function <T>(_: number, __: number, table: [T, number, number][]) {
    const roll =
      currentRoll < expectedRolls.length ? expectedRolls[currentRoll] : expectedRolls[expectedRolls.length - 1];
    for (const element of table) {
      if (roll >= element[1] && roll < element[2]) {
        currentRoll += 1;
        return element[0];
      }
    }
    throw new Error(`invalid table ${table}`);
  };
}

/**
 * Creates a deterministic mock for `selectRandom` that selects array elements by index using a predetermined sequence.
 *
 * Each time the returned mock is called:
 * 1. It takes the next index from `selections` (or repeats the last index if `selections` is exhausted).
 * 2. It returns the element at that index from the passed array (`array[selection]`).
 */
export function getSelectRandomTest(...selections: number[]): SelectRandomFn {
  const expectedSelections = [...selections];
  let currentSelection = 0;

  return function <T>(array: T[]) {
    const selection =
      currentSelection < expectedSelections.length
        ? expectedSelections[currentSelection]
        : expectedSelections[expectedSelections.length - 1];
    currentSelection += 1;
    return array[selection];
  };
}

export const testIsEqualCommonProperties = (name: string, whProperty: WhPropertyExtended) => {
  describe("isEqualTo returns true (common properties)", () => {
    test(`when ${name} are the same`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      expect(whProperty1.isEqualTo(whProperty2)).toBe(true);
    });
  });

  describe("isEqualTo returns false (common properties)", () => {
    test(`when other ${name} has different value of id`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.id = "id";
      whProperty2.id = "otherId";
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test(`when other ${name} has different value of name`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.name = "name";
      whProperty2.name = "otherName";
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test(`when other ${name} has different value of description`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.description = "description";
      whProperty2.description = "otherDescription";
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });


    test(`when other ${name} has different value of visibility`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.visibility = Visibility.Public;
      whProperty2.visibility = Visibility.Private;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test.each<{ diff: string; source: Source }>([
      { diff: "fewer sources", source: { 1: "page 2" } },
      { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
      { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
      { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
    ])(`when other ${name} has $diff`, (t) => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.source = { 1: "page 2", 3: "page 5-10" };
      whProperty2.source = t.source;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });
  });
};

interface WhPropertyWithModifiers extends WhPropertyExtended {
  modifiers: CharacterModifiers;
}

export const testIsEqualCharacterModifiers = (name: string, whProperty: WhPropertyWithModifiers) => {
  describe("isEqualTo returns false (character modifiers)", () => {
    test.each([
      { field: "WS", value: 10 },
      { field: "BS", value: 10 },
      { field: "S", value: 10 },
      { field: "T", value: 10 },
      { field: "I", value: 10 },
      { field: "Ag", value: 10 },
      { field: "Dex", value: 10 },
      { field: "Int", value: 10 },
      { field: "WP", value: 10 },
      { field: "Fel", value: 10 },
    ])(`when other ${name} has different value of modifier $field`, (t) => {
      const whProperty1 = whProperty.copy() as WhPropertyWithModifiers;
      const whProperty2 = whProperty.copy() as WhPropertyWithModifiers;
      whProperty1.modifiers.attributes = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 0 };
      whProperty2.modifiers.attributes[t.field as keyof typeof whProperty2.modifiers.attributes] = t.value;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test(`when other ${name}  has different value of modifier size`);
    {
      const whProperty1 = whProperty.copy() as WhPropertyWithModifiers;
      const whProperty2 = whProperty.copy() as WhPropertyWithModifiers;
      whProperty1.modifiers.size = 1;
      whProperty2.modifiers.size = 2;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    }

    test(`when other ${name}  has different value of modifier movement`);
    {
      const whProperty1 = whProperty.copy() as WhPropertyWithModifiers;
      const whProperty2 = whProperty.copy() as WhPropertyWithModifiers;
      whProperty1.modifiers.movement = 1;
      whProperty2.modifiers.movement = 2;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    }
  });
};
