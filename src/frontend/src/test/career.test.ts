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
    attributes: [AttributeName.T, AttributeName.Dex],
    skills: ["skill21", "skill22"],
    talents: ["talent21", "talent22"],
    items: "items2",
  } as CareerLevel,
  level3: {
    name: "l3",
    status: StatusTier.Silver,
    standing: 4,
    attributes: [AttributeName.Int, AttributeName.Fel],
    skills: ["skill31", "skill32"],
    talents: ["talent31", "talent32"],
    items: "items3",
  } as CareerLevel,
  level4: {
    name: "l4",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.S, AttributeName.BS],
    skills: ["skill41", "skill42"],
    talents: ["talent41", "talent42"],
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
    attributes: [AttributeName.T, AttributeName.Dex],
    skills: ["skill21", "skill22"],
    talents: ["talent21", "talent22"],
    items: "items2",
  } as CareerLevel,
  level3: {
    name: "l3",
    status: StatusTier.Silver,
    standing: 4,
    attributes: [AttributeName.Int, AttributeName.Fel],
    skills: ["skill31", "skill32"],
    talents: ["talent31", "talent32"],
    items: "items3",
  } as CareerLevel,
  level4: {
    name: "l4",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.S, AttributeName.BS],
    skills: ["skill41", "skill42"],
    talents: ["talent41", "talent42"],
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

describe("isEqualTo returns true", () => {
  const otherCareer = career.copy();
  describe.each([
    { name: "level1", level: otherCareer.level1 },
    { name: "level2", level: otherCareer.level2 },
    { name: "level3", level: otherCareer.level3 },
    { name: "level4", level: otherCareer.level4 },
  ])(`when other career has different $name`, (t) => {
    test("attributes are in different order", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.attributes));
      t.level.attributes.reverse();
      expect(career.isEqualTo(otherCareer)).toBe(true);
      t.level.attributes = currentValue;
    });

    test("skills are in different order", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.skills));
      t.level.skills.reverse();
      expect(career.isEqualTo(otherCareer)).toBe(true);
      t.level.skills = currentValue;
    });

    test("talents are in different order", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.talents));
      t.level.talents.reverse();
      expect(career.isEqualTo(otherCareer)).toBe(true);
      t.level.talents = currentValue;
    });
  });
});

describe("isEqualTo returns false", () => {
  const otherCareer = career.copy();
  describe.each([
    { name: "level1", level: otherCareer.level1 },
    { name: "level2", level: otherCareer.level2 },
    { name: "level3", level: otherCareer.level3 },
    { name: "level4", level: otherCareer.level4 },
  ])(`when other career has different $name`, (t) => {
    test("the difference is name", () => {
      const currentValue = t.level.name;
      t.level.name = "otherLevelName";
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.name = currentValue;
    });

    test("the difference is status", () => {
      const currentValue = t.level.status;
      t.level.status = StatusTier.Gold;
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.status = currentValue;
    });

    test("the difference is standing", () => {
      const currentValue = t.level.standing;
      t.level.standing = 6;
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.standing = currentValue;
    });

    test("the difference is items", () => {
      const currentValue = t.level.items;
      t.level.items = "otherItems";
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.items = currentValue;
    });

    test("attributes is subset", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.attributes));
      t.level.attributes.pop();
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.attributes = currentValue;
    });

    test("attributes is same length but different elements", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.attributes));
      t.level.attributes[1] = AttributeName.None;
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.attributes = currentValue;
    });

    test("skills is subset", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.skills));
      t.level.skills.pop();
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.skills = currentValue;
    });

    test("skills is same length but different elements", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.skills));
      t.level.skills[1] = "someOtherSkill";
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.skills = currentValue;
    });

    test("talents is subset", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.talents));
      t.level.talents.pop();
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.talents = currentValue;
    });

    test("talents is same length but different elements", () => {
      const currentValue = JSON.parse(JSON.stringify(t.level.talents));
      t.level.talents[1] = "someOtherTalent";
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.talents = currentValue;
    });
  });
});
