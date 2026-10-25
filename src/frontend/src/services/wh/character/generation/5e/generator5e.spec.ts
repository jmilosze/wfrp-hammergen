import { sumValues, testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { genProps5e, testSkills5e, testTalents5e } from "./fixtures5e.ts";
import { describe, expect, test } from "vitest";
import { zeroAttributes } from "@/services/wh/core/attributes.ts";
import { StatusTier } from "@/services/wh/content/career.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { generateCharacter5e } from "./generator5e.ts";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import { Talent } from "@/services/wh/content/talent.ts";

describe("generateCharacter5e", () => {
  const context = {
    species: SpeciesWithRegion.HumanReikland,
    career: testCareer(),
    skills: testSkills5e,
    talents: testTalents5e,
    items: [],
    generationProps: genProps5e,
  };

  test("level 1 character", () => {
    for (let i = 0; i < 20; ++i) {
      const character = generateCharacter5e({ ...context, level: 1 });
      expect(character.edition).toBe("5e");
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.description.length).toBeGreaterThan(0);
      expect(character.career).toEqual({ id: "career1", number: 1 });
      expect(character.careerPath).toEqual([]);
      expect(character.fate).toBe(4);
      expect(character.fortune).toBe(3);
      expect(character.status).toBe(StatusTier.Brass);
      expect(character.standing).toBe(3);
      expect(character.brass).toBeGreaterThanOrEqual(26);
      expect(character.brass).toBeLessThanOrEqual(80);
      expect(character.careerTicks).toBe(0);
      expect(character.spentExp).toBe(0);
      expect(character.currentExp).toBe(0);
      expect(character.attributeAdvances).toEqual(zeroAttributes());
      expect(character.skills.lang1).toBe(30);
      expect(Object.entries(character.skills).every(([id, x]) => id.startsWith("lang") || x <= 15)).toBe(true);
      expect(sumValues(character.skills)).toBe(60 + 25 + 40);
      expect(character.talents).toHaveProperty("doomed");
      expect(character.talents).toHaveProperty("rand1");
      expect(character.talents).toHaveProperty("rand2");
      expect(Object.keys(character.talents).filter((x) => x.startsWith("t1")).length).toBe(1);
      expect(character.equippedItems).toEqual([]);
      const carriedIds = character.carriedItems.map((x) => x.id);
      expect(carriedIds).toContain("clothing");
      expect(carriedIds.some((x) => x === "hood" || x === "mask")).toBe(true);
      expect(character.carriedItems.find((x) => x.id === "match")?.number).toBeGreaterThanOrEqual(1);
    }
  });

  test("level 1: rolls kept in order, six points on the level 1 characteristics, no creation bonuses", () => {
    for (let i = 0; i < 20; ++i) {
      const character = generateCharacter5e({ ...context, level: 1 }, { rollDiceFn: () => 10 });
      const rolls = character.attributeRolls;
      expect(rolls.WS + rolls.BS + rolls.S).toBe(36);
      expect([rolls.T, rolls.I, rolls.Ag, rolls.Dex, rolls.Int, rolls.WP, rolls.Fel]).toEqual(Array(7).fill(10));
      expect([character.fate, character.fortune, character.careerTicks]).toEqual([4, 3, 0]);
    }
  });

  test("higher levels keep the specialisations settled at level 1", () => {
    const career = testCareer();
    career.level1.talents = new Set(["etiquette"]);
    const talents = [
      ...testTalents5e,
      new Talent({ id: "etiquette", name: "Etiquette", isGroup: true }),
      ...["etiquetteNobles", "etiquetteGuilds"].map(
        (id) => new Talent({ id, name: id, maxRank: 1, group: new Set(["etiquette"]) }),
      ),
    ];
    for (let i = 0; i < 20; ++i) {
      const character = generateCharacter5e({ ...context, career: career, talents: talents, level: 4 });
      const etiquette = Object.keys(character.talents).filter((x) => x.startsWith("etiquette"));
      expect(etiquette.length).toBe(1);
    }
  });

  test("gets the career trappings and money of levels 1 to its level, and their ticks", () => {
    const career = testCareer();
    career.level1.trappings = [{ options: [[{ id: "weapon", number: "1", value: "Sickle" }]] }];
    career.level2.trappings = [{ options: [[{ id: "command", number: "1", value: "Crew of Miners" }]] }];
    career.level2.money = [{ coin: "gold", number: "20" }];
    career.level3.trappings = [{ options: [[{ id: "weapon", number: "2", value: "" }]] }];
    const items = [
      new Item({ id: "weapon", name: "Hand Weapon", type: ItemType.Melee }),
      new Item({ id: "command", name: "Command", type: ItemType.Other }),
    ];

    const character = generateCharacter5e({ ...context, career: career, items: items, level: 2 });

    expect(character.carriedItems).toContainEqual({ id: "weapon", number: 1, value: "Sickle" });
    expect(character.carriedItems.some((x) => x.id === "weapon" && x.value === "")).toBe(false);
    expect(character.storedItems).toEqual([{ id: "command", number: 1, value: "Crew of Miners" }]);
    // Silver status starts without gold; the level 2 money adds 20.
    expect(character.gold).toBe(20);
    expect(character.careerTicks).toBe(10);
  });

  test("level 3 character", () => {
    const character = generateCharacter5e({ ...context, level: 3 });
    expect(character.career).toEqual({ id: "career1", number: 3 });
    expect(character.careerPath).toEqual([
      { id: "career1", number: 1 },
      { id: "career1", number: 2 },
    ]);
    expect(character.status).toBe(StatusTier.Silver);
    expect(character.careerTicks).toBe(22);
    expect(character.spentExp).toBeGreaterThan(200);
    expect(character.attributeAdvances.T).toBe(5);
  });
});
