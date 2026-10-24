import { selectFirst, sumValues, testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { testTalents5e } from "./fixtures5e.ts";
import { describe, expect, test } from "vitest";
import { zeroAttributes } from "@/services/wh/core/attributes.ts";
import { getCareerSkillsByLevel, getCareerTalentsByLevel } from "@/services/wh/content/career.ts";
import { CAREER_TICKS_5E, generateCareerAdvances5e } from "./advancement5e.ts";

describe("generateCareerAdvances5e", () => {
  const context = {
    career: testCareer(),
    baseAttributes: zeroAttributes(),
    talentList: testTalents5e,
    careerSkillsByLevel: getCareerSkillsByLevel(testCareer()),
    careerTalentsByLevel: getCareerTalentsByLevel(testCareer()),
    // A level 1 character: eight career skill Advances and one career talent.
    startingSkills: { s1: 15, s2: 15, s3: 10 },
    startingTalents: { t1a: 1 },
  };

  test("level 1: nothing more", () => {
    const result = generateCareerAdvances5e({ ...context, level: 1 }, selectFirst);
    expect(result.skills).toEqual({ s1: 15, s2: 15, s3: 10 });
    expect(result.talents).toEqual({ t1a: 1 });
    expect(result.attributeAdvances).toEqual(zeroAttributes());
    expect(result.spentExp).toBe(0);
  });

  test("level 2: 10 ticks (talent, three characteristics, six skill Advances) and 100 XP", () => {
    const result = generateCareerAdvances5e({ ...context, level: 2 }, selectFirst);
    expect(result.talents).toEqual({ t1a: 1, t1b: 1 });
    expect(result.attributeAdvances).toEqual({ ...zeroAttributes(), WS: 5, BS: 5, S: 5 });
    expect(result.skills).toEqual({ s1: 45, s2: 15, s3: 10 });
    // talent 100, characteristics 3 × 125, s1 from +15 to +45 150+250+400+600+850+1200, level 100
    expect(result.spentExp).toBe(100 + 375 + 3450 + 100);
  });

  test("level 2: the level 2 trappings tick the tracker, so fewer skill Advances are bought", () => {
    const career = testCareer();
    career.level2.trappings = [
      { options: [[{ id: "rope", number: "1", value: "" }]] },
      {
        options: [
          [
            { id: "bow", number: "1", value: "" },
            { id: "arrow", number: "10", value: "" },
          ],
          [{ id: "sword", number: "1", value: "" }],
        ],
      },
    ];
    career.level2.money = [{ coin: "gold", number: "20" }];
    const result = generateCareerAdvances5e({ ...context, career: career, level: 2 }, selectFirst);
    // talent, three characteristics and three trapping ticks leave three skill Advances: s1 from +15 to +30
    expect(result.skills).toEqual({ s1: 30, s2: 15, s3: 10 });
    expect(result.spentExp).toBe(100 + 375 + (150 + 250 + 400) + 100);
  });

  test("level 4: 36 ticks over the career", () => {
    for (let i = 0; i < 20; ++i) {
      const result = generateCareerAdvances5e({ ...context, level: 4 });
      const talentTicks = Object.keys(result.talents).length - 1;
      const characteristicTicks = Object.values(result.attributeAdvances).reduce((sum, x) => sum + x, 0) / 5;
      const skillTicks = (sumValues(result.skills) - 40) / 5;
      expect(talentTicks).toBe(3);
      expect(characteristicTicks).toBe(3 + 4 + 5);
      expect(talentTicks + characteristicTicks + skillTicks).toBe(CAREER_TICKS_5E[3]);
      expect(result.attributeAdvances.WS).toBe(15);
      expect(result.attributeAdvances.T).toBe(10);
      expect(result.attributeAdvances.I).toBe(5);
      expect(result.attributeAdvances.Ag).toBe(0);
    }
  });
});
