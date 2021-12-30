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
  get: jest.fn(async (path) => {
    if (path === "/api/item") {
      return {
        data: {
          data: [meleeItemApiForm, otherItemApiForm],
        },
      };
    } else if (path === "/api/item/id1") {
      return {
        data: {
          data: meleeItemApiForm,
        },
      };
    } else if (path === "/api/item/id2") {
      return {
        data: {
          data: otherItemApiForm,
        },
      };
    } else if (path === "/api/item/id3") {
      return {
        data: {
          data: rangedItemApiForm,
        },
      };
    } else if (path === "/api/item/id4") {
      return {
        data: {
          data: ammoItemApiForm,
        },
      };
    } else if (path === "/api/item/id5") {
      return {
        data: {
          data: armorItemApiForm,
        },
      };
    } else if (path === "/api/item/id6") {
      return {
        data: {
          data: containerItemApiForm,
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

test("test getElement returns expected melee item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject(meleeItemModelForm);
});

test("test getElement returns expected ranged item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id3");

  expect(result).toMatchObject(rangedItemModelForm);
});

test("test getElement returns expected ammunition item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id4");

  expect(result).toMatchObject(ammoItemModelForm);
});

test("test getElement returns expected armor item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id5");

  expect(result).toMatchObject(armorItemModelForm);
});

test("test getElement returns expected container item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id6");

  expect(result).toMatchObject(containerItemModelForm);
});

test("test getElement returns expected other item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.getElement("id2");

  expect(result).toMatchObject(otherItemModelForm);
});

test("test listElements returns expected items", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([meleeItemModelForm, otherItemModelForm]);
});

test("test createElement calls axios with expected arguments for melee item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(meleeItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 0, hands: 1, dmg: 2, dmg_sb_mult: 1, reach: 1, group: 1 },
    shared: false,
  });
});

test("test createElement calls axios with expected arguments for ranged item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(rangedItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 1, hands: 2, dmg: 2, dmg_sb_mult: 1, rng: 10, rng_sb_mult: 1, group: 1 },
    shared: false,
  });
});

test("test createElement calls axios with expected arguments for ammunition item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(ammoItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 2, dmg: 1, rng: 1, rng_mult: 1, group: 1 },
    shared: false,
  });
});

test("test createElement calls axios with expected arguments for armor item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(armorItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 3, points: 2, location: [1, 3], group: 1 },
    shared: false,
  });
});

test("test createElement calls axios with expected arguments for container item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(containerItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "item",
    description: "desc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 4, capacity: 2, wearable: true },
    shared: false,
  });
});

test("test createElement calls axios with expected arguments for other item", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.createElement(otherItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item", {
    name: "otherItem",
    description: "",
    price: 10.0,
    enc: 2.0,
    availability: 1,
    properties: [],
    stats: { type: 5, carry_type: { carriable: true, wearable: false } },
    shared: true,
  });
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  const result = await client.updateElement(meleeItemModelForm);

  expect(result).toBe("inserted_id");
  expect(mockAxios.post).toHaveBeenCalledWith("/api/item/update", {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    stats: { type: 0, hands: 1, dmg: 2, dmg_sb_mult: 1, reach: 1, group: 1 },
    shared: false,
  });
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new ItemApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/item/id1");
});

test("test melee items different only in stats different than type compareItem returns true", () => {
  const meleeItem1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["asd", "qwe"],
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

  const meleeItem2 = {
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
      { hands: 2, dmg: 1, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 10, rngMult: 0, group: 0 },
      { points: 2, location: [0, 1], group: 0 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: false, wearable: false } },
    ],
    canEdit: true,
    shared: false,
  };

  const result = compareItem(meleeItem1, meleeItem2);
  expect(result).toBe(true);
});

test("test armor items different only in stats different than type compareItem returns true", () => {
  const armorItem1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: true } },
    ],
    canEdit: true,
    shared: false,
  };

  const armorItem2 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 1 },
      { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [0, 3], group: 2 },
      { capacity: 1, wearable: false },
      { carryType: { carriable: false, wearable: false } },
    ],
    canEdit: true,
    shared: false,
  };

  const result = compareItem(armorItem1, armorItem2);
  expect(result).toBe(true);
});

test("test other items different only in stats different than type compareItem returns true", () => {
  const otherItem1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 5,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: false } },
    ],
    canEdit: true,
    shared: false,
  };

  const otherItem2 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 5,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 1, dmg: 10, dmgSbMult: 2, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 3, rng: 20, rngMult: 0, group: 0 },
      { points: 1, location: [0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: false } },
    ],
    canEdit: true,
    shared: false,
  };

  const result = compareItem(otherItem1, otherItem2);
  expect(result).toBe(true);
});

test("test items different in fields other than stats compareItem returns false", () => {
  const item1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["asd", "qwe"],
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

  const item2 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["asd", "qwe", "zxc"],
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

  const item3 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["asd"],
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

  const item4 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 50.0,
    enc: 2.0,
    availability: 1,
    properties: ["asd", "qwe"],
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

  const result1 = compareItem(item1, item2);
  expect(result1).toBe(false);

  const result2 = compareItem(item1, item3);
  expect(result2).toBe(false);

  const result3 = compareItem(item1, item4);
  expect(result3).toBe(false);
});

test("test armor items different only in armor stats compareItem returns false", () => {
  const armorItem1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: true } },
    ],
    canEdit: true,
    shared: false,
  };

  const armorItem2 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0, 2], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: true } },
    ],
    canEdit: true,
    shared: false,
  };

  const armorItem3 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 3,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 1, location: [3, 0], group: 3 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: true } },
    ],
    canEdit: true,
    shared: false,
  };

  const result1 = compareItem(armorItem1, armorItem2);
  expect(result1).toBe(false);

  const result2 = compareItem(armorItem1, armorItem3);
  expect(result2).toBe(false);
});

test("test other items different only in other stats compareItem returns false", () => {
  const otherItem1 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 5,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: false, wearable: true } },
    ],
    canEdit: true,
    shared: false,
  };

  const otherItem2 = {
    id: "id1",
    name: "meleeItem",
    description: "meleeDesc",
    price: 20.0,
    enc: 1.0,
    availability: 1,
    properties: ["qwe", "asd"],
    type: 5,
    stats: [
      { hands: 1, dmg: 2, dmgSbMult: 1, reach: 1, group: 2 },
      { hands: 2, dmg: 0, dmgSbMult: 1, rng: 20, rngSbMult: 0, group: 0 },
      { dmg: 0, rng: 0, rngMult: 0, group: 0 },
      { points: 2, location: [3, 0], group: 2 },
      { capacity: 1, wearable: true },
      { carryType: { carriable: true, wearable: false } },
    ],
    canEdit: true,
    shared: false,
  };

  const result = compareItem(otherItem1, otherItem2);
  expect(result).toBe(false);
});
