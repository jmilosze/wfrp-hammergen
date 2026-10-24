import { describe, expect, test } from "vitest";
import { Career, CareerClass, copyCareerLevel, zeroCareerLevel } from "@/services/wh/content/career.ts";
import { CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Edition } from "@/services/wh/core/edition.ts";
import { AttributeName } from "@/services/wh/core/attributes.ts";
import { Character } from "./character.ts";
import { GenerationProps, GenerationProps5e } from "./generation/shared/generationProps.ts";
import { careerAttributes, findCurrentCareer, itemMarks, Marks, skillMarks, talentMarks } from "./marks.ts";

// Soldier: level N has skill sN, talent tN and trapping iN; level 4 has a group skill and talent.
function level(
  n: number,
  trappings: CareerTrappingEntry[] = [{ options: [[{ id: `i${n}`, number: "1", value: "" }]] }],
) {
  return {
    ...copyCareerLevel(zeroCareerLevel),
    exists: true,
    skills: new Set([`s${n}`]),
    talents: new Set([`t${n}`]),
    trappings: trappings,
  };
}

const soldier = new Career({
  id: "soldier",
  careerClass: CareerClass.Burghers,
  level1: level(1),
  level2: level(2),
  level3: level(3),
  level4: {
    ...level(4),
    skills: new Set(["s4", "melee"]),
    talents: new Set(["t4", "acuteSense"]),
  },
});

const watchman = new Career({ id: "watchman", level1: level(1), level2: level(2) });

const skills = [
  ...["s1", "s2", "s3", "s4", "sp1", "sp2", "lang"].map((id) => new Skill({ id: id, name: id })),
  new Skill({ id: "melee", name: "Melee", isGroup: true }),
  new Skill({ id: "meleeBasic", name: "Melee (Basic)", group: new Set(["melee"]) }),
  new Skill({ id: "meleeFencing", name: "Melee (Fencing)", group: new Set(["melee"]) }),
];

const talents = [
  ...["t1", "t2", "t3", "t4", "doomed", "savvy", "suave"].map((id) => new Talent({ id: id, name: id, maxRank: 1 })),
  new Talent({ id: "acuteSense", name: "Acute Sense", isGroup: true }),
  new Talent({ id: "acuteSight", name: "Acute Sense (Sight)", maxRank: 1, group: new Set(["acuteSense"]) }),
];

const generationProps: GenerationProps5e = {
  classItems: {
    0: { equipped: {}, carried: { book: "1" } },
    1: { equipped: { "hood,mask": "1" }, carried: { i1: "1", rope: "1d10" } },
  },
  randomTalents: [
    { id: "t3", minRoll: 1, maxRoll: 50 },
    { id: "savvy", minRoll: 50, maxRoll: 101 },
  ],
  speciesTalents: { [SpeciesWithRegion.HumanReikland]: ["doomed", "savvy,suave", "random", "t2"] },
  speciesSkills: { [SpeciesWithRegion.HumanReikland]: ["sp1", "sp2", "s1"] },
  speciesLanguages: { [SpeciesWithRegion.HumanReikland]: ["lang"] },
  careerTable: {},
};

function character(edition: Edition, career: [string, number] | undefined, careerPath: [string, number][] = []) {
  return new Character({
    edition: edition,
    species: SpeciesWithRegion.HumanReikland,
    career: career === undefined ? undefined : { id: career[0], number: career[1] },
    careerPath: careerPath.map(([id, number]) => ({ id: id, number: number })),
  });
}

function current(wh: Character) {
  return findCurrentCareer(wh, [soldier, watchman]);
}

// The ids with the mark, sorted.
function marked(marks: Marks, mark: string): string[] {
  return [...marks.entries()]
    .filter(([, idMarks]) => [...idMarks].some((x) => x === mark))
    .map(([id]) => id)
    .sort();
}

function careerSkills(wh: Character): string[] {
  return marked(skillMarks(wh, current(wh), skills, generationProps), "career");
}

function careerTalents(wh: Character): string[] {
  return marked(talentMarks(wh, current(wh), talents, generationProps), "career");
}

describe("findCurrentCareer", () => {
  test("returns the current career with its level", () => {
    expect(current(character("5e", ["soldier", 3]))).toEqual({ career: soldier, level: 3 });
  });

  test("returns undefined without a current career or when the career is not in the list", () => {
    expect(current(character("5e", undefined))).toBeUndefined();
    expect(current(character("5e", ["unknown", 1]))).toBeUndefined();
  });
});

