import {
  CharacterApi,
  compareCharacter,
  getMovement,
  getWounds,
  getBaseAttributes,
  getTotalAttributes,
  getRacialAttributes,
} from "../src/services/wh/character";
import { getAttributes } from "../src/services/wh/attributes";
import { generateEmptyModifiers } from "../src/services/wh/characterModifiers";

const character1ApiForm = {
  name: "char1",
  species: 4,
  fate: 1,
  fortune: 2,
  resilience: 3,
  resolve: 4,
  brass: 12,
  silver: 5,
  gold: 1,
  spent_exp: 1000,
  current_exp: 230,
  status: 1,
  standing: 2,
  description: "character 1",
  notes: "",
  career_path: [
    { id: "id1", level: 1 },
    { id: "id2", level: 2 },
  ],
  career: { id: "id3", level: 3 },
  base_attributes: { WS: 40, BS: 40, S: 30, T: 25, I: 50, Ag: 35, Dex: 50, Int: 35, WP: 35, Fel: 25 },
  attribute_advances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [
    { id: "id4", number: 4 },
    { id: "id5", number: 5 },
  ],
  talents: [{ id: "id6", number: 6 }],
  equipped_items: [
    { id: "id7", number: 7 },
    { id: "id7", number: 7 },
  ],
  carried_items: [
    { id: "id8", number: 8 },
    { id: "id9", number: 9 },
    { id: "id10", number: 10 },
  ],
  stored_items: [],
  spells: ["id11", "id12"],
  sin: 1,
  corruption: 2,
  mutations: ["id13"],
  can_edit: true,
  shared: true,
};

const character1ModelForm = {
  name: "char1",
  species: 4,
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
    { id: "id1", number: 1 },
    { id: "id2", number: 2 },
  ],
  career: { id: "id3", number: 3 },
  attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
  attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [
    { id: "id4", number: 4 },
    { id: "id5", number: 5 },
  ],
  talents: [{ id: "id6", number: 6 }],
  equippedItems: [
    { id: "id7", number: 7 },
    { id: "id7", number: 7 },
  ],
  carriedItems: [
    { id: "id8", number: 8 },
    { id: "id9", number: 9 },
    { id: "id10", number: 10 },
  ],
  storedItems: [],
  spells: ["id11", "id12"],
  sin: 1,
  corruption: 2,
  mutations: ["id13"],
  modifiers: generateEmptyModifiers(),
  canEdit: true,
  shared: true,
};

const character2ApiForm = {
  name: "char2",
  species: 0,
  fate: 2,
  fortune: 3,
  resilience: 1,
  resolve: 1,
  brass: 56,
  silver: 51,
  gold: 10,
  spent_exp: 345,
  current_exp: 3,
  status: 2,
  standing: 4,
  description: "character 2",
  notes: "some note",
  career_path: [],
  career: { id: "id1", level: 1 },
  base_attributes: { WS: 31, BS: 25, S: 40, T: 25, I: 25, Ag: 35, Dex: 27, Int: 33, WP: 36, Fel: 27 },
  attribute_advances: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [],
  talents: [],
  equipped_items: [],
  carried_items: [],
  stored_items: [
    { id: "id7", number: 7 },
    { id: "id7", number: 7 },
  ],
  spells: [],
  sin: 2,
  corruption: 3,
  mutations: [],
  can_edit: false,
  shared: false,
};

const character2ModelForm = {
  name: "char2",
  species: 0,
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
  sin: 2,
  corruption: 3,
  mutations: [],
  canEdit: false,
  shared: false,
};

