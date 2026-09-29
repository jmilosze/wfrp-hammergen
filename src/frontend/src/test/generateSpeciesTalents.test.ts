import { describe, expect, test } from "vitest";
import {
  generateSpeciesTalents,
  RandomTalents,
  SpeciesTalents,
} from "../services/wh/characterGeneration/generateSpeciesTalents.ts";
import { EntityGroupMap } from "../services/wh/characterGeneration/resolveEntityGroups.ts";
import { getRollDiceTest, getSelectRandomTest } from "./commonTests.ts";

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
