import { describe, expect, test } from "vitest";
import {
  allocateCareerTalents,
  calculateMaxTalentRanks,
  calculateTalentAttributeModifiers,
  CareerTalentsContext,
  generateCareerTalents,
  purchaseSingleTalentAdvance,
  resolveAvailableTalents,
} from "../services/wh/characterGeneration/generateCareerTalents.ts";
import { resolveEntityGroups } from "../services/wh/characterGeneration/resolveEntityGroups.ts";
import { Talent } from "../services/wh/talent.ts";
import { Career, copyCareerLevel, zeroCareerLevel } from "../services/wh/career.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { AttributeName } from "../services/wh/attributes.ts";
import { getSelectRandomTest } from "./commonTests.ts";

const baseAtts = { WS: 10, BS: 10, S: 10, T: 10, I: 0, Ag: 15, Dex: 0, Int: 0, WP: 0, Fel: 0 };
const advances = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };

const listOfWhTalents: Talent[] = [
  new Talent({
    id: "id0",
    modifiers: new CharacterModifiers({
      attributes: { WS: 10, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 0,
    group: new Set(["id3", "id4"]),
    attribute: AttributeName.WS,
  }),
  new Talent({
    id: "id1",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 20, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 1,
    group: new Set(["id3"]),
    attribute: AttributeName.S,
  }),
  new Talent({
    id: "id2",
    modifiers: new CharacterModifiers({
      attributes: { WS: 0, BS: 0, S: 30, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    }),
    maxRank: 2,
    attribute: AttributeName.Ag,
  }),
  new Talent({
    id: "id3",
    attribute: AttributeName.None,
    isGroup: true,
  }),
  new Talent({
    id: "id4",
    attribute: AttributeName.Various,
    isGroup: true,
  }),
];

describe("calculateTalentAttributeModifiers", () => {
  test("returns zero modifiers when no talents are acquired", () => {
    const modifiers = calculateTalentAttributeModifiers({}, listOfWhTalents);
    expect(modifiers).toEqual({ WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 });
  });

  test("scales talent attribute modifiers by talent rank and sums them", () => {
    const modifiers = calculateTalentAttributeModifiers({ id1: 1, id2: 2 }, listOfWhTalents);
    expect(modifiers.BS).toBe(20); // 1 * 20
    expect(modifiers.S).toBe(60); // 2 * 30
    expect(modifiers.WS).toBe(0);
  });

  test("ignores talents that are not present in allTalents", () => {
    const modifiers = calculateTalentAttributeModifiers({ unknown_talent: 2 }, listOfWhTalents);
    expect(modifiers).toEqual({ WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 });
  });
});

describe("calculateMaxTalentRanks", () => {
  test("with 0 selected talents", () => {
    expect(calculateMaxTalentRanks({}, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });

  test("with 2 selected talents", () => {
    expect(calculateMaxTalentRanks({ id1: 1, id2: 2 }, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 9, // expected = 1 + S(80)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });

  test("with selected talent not among whTalents", () => {
    expect(calculateMaxTalentRanks({ otherId: 1 }, listOfWhTalents, baseAtts, advances)).toEqual({
      id0: 2, // expected = 0 + WS(20)/10
      id1: 3, // expected = 1 + S(20)/10
      id2: 4, // expected = 2 + Ag(25)/10
      id3: 0, // expected = 0 + None
      id4: 0, // expected = 0 + None
    });
  });
});

describe("resolveAvailableTalents", () => {
  const talentGroups = {
    groupId1: ["id0"],
    groupId2: ["id0", "id1", "id2"],
  };

  test("when talents list is empty", () => {
    expect(resolveAvailableTalents([], talentGroups, getSelectRandomTest(0))).toEqual([]);
  });

  test("when talents list does not contain group", () => {
    const availTalents = resolveAvailableTalents(["id1", "id2", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1", "id2"]);
  });

  test("when talents list contains a group talent", () => {
    const availTalents = resolveAvailableTalents(["groupId2"], talentGroups, getSelectRandomTest(1));
    expect(availTalents).toEqual(["id1"]);
  });

  test("when talents list contains repetitions", () => {
    const availTalents = resolveAvailableTalents(["id1", "id1", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1"]);
  });

  test("when talents list contains repetitions in group", () => {
    const availTalents = resolveAvailableTalents(["id1", "groupId2", "id0"], talentGroups, getSelectRandomTest(1));
    expect(availTalents.sort()).toEqual(["id0", "id1"]);
  });
});

describe("purchaseSingleTalentAdvance", () => {
  test("increments unranked talent from 0 to 1 and returns 100 XP", () => {
    const talents: Record<string, number> = {};
    const cost = purchaseSingleTalentAdvance(talents, "t1");
    expect(talents.t1).toBe(1);
    expect(cost).toBe(100);
  });

  test("increments ranked talent from 1 to 2 and returns 200 XP", () => {
    const talents: Record<string, number> = { t1: 1 };
    const cost = purchaseSingleTalentAdvance(talents, "t1");
    expect(talents.t1).toBe(2);
    expect(cost).toBe(200);
  });
});

describe("allocateCareerTalents", () => {
  test("when availableTalents is empty, makes no changes and returns 0 XP", () => {
    const talents = { selected1: 1, selected2: 2 };
    const xpSpent = allocateCareerTalents(talents, [], { selected1: 4, selected2: 5 }, 5, getSelectRandomTest(0));
    expect(talents).toEqual({ selected1: 1, selected2: 2 });
    expect(xpSpent).toBe(0);
  });

  test("ignores talents not listed in maxRanks", () => {
    const talents = { selected1: 1, selected2: 2 };
    const xpSpent = allocateCareerTalents(
      talents,
      ["unlisted"],
      { selected1: 4, selected2: 5 },
      1,
      getSelectRandomTest(0),
    );
    expect(talents).toEqual({ selected1: 1, selected2: 2 });
    expect(xpSpent).toBe(0);
  });

  test("advances talents and calculates cumulative XP cost", () => {
    const talents = { selected1: 1, selected2: 2 };
    const xpSpent = allocateCareerTalents(
      talents,
      ["available1"],
      { selected1: 4, selected2: 5, available1: 2 },
      2,
      getSelectRandomTest(0),
    );
    // Rank 1 costs 100, Rank 2 costs 200 => total 300 XP
    expect(talents).toEqual({ selected1: 1, selected2: 2, available1: 2 });
    expect(xpSpent).toBe(300);
  });

  test("advances pre-existing talents further up to max rank", () => {
    const talents = { selected1: 2, selected2: 2 };
    const xpSpent = allocateCareerTalents(
      talents,
      ["selected1"],
      { selected1: 4, selected2: 5 },
      2,
      getSelectRandomTest(0),
    );
    // Rank 3 costs 300, Rank 4 costs 400 => total 700 XP
    expect(talents).toEqual({ selected1: 4, selected2: 2 });
    expect(xpSpent).toBe(700);
  });

  test("stops advancing a talent once it reaches max rank and switches to other available talents", () => {
    const talents = { selected1: 1, selected2: 2 };
    const xpSpent = allocateCareerTalents(
      talents,
      ["available1", "available2"],
      { selected1: 4, selected2: 5, available1: 1, available2: 3 },
      2,
      getSelectRandomTest(0),
    );
    // available1 reaches max rank 1 (cost 100), then available2 gets rank 1 (cost 100) => total 200 XP
    expect(talents).toEqual({ selected1: 1, selected2: 2, available1: 1, available2: 1 });
    expect(xpSpent).toBe(200);
  });

  test("terminates early when all available talents reach max rank before allocating all requested advances", () => {
    const talents = { selected1: 1, selected2: 2 };
    const xpSpent = allocateCareerTalents(
      talents,
      ["available1", "available2"],
      { selected1: 4, selected2: 5, available1: 1, available2: 1 },
      3,
      getSelectRandomTest(0),
    );
    // Both available1 and available2 reach max rank 1 (100 + 100 = 200 XP), then pool is exhausted
    expect(talents).toEqual({ selected1: 1, selected2: 2, available1: 1, available2: 1 });
    expect(xpSpent).toBe(200);
  });
});

describe("generateCareerTalents generates expected talents and advances", () => {
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

    const [talents, advances, cost] = generateCareerTalents(
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

    const [talents, advances, cost] = generateCareerTalents(
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
    const [talents1, , cost1] = generateCareerTalents(contextLvl1, getSelectRandomTest(0));
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
    const [talents2, advances2, cost2] = generateCareerTalents(contextLvl2, getSelectRandomTest(0));
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
    const [, advances3, cost3] = generateCareerTalents(contextLvl3, getSelectRandomTest(0));
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
    const [, advances4, cost4] = generateCareerTalents(contextLvl4, getSelectRandomTest(0));
    expect(cost4).toBeGreaterThan(cost3);
    // Prior attributes (Level 1, 2, 3) must have reached at least 15 advances
    expect(advances4.S).toBeGreaterThanOrEqual(15);
    expect(advances4.WS).toBeGreaterThanOrEqual(15);
    expect(advances4.Dex).toBeGreaterThanOrEqual(15);
    expect(advances4.I).toBeGreaterThanOrEqual(15);
    expect(advances4.Int).toBeGreaterThanOrEqual(15);
  });
});
