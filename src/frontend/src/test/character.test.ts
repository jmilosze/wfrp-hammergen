import { apiResponseToModel, Character, CharacterApiData, modelToApi } from "../services/wh/character.ts";
import { getWoundsFormula, printSpecies, SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { StatusTier } from "../services/wh/career.ts";
import { ApiResponse } from "../services/wh/common.ts";
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
});

test("apiResponseToModel returns expected item", () => {
  expect(apiResponseToModel(characterApiResponse)).toMatchObject(character);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(character)).toMatchObject(characterApiData);
});

testIsEqualCommonProperties("character", character);

describe("isEqualTo returns true", () => {
  test("when characters have different modifiers", () => {
    const otherCharacter = character.copy();
    otherCharacter.modifiers.size = 1;
    otherCharacter.modifiers.movement = 1;
    otherCharacter.modifiers.attributes.WP = 10;
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  });
  test("when elements of careerPath are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.careerPath = [
      { id: "careerId2", number: 2 },
      { id: "careerId1", number: 1 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of skills are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.skills = [
      { id: "skillId2", number: 5 },
      { id: "skillId1", number: 4 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of talents are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.talents = [
      { id: "talentId2", number: 2 },
      { id: "talentId1", number: 1 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of equippedItems are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.equippedItems = [
      { id: "eItemId2", number: 7 },
      { id: "eItemId1", number: 7 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of carriedItems are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.carriedItems = [
      { id: "cItemId3", number: 10 },
      { id: "cItemId1", number: 8 },
      { id: "cItemId2", number: 9 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of storedItems are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.storedItems = [
      { id: "sItemId2", number: 3 },
      { id: "sItemId1", number: 2 },
    ];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of spells are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.spells = ["spellId2", "spellId1"];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of prayers are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.prayers = ["prayerId2", "prayerId1"];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
  test("when elements of mutations are in different order");
  {
    const otherCharacter = character.copy();
    otherCharacter.mutations = ["mutationId2", "mutationId1"];
    expect(character.isEqualTo(otherCharacter)).toBe(true);
  }
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
      const currentValue = t1.atts[t2.field];
      t1.atts[t2.field] = t2.value;
      expect(character.isEqualTo(otherCharacter)).toBe(false);
      t1.atts[t2.field] = currentValue;
    });
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "skillId1", number: 4 },
        { id: "otherId", number: 5 },
      ],
    },
    {
      name: "different number",
      value: [
        { id: "skillId1", number: 4 },
        { id: "skillId2", number: 7 },
      ],
    },
    {
      name: "different number of elements",
      value: [{ id: "skillId1", number: 4 }],
    },
  ])("when other character has a different value of skills ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.skills = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "talentId1", number: 1 },
        { id: "otherId", number: 2 },
      ],
    },
    {
      name: "different number",
      value: [
        { id: "talentId1", number: 3 },
        { id: "talentId2", number: 2 },
      ],
    },
    {
      name: "different number of elements",
      value: [{ id: "talentId1", number: 1 }],
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
      ],
    },
    {
      name: "different number",
      value: [
        { id: "careerId1", number: 3 },
        { id: "careerId2", number: 2 },
      ],
    },
    {
      name: "different number of elements",
      value: [{ id: "careerId1", number: 1 }],
    },
  ])("when other character has a different value of careerPath ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.careerPath = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "eItemId1", number: 7 },
        { id: "otherID", number: 7 },
      ],
    },
    {
      name: "different number",
      value: [
        { id: "eItemId1", number: 7 },
        { id: "eItemId2", number: 8 },
      ],
    },
    {
      name: "different number of elements",
      value: [{ id: "eItemId1", number: 7 }],
    },
  ])("when other character has a different value of equippedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.equippedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "cItemId1", number: 8 },
        { id: "cItemId2", number: 9 },
        { id: "otherId", number: 10 },
      ],
    },
    {
      name: "different number",
      value: [
        { id: "cItemId1", number: 9 },
        { id: "cItemId2", number: 9 },
        { id: "cItemId3", number: 10 },
      ],
    },
    {
      name: "different number of elements",
      value: [
        { id: "cItemId1", number: 8 },
        { id: "cItemId2", number: 9 },
      ],
    },
  ])("when other character has a different value of carriedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.carriedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    {
      name: "different id",
      value: [
        { id: "sItemId1", number: 2 },
        { id: "otherId", number: 3 },
      ],
    },
    {
      name: "different number",
      value: [
        { id: "sItemId1", number: 5 },
        { id: "sItemId2", number: 3 },
      ],
    },
    {
      name: "different number of elements",
      value: [{ id: "sItemId1", number: 2 }],
    },
  ])("when other character has a different value of storedItems ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.storedItems = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: ["spellId1", "otherId"] },
    { name: "different number of elements", value: ["spellId1"] },
  ])("when other character has a different value of spells ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.spells = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: ["prayerId1", "otherId"] },
    { name: "different number of elements", value: ["prayerId1"] },
  ])("when other character has a different value of prayers ($name)", (t) => {
    const otherCharacter = character.copy();
    otherCharacter.prayers = t.value;
    expect(character.isEqualTo(otherCharacter)).toBe(false);
  });

  test.each([
    { name: "different value", value: ["mutationId1", "otherId"] },
    { name: "different number of elements", value: ["mutationId1"] },
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
  char.modifiers.attributes.T = 2;

  char.attributeRolls.WP = 6;
  char.attributeAdvances.WP = 5;
  char.modifiers.attributes.WP = 2;

  char.attributeRolls.S = 10;
  char.attributeAdvances.S = 0;
  char.modifiers.attributes.S = 2;

  // Halfling T 30, WP 43, S 22
  char.species = SpeciesWithRegion.HalflingDefault;
  char.modifiers.size = -1;
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
    char.modifiers.movement = t.modifier;
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
