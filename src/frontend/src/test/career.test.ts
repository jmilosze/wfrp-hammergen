import {
  apiResponseToModel,
  Career,
  CareerApiData,
  CareerClass,
  CareerLevel,
  CareerLevelApiData,
  findCareerMatches,
  getCareersForSkill,
  getCareersForTalent,
  modelToApi,
  Species,
  StatusTier,
} from "../services/wh/career.ts";
import { AttributeName } from "../services/wh/attributes.ts";
import { ApiResponse, Visibility } from "../services/wh/common.ts";
import { describe, expect, test, vi } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const careerApiData: CareerApiData = {
  name: "career",
  description: "some desc",
  species: [Species.Dwarf, Species.Human],
  class: CareerClass.Academic,
  source: { 1: "page 2", 3: "page 5-10" },
  level1: {
    exists: true,
    name: "l1",
    status: StatusTier.Brass,
    standing: 1,
    attributes: [AttributeName.Ag, AttributeName.I],
    skills: ["skill11", "skill12"],
    talents: ["talent11", "talent12"],
    items: "items1",
  } as CareerLevelApiData,
  level2: {
    exists: true,
    name: "l2",
    status: StatusTier.Silver,
    standing: 2,
    attributes: [AttributeName.T, AttributeName.Dex],
    skills: ["skill21", "skill22"],
    talents: ["talent21", "talent22"],
    items: "items2",
  } as CareerLevelApiData,
  level3: {
    exists: true,
    name: "l3",
    status: StatusTier.Silver,
    standing: 4,
    attributes: [AttributeName.Int, AttributeName.Fel],
    skills: ["skill31", "skill32"],
    talents: ["talent31", "talent32"],
    items: "items3",
  } as CareerLevelApiData,
  level4: {
    exists: true,
    name: "l4",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.S, AttributeName.BS],
    skills: ["skill41", "skill42"],
    talents: ["talent41", "talent42"],
    items: "items4",
  } as CareerLevelApiData,
  level5: {
    exists: true,
    name: "l5",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.WS, AttributeName.BS],
    skills: ["skill51", "skill52"],
    talents: ["talent51", "talent52"],
    items: "items5",
  } as CareerLevelApiData,
};

const careerApiResponse: ApiResponse<CareerApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Private,
  editions: { "4e": careerApiData },
};

const career = new Career({
  id: "id",
  ownerId: "owner",
  name: "career",
  description: "some desc",
  species: [Species.Dwarf, Species.Human],
  careerClass: CareerClass.Academic,
  source: { 1: "page 2", 3: "page 5-10" },
  level1: {
    exists: true,
    name: "l1",
    status: StatusTier.Brass,
    standing: 1,
    attributes: [AttributeName.Ag, AttributeName.I],
    skills: new Set(["skill11", "skill12"]),
    talents: new Set(["talent11", "talent12"]),
    items: "items1",
  } as CareerLevel,
  level2: {
    exists: true,
    name: "l2",
    status: StatusTier.Silver,
    standing: 2,
    attributes: [AttributeName.T, AttributeName.Dex],
    skills: new Set(["skill21", "skill22"]),
    talents: new Set(["talent21", "talent22"]),
    items: "items2",
  } as CareerLevel,
  level3: {
    exists: true,
    name: "l3",
    status: StatusTier.Silver,
    standing: 4,
    attributes: [AttributeName.Int, AttributeName.Fel],
    skills: new Set(["skill31", "skill32"]),
    talents: new Set(["talent31", "talent32"]),
    items: "items3",
  } as CareerLevel,
  level4: {
    exists: true,
    name: "l4",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.S, AttributeName.BS],
    skills: new Set(["skill41", "skill42"]),
    talents: new Set(["talent41", "talent42"]),
    items: "items4",
  } as CareerLevel,
  level5: {
    exists: true,
    name: "l5",
    status: StatusTier.Silver,
    standing: 5,
    attributes: [AttributeName.WS, AttributeName.BS],
    skills: new Set(["skill51", "skill52"]),
    talents: new Set(["talent51", "talent52"]),
    items: "items5",
  } as CareerLevel,
});

test("apiResponseToModel returns expected career", () => {
  expect(apiResponseToModel(careerApiResponse, "4e")).toMatchObject(career);
});

test("modelToApi returns expected api career data", () => {
  expect(modelToApi(career)).toMatchObject(careerApiData);
});

test("apiResponseToModel sets an empty income skill when the variant has none", () => {
  expect(apiResponseToModel(careerApiResponse, "4e").incomeSkill).toBe("");
});

