import { describe, expect, test } from "vitest";
import { Character } from "../services/wh/character.ts";
import { Career, StatusTier } from "../services/wh/career.ts";
import { GenerationProps } from "../services/wh/generationProps.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { Skill } from "../services/wh/skill.ts";
import { Talent } from "../services/wh/talent.ts";
import {
  populateClassItems,
  populateDescription,
  populateFateAndResilience,
  populateName,
  populateSpeciesSkills,
  populateSpeciesTalents,
  populateStatusAndStanding,
} from "../services/wh/characterGeneration/populateCharacter.ts";

describe("populateCharacter", () => {
  const dummyGenProps: GenerationProps = {
    classItems: [
      {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    ],
    randomTalents: [
      { id: "rand1", minRoll: 1, maxRoll: 50 },
      { id: "rand2", minRoll: 50, maxRoll: 101 },
    ],
    speciesTalents: {
      [SpeciesWithRegion.HumanReikland]: ["talent1", "talent2"],
    },
    speciesSkills: {
      [SpeciesWithRegion.HumanReikland]: [
        "skill1",
        "skill2",
        "skill3",
        "skill4",
        "skill5",
        "skill6",
      ],
    },
  };

  test("populateSpeciesSkills populates skills on character when species is supported", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    const skills = [
      new Skill({ id: "skill1", name: "Skill 1" }),
      new Skill({ id: "skill2", name: "Skill 2" }),
      new Skill({ id: "skill3", name: "Skill 3" }),
      new Skill({ id: "skill4", name: "Skill 4" }),
      new Skill({ id: "skill5", name: "Skill 5" }),
      new Skill({ id: "skill6", name: "Skill 6" }),
    ];

    populateSpeciesSkills(char, skills, dummyGenProps);
    expect(Object.keys(char.skills).length).toBeGreaterThan(0);
  });

  test("populateSpeciesSkills does not modify character skills when species is not in generationProps", () => {
    const char = new Character({ species: SpeciesWithRegion.None });
    populateSpeciesSkills(char, [], dummyGenProps);
    expect(char.skills).toEqual({});
  });

  test("populateSpeciesTalents populates talents on character when species is supported", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    const talents = [
      new Talent({ id: "talent1", name: "Talent 1" }),
      new Talent({ id: "talent2", name: "Talent 2" }),
    ];

    populateSpeciesTalents(char, talents, dummyGenProps);
    expect(char.talents).toEqual({ talent1: 1, talent2: 1 });
  });

  test("populateSpeciesTalents does not modify character talents when species is not supported", () => {
    const char = new Character({ species: SpeciesWithRegion.None });
    populateSpeciesTalents(char, [], dummyGenProps);
    expect(char.talents).toEqual({});
  });

  test("populateClassItems updates equipped and carried items on character", () => {
    const career = new Career({ id: "c1", careerClass: 0 });
    const char = new Character({ career: { id: "c1", number: 1 } });

    populateClassItems(char, [career], dummyGenProps, () => 3);
    expect(Object.keys(char.equippedItems).length).toBe(2);
    expect(Object.keys(char.carriedItems).length).toBe(1);
  });

  test("populateStatusAndStanding updates status on character", () => {
    const career = new Career({ id: "c1" });
    career.level2.status = StatusTier.Gold;
    career.level2.standing = 2;
    const char = new Character({ career: { id: "c1", number: 2 } });

    populateStatusAndStanding(char, [career]);
    expect(char.status).toEqual(StatusTier.Gold);
    expect(char.standing).toEqual(2);
  });

  test("populateFateAndResilience generates and updates fate and resilience", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    populateFateAndResilience(char, () => 2);
    expect(char.fate).toBeGreaterThanOrEqual(2);
    expect(char.resilience).toBeGreaterThanOrEqual(1);
    expect(char.fortune).toEqual(char.fate);
    expect(char.resolve).toEqual(char.resilience);
  });

  test("populateName sets non-empty name on character", () => {
    const char = new Character({ species: SpeciesWithRegion.DwarfDefault });
    populateName(char);
    expect(char.name.length).toBeGreaterThan(0);
  });

  test("populateDescription sets non-empty description on character", () => {
    const char = new Character({ species: SpeciesWithRegion.HighElfDefault });
    populateDescription(char);
    expect(char.description).toMatch(/^Age: \d+, Height: \d+'\d+", Eyes: .+, Hair: .+$/);
  });
});
