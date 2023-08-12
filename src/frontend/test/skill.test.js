import { describe, expect, test, vi } from "vitest";
import { compareSkill, SkillApi } from "../src/services/wh/skill";

const skill1ApiForm = {
  id: "id1",
  canEdit: true,
  object: {
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  },
};

const skill2ApiForm = {
  id: "id2",
  canEdit: true,
  object: {
    name: "skill2",
    description: "desc2",
    attribute: 2,
    type: 1,
    displayZero: false,
    isGroup: false,
    group: [],
    shared: true,
    source: {},
  },
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/wh/skill") {
      apiData = [JSON.parse(JSON.stringify(skill1ApiForm)), JSON.parse(JSON.stringify(skill2ApiForm))];
    } else if (path === "/api/wh/skill/id1") {
      apiData = JSON.parse(JSON.stringify(skill1ApiForm));
    } else if (path === "/api/wh/skill/id2") {
      apiData = JSON.parse(JSON.stringify(skill2ApiForm));
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

test("getElement returns expected skill", async () => {
  const client = new SkillApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject({
    id: "id1",
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("listElements returns expected skills", async () => {
  const client = new SkillApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "skill1",
      description: "desc1",
      attribute: 1,
      type: 0,
      displayZero: true,
      isGroup: true,
      group: ["a", "b"],
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    },
    {
      id: "id2",
      name: "skill2",
      description: "desc2",
      attribute: 2,
      type: 1,
      displayZero: false,
      isGroup: false,
      group: [],
      canEdit: true,
      shared: true,
      source: {},
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement({
    id: "id1",
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/skill", {
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "put");
  const result = await client.updateElement({
    id: "id1",
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/skill/id1", {
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/skill/id1");
});

describe("compareSkill returns true", () => {
  const skill = {
    id: "id",
    name: "apiSkill",
    description: "desc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  test("when skills are exactly the same", () => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    expect(compareSkill(skill, otherSkill)).toBe(true);
  });

  test("when other skill has group field with elements in different order", () => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    otherSkill.group = ["b", "a"];
    expect(compareSkill(skill, otherSkill)).toBe(true);
  });
});

describe("compareSkill returns false", () => {
  const skill = {
    id: "id",
    name: "apiSkill",
    description: "desc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "attribute", value: 2 },
    { field: "type", value: 1 },
    { field: "displayZero", value: false },
    { field: "isGroup", value: false },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other skill has different value of $field", (t) => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    otherSkill[t.field] = t.value;
    expect(compareSkill(skill, otherSkill)).toBe(false);
  });

  test.each([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other skill has $diff", (t) => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    otherSkill.source = t.source;
    expect(compareSkill(skill, otherSkill)).toBe(false);
  });

  test("when other skill has group field that is a subset", () => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    otherSkill.group = ["a"];
    expect(compareSkill(skill, otherSkill)).toBe(false);
  });

  test("when other skill has group field of the same length but different values", () => {
    let otherSkill = JSON.parse(JSON.stringify(skill));
    otherSkill.group = ["c", "d"];
    expect(compareSkill(skill, otherSkill)).toBe(false);
  });
});
