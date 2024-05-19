import { describe, expect, test } from "vitest";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";

describe("isNonZero returns expected result", () => {
  test("when all characterModifiers are 0", () => {
    const m = new CharacterModifiers();
    expect(m.isNonZero()).toBe(false);
  });

  test("when size is non-zero", () => {
    const m = new CharacterModifiers({ size: 1 });
    expect(m.isNonZero()).toBe(true);
  });

  test("when attribute is non-zero", () => {
    const m = new CharacterModifiers({
      attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    });
    expect(m.isNonZero()).toBe(true);
  });
});
