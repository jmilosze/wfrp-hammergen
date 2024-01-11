import { Mutation, MutationApiData, MutationType, apiResponseToModel, modelToApi } from "../services/wh/mutation.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { describe, expect, test } from "vitest";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const mutationApiData = {
  name: "mutation",
  description: "desc",
  type: 0 as MutationType,
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  },
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const mutationApiResponse: ApiResponse<MutationApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: mutationApiData,
};

const mutation = new Mutation({
  id: "id",
  canEdit: true,
  name: "mutation",
  description: "desc",
  type: 0,
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  }),
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(mutationApiResponse)).toMatchObject(mutation);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(mutation)).toMatchObject(mutationApiData);
});

testIsEqualCommonProperties("mutation", mutation);

describe("isEqualTo returns false", () => {
  test("when other mutation has different value of type");
  {
    const otherMutation = mutation.copy();
    otherMutation.type = 1;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  }

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
  ])("when other mutation has different value of modifier $field", (t) => {
    const otherMutation = mutation.copy();
    otherMutation.modifiers.attributes[t.field] = t.value;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  });

  test("when other mutation has different value of modifier size");
  {
    const otherMutation = mutation.copy();
    otherMutation.modifiers.size = 1;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  }

  test("when other mutation has different value of modifier movement");
  {
    const otherMutation = mutation.copy();
    otherMutation.modifiers.movement = -1;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  }
});
