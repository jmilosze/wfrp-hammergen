import { describe, expect, test, vi, afterEach } from "vitest";
import { compareArrayIgnoreOrder, compareStringNumber } from "../src/utils/arrayUtils";
import { generateSpeciesTalents } from "../src/services/wh/characterGeneration/generateSpeciesTalents";
import { selectRandom, rollInTable } from "../src/utils/randomUtils";

function getRollInTableMock(roll) {
  return function (sides, rolls, table) {
    for (let element of table) {
      if (roll >= element[1] && roll < element[2]) {
        return element[0];
      }
    }
  };
}

vi.mock("../src/utils/randomUtils");
selectRandom.mockImplementation((arr) => arr[0]);

rollInTable.mockImplementation(getRollInTableMock(20));
afterEach(() => {
  vi.clearAllMocks();
});
describe("generateSpeciesTalents returns expected talents SpeciesTalents has", () => {
  test("non-group non-random single talents", () => {
    const speciesTalents = ["id1", "id2", "id3"];
    const talentGroups = {};
    const randomTalents = [];

    const expected = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("non-group non-random multi talents", () => {
    const speciesTalents = [
      ["id1", "id2", "id3"],
      ["id4", "id5"],
    ];
    const talentGroups = {};
    const randomTalents = [];

    const expected = [
      { id: "id1", number: 1 },
      { id: "id4", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("group talents, no multiple talents belonging to the same group", () => {
    const speciesTalents = ["id1", ["id2", "id3"]];
    const talentGroups = { id1: ["id11", "id12"], id2: ["id21", "id22"], id3: ["id31", "id32"] };
    const randomTalents = [];

    const expected = [
      { id: "id11", number: 1 },
      { id: "id21", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("group talents, multiple talents belonging to the same group, group has enough elements", () => {
    const speciesTalents = ["id11", "id1", "id1", ["id1", "id2"]];
    const talentGroups = { id1: ["id11", "id12", "id13", "id14"] };
    const randomTalents = [];

    const expected = [
      { id: "id11", number: 1 },
      { id: "id12", number: 1 },
      { id: "id13", number: 1 },
      { id: "id14", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("single and multi talents, random with no groups in random table", () => {
    const speciesTalents = ["random", "random", ["random", "id4"]];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 25],
      ["id2", 25, 51],
      ["id3", 51, 101],
    ];

    const expected = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("single and multi talents, random with no groups in random table, randomRoll selects in 2,3,1 order", () => {
    rollInTable
      .mockImplementationOnce(getRollInTableMock(30))
      .mockImplementationOnce(getRollInTableMock(60))
      .mockImplementationOnce(getRollInTableMock(20));
    const speciesTalents = ["random", "random", ["random", "id4"]];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 25],
      ["id2", 25, 51],
      ["id3", 51, 101],
    ];

    const expected = [
      { id: "id3", number: 1 },
      { id: "id2", number: 1 },
      { id: "id1", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });

  test("single and multi talents, random with groups in random table", () => {
    const speciesTalents = ["id11", "random", "id21", "id22", ["random", "id4"]];
    const talentGroups = { id1: ["id11", "id12"], id2: ["id21", "id22"] };
    const randomTalents = [
      ["id1", 1, 25],
      ["id2", 25, 51],
      ["id3", 51, 101],
    ];

    const expected = [
      { id: "id11", number: 1 },
      { id: "id12", number: 1 },
      { id: "id21", number: 1 },
      { id: "id22", number: 1 },
      { id: "id3", number: 1 },
    ];
    const actual = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    expect(compareArrayIgnoreOrder(actual, expected, compareStringNumber)).true;
  });
});

describe("generateSpeciesTalents throws exception if not not enough talents to pick", () => {
  test("single talent has group talents with not enough elements", () => {
    const speciesTalents = ["id11", "id1", "id1"];
    const talentGroups = { id1: ["id11", "id12"] };
    const randomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("not enough talents in group id1");
  });

  test("multi talent has group talents with not enough elements", () => {
    const speciesTalents = ["id11", "id12", ["id1", "id2"]];
    const talentGroups = { id1: ["id11", "id12"] };
    const randomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("not enough talents in group id1");
  });

  test("random table has not enough elements", () => {
    const speciesTalents = ["random", "random", ["random", "id1"]];
    const talentGroups = { id4: ["id1", "id12"] };
    const randomTalents = [
      ["id1", 1, 25],
      ["id2", 25, 51],
    ];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("not enough talents in random talents");
  });
});

describe("generateSpeciesTalents throws exception if randomTalents is invalid", () => {
  test("randomTalents lower bound range is smaller than 1", () => {
    const speciesTalents = [];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 0, 2],
      ["id2", 2, 101],
    ];
    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid random talents table");
  });

  test("randomTalents upper bound is larger than 101", () => {
    const speciesTalents = [];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 2],
      ["id2", 2, 102],
    ];
    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has overlapping ranges", () => {
    const speciesTalents = [];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 5],
      ["id2", 4, 10],
      ["id3", 10, 101],
    ];
    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has gaps between ranges", () => {
    const speciesTalents = [];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 5],
      ["id2", 5, 9],
      ["id3", 10, 101],
    ];
    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid random talents table");
  });

  test("randomTalents has duplicated ids", () => {
    const speciesTalents = [];
    const talentGroups = {};
    const randomTalents = [
      ["id1", 1, 5],
      ["id1", 5, 10],
      ["id3", 10, 101],
    ];
    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid random talents table");
  });
});

describe("generateSpeciesTalents throws exception if speciesTalents is invalid", () => {
  test("speciesTalents has duplicated single talents", () => {
    const speciesTalents = ["id1", "id1", "id3"];
    const talentGroups = {};
    const randomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid species talents object");
  });

  test("speciesTalents has duplicated multi talents", () => {
    const speciesTalents = ["id1", "id2", "id3", ["id3", "id4"], ["id4", "id5"]];
    const talentGroups = {};
    const randomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid species talents object");
  });

  test("speciesTalents has duplicated talents between multi and single", () => {
    const speciesTalents = ["id1", "id2", "id3", ["id3", "id4"], ["id5", "id6"]];
    const talentGroups = {};
    const randomTalents = [];

    expect(() => {
      generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);
    }).toThrow("invalid species talents object");
  });
});
