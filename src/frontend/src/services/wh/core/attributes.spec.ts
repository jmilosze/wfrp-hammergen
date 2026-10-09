import { expect, test } from "vitest";
import { multiplyAttributes, sumAttributes } from "./attributes.ts";

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