const characterDisplayApiForm = {
  name: "charDisplay",
  species: 4,
  fate: 1,
  fortune: 2,
  resilience: 3,
  resolve: 4,
  brass: 12,
  silver: 5,
  gold: 1,
  spent_exp: 1000,
  current_exp: 230,
  status: 1,
  standing: 2,
  description: "character display",
  notes: "",
  career_path: [
    {
      id: "id1",
      level: 1,
      value: {
        name: "career_1",
        class: "career_1_class",
        level_1: { name: "career_1_level_1" },
        level_2: { name: "career_2_level_2" },
        level_3: { name: "career_3_level_3" },
        level_4: { name: "career_4_level_4" },
      },
    },
    {
      id: "id2",
      level: 2,
      value: {
        name: "career_2",
        class: "career_2_class",
        level_1: { name: "career_2_level_1" },
        level_2: { name: "career_2_level_2" },
        level_3: { name: "career_2_level_3" },
        level_4: { name: "career_2_level_4" },
      },
    },
  ],
  career: {
    id: "id3",
    level: 3,
    value: {
      name: "career_3",
      class: 2,
      level_1: { name: "career_3_level_1" },
      level_2: { name: "career_3_level_2" },
      level_3: { name: "career_3_level_3" },
      level_4: { name: "career_3_level_4" },
    },
  },
  base_attributes: { WS: 40, BS: 40, S: 30, T: 25, I: 50, Ag: 35, Dex: 50, Int: 35, WP: 35, Fel: 25 },
  attribute_advances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: [
    { id: "id4", number: 4 },
    { id: "id5", number: 5 },
  ],
  talents: [
    {
      id: "id6",
      number: 6,
      value: {
        name: "talent_1",
        modifiers: {
          size: 0,
          attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
          movement: 0,
        },
      },
    },
    {
      id: "id7",
      number: 6,
      value: {
        name: "talent_2",
        modifiers: {
          size: 0,
          attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 1 },
          movement: 0,
        },
      },
    },
    {
      id: "id8",
      number: 1,
      value: {
        name: "talent_3",
        modifiers: {
          size: -1,
          attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
          movement: 1,
        },
      },
    },
  ],
  equipped_items: [
    {
      id: "id9",
      number: 1,
      value: {
        name: "item_1",
        enc: 1.5,
        stats: { type: 0, group: 0, reach: 2, dmg: 2, dmg_sb_mult: 2 },
        properties: [{ name: "item_1_property_1" }],
        description: "item_1_desc",
      },
    },
    {
      id: "id10",
      number: 2,
      value: {
        name: "item_2",
        enc: 1,
        stats: { type: 1, group: 1, rng: 10, rng_sb_mult: 1.5, dmg: 2, dmg_sb_mult: 1.2 },
        properties: [{ name: "item_2_property_1" }, { name: "item_2_property_2" }],
        description: "item_2_desc",
      },
    },
    {
      id: "id11",
      number: 3,
      value: {
        name: "item_3",
        enc: 0.5,
        stats: { type: 2, group: 1, dmg: 1, rng: 5, rng_mult: 1.3 },
        properties: [],
        description: "item_3_desc",
      },
    },
    {
      id: "id12",
      number: 3,
      value: {
        name: "item_4",
        enc: 2,
        stats: { type: 3, group: 1, points: 2, location: [1, 3] },
        properties: [{ name: "item_4_property_1" }],
        description: "item_4_desc",
      },
    },
  ],
  carried_items: [
    {
      id: "id13",
      number: 1,
      value: {
        name: "item_5",
        enc: 2,
        stats: { type: 4, capacity: 2, wearable: true },
        properties: [{ name: "item_5_property_1" }, { name: "item_5_property_2" }],
        description: "item_5_desc",
      },
    },
    {
      id: "id14",
      number: 2,
      value: {
        name: "item_6",
        enc: 0,
        stats: { type: 5, carry_type: { carriable: true, wearable: false } },
        properties: [],
        description: "item_6_desc",
      },
    },
  ],
  stored_items: [
    {
      id: "id15",
      number: 5,
      value: {
        name: "item_7",
        enc: 7,
        stats: { type: 5, carry_type: { carriable: false, wearable: false } },
        properties: [],
        description: "item_7_desc",
      },
    },
  ],
  spells: [
    {
      id: "id16",
      value: {
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
      value: {
        name: "spell_2",
        range: "spell_2_range",
        target: "spell_2_target",
        duration: "spell_2_duration",
        description: "spell_2_desc",
        cn: -1,
      },
    },
  ],
  sin: 1,
  corruption: 2,
  mutations: [
    {
      id: "id18",
      value: {
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
      value: {
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
  can_edit: true,
  shared: true,
};

const skillsApiForm = [
  {
    // Should be displayed
    id: "id4",
    name: "taken_basic_skill",
    attribute: 1,
    type: 0,
    display_zero: true,
  },
  {
    // Should be displayed
    id: "id5",
    name: "taken_adv_skill",
    attribute: 3,
    type: 1,
    display_zero: false,
  },
  {
    // Should be displayed because not taken basic with display_zero: true
    id: "not_taken_id1",
    name: "basic_skill_1",
    attribute: 4,
    type: 0,
    display_zero: true,
  },
  {
    // Should NOT be displayed because not taken basic with display_zero: false
    id: "not_taken_id2",
    name: "basic_skill_2",
    attribute: 7,
    type: 0,
    display_zero: false,
  },
  {
    // Should NOT be displayed because not taken basic with attribute "Various" (11)
    id: "not_taken_id3",
    name: "basic_skill_3",
    attribute: 11,
    type: 0,
    display_zero: true,
  },
  {
    // Should NOT be displayed because not taken advanced
    id: "not_taken_id4",
    name: "advanced_skill_1",
    attribute: 1,
    type: 1,
    display_zero: true,
  },
  {
    // Should NOT be displayed because mixed (type 2)
    id: "not_taken_id5",
    name: "mixed_skill_1",
    attribute: 1,
    type: 2,
    display_zero: true,
  },
];

const mockAxios = {
  get: jest.fn(async (path) => {
    if (path === "/api/character") {
      return {
        data: {
          data: [character1ApiForm, character2ApiForm],
        },
      };
    } else if (path === "/api/character/id1") {
      return {
        data: {
          data: character1ApiForm,
        },
      };
    } else if (path === "/api/character/id2") {
      return {
        data: {
          data: character2ApiForm,
        },
      };
    } else if (path === "/api/character_resolved/id3") {
      return {
        data: {
          data: characterDisplayApiForm,
        },
      };
    } else if (path === "/api/skill") {
      return {
        data: {
          data: skillsApiForm,
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

test("test getElement returns expected character", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject(character1ModelForm);
});

test("test listElements returns expected characters", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([character1ModelForm, character2ModelForm]);
});

test("test createElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.createElement(character1ModelForm);

  expect(result).toEqual("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(character1ApiForm));
  delete expectedCareerCall.id;
  delete expectedCareerCall.can_edit;
  expect(mockAxios.post).toHaveBeenCalledWith("/api/character", expectedCareerCall);
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.updateElement(character2ModelForm);

  expect(result).toEqual("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(character2ApiForm));
  delete expectedCareerCall.can_edit;
  expect(mockAxios.post).toHaveBeenCalledWith("/api/character/update", expectedCareerCall);
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new CharacterApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/character/id1");
});

test("test compareCareers returns true if objects are the same", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [
      { id: "id4", number: 4 },
      { id: "id5", number: 5 },
    ],
    talents: [{ id: "id6", number: 6 }],
    equippedItems: [
      { id: "id7", number: 7 },
      { id: "id7", number: 7 },
    ],
    carriedItems: [
      { id: "id8", number: 8 },
      { id: "id9", number: 9 },
      { id: "id10", number: 10 },
    ],
    storedItems: [],
    spells: ["id11", "id12"],
    sin: 1,
    corruption: 2,
    mutations: ["id13"],
    canEdit: true,
    shared: true,
  };

  const char2 = {
    name: "char1",
    species: 4,
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
      { id: "id2", number: 2 },
      { id: "id1", number: 1 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5, BS: 10, S: 10 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    attributes: { WS: 11, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5, BS: 12, S: 13 },
    skills: [
      { id: "id5", number: 5 },
      { id: "id4", number: 4 },
    ],
    talents: [{ number: 6, id: "id6" }],
    equippedItems: [
      { id: "id7", number: 7 },
      { id: "id7", number: 7 },
    ],
    carriedItems: [
      { id: "id8", number: 8 },
      { id: "id10", number: 10 },
      { id: "id9", number: 9 },
    ],
    storedItems: [],
    spells: ["id12", "id11"],
    sin: 1,
    corruption: 2,
    mutations: ["id13"],
    canEdit: true,
    shared: true,
  };

  const result = compareCharacter(char1, char2);
  expect(result).toEqual(true);
});

test("test compareCareers returns false if numString arrays are different", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    talents: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    equippedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    carriedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    storedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    spells: ["id1", "id2"],
    sin: 1,
    corruption: 2,
    mutations: ["id1", "id2"],
    canEdit: true,
    shared: true,
  };
  let char2;

  for (let prop of ["careerPath", "skills", "talents", "equippedItems", "carriedItems", "storedItems"]) {
    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [
      { id: "newid", number: 1 },
      { id: "id2", number: 2 },
    ];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [
      { id: "id1", number: 1 },
      { id: "id2", number: 3 },
    ];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [{ id: "id1", number: 1 }];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
      { id: "id3", number: 3 },
    ];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [];
    expect(compareCharacter(char1, char2)).toEqual(false);
  }
});

test("test compareCareers returns false if string arrays are different", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    skills: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    talents: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    equippedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    carriedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    storedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    spells: ["id1", "id2"],
    sin: 1,
    corruption: 2,
    mutations: ["id1", "id2"],
    canEdit: true,
    shared: true,
  };
  let char2;

  for (let prop of ["spells", "mutations"]) {
    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = ["id2", "id3"];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = ["id1", "id2", "id3"];
    expect(compareCharacter(char1, char2)).toEqual(false);

    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = [];
    expect(compareCharacter(char1, char2)).toEqual(false);
  }
});

test("test compareCareers returns false if attributes are different", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    skills: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    talents: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    equippedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    carriedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    storedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    spells: ["id1", "id2"],
    sin: 1,
    corruption: 2,
    mutations: ["id1", "id2"],
    canEdit: true,
    shared: true,
  };
  let char2;

  for (let prop of ["attributeAdvances", "attributeRolls"]) {
    char2 = JSON.parse(JSON.stringify(char1));
    char2[prop] = { WS: 11, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 };
    expect(compareCharacter(char1, char2)).toEqual(false);
  }
});

test("test compareCareers returns false if careers are different", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    skills: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    talents: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    equippedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    carriedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    storedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    spells: ["id1", "id2"],
    sin: 1,
    corruption: 2,
    mutations: ["id1", "id2"],
    canEdit: true,
    shared: true,
  };
  let char2;

  char2 = JSON.parse(JSON.stringify(char1));
  char2.career = { id: "id4", number: 3 };
  expect(compareCharacter(char1, char2)).toEqual(false);

  char2 = JSON.parse(JSON.stringify(char1));
  char2.career = { id: "id3", number: 2 };
  expect(compareCharacter(char1, char2)).toEqual(false);
});

