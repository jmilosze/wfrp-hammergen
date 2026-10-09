import { selectFirst, sumValues, testCareer } from "../fixtures.ts";
import { testTalents5e } from "./fixtures5e.ts";
import { describe, expect, test } from "vitest";
import { zeroAttributes } from "../../../core/attributes.ts";
import { CAREER_TICKS_5E, generateCareerAdvances5e } from "./advancement5e.ts";

describe("generateCareerAdvances5e", () => {
  const context = {
    career: testCareer(),
    baseAttributes: zeroAttributes(),
    talentList: testTalents5e,
    skillGroupMap: {},
    talentGroupMap: {},
    startingSkills: {},
    startingTalents: {},
  };

  test("level 1: eight free skill Advances and one free talent", () => {
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
