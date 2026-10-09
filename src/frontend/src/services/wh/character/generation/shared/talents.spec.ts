import { describe, expect, test } from "vitest";
import {
  generateSpeciesTalents,
  RandomTalents,
  SpeciesTalents,
  calculateMaxTalentRanks,
  resolveAvailableTalents,
  populateSpeciesTalents,
} from "./talents.ts";
import { EntityGroupMap } from "./groups.ts";
import { rollDice, selectRandom } from "../../../../../utils/random.ts";
import { getRollDiceTest, getSelectRandomTest } from "../../../../../testing.ts";
import { Talent } from "../../../content/talent.ts";
import { CharacterModifiers } from "../../../core/characterModifiers.ts";
import { AttributeName } from "../../../core/attributes.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { GenerationProps } from "./generationProps.ts";
import { Character } from "../../character.ts";

describe("generateSpeciesTalents returns expected talents", () => {
  test("non-group non-random single talents", () => {
    const speciesTalents = ["id1", "id2", "id3"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id1: 1, id2: 1, id3: 1 });
  });

  test("non-group non-random multi talents", () => {
    const speciesTalents = ["id1,id2,id3", "id4,id5"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id1: 1, id4: 1 });
  });

  test("group talents, no multiple talents belonging to the same group", () => {
    const speciesTalents = ["id1", "id2,id3"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = { id1: ["id11", "id12"], id2: ["id21", "id22"], id3: ["id31", "id32"] };
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id11: 1, id21: 1 });
  });

  test("group talents, multiple talents belonging to the same group, group has enough elements", () => {
    const speciesTalents = ["id11", "id1", "id1", "id1,id2"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = { id1: ["id11", "id12", "id13", "id14"] };
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id11: 1, id12: 1, id13: 1, id14: 1 });
  });

  test("single and multi talents, random with no groups in random table", () => {
    const speciesTalents = ["random", "random", "random,id4"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id1: 1, id2: 1, id3: 1 });
  });

  test("single and multi talents, random with no groups in random table, randomRoll selects in 2,3,1 order", () => {
    const speciesTalents = ["random", "random", "random,id4"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(30, 60, 20),
    );
    expect(actual).toEqual({ id1: 1, id2: 1, id3: 1 });
  });

  test("single and multi talents, random with groups in random table", () => {
    const speciesTalents = ["id11", "random", "id21", "id22", "random,id4"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = { id1: ["id11", "id12"], id2: ["id21", "id22"] };
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id11: 1, id12: 1, id21: 1, id22: 1, id3: 1 });
  });

  test("trims whitespace from comma-separated options", () => {
    const speciesTalents: SpeciesTalents = ["  id1  ,  id2  "];
    const groupTalents: EntityGroupMap = {};
    const randomTalents: RandomTalents = [];

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id1: 1 });
  });
});

describe("generateSpeciesTalents throws exception if not not enough talents to pick", () => {
  test("single talent has group talents with not enough elements", () => {
    const speciesTalents = ["id11", "id1", "id1"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = { id1: ["id11", "id12"] };
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id11: 1, id12: 1 });
  });

  test("multi talent has group talents with not enough elements", () => {
    const speciesTalents = ["id11", "id12", "id1,id2"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = { id1: ["id11", "id12"] };
    const randomTalents = [] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id11: 1, id12: 1 });
  });

  test("random table has not enough elements", () => {
    const speciesTalents = ["random", "random", "random"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 50 },
      { id: "id2", minRoll: 50, maxRoll: 101 },
    ] as RandomTalents;

    const actual = generateSpeciesTalents(
      speciesTalents,
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(20),
    );
    expect(actual).toEqual({ id1: 1, id2: 1 });
  });

  test("returns empty record when speciesTalents is undefined", () => {
    const actual = generateSpeciesTalents(undefined, {}, [], getSelectRandomTest(0), getRollDiceTest(20));
    expect(actual).toEqual({});
  });
});

