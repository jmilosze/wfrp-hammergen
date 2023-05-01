import { describe, expect, test } from "vitest";
import { getAttributes, sumAndMultAttr } from "../src/services/wh/attributes";

import { species } from "@/services/wh/career";

test("sumAndMultAttr adds and multiplies attributes correctly", () => {
  let att1 = { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };
  let mult1 = 1;

  let att2 = { WS: 2, BS: 2, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  let mult2 = 2;

  let att3 = { WS: 2, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  let mult3 = 1;

  let expected = { WS: 26, BS: 24, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 };

  expect(
    sumAndMultAttr([
      { multiplier: mult1, attributes: att1 },
      { multiplier: mult2, attributes: att2 },
      { multiplier: mult3, attributes: att3 },
    ])
  ).toEqual(expected);
});

describe("getRacialAttributes returns correct value", () => {
  test.each([
    {
      name: species[0],
      species: 0,
      expected: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
    },
    {
      name: species[1],
      species: 1,
      expected: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
    },
    {
      name: species[2],
      species: 2,
      expected: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
    },
    {
      name: species[3],
      species: 3,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
    {
      name: species[4],
      species: 4,
      expected: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
    },
    {
      name: species[5],
      species: 5,
      expected: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
    },
  ])("when species is $name", (t) => {
    expect(getAttributes(t.species)).toEqual(t.expected);
  });
});