describe("career skills and talents", () => {
  test("count the current level and the lower levels in past careers", () => {
    const wh = character(
      "5e",
      ["soldier", 3],
      [
        ["soldier", 1],
        ["soldier", 2],
      ],
    );
    expect(careerSkills(wh)).toEqual(["s1", "s2", "s3"]);
    expect(careerTalents(wh)).toEqual(["t1", "t2", "t3"]);
  });

  test("count only the current level when no lower level is a past career", () => {
    const wh = character("5e", ["soldier", 3]);
    expect(careerSkills(wh)).toEqual(["s3"]);
    expect(careerTalents(wh)).toEqual(["t3"]);
  });

  test("skip the levels skipped when entering the career", () => {
    const enteredAt3 = character(
      "5e",
      ["soldier", 3],
      [
        ["watchman", 1],
        ["watchman", 2],
      ],
    );
    expect(careerSkills(enteredAt3)).toEqual(["s3"]);

    const promotedTo4 = character(
      "5e",
      ["soldier", 4],
      [
        ["soldier", 1],
        ["soldier", 2],
      ],
    );
    expect(careerSkills(promotedTo4)).toEqual(["meleeBasic", "meleeFencing", "s1", "s2", "s4"]);
  });

  test("ignore past careers above the current level and in other careers", () => {
    const wh = character(
      "5e",
      ["soldier", 2],
      [
        ["soldier", 1],
        ["soldier", 3],
        ["watchman", 2],
      ],
    );
    expect(careerSkills(wh)).toEqual(["s1", "s2"]);
  });

  test("4e talents count only the current level, 4e skills the lower levels too", () => {
    const wh = character(
      "4e",
      ["soldier", 3],
      [
        ["soldier", 1],
        ["soldier", 2],
      ],
    );
    expect(careerSkills(wh)).toEqual(["s1", "s2", "s3"]);
    expect(careerTalents(wh)).toEqual(["t3"]);
  });

  test("a group gives its members", () => {
    const wh = character("4e", ["soldier", 4]);
    expect(careerSkills(wh)).toEqual(["meleeBasic", "meleeFencing", "s4"]);
    expect(careerTalents(wh)).toEqual(["acuteSight", "t4"]);
  });

  test("no current career gives no career marks", () => {
    expect(careerSkills(character("5e", undefined))).toEqual([]);
  });
});

describe("species skills and talents", () => {
  test("species skills include 5e fluent languages", () => {
    const wh = character("5e", undefined);
    expect(marked(skillMarks(wh, undefined, skills, generationProps), "species")).toEqual(["lang", "s1", "sp1", "sp2"]);
  });

  test("4e generation data has no languages", () => {
    const props4e: GenerationProps = {
      classItems: {},
      randomTalents: [],
      speciesTalents: {},
      speciesSkills: { [SpeciesWithRegion.HumanReikland]: ["sp1"] },
    };
    const wh = character("4e", undefined);
    expect(marked(skillMarks(wh, undefined, skills, props4e), "species")).toEqual(["sp1"]);
  });

  test("species talents give every option of a choice", () => {
    const wh = character("5e", undefined);
    expect(marked(talentMarks(wh, undefined, talents, generationProps), "species")).toEqual([
      "doomed",
      "savvy",
      "suave",
      "t2",
    ]);
  });

  test("a species with Random Talents gets the table's talents as Species (Random), unless they are Species", () => {
    const wh = character("5e", undefined);
    expect(marked(talentMarks(wh, undefined, talents, generationProps), "randomSpecies")).toEqual(["t3"]);
  });

  test("a species without Random Talents gets no Species (Random)", () => {
    const wh = new Character({ edition: "5e", species: SpeciesWithRegion.DwarfDefault });
    const props: GenerationProps5e = {
      ...generationProps,
      speciesTalents: { [SpeciesWithRegion.DwarfDefault]: ["t1"] },
    };
    expect(marked(talentMarks(wh, undefined, talents, props), "randomSpecies")).toEqual([]);
  });

  test("an item can have several marks", () => {
    const wh = character("5e", ["soldier", 1]);
    expect(skillMarks(wh, current(wh), skills, generationProps).get("s1")).toEqual(new Set(["career", "species"]));
  });

  test("a species without generation data gives no species marks", () => {
    const wh = new Character({ edition: "5e", species: SpeciesWithRegion.DwarfDefault });
    expect(marked(skillMarks(wh, undefined, skills, generationProps), "species")).toEqual([]);
  });
});

describe("itemMarks", () => {
  test("career trappings come from the current level only, every option of an entry", () => {
    const withChoice = new Career({
      id: "soldier",
      careerClass: CareerClass.Burghers,
      level1: level(1),
      level2: level(2, [
        {
          options: [
            [
              { id: "bow", number: "1", value: "" },
              { id: "arrow", number: "10", value: "" },
            ],
            [{ id: "crossbow", number: "1", value: "" }],
          ],
        },
      ]),
    });
    const wh = character("5e", ["soldier", 2], [["soldier", 1]]);
    expect(marked(itemMarks(wh, findCurrentCareer(wh, [withChoice]), generationProps), "career")).toEqual([
      "arrow",
      "bow",
      "crossbow",
    ]);
  });

  test("class trappings come from the career's class, every option of a choice", () => {
    const wh = character("5e", ["soldier", 1]);
    const marks = itemMarks(wh, current(wh), generationProps);
    expect(marked(marks, "class")).toEqual(["hood", "i1", "mask", "rope"]);
    expect(marks.get("i1")).toEqual(new Set(["career", "class"]));
  });

  test("no current career gives no marks", () => {
    const wh = character("5e", undefined);
    expect(itemMarks(wh, current(wh), generationProps).size).toBe(0);
  });
});

describe("careerAttributes", () => {
  const knight = new Career({
    id: "knight",
    level1: { ...level(1), attributes: [AttributeName.WS, AttributeName.S, AttributeName.T] },
    level2: { ...level(2), attributes: [AttributeName.Ag] },
    level3: { ...level(3), attributes: [AttributeName.WP] },
  });

  function attributes(wh: Character): Set<AttributeName> {
    return careerAttributes(wh, findCurrentCareer(wh, [knight]));
  }

  test("are the current level's and those of the lower levels in past careers", () => {
    const wh = character("4e", ["knight", 3], [["knight", 1]]);
    expect(attributes(wh)).toEqual(new Set([AttributeName.WS, AttributeName.S, AttributeName.T, AttributeName.WP]));
  });

  test("are none without a current career", () => {
    expect(attributes(character("5e", undefined)).size).toBe(0);
  });
});
