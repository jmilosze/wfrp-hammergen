import { describe, expect, test } from "vitest";
import { getMovement5e, getSize5e, getSpeciesAttributes5e, getWounds5e } from "../services/wh/rules/rules5e.ts";
import { Size, SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { rulesFor } from "../services/wh/rules/rules.ts";
import { rules4e } from "../services/wh/rules/rules4e.ts";
import { rules5e } from "../services/wh/rules/rules5e.ts";

describe("getSpeciesAttributes5e", () => {
  test.each([
    {
      name: "human (Reikland)",
      species: SpeciesWithRegion.HumanReikland,
      expected: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
    },
    {
      name: "halfling",
      species: SpeciesWithRegion.HalflingDefault,
      expected: { WS: 10, BS: 30, S: 10, T: 10, I: 40, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
    },
    {
      name: "dwarf",
      species: SpeciesWithRegion.DwarfDefault,
      expected: { WS: 30, BS: 20, S: 20, T: 30, I: 10, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
    },
    {
      name: "high elf",
      species: SpeciesWithRegion.HighElfDefault,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
    {
      name: "wood elf",
      species: SpeciesWithRegion.WoodElfDefault,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
  ])("when species is $name", (t) => {
    expect(getSpeciesAttributes5e(t.species)).toEqual(t.expected);
  });
});

test("getMovement5e uses the species movement", () => {
  expect(getMovement5e(SpeciesWithRegion.HumanReikland, 0)).toEqual(4);
  expect(getMovement5e(SpeciesWithRegion.HalflingDefault, 0)).toEqual(3);
  expect(getMovement5e(SpeciesWithRegion.DwarfDefault, 1)).toEqual(4);
  expect(getMovement5e(SpeciesWithRegion.WoodElfDefault, 0)).toEqual(5);
});

test("getSize5e has five steps, Small to Monstrous", () => {
  expect(getSize5e(0)).toEqual(Size.Average);
  expect(getSize5e(-1)).toEqual(Size.Small);
  expect(getSize5e(-3)).toEqual(Size.Small);
  expect(getSize5e(3)).toEqual(Size.Monstrous);
  expect(getSize5e(5)).toEqual(Size.Monstrous);
});

describe("getWounds5e", () => {
  // T 34 (TB 3), WP 27 (WPB 2), S 41 (SB 4)
  test.each([
    { name: "small", size: Size.Small, hardy: 0, expected: 6 },
    { name: "average", size: Size.Average, hardy: 0, expected: 12 },
    { name: "average with hardy", size: Size.Average, hardy: 1, expected: 15 },
    { name: "large", size: Size.Large, hardy: 0, expected: 24 },
    { name: "enormous", size: Size.Enormous, hardy: 0, expected: 48 },
    { name: "monstrous", size: Size.Monstrous, hardy: 0, expected: 96 },
  ])("when size is $name", (t) => {
    expect(getWounds5e(t.size, 34, 27, 41, t.hardy)).toEqual(t.expected);
  });
});

test("rulesFor picks the edition's rules", () => {
  expect(rulesFor("4e")).toBe(rules4e);
  expect(rulesFor("5e")).toBe(rules5e);
});
