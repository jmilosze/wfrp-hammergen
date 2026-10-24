import { describe, expect, test } from "vitest";
import { getRollDiceTest, getSelectRandomTest } from "@/testing.ts";
import {
  canRollRandomTalents5e,
  careerTalentChoices5e,
  careerTalentOptions5e,
  fitGuidedTalents5e,
  GuidedTalents5e,
  guidedTalentsValid5e,
  randomCareerTalent5e,
  rollGuidedRandomTalent5e,
  speciesTalentRows5e,
  TalentsContext5e,
} from "./talents5e.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { zeroAttributes } from "@/services/wh/core/attributes.ts";

describe("talents5e", () => {
  const maxRanks = { t1: 1, t2: 2, etiquetteNobles: 1, etiquetteGuilds: 1 };

  test("careerTalentOptions5e lists group members and leaves out talents at their maximum rank", () => {
    const groups = { etiquette: ["etiquetteNobles", "etiquetteGuilds"] };
    expect(careerTalentOptions5e(["t1", "t2", "etiquette", "unknown"], groups, { t1: 1, t2: 1 }, maxRanks)).toEqual([
      "t2",
      "etiquetteNobles",
      "etiquetteGuilds",
    ]);
  });

  test("randomCareerTalent5e picks a talent below its maximum rank, or null", () => {
    expect(randomCareerTalent5e(["t1", "t2"], { t1: 1 }, maxRanks, getSelectRandomTest(0))).toBe("t2");
    expect(randomCareerTalent5e(["t1"], { t1: 1 }, maxRanks, getSelectRandomTest(0))).toBeNull();
  });
});

describe("guided talents5e", () => {
  const talentList = ["doomed", "savvy", "suave", "sightA", "sightB", "luck", "t1a", "t1b"].map(
    (id) => new Talent({ id, name: id, maxRank: 1 }),
  );
  const context: TalentsContext5e = {
    speciesTalents: ["doomed", "savvy,suave", "sense", "random"],
    randomTalents: [
      { id: "luck", minRoll: 1, maxRoll: 51 },
      { id: "savvy", minRoll: 51, maxRoll: 101 },
    ],
    level1Talents: ["t1a", "t1b", "doomed"],
    talentGroupMap: { sense: ["sightA", "sightB"] },
    talentList,
    attributes: zeroAttributes(),
  };
  const settled: GuidedTalents5e = {
    options: { 1: "suave" },
    members: { 2: "sightB" },
    randomRolls: ["luck"],
    career: "t1a",
  };

  test("rows settle each entry: fixed, chosen, a group's member, a roll", () => {
    const rows = speciesTalentRows5e(settled, context);
    expect(rows.map((x) => [x.kind, x.talent])).toEqual([
      ["talent", "doomed"],
      ["talent", "suave"],
      ["group", "sightB"],
      ["random", "luck"],
    ]);
    expect(guidedTalentsValid5e(settled, context)).toBe(true);
  });

  test("Random Talents are rolled once the other entries are settled, re-rolling talents already taken", () => {
    const open = { ...settled, options: {}, randomRolls: [] };
    expect(canRollRandomTalents5e(speciesTalentRows5e(open, context))).toBe(false);
    const ready = { ...settled, options: { 1: "savvy" }, randomRolls: [] };
    expect(canRollRandomTalents5e(speciesTalentRows5e(ready, context))).toBe(true);
    // The character already has Savvy, so the roll is on the rest of the table: Luck.
    expect(rollGuidedRandomTalent5e(ready, context, 0, getRollDiceTest(30)).randomRolls).toEqual(["luck"]);
  });

  test("a roll that clashes with a later choice shows as not rolled", () => {
    const clash = { ...settled, options: { 1: "savvy" }, randomRolls: ["savvy"] };
    const rows = speciesTalentRows5e(clash, context);
    expect(rows[3].talent).toBeNull();
    expect(guidedTalentsValid5e(clash, context)).toBe(false);
  });

  test("the career talent is one still under its maximum rank", () => {
    expect(careerTalentChoices5e(settled, context)).toEqual(["t1a", "t1b"]);
    expect(guidedTalentsValid5e({ ...settled, career: "doomed" }, context)).toBe(false);
  });

  test("fitting drops what no longer fits and keeps the rolls", () => {
    const other = { ...context, speciesTalents: ["doomed", "random"], level1Talents: ["t1b"] };
    expect(fitGuidedTalents5e(settled, other)).toEqual({
      options: {},
      members: {},
      randomRolls: ["luck"],
      career: null,
    });
  });
});
