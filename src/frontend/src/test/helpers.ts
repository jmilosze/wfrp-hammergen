import { WhProperty } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";

export const testIsEqualCommonProperties = (name: string, whProperty: WhProperty) => {
  describe("isEqualTo returns true", () => {
    const whProperty1 = whProperty.copy();
    const whProperty2 = whProperty.copy();
    test(`when ${name} are the same`, () => {
      expect(whProperty1.isEqualTo(whProperty2)).toBe(true);
    });
  });
};
