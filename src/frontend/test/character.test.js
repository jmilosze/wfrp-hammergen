import { describe, expect, test, vi } from "vitest";
import {
  CharacterApi,
  compareCharacter,
  getMovement,
  getWounds,
  getBaseAttributes,
  getTotalAttributes,
  getRacialAttributes,
  getWoundsFormula,
  speciesWithRegion,
} from "../src/services/wh/character";
import { generateEmptyModifiers } from "../src/services/wh/characterModifiers";
import * as c from "../src/services/wh/characterConstants";

const character1ApiForm = {
  id: "id1",
  canEdit: true,
  object: {
    name: "char1",
    species: c.WOOD_ELF_DEFAULT,
    fate: 1,
    fortune: 2,
    resilience: 3,
    resolve: 4,
    brass: 12,
    silver: 5,
    gold: 1,
    spentExp: 1000,
    currentExp: 230,
    status: 1,
    standing: 2,
    description: "character 1",
    notes: "",
    careerPath: [
      { id: "careerId1", number: 1 },
      { id: "careerId2", number: 2 },
    ],
    career: { id: "careerId3", number: 3 },
    baseAttributes: { WS: 40, BS: 40, S: 30, T: 25, I: 50, Ag: 35, Dex: 50, Int: 35, WP: 35, Fel: 25 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [
      { id: "skillId1", number: 4 },
      { id: "skillId2", number: 5 },
    ],
    talents: [
      { id: "talentId1", number: 1 },
      { id: "talentId2", number: 2 },
    ],
    equippedItems: [
      { id: "eItemId1", number: 7 },
      { id: "eItemId2", number: 7 },
    ],
    carriedItems: [
      { id: "cItemId1", number: 8 },
      { id: "cItemId2", number: 9 },
      { id: "cItemId3", number: 10 },
    ],
    storedItems: [
      { id: "sItemId1", number: 2 },
      { id: "sItemId2", number: 3 },
    ],
    spells: ["spellId1", "spellId2"],
    prayers: ["prayerId1", "prayerId2"],
    sin: 1,
    corruption: 2,
    mutations: ["mutationId1", "mutationId2"],
    shared: true,
  },
};

const character1ModelForm = {
  id: "id1",
  name: "char1",
  speciesWithRegion: c.WOOD_ELF_DEFAULT,
  fate: 1,
  fortune: 2,
  resilience: 3,
  resolve: 4,
  brass: 12,
  silver: 5,
  gold: 1,
  spentExp: 1000,
  currentExp: 230,
  status: 1,
  standing: 2,
  description: "character 1",
  notes: "",
  careerPath: [
    { id: "careerId1", number: 1 },
    { id: "careerId2", number: 2 },
  ],
  career: { id: "careerId3", number: 3 },
  attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
  attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [
    { id: "skillId1", number: 4 },
    { id: "skillId2", number: 5 },
  ],
  talents: [
    { id: "talentId1", number: 1 },
    { id: "talentId2", number: 2 },
  ],
  equippedItems: [
    { id: "eItemId1", number: 7 },
    { id: "eItemId2", number: 7 },
  ],
  carriedItems: [
    { id: "cItemId1", number: 8 },
    { id: "cItemId2", number: 9 },
    { id: "cItemId3", number: 10 },
  ],
  storedItems: [
    { id: "sItemId1", number: 2 },
    { id: "sItemId2", number: 3 },
  ],
  spells: ["spellId1", "spellId2"],
  prayers: ["prayerId1", "prayerId2"],
  sin: 1,
  corruption: 2,
  mutations: ["mutationId1", "mutationId2"],
  modifiers: generateEmptyModifiers(),
  canEdit: true,
  shared: true,
};

const character2ApiForm = {
  id: "id2",
  canEdit: false,
  object: {
    name: "char2",
    species: c.HUMAN_NORDLAND,
    fate: 2,
    fortune: 3,
    resilience: 1,
    resolve: 1,
    brass: 56,
    silver: 51,
    gold: 10,
    spentExp: 345,
    currentExp: 3,
    status: 2,
    standing: 4,
    description: "character 2",
    notes: "some note",
    careerPath: [],
    career: { id: "id1", number: 1 },
    baseAttributes: { WS: 31, BS: 25, S: 40, T: 25, I: 25, Ag: 35, Dex: 27, Int: 33, WP: 36, Fel: 27 },
    attributeAdvances: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [],
    talents: [],
    equippedItems: [],
    carriedItems: [],
    storedItems: [
      { id: "id7", number: 7 },
      { id: "id7", number: 7 },
    ],
    spells: [],
    prayers: [],
    sin: 2,
    corruption: 3,
    mutations: [],
    shared: false,
  },
};

const character2ModelForm = {
  id: "id2",
  name: "char2",
  speciesWithRegion: c.HUMAN_NORDLAND,
  fate: 2,
  fortune: 3,
  resilience: 1,
  resolve: 1,
  brass: 56,
  silver: 51,
  gold: 10,
  spentExp: 345,
  currentExp: 3,
  status: 2,
  standing: 4,
  description: "character 2",
  notes: "some note",
  careerPath: [],
  career: { id: "id1", number: 1 },
  attributeRolls: { WS: 11, BS: 5, S: 20, T: 5, I: 5, Ag: 15, Dex: 7, Int: 13, WP: 16, Fel: 7 },
  attributeAdvances: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [],
  talents: [],
  equippedItems: [],
  carriedItems: [],
  storedItems: [
    { id: "id7", number: 7 },
    { id: "id7", number: 7 },
  ],
  spells: [],
  prayers: [],
  sin: 2,
  corruption: 3,
  mutations: [],
  canEdit: false,
  shared: false,
};

const characterDisplayApiForm = {
  id: "id",
  canEdit: true,
  object: {
    name: "charDisplay",
    species: c.WOOD_ELF_DEFAULT,
    fate: 1,
    fortune: 2,
    resilience: 3,
    resolve: 4,
    brass: 12,
    silver: 5,
    gold: 1,
    spentExp: 1000,
    currentExp: 230,
    status: 1,
    standing: 2,
    description: "character display",
    notes: "",
    careerPath: [
      {
        number: 1,
        wh: {
          id: "id1",
          object: {
            name: "career_1",
            class: "career_1_class",
            level1: { name: "career_1_level_1" },
            level2: { name: "career_2_level_2" },
            level3: { name: "career_3_level_3" },
            level4: { name: "career_4_level_4" },
          },
        },
      },
      {
        number: 2,
        wh: {
          id: "id2",
          object: {
            name: "career_2",
            class: "career_2_class",
            level1: { name: "career_2_level_1" },
            level2: { name: "career_2_level_2" },
            level3: { name: "career_2_level_3" },
            level4: { name: "career_2_level_4" },
          },
        },
      },
    ],
    career: {
      number: 3,
      wh: {
        id: "id3",
        object: {
          name: "career_3",
          class: 2,
          level1: { name: "career_3_level_1" },
          level2: { name: "career_3_level_2" },
          level3: { name: "career_3_level_3" },
          level4: { name: "career_3_level_4" },
        },
      },
    },
    baseAttributes: { WS: 40, BS: 40, S: 30, T: 25, I: 50, Ag: 35, Dex: 50, Int: 35, WP: 35, Fel: 25 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [
      {
        wh: {
          id: "id4",
          object: {
            name: "basic",
            isGroup: true,
            attribute: 3,
            type: 0,
          },
        },
        number: 4,
      },
      {
        wh: {
          id: "id5",
          object: {
            name: "advanced",
            isGroup: false,
            attribute: 1,
            type: 1,
          },
        },
        number: 5,
      },
    ],
    talents: [
      {
        number: 6,
        wh: {
          id: "id6",
          object: {
            name: "talent_1",
            modifiers: {
              size: 0,
              attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
              movement: 0,
            },
          },
        },
      },
      {
        number: 6,
        wh: {
          id: "id7",
          object: {
            name: "talent_2",
            modifiers: {
              size: 0,
              attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 1 },
              movement: 0,
            },
          },
        },
      },
      {
        number: 1,
        wh: {
          id: "id8",
          object: {
            name: "talent_3",
            modifiers: {
              size: -1,
              attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
              movement: 1,
            },
          },
        },
      },
    ],
    equippedItems: [
      {
        number: 1,
        wh: {
          id: "id9",
          object: {
            name: "item_1",
            enc: 1.5,
            type: 0,
            melee: { group: 0, reach: 2, dmg: 2, dmgSbMult: 2 },
            properties: [{ object: { name: "item_1_property_1" } }],
            description: "item_1_desc",
          },
        },
      },
      {
        number: 2,
        wh: {
          id: "id10",
          object: {
            name: "item_2",
            enc: 1,
            type: 1,
            ranged: { group: 1, rng: 10, rngSbMult: 1.5, dmg: 2, dmgSbMult: 1.2 },
            properties: [{ object: { name: "item_2_property_1" } }, { object: { name: "item_2_property_2" } }],
            description: "item_2_desc",
          },
        },
      },
      {
        number: 3,
        wh: {
          id: "id11",
          object: {
            name: "item_3",
            enc: 0.5,
            type: 2,
            ammunition: { group: 1, dmg: 1, rng: 5, rngMult: 1.3 },
            properties: [],
            description: "item_3_desc",
          },
        },
      },
      {
        number: 3,
        wh: {
          id: "id12",
          object: {
            name: "item_4",
            enc: 2,
            type: 3,
            armour: { group: 1, points: 2, location: [1, 3] },
            properties: [{ object: { name: "item_4_property_1" } }],
            description: "item_4_desc",
          },
        },
      },
    ],
    carriedItems: [
      {
        number: 1,
        wh: {
          id: "id13",
          object: {
            name: "item_5",
            enc: 2,
            type: 4,
            container: { capacity: 2, carryType: 0 },
            properties: [{ object: { name: "item_5_property_1" } }, { object: { name: "item_5_property_2" } }],
            description: "item_5_desc",
          },
        },
      },
      {
        number: 2,
        wh: {
          id: "id14",
          object: {
            name: "item_6",
            enc: 0,
            type: 5,
            other: { carryType: 1 },
            properties: [],
            description: "item_6_desc",
          },
        },
      },
      {
        number: 1,
        wh: {
          id: "id14a",
          object: {
            name: "spellbook",
            enc: 1,
            type: 6,
            grimoire: {
              spells: [
                {
                  object: {
                    name: "spellbook_spell_1",
                    range: "spellbook_spell_1_range",
                    target: "spellbook_spell_1_target",
                    duration: "spellbook_spell_1_duration",
                    description: "spellbook_spell_1_desc",
                    cn: 1,
                  },
                },
                {
                  object: {
                    name: "spellbook_spell_2",
                    range: "spellbook_spell_2_range",
                    target: "spellbook_spell_2_target",
                    duration: "spellbook_spell_2_duration",
                    description: "spellbook_spell_2_desc",
                    cn: 2,
                  },
                },
              ],
            },
            properties: [],
            description: "spellbook_desc",
          },
        },
      },
    ],
    storedItems: [
      {
        number: 5,
        wh: {
          id: "id15",
          object: {
            name: "item_7",
            enc: 7,
            type: 5,
            other: { carry_type: 2 },
            properties: [],
            description: "item_7_desc",
          },
        },
      },
    ],
    spells: [
      {
        id: "id16",
        object: {
          name: "spell_1",
          range: "spell_1_range",
          target: "spell_1_target",
          duration: "spell_1_duration",
          description: "spell_1_desc",
          cn: 1,
        },
      },
      {
        id: "id17",
        object: {
          name: "spell_2",
          range: "spell_2_range",
          target: "spell_2_target",
          duration: "spell_2_duration",
          description: "spell_2_desc",
          cn: 2,
        },
      },
    ],
    prayers: [
      {
        id: "id16a",
        object: {
          name: "prayer_1",
          range: "prayer_1_range",
          target: "prayer_1_target",
          duration: "prayer_1_duration",
          description: "prayer_1_desc",
        },
      },
      {
        id: "id17a",
        object: {
          name: "prayer_2",
          range: "prayer_2_range",
          target: "prayer_2_target",
          duration: "prayer_2_duration",
          description: "prayer_2_desc",
        },
      },
    ],
    sin: 1,
    corruption: 2,
    mutations: [
      {
        id: "id18",
        object: {
          name: "mut_1",
          type: 0,
          description: "mut_1_desc",
          modifiers: {
            size: -1,
            attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 2, WP: 2, Fel: 2 },
            movement: 1,
          },
        },
      },
      {
        id: "id19",
        object: {
          name: "mut_2",
          type: 1,
          description: "mut_2_desc",
          modifiers: {
            size: 1,
            attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
            movement: 0,
          },
        },
      },
    ],
    shared: true,
  },
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/wh/character") {
      apiData = [character1ApiForm, character2ApiForm];
    } else if (path === "/api/wh/character/id1") {
      apiData = character1ApiForm;
    } else if (path === "/api/wh/character/id2") {
      apiData = character2ApiForm;
    } else if (path === "/api/wh/character/id3?full=true") {
      apiData = characterDisplayApiForm;
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

test("getElement returns expected character", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject(character1ModelForm);
});

