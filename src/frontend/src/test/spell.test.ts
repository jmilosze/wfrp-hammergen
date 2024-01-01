import { test, describe, expect } from "vitest";
import { apiResponseToModel, modelToApi, WhSpell, WhSpellApiData } from "../services/wh/spell.ts";
import { WhApiResponse, WhSource } from "../services/wh/common.ts";

const spellApiData: WhSpellApiData = {
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const spellApiResponse: WhApiResponse<WhSpellApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: spellApiData,
};

const spell = new WhSpell();
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
  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "cn", value: 3 },
    { field: "range", value: "otherRange" },
    { field: "target", value: "otherTarget" },
    { field: "duration", value: "otherDuration" },
    { field: "description", value: "otherDescription" },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other spell has different value of $field", (t) => {
    let otherSpell = spell.copy();
    // @ts-ignore
    otherSpell[t.field] = t.value;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });

  test.each<{ diff: string; source: WhSource }>([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other spell has $diff", (t) => {
    let otherSpell = spell.copy();
    otherSpell.source = t.source;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });
});
