import { describe, expect, test } from "vitest";
import { getSpeciesAttributes4e, getWounds4e } from "./rules4e.ts";
import { SpeciesWithRegion } from "../../core/species.ts";
import { Size } from "../size.ts";

describe("getRacialAttributes returns correct value", () => {
  test.each([
    {
      name: "human",
      species: SpeciesWithRegion.HumanReikland,
      expected: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
    },
    {
      name: "halfling",
      species: SpeciesWithRegion.HalflingDefault,
      expected: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
    },
    {
      name: "dwarf",
      species: SpeciesWithRegion.DwarfDefault,
      expected: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
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
    {
      name: "gnome",
      species: SpeciesWithRegion.GnomeDefault,
      expected: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
    },
    {
      name: "ogre",
      species: SpeciesWithRegion.OgreDefault,
      expected: { WS: 20, BS: 10, S: 35, T: 35, I: 0, Ag: 15, Dex: 10, Int: 10, WP: 20, Fel: 10 },
    },
  ])("when species is $name", (t) => {
    expect(getSpeciesAttributes4e(t.species)).toEqual(t.expected);
  });
});

describe("getWounds4e returns correct value", () => {
  test.each([
    { size: Size.Average, T: 10, WP: 10, S: 10, hardy: 1, expected: 5 }, // 1 + (2 * 1) + 1 + 1
    { size: Size.Average, T: 12, WP: 17, S: 20, hardy: 2, expected: 7 }, // 2 + (2 * 1) + 1 + 2
    { size: Size.Average, T: 21, WP: 26, S: 10, hardy: 0, expected: 7 }, // 1 + (2 * 2) + 2
    { size: Size.Small, T: 20, WP: 10, S: 10, hardy: 0, expected: 5 }, // (2 * 2) + 1
    { size: Size.Little, T: 20, WP: 10, S: 10, hardy: 0, expected: 2 }, // 2
    { size: Size.Tiny, T: 20, WP: 10, S: 10, hardy: 0, expected: 1 }, // 1
    { size: -1, T: 20, WP: 10, S: 10, hardy: 0, expected: 1 }, // 1
    { size: Size.Large, T: 20, WP: 10, S: 10, hardy: 0, expected: 12 }, // 2 * (1 + (2 * 2) + 1)
    { size: Size.Enormous, T: 20, WP: 10, S: 10, hardy: 0, expected: 24 }, // 4 * (1 + (2 * 2) + 1)
    { size: Size.Monstrous, T: 20, WP: 10, S: 10, hardy: 0, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
    { size: 7, T: 20, WP: 10, S: 10, hardy: 0, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
  ])("when size = $size, T = $T, WP = $WP, S = $S", (t) => {
    expect(getWounds4e(t.size, t.T, t.WP, t.S, t.hardy)).toEqual(t.expected);
  });
});