test("listElements returns expected characters", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([character1ModelForm, character2ModelForm]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement(character1ModelForm);

  expect(result.id).toBe("id1");

  const expectedCareerCall = JSON.parse(JSON.stringify(character1ApiForm.object));
  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/character", expectedCareerCall);
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "put");
  const result = await client.updateElement(character1ModelForm);

  expect(result.id).toBe("id1");

  const expectedCareerCall = JSON.parse(JSON.stringify(character1ApiForm.object));
  delete expectedCareerCall.can_edit;
  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/character/id1", expectedCareerCall);
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/wh/character/id1");
});

describe("compareCharacters returns true", () => {
  test("when characters are exactly the same", () => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    expect(compareCharacter(otherCharacter, character1ModelForm)).toBe(true);
  });

  test("when characters have different modifiers", () => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter.modifiers.size = 1;
    otherCharacter.modifiers.movement = 1;
    otherCharacter.modifiers.attributes.WP = 10;
    expect(compareCharacter(otherCharacter, character1ModelForm)).toBe(true);
  });

  test.each([
    {
      field: "careerPath",
      value: [
        { id: "careerId2", number: 2 },
        { id: "careerId1", number: 1 },
      ],
    },
    {
      field: "skills",
      value: [
        { id: "skillId2", number: 5 },
        { id: "skillId1", number: 4 },
      ],
    },
    {
      field: "talents",
      value: [
        { id: "talentId2", number: 2 },
        { id: "talentId1", number: 1 },
      ],
    },
    {
      field: "equippedItems",
      value: [
        { id: "eItemId2", number: 7 },
        { id: "eItemId1", number: 7 },
      ],
    },
    {
      field: "carriedItems",
      value: [
        { id: "cItemId3", number: 10 },
        { id: "cItemId1", number: 8 },
        { id: "cItemId2", number: 9 },
      ],
    },
    {
      field: "storedItems",
      value: [
        { id: "sItemId2", number: 3 },
        { id: "sItemId1", number: 2 },
      ],
    },
    {
      field: "spells",
      value: ["spellId2", "spellId1"],
    },
    {
      field: "prayers",
      value: ["prayerId2", "prayerId1"],
    },
    {
      field: "mutations",
      value: ["mutationId2", "mutationId1"],
    },
  ])("when elements of $field are in different order", (t) => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter[t.field] = t.value;
    expect(compareCharacter(character1ModelForm, otherCharacter)).toBe(true);
  });
});

