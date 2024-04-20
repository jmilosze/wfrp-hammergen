import { describe, expect, test } from "vitest";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";

test("characterModifiers add adds modifiers correctly", () => {
  const m1 = new CharacterModifiers({
    size: 1,
    movement: 1,
    attributes: { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 },
  });

  const m2 = new CharacterModifiers({
    size: 2,
    movement: 2,
    attributes: { WS: 3, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 },
  });

  const expected = new CharacterModifiers({
    size: 3,
    movement: 3,
    attributes: { WS: 4, BS: 4, S: 6, T: 8, I: 10, Ag: 12, Dex: 14, Int: 16, WP: 18, Fel: 20 },
  });

  expect(m1.add(m2)).toEqual(expected);
});

test("characterModifiers multiply multiplies modifiers correctly", () => {
  const m = new CharacterModifiers({
    size: 1,
    movement: 1,
    attributes: { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 },
  });

  const expected = new CharacterModifiers({
    size: 2,
    movement: 2,
    attributes: { WS: 2, BS: 4, S: 6, T: 8, I: 10, Ag: 12, Dex: 14, Int: 16, WP: 18, Fel: 20 },
  });

  expect(m.multiply(2)).toEqual(expected);
});

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
