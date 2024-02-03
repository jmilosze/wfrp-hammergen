import { Mutation, MutationApiData, MutationType, apiResponseToModel, modelToApi } from "../services/wh/mutation.ts";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { describe, expect, test } from "vitest";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCharacterModifiers, testIsEqualCommonProperties } from "./commonTests.ts";

const mutationApiData: MutationApiData = {
  name: "mutation",
  description: "desc",
  type: MutationType.Physical,
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
  type: MutationType.Physical,
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

testIsEqualCharacterModifiers("mutation", mutation);

describe("isEqualTo returns false", () => {
  test("when other mutation has different value of type");
  {
    const otherMutation = mutation.copy();
    otherMutation.type = 1;
    expect(mutation.isEqualTo(otherMutation)).toBe(false);
  }
});
