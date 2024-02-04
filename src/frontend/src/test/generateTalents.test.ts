import { expect, test } from "vitest";
import { getAllTalentsMaxRank, getTalentAtts } from "../services/wh/characterGeneration/generateTalents.ts";
import { Talent } from "../services/wh/talent.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { getAttributes } from "../services/wh/attributes.ts";

const listOfWhTalents: Talent[] = [
  new Talent({
    id: "id0",
    modifiers: new CharacterModifiers({
      attributes: { WS: 10, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 0,
    attribute: 1,
  }),
  new Talent({
    id: "id1",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 20, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 1,
    attribute: 3,
  }),
  new Talent({
    id: "id2",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 0, S: 30, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 2,
    attribute: 6,
  }),
];

test("getTalentAtts returns empty atts when selected talents is empty", () => {
  expect(getTalentAtts([], listOfWhTalents)).toEqual(getAttributes());
});

test("getTalentAtts returns correct atts", () => {
  expect(
    getTalentAtts(
      [
        { id: "id0", number: 0 },
        { id: "id1", number: 1 },
        { id: "id2", number: 2 },
      ],
      listOfWhTalents,
    ),
  ).toEqual({ WS: 0, BS: 20, S: 60, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 });
});

test("getAllTalentsMaxRank return correct max ranks", () => {
  const baseAtts = { WS: 10, BS: 10, S: 10, T: 10, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  const advances = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };
  expect(
    getAllTalentsMaxRank(
      [
        { id: "id0", number: 0 },
        { id: "id1", number: 1 },
        { id: "id2", number: 2 },
      ],
      listOfWhTalents,
      baseAtts,
      advances, // total: { WS:20, BS: 40, S: 80, T: 20, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 }
    ),
  ).toEqual({
    id0: 2, // expected = 0 + WS/10
    id1: 9, // expected = 1 + S/10
    id2: 3, // expected = 2 + 10/10
  });
});
