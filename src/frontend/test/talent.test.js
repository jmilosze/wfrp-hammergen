import { describe, expect, test, vi } from "vitest";
import { compareTalent, TalentApi } from "../src/services/wh/talent";

const talent1 = {
  id: "id1",
  canEdit: true,
  object: {
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    attribute: 2,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  },
};

const talent2 = {
  id: "id2",
  canEdit: true,
  object: {
    name: "talent2",
    description: "desc2",
    tests: "asd",
    maxRank: 2,
    attribute: 1,
    modifiers: {
      size: 0,
      movement: 0,
      attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: false,
    group: [],
    shared: true,
    source: {},
  },
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/wh/talent") {
      apiData = [JSON.parse(JSON.stringify(talent1)), JSON.parse(JSON.stringify(talent2))];
    } else if (path === "/api/wh/talent/id1") {
      apiData = JSON.parse(JSON.stringify(talent1));
    } else if (path === "/api/wh/talent/id2") {
      apiData = JSON.parse(JSON.stringify(talent2));
    } else {
      throw "invalid id";
    }
    return { data: { data: apiData } };
  },
  post: async () => {
    return { data: { data: { id: "id1" } } };
  },
  put: async () => {
    return { data: { data: { id: "id1" } } };
  },
  delete: async () => {},
};

describe("getElement returns expected talent", () => {
  test("when talent has modifiers", async () => {
    const client = new TalentApi(mockAxios);
    const result = await client.getElement("id1");

    expect(result).toMatchObject({
      id: "id1",
      name: "talent1",
      description: "desc1",
      tests: "qwe",
      maxRank: 4,
      maxRankAtt: 2,
      hasModifiers: true,
      modifiers: {
        size: 0,
        movement: 1,
        attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
      },
      isGroup: true,
      group: ["a", "b"],
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    });
  });

  test("when talent does not have modifiers", async () => {
    const client = new TalentApi(mockAxios);
    const result = await client.getElement("id2");

    expect(result).toMatchObject({
      id: "id2",
      name: "talent2",
      description: "desc2",
      tests: "asd",
      maxRank: 2,
      maxRankAtt: 1,
      hasModifiers: false,
      modifiers: {
        size: 0,
        movement: 0,
        attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
      },
      isGroup: false,
      group: [],
      canEdit: true,
      shared: true,
      source: {},
    });
  });
});

test("listElements returns expected talents", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "talent1",
      description: "desc1",
      tests: "qwe",
      maxRank: 4,
      maxRankAtt: 2,
      isGroup: true,
      group: ["a", "b"],
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    },
    {
      id: "id2",
      name: "talent2",
      description: "desc2",
      tests: "asd",
      maxRank: 2,
      maxRankAtt: 1,
      isGroup: false,
      group: [],
      canEdit: true,
      shared: true,
      source: {},
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement({
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/talent", {
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    max_rank: 4,
    max_rank_att: 2,
    is_group: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "put");
  const result = await client.updateElement({
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/talent/id1", {
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    max_rank: 4,
    max_rank_att: 2,
    is_group: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/talent/id1");
});

describe("compareTalent returns true", () => {
  const talentIndividual = {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: false,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  const talentGroup = JSON.parse(JSON.stringify(talentIndividual));
  talentGroup.isGroup = true;

  test("when other talent is exactly the same", () => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    expect(compareTalent(talentIndividual, otherTalent)).toBe(true);
  });

  test("when other talent has group field with elements in different order", () => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.group = ["b", "a"];
    expect(compareTalent(talentIndividual, otherTalent)).toBe(true);
  });

  test.each([
    { field: "tests", name: "tests", value: "asd" },
    { field: "maxRank", name: "maxRank", value: 5 },
    { field: "maxRankAtt", name: "maxRankAtt", value: 6 },
    {
      field: "modifiers",
      name: "modifiers",
      value: {
        size: 1,
        movement: 1,
        attributes: { WS: 0, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
      },
    },
    { field: "group", name: "group (subset)", value: ["a"] },
    { field: "group", name: "group (name length, different values)", value: ["c", "d"] },
  ])("when group talent is has different values of $name", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentGroup));
    otherTalent[t.field] = t.value;
    expect(compareTalent(talentGroup, otherTalent)).toBe(true);
  });
});

describe("compareTalent returns false", () => {
  const talentIndividual = {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: false,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  const talentGroup = JSON.parse(JSON.stringify(talentIndividual));
  talentGroup.isGroup = true;

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "tests", value: "otherTests" },
    { field: "maxRank", value: 1 },
    { field: "maxRankAtt", value: 4 },
    { field: "isGroup", value: true },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when talent is individual and other talent has different value of $field", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent[t.field] = t.value;
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });

  test.each([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when talent is individual and other talent has $diff", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.source = t.source;
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "isGroup", value: false },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
    { field: "source", value: { 1: "zxc", 3: "asd" } },
  ])("when talent is group and other talent has different value of $field", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentGroup));
    otherTalent[t.field] = t.value;
    expect(compareTalent(talentGroup, otherTalent)).toBe(false);
  });

  test("when talent is individual and other talent has group field that is a subset", () => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.group = ["a"];
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });

  test("when talent is individual and other talent has group field of the same length but different values", () => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.group = ["c", "d"];
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });

  test.each([
    { field: "WS", value: 10 },
    { field: "BS", value: 10 },
    { field: "S", value: 10 },
    { field: "T", value: 10 },
    { field: "I", value: 10 },
    { field: "Ag", value: 10 },
    { field: "Dex", value: 10 },
    { field: "Int", value: 10 },
    { field: "WP", value: 10 },
    { field: "Fel", value: 10 },
  ])("when other talent has different value of modifier $field", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.modifiers.attributes[t.field] = t.value;
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });

  test.each([
    { field: "size", value: 1 },
    { field: "movement", value: -1 },
  ])("when talent is individual and other talent has different value of modifier attribute $field", (t) => {
    let otherTalent = JSON.parse(JSON.stringify(talentIndividual));
    otherTalent.modifiers[t.field] = t.value;
    expect(compareTalent(talentIndividual, otherTalent)).toBe(false);
  });
});