test("test compareCareers returns false if single value props are different", () => {
  const char1 = {
    name: "char1",
    species: 4,
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
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    career: { id: "id3", number: 3 },
    attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    attributeAdvances: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
    skills: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    talents: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    equippedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    carriedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    storedItems: [
      { id: "id1", number: 1 },
      { id: "id2", number: 2 },
    ],
    spells: ["id1", "id2"],
    sin: 1,
    corruption: 2,
    mutations: ["id1", "id2"],
    canEdit: true,
    shared: true,
  };

  let char2;
  char2 = JSON.parse(JSON.stringify(char1));
  char2.name = "new name";
  expect(compareCharacter(char1, char2)).toEqual(false);

  char2 = JSON.parse(JSON.stringify(char1));
  char2.canEdit = false;
  expect(compareCharacter(char1, char2)).toEqual(false);

  char2 = JSON.parse(JSON.stringify(char1));
  char2.brass = 100;
  expect(compareCharacter(char1, char2)).toEqual(false);
});

test("test getWounds returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));

  char.attributeRolls.T = 5;
  char.attributeAdvances.T = 3;

  char.attributeRolls.WP = 6;
  char.attributeAdvances.WP = 5;

  char.attributeRolls.S = 10;
  char.attributeAdvances.S = 0;

  // Human T 28, WP 31, S 30
  char.species = 0;
  char.modifiers.size = 0;
  expect(getWounds(char)).toEqual(2 * 2 + 3 + 3);

  // Dwarf T 38, WP 51, S 30
  char.species = 2;
  char.modifiers.size = 0;
  expect(getWounds(char)).toEqual(2 * 3 + 5 + 3);

  // Elf T 28, WP 41, S 30
  char.species = 3;
  char.modifiers.size = 0;
  expect(getWounds(char)).toEqual(2 * 2 + 4 + 3);
  char.species = 4;
  char.modifiers.size = 0;
  expect(getWounds(char)).toEqual(2 * 2 + 4 + 3);

  // Halfling T 28, WP 41, S 20
  char.species = 1;
  char.modifiers.size = -1;
  expect(getWounds(char)).toEqual(2 * 2 + 4);
});

