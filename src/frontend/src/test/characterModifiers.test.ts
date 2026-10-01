import { describe, expect, test } from "vitest";
import {
  CharacterModifiers,
  ModifierEffect,
  modifierEffectsByEdition,
  printEffectName,
} from "../services/wh/characterModifiers.ts";

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

describe("modifier effects by edition", () => {
  test("4e offers only Hardy", () => {
    expect(modifierEffectsByEdition["4e"]).toEqual([ModifierEffect.Hardy]);
  });

  test("5e adds Strong Back and Sturdy", () => {
    expect(modifierEffectsByEdition["5e"]).toEqual([
      ModifierEffect.Hardy,
      ModifierEffect.StrongBack,
      ModifierEffect.Sturdy,
    ]);
  });

  test("every effect has a name", () => {
    for (const effect of modifierEffectsByEdition["5e"]) {
      expect(printEffectName(effect)).not.toBe("");
    }
  });
});