describe("compareCharacters returns false", () => {
  test.each([
    { name: "name", field: "name", value: "otherName" },
    { name: "speciesWithRegion", field: "speciesWithRegion", value: 1 },
    { name: "fate", field: "fate", value: 2 },
    { name: "fortune", field: "fortune", value: 3 },
    { name: "resilience", field: "resilience", value: 1 },
    { name: "resolve", field: "resolve", value: 1 },
    { name: "brass", field: "brass", value: 2 },
    { name: "silver", field: "silver", value: 2 },
    { name: "gold", field: "gold", value: 2 },
    { name: "spentExp", field: "spentExp", value: 10 },
    { name: "currentExp", field: "currentExp", value: 10 },
    { name: "status", field: "status", value: 3 },
    { name: "standing", field: "standing", value: 3 },
    { name: "description", field: "description", value: "otherDesc" },
    { name: "notes", field: "notes", value: "some notes" },
    { name: "sin", field: "sin", value: 3 },
    { name: "corruption", field: "corruption", value: 3 },
    { name: "canEdit", field: "canEdit", value: false },
    { name: "shared", field: "shared", value: false },
    { name: "career (different id)", field: "career", value: { id: "otherId", number: 3 } },
    { name: "career (different number)", field: "career", value: { id: "careerId3", number: 4 } },
  ])("when other character has a different value of $name", (t) => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter[t.field] = t.value;
    expect(compareCharacter(character1ModelForm, otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "careerPath (different id)",
      field: "careerPath",
      value: [
        { id: "careerId1", number: 1 },
        { id: "otherId", number: 2 },
      ],
    },
    {
      name: "careerPath (different number)",
      field: "careerPath",
      value: [
        { id: "careerId1", number: 3 },
        { id: "careerId2", number: 2 },
      ],
    },
    {
      name: "careerPath (different number of elements)",
      field: "careerPath",
      value: [{ id: "careerId1", number: 1 }],
    },
    {
      name: "skills (different id)",
      field: "skills",
      value: [
        { id: "skillId1", number: 4 },
        { id: "otherId", number: 5 },
      ],
    },
    {
      name: "skills (different number)",
      field: "skills",
      value: [
        { id: "skillId1", number: 4 },
        { id: "skillId2", number: 7 },
      ],
    },
    {
      name: "skills (different number of elements)",
      field: "skills",
      value: [{ id: "skillId1", number: 4 }],
    },
    {
      name: "talents (different id)",
      field: "talents",
      value: [
        { id: "talentId1", number: 1 },
        { id: "otherId", number: 2 },
      ],
    },
    {
      name: "talents (different number)",
      field: "talents",
      value: [
        { id: "talentId1", number: 3 },
        { id: "talentId2", number: 2 },
      ],
    },
    {
      name: "talents (different number of elements)",
      field: "talents",
      value: [{ id: "talentId1", number: 1 }],
    },
    {
      name: "equippedItems (different id)",
      field: "equippedItems",
      value: [
        { id: "eItemId1", number: 7 },
        { id: "otherID", number: 7 },
      ],
    },
    {
      name: "equippedItems (different number)",
      field: "equippedItems",
      value: [
        { id: "eItemId1", number: 7 },
        { id: "eItemId2", number: 8 },
      ],
    },
    {
      name: "equippedItems (different number of elements)",
      field: "equippedItems",
      value: [{ id: "eItemId1", number: 7 }],
    },
    {
      name: "carriedItems (different id)",
      field: "carriedItems",
      value: [
        { id: "cItemId1", number: 8 },
        { id: "cItemId2", number: 9 },
        { id: "otherId", number: 10 },
      ],
    },
    {
      name: "carriedItems (different number)",
      field: "carriedItems",
      value: [
        { id: "cItemId1", number: 9 },
        { id: "cItemId2", number: 9 },
        { id: "cItemId3", number: 10 },
      ],
    },
    {
      name: "carriedItems (different number of elements)",
      field: "carriedItems",
      value: [
        { id: "cItemId1", number: 8 },
        { id: "cItemId2", number: 9 },
      ],
    },
    {
      name: "storedItems (different id)",
      field: "storedItems",
      value: [
        { id: "sItemId1", number: 2 },
        { id: "otherId", number: 3 },
      ],
    },
    {
      name: "storedItems (different number)",
      field: "storedItems",
      value: [
        { id: "sItemId1", number: 5 },
        { id: "sItemId2", number: 3 },
      ],
    },
    {
      name: "storedItems (different number of elements)",
      field: "storedItems",
      value: [{ id: "sItemId1", number: 2 }],
    },
    { name: "spells (different value)", field: "spells", value: ["spellId1", "otherId"] },
    { name: "spells (different number of elements)", field: "spells", value: ["spellId1"] },
    { name: "prayers (different value)", field: "prayers", value: ["prayerId1", "otherId"] },
    { name: "prayers (different number of elements)", field: "prayers", value: ["prayerId1"] },
    { name: "mutations (different value)", field: "mutations", value: ["mutationId1", "otherId"] },
    { name: "mutations (different number of elements)", field: "mutations", value: ["mutationId1"] },
  ])("when other character has a different value of $name", (t) => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter[t.field] = t.value;
    expect(compareCharacter(character1ModelForm, otherCharacter)).toBe(false);
  });

  test.each([
    { field: "WS", value: 11 },
    { field: "BS", value: 11 },
    { field: "S", value: 11 },
    { field: "T", value: 11 },
    { field: "I", value: 11 },
    { field: "Ag", value: 11 },
    { field: "Dex", value: 11 },
    { field: "Int", value: 11 },
    { field: "WP", value: 11 },
    { field: "Fel", value: 11 },
  ])("when character talent has different value of attributeRolls $field", (t) => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter.attributeRolls[t.field] = t.value;
    expect(compareCharacter(character1ModelForm, otherCharacter)).toBe(false);
  });

  test.each([
    { field: "WS", value: 10 },
    { field: "BS", value: 10 },
    { field: "S", value: 10 },
    { field: "T", value: 10 },
    { field: "I", value: 10 },
    { field: "Ag", value: 10 },
    { field: "Dex", value: 10 },
    { field: "Int", value: 10 },
    { field: "WP", value: 10 },
    { field: "Fel", value: 10 },
  ])("when character talent has different value of attributeAdvances $field", (t) => {
    let otherCharacter = JSON.parse(JSON.stringify(character1ModelForm));
    otherCharacter.attributeAdvances[t.field] = t.value;
    expect(compareCharacter(character1ModelForm, otherCharacter)).toBe(false);
  });
});

