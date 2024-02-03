import { describe, expect, test } from "vitest";
import { Spell, SpellApiData, apiResponseToModel, modelToApi } from "../services/wh/spell.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";

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

const spell = new Spell({
  id: "id",
  canEdit: true,
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected spell", () => {
  expect(apiResponseToModel(spellApiResponse)).toMatchObject(spell);
});

test("modelToApi returns expected api spell data", () => {
  expect(modelToApi(spell)).toMatchObject(spellApiData);
});

testIsEqualCommonProperties("spell", spell);

describe("isEqualTo returns false", () => {
  test("when other spell has different value of cn");
  {
    const otherSpell = spell.copy();
    otherSpell.cn = 3;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of range", () => {
    const otherSpell = spell.copy();
    otherSpell.range = "otherRange";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });

  test("when other spell has different value of target", () => {
    const otherSpell = spell.copy();
    otherSpell.target = "otherTarget";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });

  test("when other spell has different value of duration", () => {
    const otherSpell = spell.copy();
    otherSpell.duration = "otherDuration";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });
});
