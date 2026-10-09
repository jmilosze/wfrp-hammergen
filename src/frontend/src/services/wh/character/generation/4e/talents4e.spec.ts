import { copyCareerLevel, Career, zeroCareerLevel } from "../../../content/career.ts";
import { describe, expect, test } from "vitest";
import { CareerTalentsContext, generateCareerTalents4e } from "./talents4e.ts";
import { resolveEntityGroups } from "../shared/groups.ts";
import { Talent } from "../../../content/talent.ts";
import { CharacterModifiers } from "../../../core/characterModifiers.ts";
import { AttributeName } from "../../../core/attributes.ts";
import { getSelectRandomTest } from "../../../../../testing.ts";

describe("generateCareerTalents4e generates expected talents and advances", () => {
  const group0 = new Talent({ id: "g0", isGroup: true });
  const group1 = new Talent({ id: "g1", isGroup: true });
  const group2 = new Talent({ id: "g2", isGroup: true });

  const group0members = [] as Talent[];
  const group1members = [] as Talent[];
  const group2members = [] as Talent[];
  for (let i = 0; i < 3; i++) {
    group0members.push(new Talent({ id: `g0m${i}`, attribute: AttributeName.S, group: new Set(["g0"]) }));
    group1members.push(new Talent({ id: `g1m${i}`, attribute: AttributeName.WS, group: new Set(["g1"]) }));
    group2members.push(new Talent({ id: `g2m${i}`, attribute: AttributeName.BS, group: new Set(["g2"]) }));
  }

  const individual0 = new Talent({
    id: "i0",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 30, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 2,
    attribute: AttributeName.Dex,
  });

  const individual1 = new Talent({
    id: "i1",
    modifiers: new CharacterModifiers({
      attributes: { WS: 10, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 0,
    attribute: AttributeName.WS,
  });

  const individual2 = new Talent({
    id: "i2",
    maxRank: 1,
    attribute: AttributeName.Ag,
  });

  const individual3 = new Talent({
    id: "i3",
    maxRank: 1,
    attribute: AttributeName.Ag,
  });

  const random0 = new Talent({
    id: "r0",
    maxRank: 1,
    attribute: AttributeName.Ag,
  });

  const random1 = new Talent({
    id: "r1",
    maxRank: 1,
    attribute: AttributeName.Ag,
  });

  const listOfWhTalents: Talent[] = [
    group0,
    group1,
    group2,
    ...group0members,
    ...group1members,
    ...group2members,
    individual0,
    individual1,
    individual2,
    individual3,
    random0,
    random1,
  ];

  const career = new Career({
    level1: {
      ...copyCareerLevel(zeroCareerLevel),
      talents: new Set(["g0", "i3"]),
      attributes: [AttributeName.S, AttributeName.WS, AttributeName.Dex],
    },
    level2: {
      ...copyCareerLevel(zeroCareerLevel),
      talents: new Set(["g0m1", "g0m2"]),
      attributes: [AttributeName.I],
    },
    level3: {
      ...copyCareerLevel(zeroCareerLevel),
      talents: new Set(["g1", "g1m1"]),
      attributes: [AttributeName.Int],
    },
    level4: {
      ...copyCareerLevel(zeroCareerLevel),
      talents: new Set(["g2", "g2m1"]),
      attributes: [AttributeName.WP],
    },
  });

  const baseAtts = { WS: 10, BS: 10, S: 10, T: 10, I: 0, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };

  test("for level 1 character with starting talents", () => {
    const startingTalents = {
      i0: 1,
      i1: 1,
      r1: 1,
    };

    const [talents, advances, cost] = generateCareerTalents4e(
      {
        startingTalents,
        career,
        baseAtts,
        talents: listOfWhTalents,
        talentGroupMap: resolveEntityGroups(listOfWhTalents),
        level: 1,
      },
      getSelectRandomTest(0),
    );

    expect(talents).toEqual({
      i0: 1,
      i1: 1,
      r1: 1,
      g0m0: 1,
    });

    expect(advances).toEqual({
      Ag: 0,
      BS: 0,
      Dex: 0,
      Fel: 0,
      I: 0,
      Int: 0,
      S: 5,
      T: 0,
      WP: 0,
      WS: 0,
    });

    expect(cost).toEqual(0);
  });

  test("for level 1 character without starting talents", () => {
    const individual = new Talent({
      id: "i1",
      modifiers: new CharacterModifiers({}),
      maxRank: 1,
      attribute: AttributeName.WS,
    });

    const singleTalentCareer = new Career({
      level1: {
        ...copyCareerLevel(zeroCareerLevel),
        talents: new Set(["i1"]),
        attributes: [AttributeName.WS],
      },
    });

    const [talents, advances, cost] = generateCareerTalents4e(
      {
        startingTalents: {},
        career: singleTalentCareer,
        baseAtts,
        talents: [individual],
        talentGroupMap: resolveEntityGroups([individual]),
        level: 1,
      },
      getSelectRandomTest(0),
    );

    expect(talents).toEqual({ i1: 1 });
    expect(cost).toEqual(0);
    expect(advances.WS).toEqual(5);
  });

  test("progresses through career tiers up to Level 4 with prerequisites and XP costs", () => {
    const talentGroupMap = resolveEntityGroups(listOfWhTalents);

    const contextLvl1: CareerTalentsContext = {
      startingTalents: {},
      career,
      baseAtts,
      talents: listOfWhTalents,
      talentGroupMap,
      level: 1,
    };
    const [talents1, , cost1] = generateCareerTalents4e(contextLvl1, getSelectRandomTest(0));
    expect(cost1).toBe(0);
    expect(talents1.g0m0).toBe(1);

    const contextLvl2: CareerTalentsContext = {
      startingTalents: {},
      career,
      baseAtts,
      talents: listOfWhTalents,
      talentGroupMap,
      level: 2,
    };
    const [talents2, advances2, cost2] = generateCareerTalents4e(contextLvl2, getSelectRandomTest(0));
    expect(cost2).toBeGreaterThan(cost1);
    // Level 1 attributes must have reached at least 5 advances
    expect(advances2.S).toBeGreaterThanOrEqual(5);
    expect(advances2.WS).toBeGreaterThanOrEqual(5);
    expect(advances2.Dex).toBeGreaterThanOrEqual(5);
    // Level 2 talents acquired
    expect(talents2.g0m1).toBeDefined();

    const contextLvl3: CareerTalentsContext = {
      startingTalents: {},
      career,
      baseAtts,
      talents: listOfWhTalents,
      talentGroupMap,
      level: 3,
    };
    const [, advances3, cost3] = generateCareerTalents4e(contextLvl3, getSelectRandomTest(0));
    expect(cost3).toBeGreaterThan(cost2);
    // Prior attributes (Level 1 + 2) must have reached at least 10 advances
    expect(advances3.S).toBeGreaterThanOrEqual(10);
    expect(advances3.WS).toBeGreaterThanOrEqual(10);
    expect(advances3.Dex).toBeGreaterThanOrEqual(10);
    expect(advances3.I).toBeGreaterThanOrEqual(10);

    const contextLvl4: CareerTalentsContext = {
      startingTalents: {},
      career,
      baseAtts,
      talents: listOfWhTalents,
      talentGroupMap,
      level: 4,
    };
    const [, advances4, cost4] = generateCareerTalents4e(contextLvl4, getSelectRandomTest(0));
    expect(cost4).toBeGreaterThan(cost3);
    // Prior attributes (Level 1, 2, 3) must have reached at least 15 advances
    expect(advances4.S).toBeGreaterThanOrEqual(15);
    expect(advances4.WS).toBeGreaterThanOrEqual(15);
    expect(advances4.Dex).toBeGreaterThanOrEqual(15);
    expect(advances4.I).toBeGreaterThanOrEqual(15);
    expect(advances4.Int).toBeGreaterThanOrEqual(15);
  });
});