describe("getWoundsFormula returns correct value", () => {
  test.each([
    { size: 3, T: 10, WP: 10, S: 10, expected: 4 }, // 1 + (2 * 1) + 1
    { size: 3, T: 12, WP: 17, S: 20, expected: 5 }, // 2 + (2 * 1) + 1
    { size: 3, T: 21, WP: 26, S: 10, expected: 7 }, // 1 + (2 * 2) + 2
    { size: 2, T: 20, WP: 10, S: 10, expected: 5 }, // (2 * 2) + 1
    { size: 1, T: 20, WP: 10, S: 10, expected: 2 }, // 2
    { size: 0, T: 20, WP: 10, S: 10, expected: 1 }, // 1
    { size: -1, T: 20, WP: 10, S: 10, expected: 1 }, // 1
    { size: 4, T: 20, WP: 10, S: 10, expected: 12 }, // 2 * (1 + (2 * 2) + 1)
    { size: 5, T: 20, WP: 10, S: 10, expected: 24 }, // 4 * (1 + (2 * 2) + 1)
    { size: 6, T: 20, WP: 10, S: 10, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
    { size: 7, T: 20, WP: 10, S: 10, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
  ])("when size = $size, T = $T, WP = $WP, S = $S", (t) => {
    expect(getWoundsFormula(t.size, t.T, t.WP, t.S)).toEqual(t.expected);
  });
});
test("getWounds returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));

  char.attributeRolls.T = 5;
  char.attributeAdvances.T = 3;
  char.modifiers.attributes.T = 2;

  char.attributeRolls.WP = 6;
  char.attributeAdvances.WP = 5;
  char.modifiers.attributes.WP = 2;

  char.attributeRolls.S = 10;
  char.attributeAdvances.S = 0;
  char.modifiers.attributes.S = 2;

  // Halfling T 30, WP 43, S 22
  char.species = 1;
  char.modifiers.size = -1;
  expect(getWounds(char)).toEqual(2 * 3 + 4);
});

describe("getMovement returns correct value", () => {
  test.each([
    { name: speciesWithRegion[c.HUMAN_REIKLAND], speciesWithRegion: c.HUMAN_REIKLAND, modifier: 0, expected: 4 },
    { name: speciesWithRegion[c.HUMAN_REIKLAND], speciesWithRegion: c.HUMAN_REIKLAND, modifier: -1, expected: 3 },
    { name: speciesWithRegion[c.HUMAN_REIKLAND], speciesWithRegion: c.HUMAN_REIKLAND, modifier: 1, expected: 5 },
    { name: speciesWithRegion[c.HALFLING_DEFAULT], speciesWithRegion: c.HALFLING_DEFAULT, modifier: 0, expected: 3 },
    { name: speciesWithRegion[c.DWARF_DEFAULT], speciesWithRegion: c.DWARF_DEFAULT, modifier: 0, expected: 3 },
    { name: speciesWithRegion[c.HIGH_ELF_DEFAULT], speciesWithRegion: c.HIGH_ELF_DEFAULT, modifier: 0, expected: 5 },
    { name: speciesWithRegion[c.WOOD_ELF_DEFAULT], speciesWithRegion: c.WOOD_ELF_DEFAULT, modifier: 0, expected: 5 },
    { name: speciesWithRegion[c.GNOME_DEFAULT], speciesWithRegion: c.GNOME_DEFAULT, modifier: 0, expected: 3 },
    { name: speciesWithRegion[c.OGRE_DEFAULT], speciesWithRegion: c.OGRE_DEFAULT, modifier: 0, expected: 6 },
  ])("when speciesWithRegion is $name and modifier is $modifier", (t) => {
    const char = JSON.parse(JSON.stringify(character1ModelForm));
    char.speciesWithRegion = t.speciesWithRegion;
    char.modifiers.movement = t.modifier;
    expect(getMovement(char)).toEqual(t.expected);
  });
});

test("getRacialAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));
  // Dwarf
  char.speciesWithRegion = "0200";
  expect(getRacialAttributes(char)).toEqual({
    WS: 30,
    BS: 20,
    S: 20,
    T: 30,
    I: 20,
    Ag: 10,
    Dex: 30,
    Int: 20,
    WP: 40,
    Fel: 10,
  });
});

