import { describe, expect, test } from "vitest";
import {
  generateAvailableTalents,
  getAllTalentsMaxRank,
  getTalentGroups,
} from "../services/wh/characterGeneration/generateTalents.ts";
import { Talent } from "../services/wh/talent.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { AttributeName } from "../services/wh/attributes.ts";
import { getSelectRandomTest } from "./commonTests.ts";

const listOfWhTalents: Talent[] = [
  new Talent({
    id: "id0",
    modifiers: new CharacterModifiers({
      attributes: { WS: 10, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 0,
    group: ["id3", "id4"],
    attribute: AttributeName.WS,
  }),
  new Talent({
    id: "id1",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 20, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 1,
    group: ["id3"],
    attribute: AttributeName.S,
  }),
  new Talent({
    id: "id2",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 0, S: 30, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 2,
    attribute: AttributeName.Ag,
  }),
  new Talent({
    id: "id3",
    modifiers: new CharacterModifiers(),
    maxRank: 1,
    attribute: AttributeName.None,
    isGroup: true,
  }),
  new Talent({
    id: "id4",
    modifiers: new CharacterModifiers(),
    maxRank: 1,
    attribute: AttributeName.Various,
    isGroup: true,
  }),
];

const baseAtts = { WS: 10, BS: 10, S: 10, T: 10, I: 0, Ag: 15, Dex: 0, Int: 0, WP: 0, Fel: 0 };
const advances = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };

describe("getAllTalentsMaxRank return correct max ranks", () => {
  test("with 0 selected talents", () => {
    expect(getAllTalentsMaxRank([], listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 1, // expected = 1 + None
      id4: 1, // expected = 1 + None
    });
  });

  test("with 2 selected talents", () => {
    expect(
      getAllTalentsMaxRank(
        [
          { id: "id1", number: 1 },
          { id: "id2", number: 2 },
        ],
        listOfWhTalents,
        baseAtts,
        advances,
      ),
    ).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 9, // expected = 1 + S(80)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 1, // expected = 1 + None
      id4: 1, // expected = 1 + None
    });
  });

  test("with selected talent not among whTalents", () => {
    expect(getAllTalentsMaxRank([{ id: "otherId", number: 1 }], listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 1, // expected = 1 + None
      id4: 1, // expected = 1 + None
    });
  });
});

test("getTalentGroups generates expected talent groups", () => {
  const generatedGroups = getTalentGroups(listOfWhTalents);
  for (const membersIds of Object.values(generatedGroups)) {
    membersIds.sort();
  }
  expect(generatedGroups).toEqual({
    id4: ["id0"],
    id3: ["id0", "id1"],
  });
});

describe("generateAvailableTalents generates expected talents", () => {
  const talentGroups = {
    id4: ["id0"],
    id3: ["id0", "id1"],
  };

  test("when talents list is empty", () => {
    expect(generateAvailableTalents([], talentGroups, getSelectRandomTest(0))).toEqual([]);
  });
});
