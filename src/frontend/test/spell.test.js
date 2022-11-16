import { SpellApi, compareSpell } from "../src/services/wh/spell";

const spell1 = {
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

const prayer2 = {
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
  get: jest.fn(async (path) => {
    if (path === "/api/spell") {
      return {
        data: {
          data: [spell1, prayer2],
        },
      };
    } else if (path === "/api/spell/id1") {
      return {
        data: {
          data: spell1,
        },
      };
    } else if (path === "/api/spell/id2") {
      return {
        data: {
          data: prayer2,
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

test("test getElement returns expected spell", async () => {
  const client = new SpellApi(mockAxios);
  const result1 = await client.getElement("id1");

  expect(result1).toMatchObject({
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

  const result2 = await client.getElement("id2");

  expect(result2).toMatchObject({
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

test("test listElements returns expected spells", async () => {
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

test("test createElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
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

  expect(mockAxios.post).toHaveBeenCalledWith("/api/spell", {
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

test("test updateElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
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

  expect(mockAxios.post).toHaveBeenCalledWith("/api/spell/update", {
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

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new SpellApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/spell/id1");
});

test("test compareSpell returns true if objects are the same", () => {
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

  const result = compareSpell(spell, {
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
  });
  expect(result).toBe(true);
});

test("test compareSpell returns false if spells have different values", () => {
  const spell = {
    id: "id",
    name: "spell",
    cn: 1,
    range: "range1",
    target: "target1",
    duration: "duration",
    description: "desc",
    type: "spell",
    canEdit: true,
    shared: true,
  };

  const result = compareSpell(spell, {
    id: "id",
    name: "spell",
    cn: 0,
    range: "range2",
    target: "target2",
    duration: "duration",
    description: "desc",
    type: "spell",
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(false);
});

test("test compareSpell returns false if spells have different cn", () => {
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

  const result = compareSpell(spell, {
    id: "id",
    name: "spell",
    cn: 0,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "spell",
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(false);
});

test("test compareSpell ignores cn for prayers", () => {
  const spell = {
    id: "id",
    name: "prayer",
    cn: 0,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "prayer",
    canEdit: true,
    shared: true,
  };

  const result = compareSpell(spell, {
    id: "id",
    name: "prayer",
    cn: 10,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "prayer",
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(true);
});

test("test compareSpell spell vs prayer", () => {
  const spell = {
    id: "id",
    name: "spell",
    cn: 0,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "prayer",
    canEdit: true,
    shared: true,
  };

  const result = compareSpell(spell, {
    id: "id",
    name: "prayer",
    cn: 10,
    range: "range",
    target: "target",
    duration: "duration",
    description: "desc",
    type: "prayer",
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(false);
});