test("test getMovement returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));

  // Human
  char.species = 0;
  expect(getMovement(char)).toEqual(4);

  // Dwarf
  char.species = 2;
  expect(getMovement(char)).toEqual(3);

  // Elf
  char.species = 3;
  expect(getMovement(char)).toEqual(5);
  char.species = 4;
  expect(getMovement(char)).toEqual(5);

  // Halfling
  char.species = 1;
  expect(getMovement(char)).toEqual(3);
});

test("test getRacialAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));

  // Human
  char.species = 0;
  expect(getRacialAttributes(char)).toEqual({
    WS: 20,
    BS: 20,
    S: 20,
    T: 20,
    I: 20,
    Ag: 20,
    Dex: 20,
    Int: 20,
    WP: 20,
    Fel: 20,
  });

  // Dwarf
  char.species = 2;
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

  // Elf
  char.species = 3;
  expect(getRacialAttributes(char)).toEqual({
    WS: 30,
    BS: 30,
    S: 20,
    T: 20,
    I: 40,
    Ag: 30,
    Dex: 30,
    Int: 30,
    WP: 30,
    Fel: 20,
  });

  char.species = 4;
  expect(getRacialAttributes(char)).toEqual({
    WS: 30,
    BS: 30,
    S: 20,
    T: 20,
    I: 40,
    Ag: 30,
    Dex: 30,
    Int: 30,
    WP: 30,
    Fel: 20,
  });

  // Halfling
  char.species = 1;
  expect(getRacialAttributes(char)).toEqual({
    WS: 10,
    BS: 30,
    S: 10,
    T: 20,
    I: 20,
    Ag: 20,
    Dex: 30,
    Int: 20,
    WP: 30,
    Fel: 30,
  });
});

