import { expect, test, describe, vi } from "vitest";
import { ItemApi, compareItem } from "../src/services/wh/item";

const meleeItemApiForm = {
  id: "id1",
  canEdit: true,
  object: {
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 0,
    melee: { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 1 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 2 },
    grimoire: { spells: [] },
    shared: false,
    source: { 1: "page 2", 3: "page 5-10" },
  },
};

const meleeItemModelForm = {
  id: "id1",
  name: "meleeItem",
  description: "meleeDesc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 0,
  stats: [
    { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 1 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
    { spells: [] },
  ],
  canEdit: true,
  shared: false,
  source: { 1: "page 2", 3: "page 5-10" },
};

const otherItemApiForm = {
  id: "id2",
  canEdit: false,
  object: {
    name: "otherItem",
    description: "",
    price: 10.0,
    enc: 2.0,
    availability: 1,
    properties: [],
    type: 5,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 1 },
    grimoire: { spells: [] },
    shared: true,
    source: {},
  },
};

const otherItemModelForm = {
  id: "id2",
  name: "otherItem",
  description: "",
  price: 10.0,
  enc: 2.0,
  availability: 1,
  properties: [],
  type: 5,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: true, wearable: false } },
    { spells: [] },
  ],
  canEdit: false,
  shared: true,
  source: {},
};

const rangedItemApiForm = {
  id: "id3",
  canEdit: true,
  object: {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 1,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 2, dmg: 2, dmgSbMult: 1, rng: 10, rngSbMult: 1, group: 1 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 0 },
    grimoire: { spells: [] },
    shared: false,
    source: {},
  },
};

const rangedItemModelForm = {
  id: "id3",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 1,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 2, dmg: 2, dmgSbMult: 1, rng: 10, rngSbMult: 1, group: 1 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: true, wearable: true } },
    { spells: [] },
  ],
  canEdit: true,
  shared: false,
  source: {},
};

const ammoItemApiForm = {
  id: "id4",
  canEdit: true,
  object: {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 2,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 1, rng: 1, rngMult: 1, group: 1 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 2 },
    grimoire: { spells: [] },
    shared: false,
    source: {},
  },
};

const ammoItemModelForm = {
  id: "id4",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 2,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 1, rng: 1, rngMult: 1, group: 1 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
    { spells: [] },
  ],
  canEdit: true,
  shared: false,
  source: {},
};

const armourItemApiForm = {
  id: "id5",
  canEdit: true,
  object: {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 2, location: [1, 3], group: 1 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 2 },
    grimoire: { spells: [] },
    shared: false,
    source: {},
  },
};

const armourItemModelForm = {
  id: "id5",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 3,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 2, location: [1, 3], group: 1 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
    { spells: [] },
  ],
  canEdit: true,
  shared: false,
  source: {},
};

const containerItemApiForm = {
  id: "id6",
  canEdit: true,
  object: {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 4,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 2, carryType: 0 },
    other: { carryType: 2 },
    grimoire: { spells: [] },
    shared: false,
    source: {},
  },
};

const containerItemModelForm = {
  id: "id6",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 4,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 2, wearable: true },
    { carryType: { carriable: false, wearable: false } },
    { spells: [] },
  ],
  canEdit: true,
  shared: false,
  source: {},
};

