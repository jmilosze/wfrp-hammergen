import {
  Talent,
  TalentApiData,
  apiResponseToModel,
  modelToApi,
  TalentAttribute as Att,
} from "../services/wh/talent.ts";
import { describe, expect, test } from "vitest";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { Source } from "../services/wh/source.ts";
import { ApiResponse } from "../services/wh/common.ts";

const talentGroupApiData = {
  name: "talent1",
  description: "desc1",
  tests: "qwe",
  maxRank: 4,
  attribute: Att.BS.valueOf(),
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
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
  canEdit: true,
  name: "talent1",
  description: "desc1",
  tests: "qwe",
  maxRank: 4,
  attribute: Att.BS.valueOf(),
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  }),
  isGroup: true,
  group: ["a", "b", "c"],
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
  attribute: Att.WS.valueOf(),
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  }),
  isGroup: false,
  group: ["a", "b"],
  shared: true,
  source: {},
});

test("apiResponseToModel returns expected talent", () => {
  expect(apiResponseToModel(talentGroupApiResponse)).toMatchObject(talentGroup);
});

test("modelToApi returns expected api talent data", () => {
  expect(modelToApi(talentGroup)).toMatchObject(talentGroupApiData);
});

describe("isEqualTo returns true", () => {
  test("when other talent is exactly the same", () => {
    const otherTalentIndividual = talentIndividual.copy();
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(true);
  });

  test("when other talent has group field with elements in different order", () => {
    const otherTalentGroup = talentGroup.copy();
    otherTalentGroup.group = ["b", "a"];
    expect(talentGroup.isEqualTo(otherTalentGroup)).toBe(true);
  });

  test("when other talent has different value of tests, maxRank, attribute, and modifiers", () => {
    const otherTalentGroup = talentGroup.copy();
    otherTalentGroup.tests = "otherTest";
    otherTalentGroup.maxRank = 5;
    otherTalentGroup.attribute = Att.Int.valueOf();
    otherTalentGroup.modifiers = new CharacterModifiers({
      size: 2,
      movement: -1,
      attributes: { WS: 1, BS: 0, S: 10, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 5 },
    });
    expect(talentGroup.isEqualTo(otherTalentGroup)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other talent has different value of id");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.id = "otherId";
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }
  test("when other talent has different value of name");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.name = "otherName";
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent has different value of description");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.description = "otherDescription";
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent has different value of canEdit");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.canEdit = false;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent has different value of isGroup");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.isGroup = true;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent has different value of shared");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.shared = false;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test.each<{ diff: string; source: Source }>([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other talent has $diff", (t) => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.source = t.source;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when other talent is individual and has different value of tests");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.tests = "otherTest";
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent is individual and has different value of maxRank");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.maxRank = 5;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when other talent is individual and has different value of attribute");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.attribute = Att.Dex.valueOf();
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when talent is individual and other talent has group field that is a subset", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.group = ["a"];
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when talent is individual and other talent has group field of the same length but different values", () => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.group = ["c", "d"];
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test.each([
    { field: "WS", value: 10 },
    { field: "BS", value: 10 },
    { field: "S", value: 10 },
    { field: "T", value: 10 },
    { field: "I", value: 10 },
    { field: "Ag", value: 10 },
    { field: "Dex", value: 10 },
    { field: "Int", value: 10 },
    { field: "WP", value: 10 },
    { field: "Fel", value: 10 },
  ])("when talent is individual and other talent has different value of modifier $field", (t) => {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.modifiers.attributes[t.field] = t.value;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  });

  test("when talent is individual and other talent has different value of modifier size");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.modifiers.size = 1;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }

  test("when talent is individual and other talent has different value of modifier movement");
  {
    const otherTalentIndividual = talentIndividual.copy();
    otherTalentIndividual.modifiers.movement = -1;
    expect(talentIndividual.isEqualTo(otherTalentIndividual)).toBe(false);
  }
});
