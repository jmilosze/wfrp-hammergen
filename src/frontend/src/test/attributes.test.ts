import { describe, expect, test } from "vitest";
import { getAttributes, sumAndMultiplyAttributes } from "../services/wh/attributes";
import * as c from "../services/wh/characterConstants";

test("sumAndMultAtts adds and multiplies attributes correctly", () => {
  let att1 = { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };
  let mult1 = 1;

  let att2 = { WS: 2, BS: 2, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  let mult2 = 2;

  let att3 = { WS: 2, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  let mult3 = 1;

  let expected = { WS: 26, BS: 24, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };

  expect(
    sumAndMultiplyAttributes([
      { multiplier: mult1, attributes: att1 },
      { multiplier: mult2, attributes: att2 },
      { multiplier: mult3, attributes: att3 },
    ]),
  ).toEqual(expected);
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
