import { describe, expect, test } from "vitest";
import {
  classTrappingEntries,
  generateCareerCoins,
  generateCareerItems,
  generateClassItems,
  populateClassItems,
  rollCareerTrappings,
  rollClassTrappings,
} from "./trappings.ts";
import { Career, copyCareerLevel, zeroCareerLevel } from "@/services/wh/content/career.ts";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import { CareerMoney, CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { getRollDiceTest, getSelectRandomTest } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GenerationProps } from "./generationProps.ts";
import { Character } from "@/services/wh/character/character.ts";

describe("generateClassItems", () => {
  const dummyGenProps: GenerationProps = {
    classItems: {
      0: {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    },
    randomTalents: [],
    speciesTalents: { [SpeciesWithRegion.HumanReikland]: [] },
    speciesSkills: {},
  };

  test("generateClassItems returns items for valid career class", () => {
    const career = new Career({ careerClass: 0 });
    const result = generateClassItems(career, dummyGenProps, () => 5);
    expect(result).toEqual([
      { id: "item1", number: 1, value: "" },
      { id: "item2", number: 2, value: "" },
      { id: "item3", number: 5, value: "" },
    ]);
  });

  test("classTrappingEntries lists the choices of the class trappings", () => {
    const career = new Career({ careerClass: 0 });
    const props = {
      ...dummyGenProps,
      classItems: { 0: { equipped: { "hood,mask": "1" }, carried: { match: "1d10" } } },
    };
    expect(classTrappingEntries(career, props)).toEqual([
      { options: ["hood", "mask"], number: "1" },
      { options: ["match"], number: "1d10" },
    ]);
    expect(classTrappingEntries(new Career({ careerClass: 1 }), props)).toEqual([]);
  });

  test("rollClassTrappings gives the chosen options with quantities rolled", () => {
    const entries = [
      { options: ["hood", "mask"], number: "1" },
      { options: ["match"], number: "1d10" },
      { options: ["mask"], number: "1" },
    ];
    expect(rollClassTrappings(entries, [1, 0, 0], () => 4)).toEqual([
      { id: "mask", number: 2, value: "" },
      { id: "match", number: 4, value: "" },
    ]);
  });
});

describe("populateClassItems", () => {
  const dummyGenProps: GenerationProps = {
    classItems: {
      0: {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    },
    randomTalents: [
      { id: "rand1", minRoll: 1, maxRoll: 50 },
      { id: "rand2", minRoll: 50, maxRoll: 101 },
    ],
    speciesTalents: {
      [SpeciesWithRegion.HumanReikland]: ["talent1", "talent2"],
    },
    speciesSkills: {
      [SpeciesWithRegion.HumanReikland]: ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
    },
  };

  test("populateClassItems fills up the carried trappings without a value", () => {
    const career = new Career({ id: "c1", careerClass: 0 });
    const char = new Character({
      career: { id: "c1", number: 1 },
      carriedItems: [
        { id: "item1", number: 1, value: "Axe" },
        { id: "item2", number: 5, value: "" },
      ],
    });

    populateClassItems(char, [career], dummyGenProps, () => 3);
    expect(char.equippedItems).toEqual([]);
    expect(char.carriedItems).toEqual([
      { id: "item1", number: 1, value: "Axe" },
      { id: "item2", number: 5, value: "" },
      { id: "item1", number: 1, value: "" },
      { id: "item3", number: 3, value: "" },
    ]);
  });
});

describe("career trappings and money", () => {
  const items = [
    new Item({ id: "bow", name: "Bow", type: ItemType.Ranged }),
    new Item({ id: "arrow", name: "Arrow", type: ItemType.Ammunition }),
    new Item({ id: "weapon", name: "Hand Weapon", type: ItemType.Melee }),
    // An Other item is neither carried nor worn, e.g. a place or a retainer.
    new Item({ id: "command", name: "Command", type: ItemType.Other }),
  ];
  const one = (id: string, number = "1", value = "") => ({ id: id, number: number, value: value });
  const got = (id: string, number: number, value = "") => ({ id: id, number: number, value: value });
  const level = (trappings: CareerTrappingEntry[], money: CareerMoney[] = []) => ({
    ...copyCareerLevel(zeroCareerLevel),
    exists: true,
    trappings: trappings,
    money: money,
  });
  const career = new Career({
    level1: level(
      [{ options: [[one("weapon", "1", "Sickle")]] }, { options: [[one("bow"), one("arrow", "10")], [one("weapon")]] }],
      [{ coin: "silver", number: "2d10+1" }],
    ),
    level2: level(
      [{ options: [[one("arrow", "1d10")]] }, { options: [[one("command", "1", "Crew of Miners")]] }],
      [{ coin: "gold", number: "20" }],
    ),
    level3: level([{ options: [[one("unknown")]] }]),
  });

  test("gives one option of each entry, rolls quantities and keeps notes as values", () => {
    const result = generateCareerItems(career, 1, items, getRollDiceTest(4), getSelectRandomTest(0));
    expect(result).toEqual({
      carried: [got("weapon", 1, "Sickle"), got("bow", 1), got("arrow", 10)],
      stored: [],
    });
  });

  test("gives the trappings of every level up to the character's; what can't be carried is stored", () => {
    const result = generateCareerItems(career, 3, items, getRollDiceTest(4), getSelectRandomTest(1));
    expect(result).toEqual({
      carried: [
        { id: "weapon", number: 1, value: "Sickle" },
        { id: "weapon", number: 1, value: "" },
        { id: "arrow", number: 4, value: "" },
      ],
      stored: [{ id: "command", number: 1, value: "Crew of Miners" }],
    });
  });

  test("rollCareerTrappings gives the chosen option of each entry", () => {
    const result = rollCareerTrappings(career.level1.trappings, [0, 1], items, getRollDiceTest(4));
    expect(result).toEqual({ carried: [got("weapon", 1, "Sickle"), got("weapon", 1)], stored: [] });
  });

  test("leaves out a trapping whose roll is below 1", () => {
    const withModifier = new Career({ level1: level([{ options: [[one("arrow", "1d6-3")]] }]) });
    expect(generateCareerItems(withModifier, 1, items, getRollDiceTest(2)).carried).toEqual([]);
    expect(generateCareerItems(withModifier, 1, items, getRollDiceTest(5)).carried).toEqual([got("arrow", 2)]);
  });

  test("rolls the money of every level up to the character's into brass, silver and gold", () => {
    expect(generateCareerCoins(career, 1, getRollDiceTest(7))).toEqual([0, 8, 0]);
    expect(generateCareerCoins(career, 2, getRollDiceTest(7))).toEqual([0, 8, 20]);
  });
});
