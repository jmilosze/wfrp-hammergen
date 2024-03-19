import { apiResponseToModel, Character, CharacterApiData, modelToApi } from "../services/wh/character.ts";
import { getWoundsFormula, printSpecies, SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { StatusTier } from "../services/wh/career.ts";
import { ApiResponse, IdNumber } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

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
    skillId1: { id: "skillId1", number: 4 },
    skillId2: { id: "skillId2", number: 5 },
  },
  talents: {
    talentId1: {
      id: "talentId1",
      number: 1,
    },
    talentId2: {
      id: "talentId2",
      number: 2,
    },
  },
  equippedItems: {
    eItemId1: { id: "eItemId1", number: 7 },
    eItemId2: { id: "eItemId2", number: 7 },
  },
  carriedItems: {
    cItemId1: { id: "cItemId1", number: 8 },
    cItemId2: { id: "cItemId2", number: 9 },
    cItemId3: { id: "cItemId3", number: 10 },
  },
  storedItems: {
    sItemId1: { id: "sItemId1", number: 2 },
    sItemId2: { id: "sItemId2", number: 3 },
  },
  spells: new Set(["spellId1", "spellId2"]),
  prayers: new Set(["prayerId1", "prayerId2"]),
  mutations: new Set(["mutationId1", "mutationId2"]),
  careerPath: {
    careerId1: { id: "careerId1", number: 1 },
    careerId2: { id: "careerId2", number: 2 },
  },
  shared: true,
});

test("apiResponseToModel returns expected item", () => {
  expect(apiResponseToModel(characterApiResponse)).toMatchObject(character);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(character)).toMatchObject(characterApiData);
});

testIsEqualCommonProperties("character", character);

test(" isEqualTo returns true when characters have different modifiers", () => {
  const otherCharacter = character.copy();
  otherCharacter.modifiers.mutations.size = 1;
  otherCharacter.modifiers.talents.movement = 1;
  otherCharacter.modifiers.talents.attributes.WP = 10;
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
        skillId1: { id: "skillId1", number: 4 },
        otherId: { id: "otherId", number: 5 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        skillId1: { id: "skillId1", number: 4 },
        skillId2: { id: "skillId2", number: 7 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: { skillId1: { id: "skillId1", number: 4 } } as Record<string, IdNumber>,
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
        talentId1: { id: "talentId1", number: 1 },
        otherId: { id: "otherId", number: 2 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        talentId1: { id: "talentId1", number: 3 },
        talentId2: { id: "talentId2", number: 2 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: { talentId1: { id: "talentId1", number: 1 } } as Record<string, IdNumber>,
    },
  ])("when other character has a different value of talents ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.talents = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: {
        careerId1: { id: "careerId1", number: 1 },
        otherId: { id: "otherId", number: 2 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        careerId1: { id: "careerId1", number: 3 },
        careerId2: { id: "careerId2", number: 2 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: { careerId1: { id: "careerId1", number: 1 } } as Record<string, IdNumber>,
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
        eItemId1: { id: "eItemId1", number: 7 },
        otherID: { id: "otherID", number: 7 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        eItemId1: { id: "eItemId1", number: 7 },
        eItemId2: { id: "eItemId2", number: 8 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: { eItemId1: { id: "eItemId1", number: 7 } } as Record<string, IdNumber>,
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
        cItemId1: { id: "cItemId1", number: 8 },
        cItemId2: { id: "cItemId2", number: 9 },
        otherId: { id: "otherId", number: 10 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        cItemId1: { id: "cItemId1", number: 9 },
        cItemId2: { id: "cItemId2", number: 9 },
        cItemId3: { id: "cItemId3", number: 10 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: {
        cItemId1: { id: "cItemId1", number: 8 },
        cItemId2: { id: "cItemId2", number: 9 },
      } as Record<string, IdNumber>,
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
        sItemId1: { id: "sItemId1", number: 2 },
        otherId: { id: "otherId", number: 3 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number",
      value: {
        sItemId1: { id: "sItemId1", number: 5 },
        sItemId2: { id: "sItemId2", number: 3 },
      } as Record<string, IdNumber>,
    },
    {
      name: "different number of elements",
      value: { sItemId1: { id: "sItemId1", number: 2 } } as Record<string, IdNumber>,
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
  const char = character.copy();

  char.attributeRolls.T = 5;
  char.attributeAdvances.T = 3;
  char.modifiers.talents.attributes.T = 1;
  char.modifiers.mutations.attributes.T = 1;

  char.attributeRolls.WP = 6;
  char.attributeAdvances.WP = 5;
  char.modifiers.talents.attributes.WP = 1;
  char.modifiers.mutations.attributes.WP = 1;

  char.attributeRolls.S = 10;
  char.attributeAdvances.S = 0;
  char.modifiers.talents.attributes.S = 1;
  char.modifiers.mutations.attributes.S = 1;

  // Halfling T 30, WP 43, S 22
  char.species = SpeciesWithRegion.HalflingDefault;
  char.modifiers.talents.size = -1;
  expect(char.getWounds()).toEqual(2 * 3 + 4);
});

describe("getMovement returns correct value", () => {
  test.each([
    {
      name: printSpecies(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifier: 0,
      expected: 4,
    },
    {
      name: printSpecies(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifier: -1,
      expected: 3,
    },
    {
      name: printSpecies(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifier: 1,
      expected: 5,
    },
    {
      name: printSpecies(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
      modifier: 0,
      expected: 3,
    },
    {
      name: printSpecies(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
      modifier: 0,
      expected: 3,
    },
    {
      name: printSpecies(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
      modifier: 0,
      expected: 5,
    },
    {
      name: printSpecies(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
      modifier: 0,
      expected: 5,
    },
    {
      name: printSpecies(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
      modifier: 0,
      expected: 3,
    },
    {
      name: printSpecies(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
      modifier: 0,
      expected: 6,
    },
  ])("when speciesWithRegion is $name and modifier is $modifier", (t) => {
    const char = character.copy();
    char.species = t.speciesWithRegion;
    char.modifiers.talents.movement = t.modifier;
    expect(char.getMovement()).toEqual(t.expected);
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
      name: printSpecies(SpeciesWithRegion.HumanReikland),
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
      name: printSpecies(SpeciesWithRegion.HalflingDefault),
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
      name: printSpecies(SpeciesWithRegion.DwarfDefault),
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
      name: printSpecies(SpeciesWithRegion.HighElfDefault),
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
      name: printSpecies(SpeciesWithRegion.WoodElfDefault),
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
      name: printSpecies(SpeciesWithRegion.GnomeDefault),
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
      name: printSpecies(SpeciesWithRegion.OgreDefault),
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
  char.modifiers.mutations.attributes = { WS: 3, BS: 4, S: 3, T: 4, I: 3, Ag: 4, Dex: 3, Int: 4, WP: 3, Fel: 1 };
  char.attributeAdvances = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 };
  test.each([
    {
      name: printSpecies(SpeciesWithRegion.HumanReikland),
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
      name: printSpecies(SpeciesWithRegion.HalflingDefault),
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
      name: printSpecies(SpeciesWithRegion.DwarfDefault),
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
      name: printSpecies(SpeciesWithRegion.HighElfDefault),
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
      name: printSpecies(SpeciesWithRegion.WoodElfDefault),
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
      name: printSpecies(SpeciesWithRegion.GnomeDefault),
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
      name: printSpecies(SpeciesWithRegion.OgreDefault),
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