test("test getBaseAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };

  // Human
  char.species = 0;
  expect(getBaseAttributes(char)).toEqual({
    WS: 12 + 20,
    BS: 1 + 20,
    S: 2 + 20,
    T: 1 + 20,
    I: 2 + 20,
    Ag: 1 + 20,
    Dex: 2 + 20,
    Int: 1 + 20,
    WP: 2 + 20,
    Fel: 0 + 20,
  });

  // Dwarf
  char.species = 2;
  expect(getBaseAttributes(char)).toEqual({
    WS: 12 + 30,
    BS: 1 + 20,
    S: 2 + 20,
    T: 1 + 30,
    I: 2 + 20,
    Ag: 1 + 10,
    Dex: 2 + 30,
    Int: 1 + 20,
    WP: 2 + 40,
    Fel: 0 + 10,
  });

  // Elf
  char.species = 3;
  expect(getBaseAttributes(char)).toEqual({
    WS: 12 + 30,
    BS: 1 + 30,
    S: 2 + 20,
    T: 1 + 20,
    I: 2 + 40,
    Ag: 1 + 30,
    Dex: 2 + 30,
    Int: 1 + 30,
    WP: 2 + 30,
    Fel: 0 + 20,
  });

  char.species = 4;
  expect(getBaseAttributes(char)).toEqual({
    WS: 12 + 30,
    BS: 1 + 30,
    S: 2 + 20,
    T: 1 + 20,
    I: 2 + 40,
    Ag: 1 + 30,
    Dex: 2 + 30,
    Int: 1 + 30,
    WP: 2 + 30,
    Fel: 0 + 20,
  });

  // Halfling
  char.species = 1;
  expect(getBaseAttributes(char)).toEqual({
    WS: 12 + 10,
    BS: 1 + 30,
    S: 2 + 10,
    T: 1 + 20,
    I: 2 + 20,
    Ag: 1 + 20,
    Dex: 2 + 30,
    Int: 1 + 20,
    WP: 2 + 30,
    Fel: 0 + 30,
  });
});

