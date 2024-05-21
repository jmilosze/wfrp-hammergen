import { apiResponseToModel, Character, CharacterApiData, modelToApi } from "../services/wh/character.ts";
import { getWoundsFormula, printSpeciesWithRegion, Size, SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { StatusTier } from "../services/wh/career.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";
import { IdNumber } from "../utils/idNumber.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { getAttributes } from "../services/wh/attributes.ts";

const characterApiData: CharacterApiData = {
  name: "char name",
  description: "character 1",
  notes: "some notes",
  species: SpeciesWithRegion.WoodElfDefault,
  fate: 1,
  fortune: 2,
  resilience: 3,
  resolve: 4,
  brass: 12,
  silver: 5,
  gold: 1,
  spentExp: 1000,
  currentExp: 230,
  sin: 1,
  corruption: 2,
  status: StatusTier.Brass,
  standing: 2,
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
  mutations: ["mutationId1", "mutationId2"],
  careerPath: [
    { id: "careerId1", number: 1 },
    { id: "careerId2", number: 2 },
  ],
  shared: true,
};

const characterApiResponse: ApiResponse<CharacterApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: characterApiData,
};

const character = new Character({
  id: "id",
  canEdit: true,
  name: "char name",
  description: "character 1",
  notes: "some notes",
  species: SpeciesWithRegion.WoodElfDefault,
  fate: 1,
  fortune: 2,
  resilience: 3,
  resolve: 4,
  brass: 12,
  silver: 5,
  gold: 1,
  spentExp: 1000,
  currentExp: 230,
  sin: 1,
  corruption: 2,
  status: StatusTier.Brass,
  standing: 2,
  career: { id: "careerId3", number: 3 },
  attributeRolls: { WS: 10, BS: 10, S: 10, T: 5, I: 10, Ag: 5, Dex: 20, Int: 5, WP: 5, Fel: 5 },
  attributeAdvances: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  skills: {
    skillId1: 4,
    skillId2: 5,
  },
  talents: {
    talentId1: 1,
    talentId2: 2,
  },
  equippedItems: {
    eItemId1: 7,
    eItemId2: 7,
  },
  carriedItems: {
    cItemId1: 8,
    cItemId2: 9,
    cItemId3: 10,
  },
  storedItems: {
    sItemId1: 2,
    sItemId2: 3,
  },
  spells: new Set(["spellId1", "spellId2"]),
  prayers: new Set(["prayerId1", "prayerId2"]),
  mutations: new Set(["mutationId1", "mutationId2"]),
  careerPath: [
    { id: "careerId1", number: 1 },
    { id: "careerId2", number: 2 },
  ],
  shared: true,
});

test("apiResponseToModel returns expected item", () => {
  console.log(apiResponseToModel(characterApiResponse));
  expect(apiResponseToModel(characterApiResponse)).toMatchObject(character);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(character)).toMatchObject(characterApiData);
});

testIsEqualCommonProperties("character", character);

test(" isEqualTo returns true when characters have different modifiers", () => {
  const otherCharacter = character.copy();
  otherCharacter.modifiers.mutations = { mutationId: { value: new CharacterModifiers({ size: 1 }) } };
  otherCharacter.modifiers.talents = { talentId: { number: 2, value: new CharacterModifiers({ movement: 1 }) } };
  otherCharacter.modifiers.talents = {
    talentId: {
      number: 2,
      value: new CharacterModifiers({ attributes: getAttributes(SpeciesWithRegion.DwarfAtldorf) }),
    },
  };
  expect(character.isEqualTo(otherCharacter)).toBe(true);
});

