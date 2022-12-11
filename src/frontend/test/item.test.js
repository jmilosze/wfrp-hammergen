import { expect, test, describe, vi } from "vitest";
import { ItemApi, compareItem } from "../src/services/wh/item";

const meleeItemApiForm = {
  id: "id1",
  name: "meleeItem",
  description: "meleeDesc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  stats: { type: 0, hands: 1, dmg: 2, dmg_sb_mult: 1, reach: 1, group: 1 },
  can_edit: true,
  shared: false,
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
  ],
  canEdit: true,
  shared: false,
};

const otherItemApiForm = {
  id: "id2",
  name: "otherItem",
  description: "",
  price: 10.0,
  enc: 2.0,
  availability: 1,
  properties: [],
  stats: { type: 5, carry_type: { carriable: true, wearable: false } },
  can_edit: false,
  shared: true,
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
  ],
  canEdit: false,
  shared: true,
};

const rangedItemApiForm = {
  id: "id3",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  stats: { type: 1, hands: 2, dmg: 2, dmg_sb_mult: 1, rng: 10, rng_sb_mult: 1, group: 1 },
  can_edit: true,
  shared: false,
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
    { carryType: { carriable: false, wearable: false } },
  ],
  canEdit: true,
  shared: false,
};

const ammoItemApiForm = {
  id: "id4",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  stats: { type: 2, dmg: 1, rng: 1, rng_mult: 1, group: 1 },
  can_edit: true,
  shared: false,
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
  ],
  canEdit: true,
  shared: false,
};

const armorItemApiForm = {
  id: "id5",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  stats: { type: 3, points: 2, location: [1, 3], group: 1 },
  can_edit: true,
  shared: false,
};

const armorItemModelForm = {
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
  ],
  canEdit: true,
  shared: false,
};

const containerItemApiForm = {
  id: "id6",
  name: "item",
  description: "desc",
  price: 20.0,
  enc: 1.0,
  availability: 1,
  properties: ["qwe", "asd"],
  stats: { type: 4, capacity: 2, wearable: true },
  can_edit: true,
  shared: false,
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
  ],
  canEdit: true,
  shared: false,
};

const mockAxios = {
  get: async (path) => {
    let apiData;

    if (path === "/api/item") {
      apiData = [JSON.parse(JSON.stringify(meleeItemApiForm)), JSON.parse(JSON.stringify(otherItemApiForm))];
    } else if (path === "/api/item/id1") {
      apiData = JSON.parse(JSON.stringify(meleeItemApiForm));
    } else if (path === "/api/item/id2") {
      apiData = JSON.parse(JSON.stringify(otherItemApiForm));
    } else if (path === "/api/item/id3") {
      apiData = JSON.parse(JSON.stringify(rangedItemApiForm));
    } else if (path === "/api/item/id4") {
      apiData = JSON.parse(JSON.stringify(ammoItemApiForm));
    } else if (path === "/api/item/id5") {
      apiData = JSON.parse(JSON.stringify(armorItemApiForm));
    } else if (path === "/api/item/id6") {
      apiData = JSON.parse(JSON.stringify(containerItemApiForm));
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

describe("getElement returns expected item", () => {
  test.each([
    { itemType: "melee", id: meleeItemApiForm.id, expectedModel: meleeItemModelForm },
    { itemType: "ranged", id: rangedItemApiForm.id, expectedModel: rangedItemModelForm },
    { itemType: "ammunition", id: ammoItemApiForm.id, expectedModel: ammoItemModelForm },
    { itemType: "armor", id: armorItemApiForm.id, expectedModel: armorItemModelForm },
    { itemType: "container", id: containerItemApiForm.id, expectedModel: containerItemModelForm },
    { itemType: "other", id: otherItemApiForm.id, expectedModel: otherItemModelForm },
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
    { itemType: "armor", modelForm: armorItemModelForm, expectedApiData: armorItemApiForm },
    { itemType: "container", modelForm: containerItemModelForm, expectedApiData: containerItemApiForm },
    { itemType: "other", modelForm: otherItemModelForm, expectedApiData: otherItemApiForm },
  ])("when item type is $itemType", async (t) => {
    const client = new ItemApi(mockAxios);
    const axiosSpy = vi.spyOn(mockAxios, "post");
    const result = await client.createElement(t.modelForm);
    let expectedCalldata = JSON.parse(JSON.stringify(t.expectedApiData));
    delete expectedCalldata["id"];
    delete expectedCalldata["can_edit"];

    expect(result).toBe("inserted_id");
    expect(axiosSpy).toHaveBeenCalledWith("/api/item", expectedCalldata);
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.updateElement(meleeItemModelForm);
  let expectedCalldata = JSON.parse(JSON.stringify(meleeItemApiForm));
  delete expectedCalldata["can_edit"];

  expect(result).toBe("inserted_id");
  expect(axiosSpy).toHaveBeenCalledWith("/api/item/update", expectedCalldata);
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/item/id1");
});

describe("compareItem returns true", () => {
  test("when other item has properties field with elements in different order", () => {
    let otherItem = JSON.parse(JSON.stringify(meleeItemModelForm));
    otherItem.properties = ["asd", "qwe"];
    expect(compareItem(meleeItemModelForm, otherItem)).toBe(true);
  });

  test("when other item is armor and has location field with elements in different order", () => {
    let otherItem = JSON.parse(JSON.stringify(armorItemModelForm));
    otherItem.stats[3].location = [3, 1];
    expect(compareItem(armorItemModelForm, otherItem)).toBe(true);
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
    { itemType: "armor", modelForm: armorItemModelForm },
    { itemType: "container", modelForm: containerItemModelForm },
    { itemType: "other", modelForm: otherItemModelForm },
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
    let otherItem = JSON.parse(JSON.stringify(armorItemModelForm));
    otherItem.stats[3][t.field] = t.value;
    expect(compareItem(armorItemModelForm, otherItem)).toBe(false);
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
});
