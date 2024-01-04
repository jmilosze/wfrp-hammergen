import { describe, expect, test } from "vitest";
import { getAttributes, multiplyAttributes, sumAttributes } from "../services/wh/attributes.ts";
import * as c from "../services/wh/characterConstants.ts";

test("sumAttributes adds attributes correctly", () => {
  const att1 = { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };
  const att2 = { WS: 2, BS: 2, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  const expected = { WS: 22, BS: 22, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };

  expect(sumAttributes(att1, att2)).toEqual(expected);
});

test("multiplyAttributes multiplies attributes correctly", () => {
  const att = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 };
  const mult = 2;
  const expected = { WS: 2, BS: 4, S: 6, T: 8, I: 10, Ag: 12, Dex: 14, Int: 16, WP: 18, Fel: 20 };

  expect(multiplyAttributes(mult, att)).toEqual(expected);
});

describe("getRacialAttributes returns correct value", () => {
  test.each([
    {
      name: "human",
      species: c.HUMAN_REIKLAND,
      expected: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
    },
    {
      name: "halfling",
      species: c.HALFLING_DEFAULT,
      expected: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
    },
    {
      name: "dwarf",
      species: c.DWARF_DEFAULT,
      expected: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
    },
    {
      name: "high elf",
      species: c.HIGH_ELF_DEFAULT,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
    {
      name: "wood elf",
      species: c.WOOD_ELF_DEFAULT,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
    {
      name: "gnome",
      species: c.GNOME_DEFAULT,
      expected: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
    },
    {
      name: "ogre",
      species: c.OGRE_DEFAULT,
      expected: { WS: 20, BS: 10, S: 35, T: 35, I: 0, Ag: 15, Dex: 10, Int: 10, WP: 20, Fel: 10 },
    },
  ])("when species is $name", (t) => {
    expect(getAttributes(t.species)).toEqual(t.expected);
  });
});
