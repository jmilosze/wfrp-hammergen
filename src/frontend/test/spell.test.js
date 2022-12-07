import { describe, expect, test, vi } from "vitest";
import { SpellApi, compareSpell } from "../src/services/wh/spell";

const spell = {
  id: "id1",
  name: "spell1",
  cn: 1,
  range: "range1",
  target: "target1",
  duration: "duration1",
  description: "desc1",
  can_edit: true,
  shared: true,
};

const prayer = {
  id: "id2",
  name: "prayer2",
  cn: -1,
  range: "range2",
  target: "target2",
  duration: "duration2",
  description: "desc2",
  can_edit: true,
  shared: true,
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/spell") {
      apiData = [JSON.parse(JSON.stringify(spell)), JSON.parse(JSON.stringify(prayer))];
    } else if (path === "/api/spell/id1") {
      apiData = JSON.parse(JSON.stringify(spell));
    } else if (path === "/api/spell/id2") {
      apiData = JSON.parse(JSON.stringify(prayer));
    } else {
      throw "invalid id";
    }
    return { data: { data: apiData } };
  },
  post: async () => {
    return { data: { data: "inserted_id" } };
  },
  delete: async () => {},
};

describe("getElement returns expected spell", () => {
  test("when spell is an actual spell", async () => {
    const client = new SpellApi(mockAxios);
    const result = await client.getElement("id1");
    expect(result).toMatchObject({
      id: "id1",
      name: "spell1",
      cn: 1,
      range: "range1",
      target: "target1",
      duration: "duration1",
      description: "desc1",
      type: "spell",
      canEdit: true,
      shared: true,
    });
  });

  test("when spell is a prayer", async () => {
    const client = new SpellApi(mockAxios);
    const result = await client.getElement("id2");
    expect(result).toMatchObject({
      id: "id2",
      name: "prayer2",
      cn: 0,
      range: "range2",
      target: "target2",
      duration: "duration2",
      description: "desc2",
      type: "prayer",
      canEdit: true,
      shared: true,
    });
  });
});

test("listElements returns expected spells", async () => {
  const client = new SpellApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "spell1",
      cn: 1,
      range: "range1",
      target: "target1",
      duration: "duration1",
      description: "desc1",
      type: "spell",
      canEdit: true,
      shared: true,
    },
    {
      id: "id2",
      name: "prayer2",
      cn: 0,
      range: "range2",
      target: "target2",
      duration: "duration2",
      description: "desc2",
      type: "prayer",
      canEdit: true,
      shared: true,
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result1 = await client.createElement({
    id: "id1",
    name: "spell1",
    cn: 1,
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    type: "spell",
    canEdit: true,
    shared: true,
  });

  expect(result1).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/spell", {
    name: "spell1",
    cn: 1,
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    shared: true,
  });

  mockAxios.post.mockClear();
  await client.createElement({
    id: "id2",
    name: "prayer2",
    cn: 0,
    range: "range2",
    target: "target2",
    duration: "duration2",
    description: "desc2",
    type: "prayer",
    canEdit: true,
    shared: true,
  });

  expect(mockAxios.post).toHaveBeenCalledWith("/api/spell", {
    name: "prayer2",
    cn: -1,
    range: "range2",
    target: "target2",
    duration: "duration2",
    description: "desc2",
    shared: true,
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result1 = await client.updateElement({
    id: "id1",
    name: "spell1",
    cn: 1,
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    type: "spell",
    canEdit: true,
    shared: true,
  });

  expect(result1).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/spell/update", {
    id: "id1",
    name: "spell1",
    cn: 1,
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    shared: true,
  });

  mockAxios.post.mockClear();
  await client.updateElement({
    id: "id2",
    name: "prayer2",
    cn: 0,
    range: "range2",
    target: "target2",
    duration: "duration2",
    description: "desc2",
    type: "prayer",
    canEdit: true,
    shared: true,
  });

  expect(mockAxios.post).toHaveBeenCalledWith("/api/spell/update", {
    id: "id2",
    name: "prayer2",
    cn: -1,
    range: "range2",
    target: "target2",
    duration: "duration2",
    description: "desc2",
    shared: true,
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/spell/id1");
});

describe("compareTalent returns true", () => {
  const spell = {
    id: "id",
    name: "spell",
    cn: 1,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "spell",
    canEdit: true,
    shared: true,
  };

  test("when spells are the same", () => {
    let otherSpell = JSON.parse(JSON.stringify(spell));
    expect(compareSpell(spell, otherSpell)).toBe(true);
  });

  test("when prayers are the same except for cn", () => {
    let prayer = JSON.parse(JSON.stringify(spell));
    prayer.type = "prayer";
    prayer.cn = -1;
    let otherPrayer = JSON.parse(JSON.stringify(prayer));
    otherPrayer.cn = 5;
    expect(compareSpell(prayer, otherPrayer)).toBe(true);
  });
});

describe("compareSpell returns false", () => {
  const spell = {
    id: "id",
    name: "spell",
    cn: 1,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "spell",
    canEdit: true,
    shared: true,
  };

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "cn", value: 3 },
    { field: "range", value: "otherRange" },
    { field: "target", value: "otherTarget" },
    { field: "duration", value: "otherDuration" },
    { field: "description", value: "otherDescription" },
    { field: "type", value: "prayer" },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other spell has different value of $field", (t) => {
    let otherSpell = JSON.parse(JSON.stringify(spell));
    otherSpell[t.field] = t.value;
    expect(compareSpell(spell, otherSpell)).toBe(false);
  });
});
