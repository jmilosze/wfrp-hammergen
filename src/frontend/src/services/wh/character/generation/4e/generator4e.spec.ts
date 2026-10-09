import { ids, sumValues, testCareer } from "../fixtures.ts";
import { genProps4e, testSkills4e, testTalents4e } from "./fixtures4e.ts";
import { describe, expect, test } from "vitest";
import { StatusTier } from "../../../content/career.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { generateCharacter4e } from "./generator4e.ts";

describe("generateCharacter4e", () => {
  const context = {
    species: SpeciesWithRegion.HumanReikland,
    career: testCareer(),
    skills: testSkills4e,
    talents: testTalents4e,
    generationProps: genProps4e,
  };

  test("level 1 character", () => {
    for (let i = 0; i < 20; ++i) {
      const character = generateCharacter4e({ ...context, level: 1 });
      expect(character.edition).toBe("4e");
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.description.length).toBeGreaterThan(0);
      expect(character.career).toEqual({ id: "career1", number: 1 });
      expect(character.careerPath).toEqual([]);
      expect(character.fate + character.resilience).toBe(2 + 1 + 3);
      expect(character.fortune).toBe(character.fate);
      expect(character.resolve).toBe(character.resilience);
      expect(character.status).toBe(StatusTier.Brass);
      expect(character.standing).toBe(3);
      expect(character.brass).toBeGreaterThanOrEqual(6);
      expect(character.brass).toBeLessThanOrEqual(60);
      expect(Object.values(character.attributeRolls).every((x) => x >= 2 && x <= 20)).toBe(true);

      // 5 free advances over the level 1 career characteristics
      const advances = character.attributeAdvances;
      expect(advances.WS + advances.BS + advances.S).toBe(5);
      expect(sumValues({ ...advances })).toBe(5);

      // species: 3 skills at +3 and 3 at +5; career: 40 advances over level 1 skills, at most 10 each
      const speciesSkills = Object.entries(character.skills).filter(([id]) => id.startsWith("sp"));
      expect(speciesSkills.map(([, x]) => x).sort()).toEqual([3, 3, 3, 5, 5, 5]);
      const careerSkills = Object.entries(character.skills).filter(([id]) => !id.startsWith("sp"));
      expect(careerSkills.every(([id, x]) => ids("s", 1, 10).includes(id) && x <= 10)).toBe(true);
      expect(sumValues(character.skills)).toBe(24 + 40);

      expect(character.talents).toHaveProperty("doomed");
      expect(character.talents).toHaveProperty("rand1");
      expect(character.talents).toHaveProperty("rand2");
      expect(Object.keys(character.talents).filter((x) => x.startsWith("t1")).length).toBe(1);

      expect(character.equippedItems).toHaveProperty("clothing");
      expect(Object.keys(character.equippedItems).some((x) => x === "hood" || x === "mask")).toBe(true);
      expect(character.carriedItems.match).toBeGreaterThanOrEqual(1);

      expect(character.careerTicks).toBe(0);
      expect(character.spentExp).toBe(0);
      expect(character.currentExp).toBe(50);
    }
  });

  test("level 3 character", () => {
    for (let i = 0; i < 20; ++i) {
      const character = generateCharacter4e({ ...context, level: 3 });
      expect(character.career).toEqual({ id: "career1", number: 3 });
      expect(character.careerPath).toEqual([
        { id: "career1", number: 1 },
        { id: "career1", number: 2 },
      ]);
      expect(character.status).toBe(StatusTier.Silver);

      // characteristics of levels 1 and 2 reach 10 advances to enter level 3; level 4's is not advanced
      const advances = character.attributeAdvances;
      expect([advances.WS, advances.BS, advances.S, advances.T].every((x) => x >= 10)).toBe(true);
      expect(advances.Ag).toBe(0);
      expect(sumValues({ ...advances })).toBe(4 * 10 + 5);

      // 8 career skills of levels 1-2 reach 10 advances to enter level 3
      const qualifying = ids("s", 1, 16).filter((id) => (character.skills[id] ?? 0) >= 10);
      expect(qualifying.length).toBeGreaterThanOrEqual(8);

      // 1 free talent, 1 more from level 1, then 2 per level
      expect(Object.keys(character.talents).filter((x) => /^t[123]/.test(x)).length).toBe(6);
      expect(Object.keys(character.talents).filter((x) => x.startsWith("t4")).length).toBe(0);

      expect(character.spentExp).toBeGreaterThan(200);
      expect(character.currentExp).toBe(0);
    }
  });

  test("characteristic rolls are 2d10 with no extra points", () => {
    const character = generateCharacter4e({ ...context, level: 1 }, { rollDiceFn: () => 7 });
    expect(Object.values(character.attributeRolls)).toEqual(Array(10).fill(7));
  });
});