describe("isEqualTo returns false", () => {
  test("when other character has different value of species");
  {
    const otherCharacter = character.copy();
    otherCharacter.species = SpeciesWithRegion.HumanAltdorfDocklands;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of fate");
  {
    const otherCharacter = character.copy();
    otherCharacter.fate = 5;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of fortune");
  {
    const otherCharacter = character.copy();
    otherCharacter.fortune = 5;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of resilience");
  {
    const otherCharacter = character.copy();
    otherCharacter.resilience = 5;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of resolve");
  {
    const otherCharacter = character.copy();
    otherCharacter.resolve = 5;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of brass");
  {
    const otherCharacter = character.copy();
    otherCharacter.brass = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of silver");
  {
    const otherCharacter = character.copy();
    otherCharacter.silver = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of gold");
  {
    const otherCharacter = character.copy();
    otherCharacter.gold = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of spentExp");
  {
    const otherCharacter = character.copy();
    otherCharacter.spentExp = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of currentExp");
  {
    const otherCharacter = character.copy();
    otherCharacter.currentExp = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of sin");
  {
    const otherCharacter = character.copy();
    otherCharacter.sin = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of corruption");
  {
    const otherCharacter = character.copy();
    otherCharacter.corruption = 100;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of status");
  {
    const otherCharacter = character.copy();
    otherCharacter.status = StatusTier.Gold;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of standing");
  {
    const otherCharacter = character.copy();
    otherCharacter.standing = 5;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of career level");
  {
    const otherCharacter = character.copy();
    otherCharacter.career.number = 1;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }
  test("when other character has different value of career id");
  {
    const otherCharacter = character.copy();
    otherCharacter.career.id = "otherId";
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  }

  const otherCharacter = character.copy();
  describe.each([
    { name: "attributeRolls", atts: otherCharacter.attributeRolls },
    { name: "attributeAdvances", atts: otherCharacter.attributeAdvances },
  ])(`when other character has different $name`, (t1) => {
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
    ])(`the difference is in $field`, (t2) => {
      const key = t2.field as keyof typeof t1.atts;
      const currentValue = t1.atts[key];
      // const currentValue = t1.atts["zxc" as keyof typeof Attr]
      t1.atts[key] = t2.value;
      expect(character.isEqualTo(otherCharacter)).toBe(false);
      t1.atts[key] = currentValue;
    });
  });

  test.each([
    {
      name: "different id",
      value: {
        skillId1: 4,
        otherId: 5,
      } as Record<string, number>,
    },
    {
      name: "different number",
      value: {
        skillId1: 4,
        skillId2: 7,
      } as Record<string, number>,
    },
    {
      name: "different number of elements",
      value: { skillId1: 4 } as Record<string, number>,
    },
  ])("when other character has a different value of skills ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.skills = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: {
        talentId1: 1,
        otherId: 2,
      } as Record<string, number>,
    },
    {
      name: "different number",
      value: {
        talentId1: 3,
        talentId2: 2,
      } as Record<string, number>,
    },
    {
      name: "different number of elements",
      value: { talentId1: 1 } as Record<string, number>,
    },
  ])("when other character has a different value of talents ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.talents = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "careerId1", number: 1 },
        { id: "otherId", number: 2 },
      ] as IdNumber[],
    },
    {
      name: "different number",
      value: [
        { id: "careerId1", number: 3 },
        { id: "careerId2", number: 2 },
      ] as IdNumber[],
    },
    {
      name: "different number of elements",
      value: [{ id: "careerId1", number: 1 }] as IdNumber[],
    },
  ])("when other character has a different value of careerPath ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.careerPath = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: {
        eItemId1: 7,
        otherID: 7,
      } as Record<string, number>,
    },
    {
      name: "different number",
      value: {
        eItemId1: 7,
        eItemId2: 8,
      } as Record<string, number>,
    },
    {
      name: "different number of elements",
      value: { eItemId1: 7 } as Record<string, number>,
    },
  ])("when other character has a different value of equippedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.equippedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: {
        cItemId1: 8,
        cItemId2: 9,
        otherId: 10,
      } as Record<string, number>,
    },
    {
      name: "different number",
      value: {
        cItemId1: 9,
        cItemId2: 9,
        cItemId3: 10,
      } as Record<string, number>,
    },
    {
      name: "different number of elements",
      value: {
        cItemId1: 8,
        cItemId2: 9,
      } as Record<string, number>,
    },
  ])("when other character has a different value of carriedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.carriedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: {
        sItemId1: 2,
        otherId: 3,
      } as Record<string, number>,
    },
    {
      name: "different number",
      value: {
        sItemId1: 5,
        sItemId2: 3,
      } as Record<string, number>,
    },
    {
      name: "different number of elements",
      value: { sItemId1: 2 } as Record<string, number>,
    },
  ])("when other character has a different value of storedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.storedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: new Set(["spellId1", "otherId"]) },
    { name: "different number of elements", value: new Set(["spellId1"]) },
  ])("when other character has a different value of spells ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.spells = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: new Set(["prayerId1", "otherId"]) },
    { name: "different number of elements", value: new Set(["prayerId1"]) },
  ])("when other character has a different value of prayers ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.prayers = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: new Set(["mutationId1", "otherId"]) },
    { name: "different number of elements", value: new Set(["mutationId1"]) },
  ])("when other character has a different value of mutations ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.mutations = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });
});