describe("generateSpeciesTalents throws exception if randomTalents is invalid", () => {
  test("randomTalents lower bound range is smaller than 1", () => {
    const speciesTalents = [] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 0, maxRoll: 2 },
      { id: "id2", minRoll: 2, maxRoll: 101 },
    ] as RandomTalents;
    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });

  test("randomTalents upper bound is larger than 101", () => {
    const speciesTalents = [] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 2 },
      { id: "id2", minRoll: 2, maxRoll: 102 },
    ] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });

  test("randomTalents upper bound is smaller than 101", () => {
    const speciesTalents: SpeciesTalents = [];
    const groupTalents: EntityGroupMap = {};
    const randomTalents: RandomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 50 },
      { id: "id2", minRoll: 50, maxRoll: 100 },
    ];

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has overlapping ranges", () => {
    const speciesTalents = [] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 5 },
      { id: "id2", minRoll: 4, maxRoll: 10 },
      { id: "id3", minRoll: 10, maxRoll: 101 },
    ] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has gaps between ranges", () => {
    const speciesTalents = [] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 5 },
      { id: "id2", minRoll: 5, maxRoll: 9 },
      { id: "id3", minRoll: 10, maxRoll: 101 },
    ] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has duplicated ids", () => {
    const speciesTalents = [] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 5 },
      { id: "id2", minRoll: 5, maxRoll: 10 },
      { id: "id2", minRoll: 10, maxRoll: 101 },
    ] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid random talents table");
  });
});

describe("generateSpeciesTalents throws exception if speciesTalents is invalid", () => {
  test("speciesTalents has duplicated single talents", () => {
    const speciesTalents = ["id1", "id1", "id3"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid species talents object");
  });

  test("speciesTalents has duplicated multi talents", () => {
    const speciesTalents = ["id1", "id2", "id3", "id3,id4", "id4,id5"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid species talents object");
  });

  test("speciesTalents has duplicated talents between multi and single", () => {
    const speciesTalents = ["id1", "id2", "id3", "id3,id4", "id5,id6"] as SpeciesTalents;
    const groupTalents: EntityGroupMap = {};
    const randomTalents = [] as RandomTalents;

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid species talents object");
  });

  test("speciesTalents has duplicated talents differing only in whitespace", () => {
    const speciesTalents: SpeciesTalents = [" id1 ", "id1"];
    const groupTalents: EntityGroupMap = {};
    const randomTalents: RandomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, groupTalents, randomTalents, getSelectRandomTest(0), getRollDiceTest(20));
    }).toThrow("invalid species talents object");
  });
});

describe("generateSpeciesTalents never loses a talent the species gets by name", () => {
  const randomTalents: RandomTalents = [
    { id: "luck", minRoll: 1, maxRoll: 26 },
    { id: "savvy", minRoll: 26, maxRoll: 51 },
    { id: "acute_sense", minRoll: 51, maxRoll: 76 },
    { id: "hardy", minRoll: 76, maxRoll: 101 },
  ];
  const groupTalents: EntityGroupMap = { acute_sense: ["acute_sight", "acute_taste"] };

  test("a random pick skips a named talent listed after it", () => {
    // Roll 10 lands on Luck, which the species gets by name, so the random pick rolls again and gets Savvy.
    const result = generateSpeciesTalents(
      ["random", "luck", "doomed"],
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(10),
    );
    expect(result).toEqual({ luck: 1, doomed: 1, savvy: 1 });
  });

  test("a group pick skips a named talent listed after it", () => {
    const result = generateSpeciesTalents(
      ["acute_sense", "acute_sight", "doomed"],
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(10),
    );
    expect(result).toEqual({ acute_sight: 1, doomed: 1, acute_taste: 1 });
  });

  test("a random pick that lands on a group skips a named talent listed after it", () => {
    // Roll 60 lands on the Acute Sense group; Sight is named, so the group gives Taste.
    const result = generateSpeciesTalents(
      ["random", "acute_sight", "doomed"],
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(60),
    );
    expect(result).toEqual({ acute_sight: 1, doomed: 1, acute_taste: 1 });
  });

  test("a random pick skips a talent chosen from a later choice", () => {
    // The "savvy,suave" choice picks Savvy, so the random roll that lands on Savvy rolls again.
    const result = generateSpeciesTalents(
      ["random", "savvy,suave"],
      groupTalents,
      randomTalents,
      getSelectRandomTest(0),
      getRollDiceTest(30),
    );
    expect(result).toEqual({ savvy: 1, acute_sight: 1 });
  });

  test("always gives one talent per species entry, whatever the order", () => {
    for (let i = 0; i < 200; ++i) {
      const result = generateSpeciesTalents(
        ["random", "random", "luck", "doomed"],
        groupTalents,
        randomTalents,
        selectRandom,
        rollDice,
      );
      expect(Object.keys(result).length).toBe(4);
      expect(result.luck).toBe(1);
    }
  });
});

