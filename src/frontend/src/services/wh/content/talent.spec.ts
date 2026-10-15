import { Talent, TalentApiData, apiResponseToModel, modelToApi } from "./talent.ts";
import { describe, expect, test } from "vitest";
import { CharacterModifiers } from "@/services/wh/core/characterModifiers.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { testIsEqualTo } from "@/testing.ts";
import { AttributeName as Att } from "@/services/wh/core/attributes.ts";

const talentGroupApiData: TalentApiData = {
  name: "talent1",
  description: "desc1",
  tests: "qwe",
  maxRank: 4,
  attribute: Att.BS.valueOf(),
  attribute2: Att.WS.valueOf(),
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
    effects: [],
  },
  isGroup: true,
  group: ["a", "b", "c"],
  source: { 1: "page 2", 3: "page 5-10" },
};

const talentGroupApiResponse: ApiResponse<TalentApiData> = {
  id: "id1",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": talentGroupApiData },
};

const talentGroup = new Talent({
  id: "id1",
  ownerId: "owner",
  name: "talent1",
  description: "desc1",
  tests: "qwe",
  maxRank: 4,
  attribute: Att.BS,
  attribute2: Att.WS,
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  }),
  isGroup: true,
  group: new Set(["a", "b", "c"]),
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

const talentIndividual = new Talent({
  id: "id2",
  ownerId: "owner",
  name: "talent2",
  description: "desc2",
  tests: "asd",
  maxRank: 2,
  attribute: Att.BS.valueOf(),
  attribute2: Att.WS.valueOf(),
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  }),
  isGroup: false,
  group: new Set(["a", "b"]),
  visibility: Visibility.Shared,
  source: {},
});

test("apiResponseToModel returns expected talent", () => {
  expect(apiResponseToModel(talentGroupApiResponse, "4e")).toMatchObject(talentGroup);
});

test("modelToApi returns expected api talent data", () => {
  expect(modelToApi(talentGroup)).toMatchObject(talentGroupApiData);
});

testIsEqualTo("talent", talentIndividual);
// A group talent compares only what a group has: not tests, max rank, characteristics, groups or modifiers.
testIsEqualTo("group talent", talentGroup, {
  ignored: ["tests", "maxRank", "attribute", "attribute2", "group", "modifiers"],
});

describe("validateMaxRank", () => {
  test.each([
    [0, true],
    [3, true],
    [999, true],
    [1000, false],
    [-1, false],
    [1.5, false],
  ])("4e max rank %d is valid: %s", (maxRank, valid) => {
    expect(new Talent({ maxRank }).validateMaxRank("4e").valid).toBe(valid);
  });

  test.each([
    [0, false],
    [1, true],
    [999, true],
    [1000, false],
  ])("5e max rank %d is valid: %s", (maxRank, valid) => {
    expect(new Talent({ maxRank }).validateMaxRank("5e").valid).toBe(valid);
  });

  test("5e group talent needs no max rank", () => {
    expect(new Talent({ maxRank: 0, isGroup: true }).validateMaxRank("5e").valid).toBe(true);
  });
});
