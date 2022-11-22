import { sumAndMultModifiers } from "../src/services/wh/characterModifiers";
test("sumAndMultModifiers sums and multiplies modifiers correctly", () => {
  let mod1 = {
    size: 0,
    movement: 0,
    attributes: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  };
  let mult1 = 1;

  let mod2 = {
    size: -1,
    movement: -1,
    attributes: { WS: 2, BS: 2, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  };
  let mult2 = 2;

  let mod3 = {
    size: 1,
    movement: 1,
    attributes: { WS: 2, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  };
  let mult3 = 1;

  let expected = {
    size: -1,
    movement: -1,
    attributes: { WS: 26, BS: 24, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  };

  expect(
    sumAndMultModifiers([
      { multiplier: mult1, modifiers: mod1 },
      { multiplier: mult2, modifiers: mod2 },
      { multiplier: mult3, modifiers: mod3 },
    ])
  ).toEqual(expected);
});
