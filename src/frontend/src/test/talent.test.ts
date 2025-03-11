import { Talent, TalentApiData, apiResponseToModel, modelToApi } from "../services/wh/talent.ts";
import { describe, expect, test } from "vitest";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCharacterModifiers, testIsEqualCommonProperties } from "./commonTests.ts";

import { AttributeName as Att } from "../services/wh/attributes.ts";

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
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const talentGroupApiResponse: ApiResponse<TalentApiData> = {
  id: "id1",
  canEdit: true,
  ownerId: "owner",
  object: talentGroupApiData,
};

const talentGroup = new Talent({
  id: "id1",
  ownerId: "owner",
  canEdit: true,
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
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

const talentIndividual = new Talent({
  id: "id2",
  canEdit: true,
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
  shared: true,
  source: {},
});

test("apiResponseToModel returns expected talent", () => {
  expect(apiResponseToModel(talentGroupApiResponse)).toMatchObject(talentGroup);
});

test("modelToApi returns expected api talent data", () => {
  expect(modelToApi(talentGroup)).toMatchObject(talentGroupApiData);
});

testIsEqualCommonProperties("talent", talentIndividual);

testIsEqualCharacterModifiers("talent", talentIndividual);

describe("isEqualTo returns true", () => {
  test("when comparing group talents and other talent has different value of tests, maxRank, attribute, and modifiers", () => {
    const otherTalentGroup = talentGroup.copy();
    otherTalentGroup.tests = "otherTest";
    otherTalentGroup.maxRank = 5;
    otherTalentGroup.attribute = Att.Int;
    otherTalentGroup.modifiers = new CharacterModifiers({
      size: 2,
      movement: -1,
      attributes: { WS: 1, BS: 0, S: 10, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 5 },
    });
    expect(talentGroup.isEqualTo(otherTalentGroup)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other talent has different value of isGroup", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.isGroup = true;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when other talent is individual and has different value of tests", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.tests = "otherTest";
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when other talent is individual and has different value of maxRank", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.maxRank = 5;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when other talent is individual and has different value of attribute", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.attribute = Att.Dex;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when other talent is individual and has different value of attribute2", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.attribute2 = Att.Dex;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when talent is individual and other talent has group field that is a subset", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.group = new Set(["a"]);
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when talent is individual and other talent has group field of the same length but different values", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.group = new Set(["c", "d"]);
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });
});
