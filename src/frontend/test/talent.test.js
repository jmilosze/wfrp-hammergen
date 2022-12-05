import { TalentApi, compareTalent } from "../src/services/wh/talent";

const talent1 = {
  id: "id1",
  name: "talent1",
  description: "desc1",
  tests: "qwe",
  max_rank: 4,
  max_rank_att: 2,
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  },
  is_group: true,
  group: ["a", "b"],
  can_edit: true,
  shared: true,
};

const talent2 = {
  id: "id2",
  name: "talent2",
  description: "desc2",
  tests: "asd",
  max_rank: 2,
  max_rank_att: 1,
  modifiers: {
    size: 0,
    movement: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  },
  is_group: false,
  group: [],
  can_edit: true,
  shared: true,
};

const mockAxios = {
  get: jest.fn(async (path) => {
    if (path === "/api/talent") {
      return {
        data: {
          data: [talent1, talent2],
        },
      };
    } else if (path === "/api/talent/id1") {
      return {
        data: {
          data: talent1,
        },
      };
    } else if (path === "/api/talent/id2") {
      return {
        data: {
          data: talent2,
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

test("test getElement returns expected talents, talent has modifiers", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject({
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
});

test("test getElement returns expected talents, talent does not have modifiers", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.getElement("id2");

  expect(result).toMatchObject({
    id: "id2",
    name: "talent2",
    description: "desc2",
    tests: "asd",
    maxRank: 2,
    maxRankAtt: 1,
    hasModifiers: false,
    modifiers: {
      size: 0,
      movement: 0,
      attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: false,
    group: [],
    canEdit: true,
    shared: true,
  });
});

test("test listElements returns expected talents", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "talent1",
      description: "desc1",
      tests: "qwe",
      maxRank: 4,
      maxRankAtt: 2,
      isGroup: true,
      group: ["a", "b"],
      canEdit: true,
      shared: true,
    },
    {
      id: "id2",
      name: "talent2",
      description: "desc2",
      tests: "asd",
      maxRank: 2,
      maxRankAtt: 1,
      isGroup: false,
      group: [],
      canEdit: true,
      shared: true,
    },
  ]);
});

test("test createElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.createElement({
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id");

  expect(mockAxios.post).toHaveBeenCalledWith("/api/talent", {
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    max_rank: 4,
    max_rank_att: 2,
    is_group: true,
    group: ["a", "b"],
    shared: true,
  });
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  const result = await client.updateElement({
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id");

  expect(mockAxios.post).toHaveBeenCalledWith("/api/talent/update", {
    id: "id1",
    name: "talent1",
    description: "desc1",
    tests: "qwe",
    max_rank: 4,
    max_rank_att: 2,
    is_group: true,
    group: ["a", "b"],
    shared: true,
  });
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new TalentApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/talent/id1");
});

test("test compareTalent returns true if objects are the same", () => {
  const talent = {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  };

  const result1 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
  expect(result1).toBe(true);

  const result2 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["b", "a"],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(true);
});

test("test compareTalent returns false if objects are different", () => {
  const talent = {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  };

  const result1 = compareTalent(talent, {
    id: "otherId",
    name: "apiTalent",
    description: "otherDesc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
  expect(result1).toBe(false);

  const result2 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a"],
    canEdit: true,
    shared: true,
  });
  expect(result2).toBe(false);

  const result3 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["c", "d"],
    canEdit: true,
    shared: true,
  });
  expect(result3).toBe(false);

  const result4 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 1,
      movement: 1,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
  expect(result4).toBe(false);

  const result5 = compareTalent(talent, {
    id: "id",
    name: "apiTalent",
    description: "desc",
    tests: "qwe",
    maxRank: 4,
    maxRankAtt: 2,
    hasModifiers: true,
    modifiers: {
      size: 0,
      movement: 4,
      attributes: { WS: 1, BS: 2, S: 3, T: 4, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    isGroup: true,
    group: ["a", "b"],
    canEdit: true,
    shared: true,
  });
  expect(result5).toBe(false);
});
