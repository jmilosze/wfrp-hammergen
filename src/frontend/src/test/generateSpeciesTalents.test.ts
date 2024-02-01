import { describe, expect, test } from "vitest";
import {
  generateSpeciesTalents,
  GroupTalents,
  RandomTalents,
  SpeciesTalents,
} from "../services/wh/characterGeneration/generateSpeciesTalents.ts";
import { compareIdNumber, IdNumber } from "../services/wh/common.ts";
import { arraysAreEqualIgnoreOrder } from "../utils/arrayUtils.ts";

function getRollInTableTest(...rolls: number[]): <T>(_: number, __: number, table: [T, number, number][]) => T {
  let expectedRolls = [] as number[];
  let currentRoll = 0;
  expectedRolls = JSON.parse(JSON.stringify(rolls));

  return function <T>(_: number, __: number, table: [T, number, number][]) {
    const roll =
      currentRoll < expectedRolls.length ? expectedRolls[currentRoll] : expectedRolls[expectedRolls.length - 1];
    for (const element of table) {
      if (roll >= element[1] && roll < element[2]) {
        currentRoll += 1;
        console.log(`Rolled ${roll}`);
        return element[0];
      }
    }
    throw new Error(`invalid table ${table}`);
  };
}

function getSelectRandomTest(pickNumber: number): <T>(array: T[]) => T {
  return function <T>(array: T[]) {
    return array[pickNumber];
  };
}