describe("getBaseAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };
  test.each([
    {
      name: speciesWithRegion[c.HUMAN_REIKLAND],
      speciesWithRegion: c.HUMAN_REIKLAND,
      expected: {
        WS: 20 + 12,
        BS: 20 + 1,
        S: 20 + 2,
        T: 20 + 1,
        I: 20 + 2,
        Ag: 20 + 1,
        Dex: 20 + 2,
        Int: 20 + 1,
        WP: 20 + 2,
        Fel: 20,
      },
    },
    {
      name: speciesWithRegion[c.HALFLING_DEFAULT],
      speciesWithRegion: c.HALFLING_DEFAULT,
      expected: {
        WS: 10 + 12,
        BS: 30 + 1,
        S: 10 + 2,
        T: 20 + 1,
        I: 20 + 2,
        Ag: 20 + 1,
        Dex: 30 + 2,
        Int: 20 + 1,
        WP: 30 + 2,
        Fel: 30,
      },
    },
    {
      name: speciesWithRegion[c.DWARF_DEFAULT],
      speciesWithRegion: c.DWARF_DEFAULT,
      expected: {
        WS: 30 + 12,
        BS: 20 + 1,
        S: 20 + 2,
        T: 30 + 1,
        I: 20 + 2,
        Ag: 10 + 1,
        Dex: 30 + 2,
        Int: 20 + 1,
        WP: 40 + 2,
        Fel: 10,
      },
    },
    {
      name: speciesWithRegion[c.HIGH_ELF_DEFAULT],
      speciesWithRegion: c.HIGH_ELF_DEFAULT,
      expected: {
        WS: 30 + 12,
        BS: 30 + 1,
        S: 20 + 2,
        T: 20 + 1,
        I: 40 + 2,
        Ag: 30 + 1,
        Dex: 30 + 2,
        Int: 30 + 1,
        WP: 30 + 2,
        Fel: 20,
      },
    },
    {
      name: speciesWithRegion[c.WOOD_ELF_DEFAULT],
      speciesWithRegion: c.WOOD_ELF_DEFAULT,
      expected: {
        WS: 30 + 12,
        BS: 30 + 1,
        S: 20 + 2,
        T: 20 + 1,
        I: 40 + 2,
        Ag: 30 + 1,
        Dex: 30 + 2,
        Int: 30 + 1,
        WP: 30 + 2,
        Fel: 20,
      },
    },
    {
      name: speciesWithRegion[c.GNOME_DEFAULT],
      speciesWithRegion: c.GNOME_DEFAULT,
      expected: {
        WS: 20 + 12,
        BS: 10 + 1,
        S: 10 + 2,
        T: 15 + 1,
        I: 30 + 2,
        Ag: 30 + 1,
        Dex: 30 + 2,
        Int: 30 + 1,
        WP: 40 + 2,
        Fel: 15,
      },
    },
    {
      name: speciesWithRegion[c.OGRE_DEFAULT],
      speciesWithRegion: c.OGRE_DEFAULT,
      expected: {
        WS: 20 + 12,
        BS: 10 + 1,
        S: 35 + 2,
        T: 35 + 1,
        I: 0 + 2,
        Ag: 15 + 1,
        Dex: 10 + 2,
        Int: 10 + 1,
        WP: 20 + 2,
        Fel: 10,
      },
    },
  ])("for $name", (t) => {
    char.speciesWithRegion = t.speciesWithRegion;
    expect(getBaseAttributes(char)).toEqual(t.expected);
  });
});