const grimoireItemApiForm = {
  id: "id7",
  canEdit: true,
  object: {
    name: "grimoireItem",
    description: "grimoireDesc",
    price: 10.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 6,
    melee: { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    ranged: { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    ammunition: { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    armour: { points: 0, location: [], group: 0 },
    container: { capacity: 1, carryType: 1 },
    other: { carryType: 2 },
    grimoire: { spells: ["spellId1", "spellId2"] },
    shared: false,
    source: {},
  },
};

const grimoireItemModelForm = {
  id: "id7",
  name: "grimoireItem",
  description: "grimoireDesc",
  price: 10.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  type: 6,
  stats: [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
    { spells: ["spellId1", "spellId2"] },
  ],
  canEdit: true,
  shared: false,
  source: {},
};

const mockAxios = {
  get: async (path) => {
    let apiData;

    if (path === "/api/wh/item") {
      apiData = [JSON.parse(JSON.stringify(meleeItemApiForm)), JSON.parse(JSON.stringify(otherItemApiForm))];
    } else if (path === "/api/wh/item/id1") {
      apiData = JSON.parse(JSON.stringify(meleeItemApiForm));
    } else if (path === "/api/wh/item/id2") {
      apiData = JSON.parse(JSON.stringify(otherItemApiForm));
    } else if (path === "/api/wh/item/id3") {
      apiData = JSON.parse(JSON.stringify(rangedItemApiForm));
    } else if (path === "/api/wh/item/id4") {
      apiData = JSON.parse(JSON.stringify(ammoItemApiForm));
    } else if (path === "/api/wh/item/id5") {
      apiData = JSON.parse(JSON.stringify(armourItemApiForm));
    } else if (path === "/api/wh/item/id6") {
      apiData = JSON.parse(JSON.stringify(containerItemApiForm));
    } else if (path === "/api/wh/item/id7") {
      apiData = JSON.parse(JSON.stringify(grimoireItemApiForm));
    } else {
      throw "invalid id";
    }

    return { data: { data: apiData } };
  },
  post: async () => {
    return { data: { data: { id: "id" } } };
  },
  put: async () => {
    return { data: { data: { id: "id" } } };
  },
  delete: async () => {},
};

describe("getElement returns expected item", () => {
  test.each([
    { itemType: "melee", id: meleeItemApiForm.id, expectedModel: meleeItemModelForm },
    { itemType: "ranged", id: rangedItemApiForm.id, expectedModel: rangedItemModelForm },
    { itemType: "ammunition", id: ammoItemApiForm.id, expectedModel: ammoItemModelForm },
    { itemType: "armor", id: armourItemApiForm.id, expectedModel: armourItemModelForm },
    { itemType: "container", id: containerItemApiForm.id, expectedModel: containerItemModelForm },
    { itemType: "other", id: otherItemApiForm.id, expectedModel: otherItemModelForm },
    { itemType: "grimoire", id: grimoireItemApiForm.id, expectedModel: grimoireItemModelForm },
  ])("when item type is $itemType", async (t) => {
    const client = new ItemApi(mockAxios);
    const result = await client.getElement(t.id);

    expect(result).toMatchObject(t.expectedModel);
  });
});

test("listElements returns expected items", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([meleeItemModelForm, otherItemModelForm]);
});

describe("createElement calls axios with expected arguments", () => {
  test.each([
    { itemType: "melee", modelForm: meleeItemModelForm, expectedApiData: meleeItemApiForm },
    { itemType: "ranged", modelForm: rangedItemModelForm, expectedApiData: rangedItemApiForm },
    { itemType: "ammunition", modelForm: ammoItemModelForm, expectedApiData: ammoItemApiForm },
    { itemType: "armor", modelForm: armourItemModelForm, expectedApiData: armourItemApiForm },
    { itemType: "container", modelForm: containerItemModelForm, expectedApiData: containerItemApiForm },
    { itemType: "other", modelForm: otherItemModelForm, expectedApiData: otherItemApiForm },
    { itemType: "grimoire", modelForm: grimoireItemModelForm, expectedApiData: grimoireItemApiForm },
  ])("when item type is $itemType", async (t) => {
    const client = new ItemApi(mockAxios);
    const axiosSpy = vi.spyOn(mockAxios, "post");
    const result = await client.createElement(t.modelForm);
    let expectedCallData = JSON.parse(JSON.stringify(t.expectedApiData.object));

    expect(result.id).toBe("id");
    expect(axiosSpy).toHaveBeenCalledWith("/api/wh/item", expectedCallData);
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "put");
  const result = await client.updateElement(meleeItemModelForm);
  let expectedCallData = JSON.parse(JSON.stringify(meleeItemApiForm.object));

  expect(result.id).toBe("id");
  expect(axiosSpy).toHaveBeenCalledWith(`/api/wh/item/${meleeItemApiForm.id}`, expectedCallData);
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/item/id1");
});

describe("compareItem returns true", () => {
  test("when other item has properties field with elements in different order", () => {
    let otherItem = JSON.parse(JSON.stringify(meleeItemModelForm));
    otherItem.properties = ["asd", "qwe"];
    expect(compareItem(meleeItemModelForm, otherItem)).toBe(true);
  });

  test("when other item is armor and has location field with elements in different order", () => {
    let otherItem = JSON.parse(JSON.stringify(armourItemModelForm));
    otherItem.stats[3].location = [3, 1];
    expect(compareItem(armourItemModelForm, otherItem)).toBe(true);
  });

  test("when other item is grimoire and has spells field with elements in different order", () => {
    let otherItem = JSON.parse(JSON.stringify(grimoireItemModelForm));
    otherItem.stats[6].spells = ["spellId2", "spellId1"];
    expect(compareItem(grimoireItemModelForm, otherItem)).toBe(true);
  });

  let otherStats = [
    { hands: 2, dmg: 5, dmgSbMult: 1, reach: 1, group: 2 },
    { hands: 1, dmg: 3, dmgSbMult: 2, rng: 5, rngSbMult: 0, group: 1 },
    { dmg: 2, rng: 2, rngMult: 2, group: 2 },
    { points: 2, location: [3], group: 1 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
  ];

  test.each([
    { itemType: "melee", modelForm: meleeItemModelForm },
    { itemType: "ranged", modelForm: rangedItemModelForm },
    { itemType: "ammunition", modelForm: ammoItemModelForm },
    { itemType: "armor", modelForm: armourItemModelForm },
    { itemType: "container", modelForm: containerItemModelForm },
    { itemType: "other", modelForm: otherItemModelForm },
    { itemType: "grimoire", modelForm: grimoireItemModelForm },
  ])("when $itemType item has different stats for types other than itself", (t) => {
    let otherItem = JSON.parse(JSON.stringify(t.modelForm));
    for (let i = 0; i < 6; ++i) {
      if (i !== otherItem.type) {
        otherItem.stats[i] = otherStats[i];
      }
    }
    expect(compareItem(t.modelForm, otherItem)).toBe(true);
  });
});

describe("compareItem returns false", () => {
  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "price", value: 15.0 },
    { field: "enc", value: 2 },
    { field: "availability", value: 3 },
    { field: "canEdit", value: false },
    { field: "shared", value: true },
  ])("when other item has different value of $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(meleeItemModelForm));
    otherItem[t.field] = t.value;
    expect(compareItem(meleeItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other item has $diff", (t) => {
    let otherItem = JSON.parse(JSON.stringify(meleeItemModelForm));
    otherItem.source = t.source;
    expect(compareItem(meleeItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "hands", value: 2 },
    { field: "dmg", value: 4 },
    { field: "dmgSbMult", value: 2 },
    { field: "reach", value: 2 },
    { field: "group", value: 2 },
  ])("when item is melee and has different value of stat[type] $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(meleeItemModelForm));
    otherItem.stats[0][t.field] = t.value;
    expect(compareItem(meleeItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "hands", value: 1 },
    { field: "dmg", value: 4 },
    { field: "dmgSbMult", value: 2 },
    { field: "rng", value: 20 },
    { field: "rngSbMult", value: 2 },
    { field: "group", value: 2 },
  ])("when item is ranged and has different value of stat[type] $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(rangedItemModelForm));
    otherItem.stats[1][t.field] = t.value;
    expect(compareItem(rangedItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "dmg", value: 2 },
    { field: "rng", value: 2 },
    { field: "rngMult", value: 2 },
    { field: "group", value: 2 },
  ])("when item is ammunition and has different value of stat[type] $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(ammoItemModelForm));
    otherItem.stats[2][t.field] = t.value;
    expect(compareItem(ammoItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "points", name: "points", value: 1 },
    { field: "group", name: "group", value: 2 },
    { field: "location", name: "location (different number of elements)", value: [1] },
    { field: "location", name: "location (different elements)", value: [2, 3] },
  ])("when item is armor and has different value of stat[type] $name", (t) => {
    let otherItem = JSON.parse(JSON.stringify(armourItemModelForm));
    otherItem.stats[3][t.field] = t.value;
    expect(compareItem(armourItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "capacity", value: 3 },
    { field: "wearable", value: false },
  ])("when item is container and has different value of stat[type] $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(containerItemModelForm));
    otherItem.stats[4][t.field] = t.value;
    expect(compareItem(containerItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "carriable", value: false },
    { field: "wearable", value: true },
  ])("when item is other and has different value of stat[type] carryType $field", (t) => {
    let otherItem = JSON.parse(JSON.stringify(otherItemModelForm));
    otherItem.stats[5].carryType[t.field] = t.value;
    expect(compareItem(otherItemModelForm, otherItem)).toBe(false);
  });

  test.each([
    { field: "spells", name: "spells (different number of elements)", value: ["spellId1"] },
    { field: "spells", name: "spells (different elements)", value: ["spellId1", "spellId3"] },
  ])("when item is grimoire and has different value of stat[type] $name", (t) => {
    let otherItem = JSON.parse(JSON.stringify(grimoireItemModelForm));
    otherItem.stats[6][t.field] = t.value;
    expect(compareItem(grimoireItemModelForm, otherItem)).toBe(false);
  });
});
