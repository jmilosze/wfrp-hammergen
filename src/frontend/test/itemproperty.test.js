import { describe, expect, test, vi } from "vitest";
import { ItemPropertyApi, compareItemProperty } from "../src/services/wh/itemproperty";

const itemProperty1 = {
  id: "id1",
  name: "itemProperty1",
  description: "desc1",
  type: 0,
  applicable_to: [0, 1],
  can_edit: true,
  shared: true,
};

const itemProperty2 = {
  id: "id2",
  name: "itemProperty2",
  description: "desc2",
  type: 1,
  applicable_to: [2, 3],
  can_edit: false,
  shared: false,
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/item_property") {
      apiData = [JSON.parse(JSON.stringify(itemProperty1)), JSON.parse(JSON.stringify(itemProperty2))];
    } else if (path === "/api/item_property/id1") {
      apiData = JSON.parse(JSON.stringify(itemProperty1));
    } else if (path === "/api/item_property/id2") {
      apiData = JSON.parse(JSON.stringify(itemProperty2));
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

test("getElement returns expected item property", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject({
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });
});

test("listElements returns expected item properties", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "itemProperty1",
      description: "desc1",
      type: 0,
      applicableTo: [0, 1],
      canEdit: true,
      shared: true,
    },
    {
      id: "id2",
      name: "itemProperty2",
      description: "desc2",
      type: 1,
      applicableTo: [2, 3],
      canEdit: false,
      shared: false,
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement({
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/item_property", {
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicable_to: [0, 1],
    shared: true,
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.updateElement({
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/item_property/update", {
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicable_to: [0, 1],
    shared: true,
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/item_property/id1");
});

describe("compareItemProperty returns true", () => {
  const itemProperty = {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  };

  test("when other itemProperty is exactly the same", () => {
    let otherItemProperty = JSON.parse(JSON.stringify(itemProperty));
    expect(compareItemProperty(itemProperty, otherItemProperty)).toBe(true);
  });

  test("when other itemProperty has applicableTo field with elements in different order", () => {
    let otherItemProperty = JSON.parse(JSON.stringify(itemProperty));
    otherItemProperty.applicableTo = [1, 0];
    expect(compareItemProperty(itemProperty, otherItemProperty)).toBe(true);
  });
});

describe("compareItemProperty returns false", () => {
  const itemProperty = {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  };

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "type", value: 1 },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other itemProperty has different value of $field", (t) => {
    let otherItemProperty = JSON.parse(JSON.stringify(itemProperty));
    otherItemProperty[t.field] = t.value;
    expect(compareItemProperty(itemProperty, otherItemProperty)).toBe(false);
  });

  test("when other itemProperty has applicableTo field that is a subset", () => {
    let otherItemProperty = JSON.parse(JSON.stringify(itemProperty));
    otherItemProperty.applicableTo = [1];
    expect(compareItemProperty(itemProperty, otherItemProperty)).toBe(false);
  });

  test("when other itemProperty has applicableTo field of the same length but different values", () => {
    let otherItemProperty = JSON.parse(JSON.stringify(itemProperty));
    otherItemProperty.applicableTo = [1, 2];
    expect(compareItemProperty(itemProperty, otherItemProperty)).toBe(false);
  });
});