describe("getWoundsFormula returns correct value", () => {
  test.each([
    { size: Size.Average, T: 10, WP: 10, S: 10, hardy: 1, expected: 5 }, // 1 + (2 * 1) + 1 + 1
    { size: Size.Average, T: 12, WP: 17, S: 20, hardy: 2, expected: 7 }, // 2 + (2 * 1) + 1 + 2
    { size: Size.Average, T: 21, WP: 26, S: 10, hardy: 0, expected: 7 }, // 1 + (2 * 2) + 2
    { size: Size.Small, T: 20, WP: 10, S: 10, hardy: 0, expected: 5 }, // (2 * 2) + 1
    { size: Size.Little, T: 20, WP: 10, S: 10, hardy: 0, expected: 2 }, // 2
    { size: Size.Tiny, T: 20, WP: 10, S: 10, hardy: 0, expected: 1 }, // 1
    { size: -1, T: 20, WP: 10, S: 10, hardy: 0, expected: 1 }, // 1
    { size: Size.Large, T: 20, WP: 10, S: 10, hardy: 0, expected: 12 }, // 2 * (1 + (2 * 2) + 1)
    { size: Size.Enormous, T: 20, WP: 10, S: 10, hardy: 0, expected: 24 }, // 4 * (1 + (2 * 2) + 1)
    { size: Size.Monstrous, T: 20, WP: 10, S: 10, hardy: 0, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
    { size: 7, T: 20, WP: 10, S: 10, hardy: 0, expected: 48 }, // 8 * (1 + (2 * 2) + 1) },
  ])("when size = $size, T = $T, WP = $WP, S = $S", (t) => {
    expect(getWoundsFormula(t.size, t.T, t.WP, t.S, t.hardy)).toEqual(t.expected);
  });
});

test("getWounds returns correct value", () => {
  const char = character.copy();

  const talent1Attributes = { WS: 0, BS: 0, S: 1, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 0 };
  const talent2Attributes = { WS: 0, BS: 0, S: 0, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  const mut1Attributes = { WS: 0, BS: 0, S: 1, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 0 };
  const mut2Attributes = { WS: 0, BS: 0, S: 2, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  char.modifiers = {
    talents: {
      talent1: { number: 1, value: new CharacterModifiers({ size: -1, attributes: talent1Attributes }) },
      talent2: { number: 2, value: new CharacterModifiers({ attributes: talent2Attributes }) },
    },
    mutations: {
      mutation1: { value: new CharacterModifiers({ attributes: mut1Attributes }) },
      mutation2: { value: new CharacterModifiers({ attributes: mut2Attributes }) },
    },
  };

  char.attributeRolls.T = 3;
  char.attributeAdvances.T = 3;

  char.attributeRolls.WP = 6;
  char.attributeAdvances.WP = 5;

  char.attributeRolls.S = 8;
  char.attributeAdvances.S = 0;

  // Halfling T 30, WP 43, S 22
  char.species = SpeciesWithRegion.HalflingDefault;
  expect(char.getWounds()).toEqual(2 * 3 + 4);
});

describe("getMovement returns correct value", () => {
  test.each([
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifiers: {
        talents: {} as Record<string, { number: number; value: CharacterModifiers }>,
        mutations: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 4,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ movement: 1 }) },
          talent2: { number: 2, value: new CharacterModifiers({ movement: -1 }) },
        },
        mutations: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifiers: {
        talents: {},
        mutations: {
          mutation1: { value: new CharacterModifiers({ movement: -1 }) },
          mutation2: { value: new CharacterModifiers({ movement: 2 }) },
        },
      },
      expected: 5,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 5,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 5,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
      modifiers: {
        talents: {},
        mutations: {},
      },
      expected: 6,
    },
  ])("when speciesWithRegion is $name", (t) => {
    const char = character.copy();
    char.species = t.speciesWithRegion;
    char.modifiers = t.modifiers;
    expect(char.getMovement()).toEqual(t.expected);
  });
});

