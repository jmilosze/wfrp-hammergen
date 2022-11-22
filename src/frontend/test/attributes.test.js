import { sumAndMultAttr } from "../src/services/wh/attributes";
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
