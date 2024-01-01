import { test, expect } from "vitest";
import { apiResponseToModel, modelToApi, WhSpell, WhSpellApiData } from "../src/services/wh/spell";
import { WhApiResponse } from "../src/services/wh/common";

const spellApiData: WhSpellApiData = {
  name: "spell1",
  cn: 1,
  range: "range1",
  target: "target1",
  duration: "duration1",
  description: "desc1",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const spellApiResponse: WhApiResponse<WhSpellApiData> = {
  id: "id1",
  canEdit: true,
  ownerId: "owner1",
  object: spellApiData,
};

const spell = new WhSpell();
spell.id = "id1";
spell.canEdit = true;
spell.name = "spell1";
spell.cn = 1;
spell.range = "range1";
spell.target = "target1";
spell.duration = "duration1";
spell.description = "desc1";
spell.shared = true;
spell.source = { 1: "page 2", 3: "page 5-10" };

test("apiResponseToModel returns expected spell", () => {
  expect(apiResponseToModel(spellApiResponse)).toMatchObject(spell);
});

test("modelToApi returns expected api spell data", () => {
  expect(modelToApi(spell)).toMatchObject(spellApiData);
});

// describe("compareSpell returns true", () => {
//   const spell = {
//     id: "id",
//     name: "spell",
//     cn: 1,
//     range: "range",
//     target: "target",
//     duration: "duration",
//     description: "desc",
//     canEdit: true,
//     shared: true,
//     source: { 1: "page 2", 3: "page 5-10" },
//   };
//
//   test("when spells are the same", () => {
//     let otherSpell = JSON.parse(JSON.stringify(spell));
//     expect(compareSpell(spell, otherSpell)).toBe(true);
//   });
// });
//
// describe("compareSpell returns false", () => {
//   const spell = {
//     id: "id",
//     name: "spell",
//     cn: 1,
//     range: "range",
//     target: "target",
//     duration: "duration",
//     description: "desc",
//     canEdit: true,
//     shared: true,
//     source: { 1: "page 2", 3: "page 5-10" },
//   };
//
//   test.each([
//     { field: "id", value: "otherId" },
//     { field: "name", value: "otherName" },
//     { field: "cn", value: 3 },
//     { field: "range", value: "otherRange" },
//     { field: "target", value: "otherTarget" },
//     { field: "duration", value: "otherDuration" },
//     { field: "description", value: "otherDescription" },
//     { field: "canEdit", value: false },
//     { field: "shared", value: false },
//   ])("when other spell has different value of $field", (t) => {
//     let otherSpell = JSON.parse(JSON.stringify(spell));
//     otherSpell[t.field] = t.value;
//     expect(compareSpell(spell, otherSpell)).toBe(false);
//   });
//
//   test.each([
//     { diff: "fewer sources", source: { 1: "page 2" } },
//     { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
//     { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
//     { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
//   ])("when other spell has $diff", (t) => {
//     let otherSpell = JSON.parse(JSON.stringify(spell));
//     otherSpell.source = t.source;
//     expect(compareSpell(spell, otherSpell)).toBe(false);
//   });
// });