describe("generateSpeciesTalents returns expected talents", () => {
  test("non-group non-random single talents", () => {
    const speciesTalents = ["id1", "id2", "id3"] as SpeciesTalents;
    const talentGroups = {} as GroupTalents;
    const randomTalents = [] as RandomTalents;

    const expected: IdNumber[] = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("non-group non-random multi talents", () => {
    const speciesTalents = ["id1,id2,id3", "id4,id5"] as SpeciesTalents;
    const talentGroups = {} as GroupTalents;
    const randomTalents = [] as RandomTalents;

    const expected = [
      { id: "id1", number: 1 },
      { id: "id4", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("group talents, no multiple talents belonging to the same group", () => {
    const speciesTalents = ["id1", "id2,id3"] as SpeciesTalents;
    const talentGroups = { id1: ["id11", "id12"], id2: ["id21", "id22"], id3: ["id31", "id32"] } as GroupTalents;
    const randomTalents = [] as RandomTalents;

    const expected = [
      { id: "id11", number: 1 },
      { id: "id21", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("group talents, multiple talents belonging to the same group, group has enough elements", () => {
    const speciesTalents = ["id11", "id1", "id1", "id1,id2"] as SpeciesTalents;
    const talentGroups = { id1: ["id11", "id12", "id13", "id14"] } as GroupTalents;
    const randomTalents = [] as RandomTalents;

    const expected = [
      { id: "id11", number: 1 },
      { id: "id12", number: 1 },
      { id: "id13", number: 1 },
      { id: "id14", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("single and multi talents, random with no groups in random table", () => {
    const speciesTalents = ["random", "random", "random,id4"] as SpeciesTalents;
    const talentGroups = {} as GroupTalents;
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const expected = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("single and multi talents, random with no groups in random table, randomRoll selects in 2,3,1 order", () => {
    const speciesTalents = ["random", "random", "random,id4"] as SpeciesTalents;
    const talentGroups = {} as GroupTalents;
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const expected = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(30, 60, 20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });

  test("single and multi talents, random with groups in random table", () => {
    const speciesTalents = ["id11", "random", "id21", "id22", "random,id4"] as SpeciesTalents;
    const talentGroups = { id1: ["id11", "id12"], id2: ["id21", "id22"] } as GroupTalents;
    const randomTalents = [
      { id: "id1", minRoll: 1, maxRoll: 25 },
      { id: "id2", minRoll: 25, maxRoll: 51 },
      { id: "id3", minRoll: 51, maxRoll: 101 },
    ] as RandomTalents;

    const expected = [
      { id: "id11", number: 1 },
      { id: "id12", number: 1 },
      { id: "id21", number: 1 },
      { id: "id22", number: 1 },
      { id: "id3", number: 1 },
    ];
    const actual = generateSpeciesTalents(
      speciesTalents,
      talentGroups,
      randomTalents,
      getSelectRandomTest(0),
      getRollInTableTest(20),
    );
    expect(arraysAreEqualIgnoreOrder(actual, expected, compareIdNumber)).true;
  });
});

// describe("generateSpeciesTalents throws exception if not not enough talents to pick", () => {
//   test("single talent has group talents with not enough elements", () => {
//     const speciesTalents = ["id11", "id1", "id1"];
//     const talentGroups = { id1: ["id11", "id12"] };
//     const randomTalents = [];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("not enough talents in group id1");
//   });
//
//   test("multi talent has group talents with not enough elements", () => {
//     const speciesTalents = ["id11", "id12", "id1,id2"];
//     const talentGroups = { id1: ["id11", "id12"] };
//     const randomTalents = [];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("not enough talents in group id1");
//   });
//
//   test("random table has not enough elements", () => {
//     const speciesTalents = ["random", "random", "random,id1"];
//     const talentGroups = { id4: ["id1", "id12"] };
//     const randomTalents = [
//       { id: "id1", minRoll: 1, maxRoll: 25 },
//       { id: "id2", minRoll: 25, maxRoll: 51 },
//     ];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("not enough talents in random talents");
//   });
// });
//
// describe("generateSpeciesTalents throws exception if randomTalents is invalid", () => {
//   test("randomTalents lower bound range is smaller than 1", () => {
//     const speciesTalents = [];
//     const talentGroups = {};
//     const randomTalents = [
//       ["id1", 0, 2],
//       ["id2", 2, 101],
//     ];
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid random talents table");
//   });
//
//   test("randomTalents upper bound is larger than 101", () => {
//     const speciesTalents = [];
//     const talentGroups = {};
//     const randomTalents = [
//       ["id1", 1, 2],
//       ["id2", 2, 102],
//     ];
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid random talents table");
//   });
//
//   test("randomTalents has overlapping ranges", () => {
//     const speciesTalents = [];
//     const talentGroups = {};
//     const randomTalents = [
//       ["id1", 1, 5],
//       ["id2", 4, 10],
//       ["id3", 10, 101],
//     ];
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid random talents table");
//   });
//
//   test("randomTalents has gaps between ranges", () => {
//     const speciesTalents = [];
//     const talentGroups = {};
//     const randomTalents = [
//       ["id1", 1, 5],
//       ["id2", 5, 9],
//       ["id3", 10, 101],
//     ];
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid random talents table");
//   });
//
//   test("randomTalents has duplicated ids", () => {
//     const speciesTalents = [];
//     const talentGroups = {};
//     const randomTalents = [
//       ["id1", 1, 5],
//       ["id1", 5, 10],
//       ["id3", 10, 101],
//     ];
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid random talents table");
//   });
// });
//
// describe("generateSpeciesTalents throws exception if speciesTalents is invalid", () => {
//   test("speciesTalents has duplicated single talents", () => {
//     const speciesTalents = ["id1", "id1", "id3"];
//     const talentGroups = {};
//     const randomTalents = [];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid species talents object");
//   });
//
//   test("speciesTalents has duplicated multi talents", () => {
//     const speciesTalents = ["id1", "id2", "id3", "id3,id4", "id4,id5"];
//     const talentGroups = {};
//     const randomTalents = [];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid species talents object");
//   });
//
//   test("speciesTalents has duplicated talents between multi and single", () => {
//     const speciesTalents = ["id1", "id2", "id3", "id3,id4", "id5,id6"];
//     const talentGroups = {};
//     const randomTalents = [];
//
//     expect(() => {
//       generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
//     }).toThrow("invalid species talents object");
//   });
// });
