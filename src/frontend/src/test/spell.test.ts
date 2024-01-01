import { test, describe, expect } from "vitest";
import { apiResponseToModel, modelToApi, Spell, SpellApiData } from "../services/wh/spell.ts";
import { ApiResponse, Source } from "../services/wh/common.ts";

const spellApiData: SpellApiData = {
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const spellApiResponse: ApiResponse<SpellApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: spellApiData,
};

const spell = new Spell();
spell.id = "id";
spell.canEdit = true;
spell.name = "spell";
spell.cn = 1;
spell.range = "range";
spell.target = "target";
spell.duration = "duration";
spell.description = "desc";
spell.shared = true;
spell.source = { 1: "page 2", 3: "page 5-10" };

test("apiResponseToModel returns expected spell", () => {
  expect(apiResponseToModel(spellApiResponse)).toMatchObject(spell);
});

test("modelToApi returns expected api spell data", () => {
  expect(modelToApi(spell)).toMatchObject(spellApiData);
});

describe("isEqualTo returns true", () => {
  const otherSpell = spell.copy();
  test("when spells are the same", () => {
    expect(spell.isEqualTo(otherSpell)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other spell has different value of id");
  {
    const otherSpell = spell.copy();
    otherSpell.id = "otherId";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of name");
  {
    const otherSpell = spell.copy();
    otherSpell.name = "otherName";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of cn");
  {
    const otherSpell = spell.copy();
    otherSpell.cn = 3;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of range");
  {
    const otherSpell = spell.copy();
    otherSpell.range = "otherRange";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of target");
  {
    const otherSpell = spell.copy();
    otherSpell.target = "otherTarget";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of duration");
  {
    const otherSpell = spell.copy();
    otherSpell.duration = "otherDuration";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of description");
  {
    const otherSpell = spell.copy();
    otherSpell.description = "otherDescription";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of canEdit");
  {
    const otherSpell = spell.copy();
    otherSpell.canEdit = false;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of shared");
  {
    const otherSpell = spell.copy();
    otherSpell.shared = false;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test.each<{ diff: string; source: Source }>([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other spell has $diff", (t) => {
    const otherSpell = spell.copy();
    otherSpell.source = t.source;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });
});
