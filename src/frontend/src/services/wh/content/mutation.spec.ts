import { Mutation, MutationApiData, MutationType, apiResponseToModel, modelToApi } from "./mutation.ts";
import { CharacterModifiers } from "../core/characterModifiers.ts";
import { describe, expect, test } from "vitest";
import { ApiResponse } from "../core/api.ts";
import { Visibility } from "../core/entity.ts";
import { testIsEqualCharacterModifiers, testIsEqualCommonProperties } from "../../../testing.ts";

const mutationApiData: MutationApiData = {
  name: "mutation",
  description: "desc",
  type: MutationType.Physical,
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
    effects: [],
  },
  source: { 1: "page 2", 3: "page 5-10" },
};

const mutationApiResponse: ApiResponse<MutationApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": mutationApiData },
};

const mutation = new Mutation({
  id: "id",
  ownerId: "owner",
  name: "mutation",
  description: "desc",
  type: MutationType.Physical,
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  }),
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(mutationApiResponse, "4e")).toMatchObject(mutation);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(mutation)).toMatchObject(mutationApiData);
});

testIsEqualCommonProperties("mutation", mutation);

testIsEqualCharacterModifiers("mutation", mutation);

describe("isEqualTo returns false", () => {
  test("when other mutation has different value of type");
  {
    const otherMutation = mutation.copy();
    otherMutation.type = 1;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  }
});