describe("getSize returns correct value", () => {
  test.each([
    {
      title: "default is 3",
      modifiers: {
        talents: {} as Record<string, { number: number; value: CharacterModifiers }>,
        mutations: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 3,
    },
    {
      title: "modifiers are added correctly",
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ size: 1 }) },
          talent2: { number: 2, value: new CharacterModifiers({ size: -1 }) },
        },
        mutations: {
          mutation1: { value: new CharacterModifiers({ size: 1 }) },
          mutation2: { value: new CharacterModifiers({ size: 2 }) },
        },
      },
      expected: 5, // 3 + 1 - 2*1 + 1 + 2,
    },
    {
      title: "can never be smaller than 0",
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ size: -10 }) },
        },
        mutations: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 0,
    },
    {
      title: "can never be larger than 6",
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ size: 10 }) },
        },
        mutations: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 6,
    },
  ])("$title", (t) => {
    const char = character.copy();
    char.modifiers = t.modifiers;
    expect(char.getSize()).toEqual(t.expected);
  });
});

test("getRacialAttributes returns correct value", () => {
  const char = character.copy();
  // Dwarf
  char.species = SpeciesWithRegion.DwarfDefault;
  expect(char.getRacialAttributes()).toEqual({
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
  const char = character.copy();
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };
  test.each([
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
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
    char.species = t.speciesWithRegion;
    expect(char.getBaseAttributes()).toEqual(t.expected);
  });
});

describe("getTotalAttributes returns correct value", () => {
  const char = character.copy();
  char.attributeRolls = { WS: 12, BS: 1, S: 2, T: 1, I: 2, Ag: 1, Dex: 2, Int: 1, WP: 2, Fel: 0 };

  const talent1Attributes = { WS: 0, BS: 1, S: 0, T: 0, I: 1, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 1 };
  const talent2Attributes = { WS: 1, BS: 1, S: 0, T: 1, I: 1, Ag: 0, Dex: 0, Int: 2, WP: 1, Fel: 0 };

  const mut1Attributes = { WS: 1, BS: 1, S: 1, T: 1, I: 0, Ag: 2, Dex: 1, Int: 0, WP: 0, Fel: 0 };
  const mut2Attributes = { WS: 0, BS: 0, S: 2, T: 1, I: 0, Ag: 2, Dex: 2, Int: 0, WP: 0, Fel: 0 };

  char.modifiers = {
    talents: {
      talent1: { number: 1, value: new CharacterModifiers({ attributes: talent1Attributes }) },
      talent2: { number: 2, value: new CharacterModifiers({ attributes: talent2Attributes }) },
    },
    mutations: {
      mutation1: { value: new CharacterModifiers({ attributes: mut1Attributes }) },
      mutation2: { value: new CharacterModifiers({ attributes: mut2Attributes }) },
    },
  };

  char.attributeAdvances = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 };
  test.each([
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
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
      name: printSpeciesWithRegion(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
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
    char.species = t.speciesWithRegion;
    expect(char.getTotalAttributes()).toEqual(t.expected);
  });
});
