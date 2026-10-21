import { apiResponseToModel, Character, CharacterApiData, modelToApi } from "./character.ts";
import { printSpeciesWithRegion, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Size } from "./size.ts";
import { StatusTier } from "@/services/wh/content/career.ts";
import { CharacterApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualTo } from "@/testing.ts";
import { CharacterModifiers } from "@/services/wh/core/characterModifiers.ts";
import { Trait } from "@/services/wh/content/trait.ts";

const characterApiData: CharacterApiData = {
  edition: "4e",
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
  careerTicks: 0,
  allow4e: false,
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
    { id: "eItemId1", number: 7, value: "" },
    { id: "eItemId1", number: 1, value: "Axe" },
    { id: "eItemId2", number: 7, value: "" },
  ],
  carriedItems: [
    { id: "cItemId1", number: 8, value: "" },
    { id: "cItemId2", number: 9, value: "" },
    { id: "cItemId3", number: 10, value: "" },
  ],
  storedItems: [
    { id: "sItemId1", number: 2, value: "" },
    { id: "sItemId2", number: 3, value: "" },
  ],
  spells: ["spellId1", "spellId2"],
  prayers: ["prayerId1", "prayerId2"],
  traits: [
    { id: "traitId1", value: "Elves" },
    { id: "traitId2", value: "" },
  ],
  mutations: ["mutationId1", "mutationId2"],
  careerPath: [
    { id: "careerId1", number: 1 },
    { id: "careerId2", number: 2 },
  ],
  visibility: Visibility.Shared,
};

const characterApiResponse: CharacterApiResponse<CharacterApiData> = {
  id: "id",
  ownerId: "owner",
  modifiedOn: "2026-10-11T10:00:00Z",
  visibility: Visibility.Shared,
  object: characterApiData,
};

const character = new Character({
  id: "id",
  ownerId: "owner",
  modifiedOn: "2026-10-11T10:00:00Z",
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
  careerTicks: 0,
  allow4e: false,
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
  equippedItems: [
    { id: "eItemId1", number: 7, value: "" },
    { id: "eItemId1", number: 1, value: "Axe" },
    { id: "eItemId2", number: 7, value: "" },
  ],
  carriedItems: [
    { id: "cItemId1", number: 8, value: "" },
    { id: "cItemId2", number: 9, value: "" },
    { id: "cItemId3", number: 10, value: "" },
  ],
  storedItems: [
    { id: "sItemId1", number: 2, value: "" },
    { id: "sItemId2", number: 3, value: "" },
  ],
  spells: new Set(["spellId1", "spellId2"]),
  prayers: new Set(["prayerId1", "prayerId2"]),
  traits: [
    { id: "traitId1", value: "Elves" },
    { id: "traitId2", value: "" },
  ],
  mutations: new Set(["mutationId1", "mutationId2"]),
  careerPath: [
    { id: "careerId1", number: 1 },
    { id: "careerId2", number: 2 },
  ],
  visibility: Visibility.Shared,
});

test("apiResponseToModel returns expected item", () => {
  expect(apiResponseToModel(characterApiResponse)).toMatchObject(character);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(character)).toMatchObject(characterApiData);
});

// The modifiers come from the character's talents, mutations and traits, so they don't count.
testIsEqualTo("character", character, {
  ignored: ["modifiers"],
  unordered: ["careerPath", "equippedItems", "carriedItems", "storedItems"],
});

test("updateCurrentCareer sets the current career and clears it when unselected", () => {
  const otherCharacter = character.copy();
  otherCharacter.updateCurrentCareer("careerId1", 2, true);
  expect(otherCharacter.career).toEqual({ id: "careerId1", number: 2 });
  otherCharacter.updateCurrentCareer("careerId1", 2, false);
  expect(otherCharacter.career).toBeUndefined();
});

