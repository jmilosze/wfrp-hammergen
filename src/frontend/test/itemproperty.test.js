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
  get: jest.fn(async (path) => {
    if (path === "/api/item_property") {
      return {
        data: {
          data: [itemProperty1, itemProperty2],
        },
      };
    } else if (path === "/api/item_property/id1") {
      return {
        data: {
          data: itemProperty1,
        },
      };
    } else if (path === "/api/item_property/id2") {
      return {
        data: {
          data: itemProperty2,
        },
      };
    }
  }),
  post: jest.fn(async () => {
    return {
        data: {
          data: "inserted_id",
        },
      };
  }),
  delete: jest.fn(),
};

test("test getElement returns expected item property", async () => {
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

test("test listElements returns expected item properties", async () => {
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

test("test createElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const result = await client.createElement({
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id")

  expect(mockAxios.post).toHaveBeenCalledWith("/api/item_property", {
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicable_to: [0, 1],
    shared: true,
  });
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  const result = await client.updateElement({
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id")

  expect(mockAxios.post).toHaveBeenCalledWith("/api/item_property/update", {
    id: "id1",
    name: "itemProperty1",
    description: "desc1",
    type: 0,
    applicable_to: [0, 1],
    shared: true,
  });
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new ItemPropertyApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/item_property/id1");
});

test("test compareItemProperty returns true if objects are the same", () => {
  const itemProperty = {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  };

  const result1 = compareItemProperty(itemProperty, {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });
  expect(result1).toBe(true);

  const result2 = compareItemProperty(itemProperty, {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [1, 0],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(true);
});

test("test compareItemProperty returns false if objects are different", () => {
  const itemProperty = {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  };

  const result1 = compareItemProperty(itemProperty, {
    id: "otherId",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0, 1],
    canEdit: true,
    shared: true,
  });
  expect(result1).toBe(false);

  const result2 = compareItemProperty(itemProperty, {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [0],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(false);

  const result3 = compareItemProperty(itemProperty, {
    id: "id",
    name: "apiItemProperty",
    description: "desc",
    type: 0,
    applicableTo: [3, 4],
    canEdit: true,
    shared: true,
  });
  expect(result3).toBe(false);
});
