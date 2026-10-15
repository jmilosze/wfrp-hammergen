import { describe, expect, test } from "vitest";
import {
  CharacterModifiers,
  ModifierEffect,
  modifierEffectsByEdition,
  printEffectDesc,
  printEffectName,
} from "./characterModifiers.ts";

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
  test.each(["4e", "5e"] as const)("%s offers Hardy, Strong Back and Sturdy", (edition) => {
    expect(modifierEffectsByEdition[edition]).toEqual([
      ModifierEffect.Hardy,
      ModifierEffect.StrongBack,
      ModifierEffect.Sturdy,
    ]);
  });

  test.each(["4e", "5e"] as const)("every %s effect has a name and description", (edition) => {
    for (const effect of modifierEffectsByEdition[edition]) {
      expect(printEffectName(effect)).not.toBe("");
      expect(printEffectDesc(effect, edition)).not.toBe("");
    }
  });
});