const baseAtts = { WS: 10, BS: 10, S: 10, T: 10, I: 0, Ag: 15, Dex: 0, Int: 0, WP: 0, Fel: 0 };

const advances = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };

const listOfWhTalents: Talent[] = [
  new Talent({
    id: "id0",
    modifiers: new CharacterModifiers({
      attributes: { WS: 10, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 0,
    group: new Set(["id3", "id4"]),
    attribute: AttributeName.WS,
  }),
  new Talent({
    id: "id1",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 20, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 1,
    group: new Set(["id3"]),
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
    attribute: AttributeName.None,
    isGroup: true,
  }),
  new Talent({
    id: "id4",
    attribute: AttributeName.Various,
    isGroup: true,
  }),
];

describe("calculateMaxTalentRanks", () => {
  test("with 0 selected talents", () => {
    expect(calculateMaxTalentRanks({}, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });

  test("with 2 selected talents", () => {
    expect(calculateMaxTalentRanks({ id1: 1, id2: 2 }, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 9, // expected = 1 + S(80)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });

  test("with selected talent not among whTalents", () => {
    expect(calculateMaxTalentRanks({ otherId: 1 }, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });
});

describe("resolveAvailableTalents", () => {
  const talentGroups = {
    groupId1: ["id0"],
    groupId2: ["id0", "id1", "id2"],
  };

  test("when talents list is empty", () => {
    expect(resolveAvailableTalents([], talentGroups, getSelectRandomTest(0))).toEqual([]);
  });

  test("when talents list does not contain group", () => {
    const availTalents = resolveAvailableTalents(["id1", "id2", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1", "id2"]);
  });

  test("when talents list contains a group talent", () => {
    const availTalents = resolveAvailableTalents(["groupId2"], talentGroups, getSelectRandomTest(1));
    expect(availTalents).toEqual(["id1"]);
  });

  test("when talents list contains repetitions", () => {
    const availTalents = resolveAvailableTalents(["id1", "id1", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1"]);
  });

  test("when talents list contains repetitions in group", () => {
    const availTalents = resolveAvailableTalents(["id1", "groupId2", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1"]);
  });
});

describe("populateSpeciesTalents", () => {
  const dummyGenProps: GenerationProps = {
    classItems: [
      {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    ],
    randomTalents: [
      { id: "rand1", minRoll: 1, maxRoll: 50 },
      { id: "rand2", minRoll: 50, maxRoll: 101 },
    ],
    speciesTalents: {
      [SpeciesWithRegion.HumanReikland]: ["talent1", "talent2"],
    },
    speciesSkills: {
      [SpeciesWithRegion.HumanReikland]: ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
    },
  };

  test("populateSpeciesTalents populates talents on character when species is supported", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    const talents = [new Talent({ id: "talent1", name: "Talent 1" }), new Talent({ id: "talent2", name: "Talent 2" })];

    populateSpeciesTalents(char, talents, dummyGenProps);
    expect(char.talents).toEqual({ talent1: 1, talent2: 1 });
  });

  test("populateSpeciesTalents does not modify character talents when species is not supported", () => {
    const char = new Character({ species: SpeciesWithRegion.None });
    populateSpeciesTalents(char, [], dummyGenProps);
    expect(char.talents).toEqual({});
  });
});