test("income skill round-trips through the api data", () => {
  const withIncome = apiResponseToModel(
    {
      ...careerApiResponse,
      editions: { "4e": { ...careerApiData, incomeSkill: "skill11" } },
    },
    "4e",
  );
  expect(withIncome.incomeSkill).toBe("skill11");
  expect(modelToApi(withIncome).incomeSkill).toBe("skill11");
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
    { name: "level5", level: otherCareer.level5 },
  ])(`when other career has different $name`, (t) => {
    test("attributes are in different order", () => {
      const currentValue = [...t.level.attributes];
      t.level.attributes.reverse();
      expect(career.isEqualTo(otherCareer)).toBe(true);
      t.level.attributes = currentValue;
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
    { name: "level5", level: otherCareer.level5 },
  ])(`when other career has different $name`, (t) => {
    test("the difference is exists", () => {
      const currentValue = t.level.exists;
      t.level.exists = false;
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.exists = currentValue;
    });

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
      const currentValue = [...t.level.attributes];
      t.level.attributes.pop();
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.attributes = currentValue;
    });

    test("attributes is same length but different elements", () => {
      const currentValue = [...t.level.attributes];
      t.level.attributes[1] = AttributeName.None;
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.attributes = currentValue;
    });

    test("skills is subset", () => {
      const currentValue = new Set(t.level.skills);
      const firstSkill = t.level.skills.values().next().value;
      if (firstSkill) {
        t.level.skills.delete(firstSkill);
      }
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.skills = currentValue;
    });

    test("skills is same length but different elements", () => {
      const currentValue = new Set(t.level.skills);
      const firstSkill = t.level.skills.values().next().value;
      if (firstSkill) {
        t.level.skills.delete(firstSkill);
      }
      t.level.skills.add("someOtherSkill");
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.skills = currentValue;
    });

    test("talents is subset", () => {
      const currentValue = new Set(t.level.talents);
      const firstTalent = t.level.talents.values().next().value;
      if (firstTalent) {
        t.level.talents.delete(firstTalent);
      }
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.talents = currentValue;
    });

    test("talents is same length but different elements", () => {
      const currentValue = new Set(t.level.talents);
      const firstTalent = t.level.talents.values().next().value;
      if (firstTalent) {
        t.level.talents.delete(firstTalent);
      }
      t.level.talents.add("someOtherTalent");
      expect(career.isEqualTo(otherCareer)).toBe(false);
      t.level.talents = currentValue;
    });
  });

  describe("findCareerMatches", () => {
    const testCareer = apiResponseToModel(
      {
        id: "career-1",
        ownerId: "owner-1",
        visibility: Visibility.Public,
        editions: {
          "4e": {
            name: "Test Career",
            description: "description",
            species: [Species.Human],
            class: CareerClass.Warrior,
            source: {},
            level1: {
              exists: true,
              name: "Level 1 Name",
              status: StatusTier.Brass,
              standing: 1,
              attributes: [],
              skills: ["skill-a", "group-1"],
              talents: ["talent-a"],
              items: "",
            },
            level2: {
              exists: false,
              name: "Level 2 Inactive",
              status: StatusTier.Brass,
              standing: 1,
              attributes: [],
              skills: ["skill-a"],
              talents: ["talent-a"],
              items: "",
            },
            level3: {
              exists: true,
              name: "Level 3 Name",
              status: StatusTier.Silver,
              standing: 2,
              attributes: [],
              skills: ["skill-b"],
              talents: ["talent-b", "talent-group-1"],
              items: "",
            },
            level4: {
              exists: false,
              name: "",
              status: StatusTier.Brass,
              standing: 0,
              attributes: [],
              skills: [],
              talents: [],
              items: "",
            },
            level5: {
              exists: false,
              name: "",
              status: StatusTier.Brass,
              standing: 0,
              attributes: [],
              skills: [],
              talents: [],
              items: "",
            },
          },
        },
      },
      "4e",
    );

    test("matches skill on active levels and ignores inactive levels", () => {
      const match = findCareerMatches(testCareer, new Set(["skill-a"]), "skill");
      expect(match).toEqual({
        id: "career-1",
        name: "Test Career",
        careerClass: CareerClass.Warrior,
        levels: [1],
      });
    });

    test("matches parent group ID when passed in searchIds", () => {
      const match = findCareerMatches(testCareer, new Set(["skill-child", "group-1"]), "skill");
      expect(match).toEqual({
        id: "career-1",
        name: "Test Career",
        careerClass: CareerClass.Warrior,
        levels: [1],
      });
    });

    test("matches multiple active levels", () => {
      const match = findCareerMatches(testCareer, new Set(["skill-a", "skill-b"]), "skill");
      expect(match).toEqual({
        id: "career-1",
        name: "Test Career",
        careerClass: CareerClass.Warrior,
        levels: [1, 3],
      });
    });

    test("returns null if no skills match", () => {
      const match = findCareerMatches(testCareer, new Set(["skill-unknown"]), "skill");
      expect(match).toBeNull();
    });

    test("matches talents on active levels including parent group", () => {
      const match = findCareerMatches(testCareer, new Set(["talent-child", "talent-group-1"]), "talent");
      expect(match).toEqual({
        id: "career-1",
        name: "Test Career",
        careerClass: CareerClass.Warrior,
        levels: [3],
      });
    });

    test("returns null if no talents match", () => {
      const match = findCareerMatches(testCareer, new Set(["talent-unknown"]), "talent");
      expect(match).toBeNull();
    });
  });

  describe("career API lookups", () => {
    test("getCareersForSkill calls endpoint with skillId params and maps response", async () => {
      const mockCareerApi: ApiResponse<CareerApiData> = {
        id: "c-1",
        ownerId: "u-1",
        visibility: Visibility.Public,
        editions: { "4e": careerApiData },
      };

      const mockAxios = {
        get: vi.fn().mockResolvedValue({ data: { data: [mockCareerApi] } }),
      };

      const result = await getCareersForSkill(mockAxios, ["skill-1", "group-1"], "4e");

      expect(mockAxios.get).toHaveBeenCalledWith("/api/wh/career", {
        params: { skillId: ["skill-1", "group-1"], edition: "4e" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("c-1");
      expect(result[0].name).toBe("career");
    });

    test("getCareersForTalent calls endpoint with talentId params and maps response", async () => {
      const mockCareerApi: ApiResponse<CareerApiData> = {
        id: "c-2",
        ownerId: "u-1",
        visibility: Visibility.Public,
        editions: { "5e": careerApiData },
      };

      const mockAxios = {
        get: vi.fn().mockResolvedValue({ data: { data: [mockCareerApi] } }),
      };

      const result = await getCareersForTalent(mockAxios, ["talent-1"], "5e");

      expect(mockAxios.get).toHaveBeenCalledWith("/api/wh/career", {
        params: { talentId: ["talent-1"], edition: "5e" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("c-2");
    });
  });
});
