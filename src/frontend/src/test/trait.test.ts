import { Trait, TraitApiData, apiResponseToModel, modelToApi } from "../services/wh/trait.ts";
import { expect, test } from "vitest";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCharacterModifiers, testIsEqualCommonProperties } from "./commonTests.ts";

const traitGroupApiData: TraitApiData = {
  name: "trait1",
  description: "desc1",
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
    effects: [],
  },
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const traitGroupApiResponse: ApiResponse<TraitApiData> = {
  id: "id1",
  canEdit: true,
  ownerId: "owner",
  object: traitGroupApiData,
};

const traitGroup = new Trait({
  id: "id1",
  canEdit: true,
  name: "trait1",
  description: "desc1",
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  }),
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

const traitIndividual = new Trait({
  id: "id2",
  canEdit: true,
  name: "trait2",
  description: "desc2",
  modifiers: new CharacterModifiers({
    size: 0,
    movement: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  }),
  shared: true,
  source: {},
});

test("apiResponseToModel returns expected trait", () => {
  expect(apiResponseToModel(traitGroupApiResponse)).toMatchObject(traitGroup);
});

test("modelToApi returns expected api trait data", () => {
  expect(modelToApi(traitGroup)).toMatchObject(traitGroupApiData);
});

testIsEqualCommonProperties("trait", traitIndividual);

testIsEqualCharacterModifiers("trait", traitIndividual);