test("getWounds returns correct value", () => {
  const char = character.copy();

  const talent1Attributes = { WS: 0, BS: 0, S: 1, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 0 };
  const talent2Attributes = { WS: 0, BS: 0, S: 0, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  const mut1Attributes = { WS: 0, BS: 0, S: 1, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 0 };
  const mut2Attributes = { WS: 0, BS: 0, S: 2, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  const trait1Attributes = { WS: 0, BS: 0, S: 1, T: 1, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 1, Fel: 0 };
  const trait2Attributes = { WS: 0, BS: 0, S: 2, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  char.modifiers = {
    talents: {
      talent1: { number: 1, value: new CharacterModifiers({ size: -1, attributes: talent1Attributes }) },
      talent2: { number: 2, value: new CharacterModifiers({ attributes: talent2Attributes }) },
    },
    mutations: {
      mutation1: { value: new CharacterModifiers({ attributes: mut1Attributes }) },
      mutation2: { value: new CharacterModifiers({ attributes: mut2Attributes }) },
    },
    traits: {
      trait1: { value: new CharacterModifiers({ attributes: trait1Attributes }) },
      trait2: { value: new CharacterModifiers({ attributes: trait2Attributes }) },
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
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ movement: -100 }) },
        },
        mutations: {} as Record<string, { value: CharacterModifiers }>,
        traits: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 0,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      modifiers: {
        talents: {} as Record<string, { number: number; value: CharacterModifiers }>,
        mutations: {} as Record<string, { value: CharacterModifiers }>,
        traits: {} as Record<string, { value: CharacterModifiers }>,
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
        traits: {},
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
        traits: {
          trait1: { value: new CharacterModifiers({ movement: -1 }) },
          trait2: { value: new CharacterModifiers({ movement: 2 }) },
        },
      },
      expected: 6,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
      },
      expected: 5,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
      },
      expected: 5,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
      },
      expected: 3,
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
      modifiers: {
        talents: {},
        mutations: {},
        traits: {},
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
        traits: {} as Record<string, { value: CharacterModifiers }>,
      },
      expected: 3,
    },
    {
      title: "modifiers are added correctly",
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ size: 1 }) },
          talent2: { number: 2, value: new CharacterModifiers({ size: -2 }) },
        },
        mutations: {
          mutation1: { value: new CharacterModifiers({ size: 1 }) },
          mutation2: { value: new CharacterModifiers({ size: 2 }) },
        },
        traits: {
          trait1: { value: new CharacterModifiers({ size: 1 }) },
          trait2: { value: new CharacterModifiers({ size: 0 }) },
        },
      },
      expected: 4, // 3 + 1 - 2*2 + 1 + 2 + 1 + 0,
    },
    {
      title: "can never be smaller than 0",
      modifiers: {
        talents: {
          talent1: { number: 1, value: new CharacterModifiers({ size: -10 }) },
        },
        mutations: {} as Record<string, { value: CharacterModifiers }>,
        traits: {} as Record<string, { value: CharacterModifiers }>,
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
        traits: {} as Record<string, { value: CharacterModifiers }>,
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

  const trait1Attributes = { WS: 1, BS: 1, S: 1, T: 1, I: 0, Ag: 2, Dex: 1, Int: 0, WP: 0, Fel: 0 };
  const trait2Attributes = { WS: 0, BS: 0, S: 2, T: 1, I: 0, Ag: 2, Dex: 2, Int: 0, WP: 0, Fel: 0 };

  char.modifiers = {
    talents: {
      talent1: { number: 1, value: new CharacterModifiers({ attributes: talent1Attributes }) },
      talent2: { number: 2, value: new CharacterModifiers({ attributes: talent2Attributes }) },
    },
    mutations: {
      mutation1: { value: new CharacterModifiers({ attributes: mut1Attributes }) },
      mutation2: { value: new CharacterModifiers({ attributes: mut2Attributes }) },
    },
    traits: {
      mutation1: { value: new CharacterModifiers({ attributes: trait1Attributes }) },
      mutation2: { value: new CharacterModifiers({ attributes: trait2Attributes }) },
    },
  };

  char.attributeAdvances = { WS: 1, BS: 2, S: 3, T: 4, I: 5, Ag: 6, Dex: 7, Int: 8, WP: 9, Fel: 10 };
  test.each([
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HumanReikland),
      speciesWithRegion: SpeciesWithRegion.HumanReikland,
      expected: {
        WS: 20 + 17,
        BS: 20 + 8,
        S: 20 + 11,
        T: 20 + 11,
        I: 20 + 10,
        Ag: 20 + 15,
        Dex: 20 + 15,
        Int: 20 + 13,
        WP: 20 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HalflingDefault),
      speciesWithRegion: SpeciesWithRegion.HalflingDefault,
      expected: {
        WS: 10 + 17,
        BS: 30 + 8,
        S: 10 + 11,
        T: 20 + 11,
        I: 20 + 10,
        Ag: 20 + 15,
        Dex: 30 + 15,
        Int: 20 + 13,
        WP: 30 + 14,
        Fel: 30 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.DwarfDefault),
      speciesWithRegion: SpeciesWithRegion.DwarfDefault,
      expected: {
        WS: 30 + 17,
        BS: 20 + 8,
        S: 20 + 11,
        T: 30 + 11,
        I: 20 + 10,
        Ag: 10 + 15,
        Dex: 30 + 15,
        Int: 20 + 13,
        WP: 40 + 14,
        Fel: 10 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.HighElfDefault),
      speciesWithRegion: SpeciesWithRegion.HighElfDefault,
      expected: {
        WS: 30 + 17,
        BS: 30 + 8,
        S: 20 + 11,
        T: 20 + 11,
        I: 40 + 10,
        Ag: 30 + 15,
        Dex: 30 + 15,
        Int: 30 + 13,
        WP: 30 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.WoodElfDefault),
      speciesWithRegion: SpeciesWithRegion.WoodElfDefault,
      expected: {
        WS: 30 + 17,
        BS: 30 + 8,
        S: 20 + 11,
        T: 20 + 11,
        I: 40 + 10,
        Ag: 30 + 15,
        Dex: 30 + 15,
        Int: 30 + 13,
        WP: 30 + 14,
        Fel: 20 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.GnomeDefault),
      speciesWithRegion: SpeciesWithRegion.GnomeDefault,
      expected: {
        WS: 20 + 17,
        BS: 10 + 8,
        S: 10 + 11,
        T: 15 + 11,
        I: 30 + 10,
        Ag: 30 + 15,
        Dex: 30 + 15,
        Int: 30 + 13,
        WP: 40 + 14,
        Fel: 15 + 11,
      },
    },
    {
      name: printSpeciesWithRegion(SpeciesWithRegion.OgreDefault),
      speciesWithRegion: SpeciesWithRegion.OgreDefault,
      expected: {
        WS: 20 + 17,
        BS: 10 + 8,
        S: 35 + 11,
        T: 35 + 11,
        I: 0 + 10,
        Ag: 15 + 15,
        Dex: 10 + 15,
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

describe("Character currency validation", () => {
  test("validateBrass returns valid for valid integers between 0 and 1,000,000", () => {
    const char = character.copy();
    char.brass = 0;
    expect(char.validateBrass().valid).toBe(true);

    char.brass = 500;
    expect(char.validateBrass().valid).toBe(true);

    char.brass = 1000000;
    expect(char.validateBrass().valid).toBe(true);
  });

  test("validateBrass returns invalid for numbers outside range or non-integers", () => {
    const char = character.copy();
    char.brass = -1;
    expect(char.validateBrass().valid).toBe(false);

    char.brass = 1000001;
    expect(char.validateBrass().valid).toBe(false);

    char.brass = 5.5;
    expect(char.validateBrass().valid).toBe(false);
  });

  test("validateSilver returns valid for valid integers between 0 and 1,000,000", () => {
    const char = character.copy();
    char.silver = 0;
    expect(char.validateSilver().valid).toBe(true);

    char.silver = 1000000;
    expect(char.validateSilver().valid).toBe(true);
  });

  test("validateSilver returns invalid for numbers outside range or non-integers", () => {
    const char = character.copy();
    char.silver = -1;
    expect(char.validateSilver().valid).toBe(false);

    char.silver = 1000001;
    expect(char.validateSilver().valid).toBe(false);
  });

  test("validateGold returns valid for valid integers between 0 and 1,000,000", () => {
    const char = character.copy();
    char.gold = 0;
    expect(char.validateGold().valid).toBe(true);

    char.gold = 1000000;
    expect(char.validateGold().valid).toBe(true);
  });

  test("validateGold returns invalid for numbers outside range or non-integers", () => {
    const char = character.copy();
    char.gold = -1;
    expect(char.validateGold().valid).toBe(false);

    char.gold = 1000001;
    expect(char.validateGold().valid).toBe(false);
  });

  test("isValid enforces brass, silver, and gold validity", () => {
    const char = character.copy();
    expect(char.isValid()).toBe(true);

    char.brass = -1;
    expect(char.isValid()).toBe(false);

    char.brass = 12;
    char.silver = -5;
    expect(char.isValid()).toBe(false);

    char.silver = 5;
    char.gold = -1;
    expect(char.isValid()).toBe(false);
  });
});

describe("Character traits", () => {
  const traits = [
    new Trait({ id: "hatred", hasValue: true }),
    new Trait({ id: "large", modifiers: new CharacterModifiers({ size: 1 }) }),
  ];

  test("addTrait adds a trait that takes a value more than once and counts its modifiers once", () => {
    const character = new Character();
    character.addTrait("hatred", traits);
    character.addTrait("hatred", traits);
    character.updateTraitValue(0, "Elves");
    character.updateTraitValue(1, "Dwarfs");
    expect(character.traits).toEqual([
      { id: "hatred", value: "Elves" },
      { id: "hatred", value: "Dwarfs" },
    ]);
    expect(Object.keys(character.modifiers.traits)).toEqual(["hatred"]);
  });

  test("removeTrait keeps the modifiers while the trait is still on the character", () => {
    const character = new Character();
    character.addTrait("large", traits);
    character.addTrait("large", traits);
    character.removeTrait(0);
    expect(character.getSize()).toBe(Size.Large);
    character.removeTrait(0);
    expect(character.traits).toEqual([]);
    expect(character.getSize()).toBe(Size.Average);
  });

  test("updateTraits adds a trait once and removes every occurrence", () => {
    const character = new Character();
    character.updateTraits("large", true, traits);
    character.updateTraits("large", true, traits);
    expect(character.traits).toEqual([{ id: "large", value: "" }]);
    expect(character.getSize()).toBe(Size.Large);

    character.addTrait("hatred", traits);
    character.addTrait("hatred", traits);
    character.updateTraits("hatred", false, traits);
    expect(character.traits).toEqual([{ id: "large", value: "" }]);
  });

  test("validateTraits rejects a value that is too long", () => {
    const character = new Character();
    character.addTrait("hatred", traits);
    expect(character.validateTraits().valid).toBe(true);
    character.updateTraitValue(0, "a".repeat(21));
    expect(character.validateTraits().valid).toBe(false);
    expect(character.isValid()).toBe(false);
  });
});

describe("Character trappings", () => {
  test("addItem adds a new row of one without a value each time", () => {
    const character = new Character({ carriedItems: [{ id: "agurk", number: 2, value: "Axe" }] });
    character.addItem("carried", "agurk");
    character.addItem("carried", "agurk");
    expect(character.carriedItems).toEqual([
      { id: "agurk", number: 2, value: "Axe" },
      { id: "agurk", number: 1, value: "" },
      { id: "agurk", number: 1, value: "" },
    ]);
  });

  test("updateItem changes the number and value of one entry and removes it at 0", () => {
    const character = new Character({ carriedItems: [{ id: "hw", number: 2, value: "" }] });
    character.updateItem("carried", 0, { value: "Axe" });
    character.updateItem("carried", 0, { number: 3 });
    expect(character.carriedItems).toEqual([{ id: "hw", number: 3, value: "Axe" }]);
    character.updateItem("carried", 0, { number: 0 });
    expect(character.carriedItems).toEqual([]);
  });

  test("moveItem moves one, keeps the value and joins an entry with the same value", () => {
    const character = new Character({
      carriedItems: [{ id: "hw", number: 2, value: "Axe" }],
      equippedItems: [{ id: "hw", number: 1, value: "Axe" }],
    });
    character.moveItem("carried", 0, "equipped");
    expect(character.carriedItems).toEqual([{ id: "hw", number: 1, value: "Axe" }]);
    expect(character.equippedItems).toEqual([{ id: "hw", number: 2, value: "Axe" }]);
    character.moveItem("carried", 0, "stored");
    expect(character.carriedItems).toEqual([]);
    expect(character.storedItems).toEqual([{ id: "hw", number: 1, value: "Axe" }]);
  });

  test("modelToApi and apiResponseToModel keep identical rows apart", () => {
    const rows = [
      { id: "agurk", number: 1, value: "" },
      { id: "agurk", number: 1, value: "" },
      { id: "agurk", number: 3, value: "Axe" },
    ];
    const character = new Character({ carriedItems: rows.map((x) => ({ ...x })) });
    const apiData = modelToApi(character);
    expect(apiData.carriedItems).toEqual(rows);
    expect(apiResponseToModel({ ...characterApiResponse, object: apiData }).carriedItems).toEqual(rows);
  });

  test("validation checks numbers and values of 40 characters at most", () => {
    const character = new Character({ storedItems: [{ id: "hw", number: 1, value: "a".repeat(40) }] });
    expect(character.validateStoredItems().valid).toBe(true);
    character.storedItems[0].value = "a".repeat(41);
    expect(character.validateStoredItems().valid).toBe(false);
    character.storedItems[0].value = "<b>";
    expect(character.validateStoredItems().valid).toBe(false);
    character.storedItems[0].value = "";
    character.storedItems[0].number = 0;
    expect(character.validateStoredItems().valid).toBe(false);
  });
});
