import { describe, expect, test, vi } from "vitest";
import { comparePrayer, PrayerApi } from "../src/services/wh/prayer";

const prayer1ApiForm = {
  id: "id1",
  canEdit: true,
  object: {
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  },
};

const prayer2ApiForm = {
  id: "id2",
  canEdit: true,
  object: {
    name: "prayer2",
    cn: -1,
    range: "range2",
    target: "target2",
    duration: "duration2",
    description: "desc2",
    shared: true,
    source: {},
  },
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/wh/prayer") {
      apiData = [JSON.parse(JSON.stringify(prayer1ApiForm)), JSON.parse(JSON.stringify(prayer2ApiForm))];
    } else if (path === "/api/wh/prayer/id1") {
      apiData = JSON.parse(JSON.stringify(prayer1ApiForm));
    } else if (path === "/api/wh/prayer/id2") {
      apiData = JSON.parse(JSON.stringify(prayer2ApiForm));
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

test("getElement returns expected prayer", async () => {
  const client = new PrayerApi(mockAxios);
  const result = await client.getElement("id1");
  expect(result).toMatchObject({
    id: "id1",
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("listElements returns expected prayers", async () => {
  const client = new PrayerApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "prayer1",
      range: "range1",
      target: "target1",
      duration: "duration1",
      description: "desc1",
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    },
    {
      id: "id2",
      name: "prayer2",
      range: "range2",
      target: "target2",
      duration: "duration2",
      description: "desc2",
      canEdit: true,
      shared: true,
      source: {},
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new PrayerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result1 = await client.createElement({
    id: "id1",
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result1.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/prayer", {
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new PrayerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "put");
  const result1 = await client.updateElement({
    id: "id1",
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result1.id).toBe("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/prayer/id1", {
    name: "prayer1",
    range: "range1",
    target: "target1",
    duration: "duration1",
    description: "desc1",
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new PrayerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/prayer/id1");
});

describe("comparePrayer returns true", () => {
  const prayer = {
    id: "id",
    name: "prayer",
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  test("when prayers are the same", () => {
    let otherPrayer = JSON.parse(JSON.stringify(prayer));
    expect(comparePrayer(prayer, otherPrayer)).toBe(true);
  });
});

describe("comparePrayer returns false", () => {
  const prayer = {
    id: "id",
    name: "prayer",
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "range", value: "otherRange" },
    { field: "target", value: "otherTarget" },
    { field: "duration", value: "otherDuration" },
    { field: "description", value: "otherDescription" },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other prayer has different value of $field", (t) => {
    let otherPrayer = JSON.parse(JSON.stringify(prayer));
    otherPrayer[t.field] = t.value;
    expect(comparePrayer(prayer, otherPrayer)).toBe(false);
  });

  test.each([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other prayer has $diff", (t) => {
    let otherPrayer = JSON.parse(JSON.stringify(prayer));
    otherPrayer.source = t.source;
    expect(comparePrayer(prayer, otherPrayer)).toBe(false);
  });
});
