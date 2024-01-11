import { WhProperty } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { Source } from "../services/wh/source.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";

export const testIsEqualCommonProperties = (name: string, whProperty: WhProperty) => {
  describe("isEqualTo (common properties) returns true", () => {
    test(`when ${name} are the same`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      expect(whProperty1.isEqualTo(whProperty2)).toBe(true);
    });
  });

  describe("isEqualTo (common properties) returns false", () => {
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

    test(`when other ${name} has different value of canEdit`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.canEdit = true;
      whProperty2.canEdit = false;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test(`when other ${name} has different value of shared`, () => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.shared = true;
      whProperty2.shared = false;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });

    test.each<{ diff: string; source: Source }>([
      { diff: "fewer sources", source: { 1: "page 2" } },
      { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
      { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
      { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
    ])("when other mutation has $diff", (t) => {
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty1.source = { 1: "page 2", 3: "page 5-10" };
      whProperty1.source = t.source;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });
  });
};

interface WhPropertyWithModifiers extends WhProperty {
  modifiers: CharacterModifiers;
}

export const testIsEqualCharacterModifiers = (name: string, whProperty: WhPropertyWithModifiers) => {
  describe("isEqualTo (character modifiers) returns false", () => {
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
      const whProperty1 = whProperty.copy();
      const whProperty2 = whProperty.copy();
      whProperty2.modifiers.attributes[t.field] = t.value;
      expect(whProperty1.isEqualTo(whProperty2)).toBe(false);
    });
  });
};
