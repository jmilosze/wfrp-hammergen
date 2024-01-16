import {
  apiResponseToModel,
  Career,
  CareerApiData,
  CareerClass,
  CareerLevel,
  modelToApi,
  Species,
  StatusTier,
} from "../services/wh/career.ts";
import { AttributeName } from "../services/wh/attributes.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const careerApiData: CareerApiData = {
  name: "career",
  description: "some desc",
  species: [Species.Dwarf, Species.Human],
  class: CareerClass.Academic,
  shared: false,
  source: { 1: "page 2", 3: "page 5-10" },
  level1: {
    name: "l1",
    status: StatusTier.Brass,
    standing: 1,
    attributes: [AttributeName.Ag, AttributeName.I],
    skills: ["skill11", "skill12"],
    talents: ["talent11", "talent12"],
    items: "items1",
  } as CareerLevel,
  level2: {
    name: "l2",
    status: StatusTier.Silver,
    standing: 2,
    attributes: [AttributeName.T],
    skills: ["skill21", "skill22"],
    talents: ["talent21", "talent22"],
    items: "items2",
  } as CareerLevel,
  level3: {
    name: "l3",
    status: StatusTier.Gold,
    standing: 4,
    attributes: [AttributeName.Int],
    skills: ["skill3"],
    talents: ["talent3"],
    items: "items3",
  } as CareerLevel,
  level4: {
    name: "l4",
    status: StatusTier.Gold,
    standing: 5,
    attributes: [AttributeName.S],
    skills: [],
    talents: [],
    items: "items4",
  } as CareerLevel,
};

const careerApiResponse: ApiResponse<CareerApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: careerApiData,
};

const career = new Career({
  id: "id",
  canEdit: true,
  name: "career",
  description: "some desc",
  species: [Species.Dwarf, Species.Human],
  careerClass: CareerClass.Academic,
  shared: false,
  source: { 1: "page 2", 3: "page 5-10" },
  level1: {
    name: "l1",
    status: StatusTier.Brass,
    standing: 1,
    attributes: [AttributeName.Ag, AttributeName.I],
    skills: ["skill11", "skill12"],
    talents: ["talent11", "talent12"],
    items: "items1",
  } as CareerLevel,
  level2: {
    name: "l2",
    status: StatusTier.Silver,
    standing: 2,
    attributes: [AttributeName.T],
    skills: ["skill21", "skill22"],
    talents: ["talent21", "talent22"],
    items: "items2",
  } as CareerLevel,
  level3: {
    name: "l3",
    status: StatusTier.Gold,
    standing: 4,
    attributes: [AttributeName.Int],
    skills: ["skill3"],
    talents: ["talent3"],
    items: "items3",
  } as CareerLevel,
  level4: {
    name: "l4",
    status: StatusTier.Gold,
    standing: 5,
    attributes: [AttributeName.S],
    skills: [],
    talents: [],
    items: "items4",
  } as CareerLevel,
});

test("apiResponseToModel returns expected career", () => {
  expect(apiResponseToModel(careerApiResponse)).toMatchObject(career);
});

test("modelToApi returns expected api career data", () => {
  expect(modelToApi(career)).toMatchObject(careerApiData);
});

testIsEqualCommonProperties("career", career);

describe("isEqualTo returns true", () => {
  test("when other career has species field with elements in different order", () => {
    const otherCareer = career.copy();
    otherCareer.species = [Species.Human, Species.Dwarf];
    expect(career.isEqualTo(otherCareer)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other career has different value of careerClass", () => {
    const otherCareer = career.copy();
    otherCareer.careerClass = CareerClass.Courtier;
    expect(career.isEqualTo(otherCareer)).toBe(false);
  });
});