describe("getTotalAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };
  char.modifiers.attributes = { WS: 3, BS: 4, S: 3, T: 4, I: 3, Ag: 4, Dex: 3, Int: 4, WP: 3, Fel: 1 };
  char.attributeAdvances = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 };
  test.each([
    {
      name: speciesWithRegion[c.HUMAN_REIKLAND],
      speciesWithRegion: c.HUMAN_REIKLAND,
      expected: {
        WS: 20 + 16,
        BS: 20 + 7,
        S: 20 + 8,
        T: 20 + 9,
        I: 20 + 10,
        Ag: 20 + 11,
        Dex: 20 + 12,
        Int: 20 + 13,
        WP: 20 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: speciesWithRegion[c.HALFLING_DEFAULT],
      speciesWithRegion: c.HALFLING_DEFAULT,
      expected: {
        WS: 10 + 16,
        BS: 30 + 7,
        S: 10 + 8,
        T: 20 + 9,
        I: 20 + 10,
        Ag: 20 + 11,
        Dex: 30 + 12,
        Int: 20 + 13,
        WP: 30 + 14,
        Fel: 30 + 11,
      },
    },
    {
      name: speciesWithRegion[c.DWARF_DEFAULT],
      speciesWithRegion: c.DWARF_DEFAULT,
      expected: {
        WS: 30 + 16,
        BS: 20 + 7,
        S: 20 + 8,
        T: 30 + 9,
        I: 20 + 10,
        Ag: 10 + 11,
        Dex: 30 + 12,
        Int: 20 + 13,
        WP: 40 + 14,
        Fel: 10 + 11,
      },
    },
    {
      name: speciesWithRegion[c.HIGH_ELF_DEFAULT],
      speciesWithRegion: c.HIGH_ELF_DEFAULT,
      expected: {
        WS: 30 + 16,
        BS: 30 + 7,
        S: 20 + 8,
        T: 20 + 9,
        I: 40 + 10,
        Ag: 30 + 11,
        Dex: 30 + 12,
        Int: 30 + 13,
        WP: 30 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: speciesWithRegion[c.WOOD_ELF_DEFAULT],
      speciesWithRegion: c.WOOD_ELF_DEFAULT,
      expected: {
        WS: 30 + 16,
        BS: 30 + 7,
        S: 20 + 8,
        T: 20 + 9,
        I: 40 + 10,
        Ag: 30 + 11,
        Dex: 30 + 12,
        Int: 30 + 13,
        WP: 30 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: speciesWithRegion[c.GNOME_DEFAULT],
      speciesWithRegion: c.GNOME_DEFAULT,
      expected: {
        WS: 20 + 16,
        BS: 10 + 7,
        S: 10 + 8,
        T: 15 + 9,
        I: 30 + 10,
        Ag: 30 + 11,
        Dex: 30 + 12,
        Int: 30 + 13,
        WP: 40 + 14,
        Fel: 15 + 11,
      },
    },
    {
      name: speciesWithRegion[c.OGRE_DEFAULT],
      speciesWithRegion: c.OGRE_DEFAULT,
      expected: {
        WS: 20 + 16,
        BS: 10 + 7,
        S: 35 + 8,
        T: 35 + 9,
        I: 0 + 10,
        Ag: 15 + 11,
        Dex: 10 + 12,
        Int: 10 + 13,
        WP: 20 + 14,
        Fel: 10 + 11,
      },
    },
  ])("for $name", (t) => {
    char.speciesWithRegion = t.speciesWithRegion;
    expect(getTotalAttributes(char)).toEqual(t.expected);
  });
});

test("getElementDisplay returns correct value", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.getElementForDisplay("id3");

  const expected = {
    id: "id3",
    name: "charDisplay",
    speciesWithRegion: "Wood Elf",
    fate: 1,
    fortune: 2,
    resilience: 3,
    resolve: 4,
    brass: 12,
    silver: 5,
    gold: 1,
    spentExp: 1000,
    currentExp: 230,
    status: "Silver",
    standing: 2,
    description: "character display",
    notes: "",
    sin: 1,
    corruption: 2,
    shared: true,
    canEdit: true,
    careerName: "career_3 3",
    careerLevelName: "career_3_level_3",
    className: "Courtier",
    pastCareers: ["career_1 1", "career_2 2"],
    baseAttributes: { WS: 40, BS: 40, S: 30, T: 25, I: 50, Ag: 35, Dex: 50, Int: 35, WP: 35, Fel: 25 },
    otherAttributes: { WS: 6, BS: 12, S: 18, T: 0, I: 0, Ag: 0, Dex: 0, Int: 2, WP: 2, Fel: 8 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    attributes: { Ag: 35, BS: 54, Dex: 50, Fel: 33, I: 50, Int: 37, S: 51, T: 25, WP: 37, WS: 47 },
    movement: 7,
    walk: 14,
    run: 28,
    wounds: 7,
    talents: [
      { name: "talent_1", rank: 6 },
      { name: "talent_2", rank: 6 },
      { name: "talent_3", rank: 1 },
    ],
    basicSkills: [
      {
        name: "basic (Any)",
        attributeName: "S",
        attributeValue: 51,
        advances: 4,
        skill: 55,
      },
    ],
    advancedSkills: [
      {
        name: "advanced",
        attributeName: "WS",
        attributeValue: 47,
        advances: 5,
        skill: 52,
      },
    ],
    equippedArmor: [
      {
        name: "item_4",
        enc: 2,
        qualities: ["item_4_property_1"],
        number: 3,
        desc: "item_4_desc",
        group: "Boiled Leather",
        locations: ["Body", "Head"],
        ap: 2,
      },
    ],
    equippedWeapon: [
      {
        name: "item_1",
        enc: 1.5,
        qualities: ["item_1_property_1"],
        number: 1,
        desc: "item_1_desc",
        group: "Basic",
        rng: "Short",
        dmg: 12,
      },
      {
        name: "item_2",
        enc: 1,
        qualities: ["item_2_property_1", "item_2_property_2"],
        number: 2,
        desc: "item_2_desc",
        group: "Bow",
        rng: 17.5,
        dmg: 8,
      },
      {
        name: "item_3",
        enc: 0.5,
        qualities: [],
        number: 3,
        desc: "item_3_desc",
        group: "Bow",
        rng: "Weapon x1.3+5",
        dmg: "Weapon+1",
      },
    ],
    equippedOther: [],
    carried: [
      {
        name: "item_5",
        enc: 2,
        qualities: ["item_5_property_1", "item_5_property_2"],
        number: 1,
        desc: "(Capacity 2) item_5_desc",
      },
      {
        name: "item_6",
        enc: 0,
        qualities: [],
        number: 2,
        desc: "item_6_desc",
      },
      {
        number: 1,
        name: "spellbook",
        enc: 1,
        qualities: [],
        desc: "spellbook_desc",
        spells: [
          {
            name: "spellbook_spell_1",
            range: "spellbook_spell_1_range",
            target: "spellbook_spell_1_target",
            duration: "spellbook_spell_1_duration",
            description: "spellbook_spell_1_desc",
            cn: 1,
          },
          {
            name: "spellbook_spell_2",
            range: "spellbook_spell_2_range",
            target: "spellbook_spell_2_target",
            duration: "spellbook_spell_2_duration",
            description: "spellbook_spell_2_desc",
            cn: 2,
          },
        ],
      },
    ],
    stored: [{ name: "item_7", enc: 7, qualities: [], number: 5, desc: "item_7_desc" }],
    spells: [
      {
        name: "spell_1",
        range: "spell_1_range",
        target: "spell_1_target",
        duration: "spell_1_duration",
        description: "spell_1_desc",
        cn: 1,
      },
      {
        name: "spell_2",
        range: "spell_2_range",
        target: "spell_2_target",
        duration: "spell_2_duration",
        description: "spell_2_desc",
        cn: 2,
      },
    ],
    prayers: [
      {
        name: "prayer_1",
        range: "prayer_1_range",
        target: "prayer_1_target",
        duration: "prayer_1_duration",
        description: "prayer_1_desc",
      },
      {
        name: "prayer_2",
        range: "prayer_2_range",
        target: "prayer_2_target",
        duration: "prayer_2_duration",
        description: "prayer_2_desc",
      },
    ],
    mutations: [
      { name: "mut_1", type: "Physical", description: "mut_1_desc" },
      { name: "mut_2", type: "Mental", description: "mut_2_desc" },
    ],
    encWeapon: 5,
    encArmor: 3,
    encOther: 0,
    encCarried: 3,
  };

  expect(result).toEqual(expected);
});
