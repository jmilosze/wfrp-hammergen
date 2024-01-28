import { apiResponseToModel, Character, CharacterApiData, modelToApi } from "../services/wh/character.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
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
});