test("test getTotalAttributes returns correct value", () => {
  const char = JSON.parse(JSON.stringify(character1ModelForm));
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };
  char.attributeAdvances = { WS: 3, BS: 4, S: 3, T: 4, I: 3, Ag: 4, Dex: 3, Int: 4, WP: 3, Fel: 1 };

  // Human
  char.species = 0;
  expect(getTotalAttributes(char, getAttributes())).toEqual({
    WS: 15 + 20,
    BS: 5 + 20,
    S: 5 + 20,
    T: 5 + 20,
    I: 5 + 20,
    Ag: 5 + 20,
    Dex: 5 + 20,
    Int: 5 + 20,
    WP: 5 + 20,
    Fel: 1 + 20,
  });

  // Dwarf
  char.species = 2;
  expect(getTotalAttributes(char, getAttributes())).toEqual({
    WS: 15 + 30,
    BS: 5 + 20,
    S: 5 + 20,
    T: 5 + 30,
    I: 5 + 20,
    Ag: 5 + 10,
    Dex: 5 + 30,
    Int: 5 + 20,
    WP: 5 + 40,
    Fel: 1 + 10,
  });

  // Elf
  char.species = 3;
  expect(getTotalAttributes(char, getAttributes())).toEqual({
    WS: 15 + 30,
    BS: 5 + 30,
    S: 5 + 20,
    T: 5 + 20,
    I: 5 + 40,
    Ag: 5 + 30,
    Dex: 5 + 30,
    Int: 5 + 30,
    WP: 5 + 30,
    Fel: 1 + 20,
  });

  char.species = 4;
  expect(getTotalAttributes(char, getAttributes())).toEqual({
    WS: 15 + 30,
    BS: 5 + 30,
    S: 5 + 20,
    T: 5 + 20,
    I: 5 + 40,
    Ag: 5 + 30,
    Dex: 5 + 30,
    Int: 5 + 30,
    WP: 5 + 30,
    Fel: 1 + 20,
  });

  // Halfling
  char.species = 1;
  expect(getTotalAttributes(char, getAttributes())).toEqual({
    WS: 15 + 10,
    BS: 5 + 30,
    S: 5 + 10,
    T: 5 + 20,
    I: 5 + 20,
    Ag: 5 + 20,
    Dex: 5 + 30,
    Int: 5 + 20,
    WP: 5 + 30,
    Fel: 1 + 30,
  });
});

test("test getElementDisplay return correct value", async () => {
  const client = new CharacterApi(mockAxios);
  const result = await client.getElementForDisplay("id3");

  const expected = {
    id: "id3",
    name: "charDisplay",
    species: "Wood Elf",
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
        name: "basic_skill_1",
        attributeName: "T",
        attributeValue: 25,
        advances: 0,
        skill: 25,
      },
      {
        name: "taken_basic_skill",
        attributeName: "WS",
        attributeValue: 47,
        advances: 4,
        skill: 51,
      },
    ],
    advancedSkills: [
      {
        name: "taken_adv_skill",
        attributeName: "S",
        attributeValue: 51,
        advances: 5,
        skill: 56,
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
    ],
    stored: [
      {
        name: "item_7",
        enc: 7,
        qualities: [],
        number: 5,
        desc: "item_7_desc",
      },
    ],
    spells: [
      {
        name: "spell_1",
        range: "spell_1_range",
        target: "spell_1_target",
        duration: "spell_1_duration",
        description: "spell_1_desc",
        type: "Spell",
        cn: 1,
      },
      {
        name: "spell_2",
        range: "spell_2_range",
        target: "spell_2_target",
        duration: "spell_2_duration",
        description: "spell_2_desc",
        type: "Prayer",
        cn: null,
      },
    ],
    mutations: [
      {
        name: "mut_1",
        type: "Physical",
        description: "mut_1_desc",
      },
      {
        name: "mut_2",
        type: "Mental",
        description: "mut_2_desc",
      },
    ],
    encWeapon: 5,
    encArmor: 3,
    encOther: 0,
    encCarried: 2,
  };

  expect(result).toEqual(expected);
});
