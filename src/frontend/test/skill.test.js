import { SkillApi, compareSkill } from "../src/services/wh/skill";

const skill1 = {
  id: "id1",
  name: "skill1",
  description: "desc1",
  attribute: 1,
  type: 0,
  display_zero: true,
  is_group: true,
  group: ["a", "b"],
  can_edit: true,
  shared: true,
};

const skill2 = {
  id: "id2",
  name: "skill2",
  description: "desc2",
  attribute: 2,
  type: 1,
  display_zero: false,
  is_group: false,
  group: [],
  can_edit: true,
  shared: true,
};

const mockAxios = {
  get: jest.fn(async (path) => {
    if (path === "/api/skill") {
      return {
        data: {
          data: [skill1, skill2],
        },
      };
    } else if (path === "/api/skill/id1") {
      return {
        data: {
          data: skill1,
        },
      };
    } else if (path === "/api/skill/id2") {
      return {
        data: {
          data: skill2,
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

test("test getElement returns expected skill", async () => {
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
  });
});

test("test listElements returns expected skills", async () => {
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
    },
  ]);
});

test("test createElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
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
  });

  expect(result).toBe("inserted_id");

  expect(mockAxios.post).toHaveBeenCalledWith("/api/skill", {
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    display_zero: true,
    is_group: true,
    group: ["a", "b"],
    shared: true,
  });
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
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
  });

  expect(result).toBe("inserted_id");

  expect(mockAxios.post).toHaveBeenCalledWith("/api/skill/update", {
    id: "id1",
    name: "skill1",
    description: "desc1",
    attribute: 1,
    type: 0,
    display_zero: true,
    is_group: true,
    group: ["a", "b"],
    shared: true,
  });
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new SkillApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/skill/id1");
});

test("test compareSkill returns true if objects are the same", () => {
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
  };

  const result1 = compareSkill(skill, {
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
  });
  expect(result1).toBe(true);

  const result2 = compareSkill(skill, {
    id: "id",
    name: "apiSkill",
    description: "desc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["b", "a"],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(true);
});

test("test compareSkill returns false if objects are different", () => {
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
  };

  const result1 = compareSkill(skill, {
    id: "otherId",
    name: "apiSkill",
    description: "otherDesc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
  expect(result1).toBe(false);

  const result2 = compareSkill(skill, {
    id: "id",
    name: "apiSkill",
    description: "desc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["a"],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(false);

  const result3 = compareSkill(skill, {
    id: "id",
    name: "apiSkill",
    description: "desc",
    attribute: 1,
    type: 0,
    displayZero: true,
    isGroup: true,
    group: ["c", "d"],
    canEdit: true,
    shared: true,
  });
  expect(result3).toBe(false);
});
