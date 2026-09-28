import { describe, expect, test } from "vitest";
import { Character } from "../services/wh/character.ts";
import { Career, StatusTier } from "../services/wh/career.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { Skill } from "../services/wh/skill.ts";
import { Talent } from "../services/wh/talent.ts";
import { GenerationProps } from "../services/wh/generationProps.ts";
import {
  applyClassItems,
  applyDescription,
  applyFateAndResilience,
  applyName,
  applySpeciesSkills,
  applySpeciesTalents,
  applyStatusAndStanding,
  generateClassItemsForCareer,
  generateSpeciesSkillsForSpecies,
  generateSpeciesTalentsForSpecies,
  generateStatusAndStanding,
} from "../services/wh/characterGeneration/characterGenerator.ts";

describe("characterGenerator domain service", () => {
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

  test("generateSpeciesSkillsForSpecies returns skills when species is supported", () => {
    const skills = [
      new Skill({ id: "skill1", name: "Skill 1" }),
      new Skill({ id: "skill2", name: "Skill 2" }),
      new Skill({ id: "skill3", name: "Skill 3" }),
      new Skill({ id: "skill4", name: "Skill 4" }),
      new Skill({ id: "skill5", name: "Skill 5" }),
      new Skill({ id: "skill6", name: "Skill 6" }),
    ];

    const result = generateSpeciesSkillsForSpecies(
      SpeciesWithRegion.HumanReikland,
      skills,
      dummyGenProps,
    );

    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  test("generateSpeciesSkillsForSpecies returns empty object when species is not in generationProps", () => {
    const result = generateSpeciesSkillsForSpecies(
      SpeciesWithRegion.None,
      [],
      dummyGenProps,
    );
    expect(result).toEqual({});
  });

  test("applySpeciesSkills populates skills on character", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    const skills = [
      new Skill({ id: "skill1", name: "Skill 1" }),
      new Skill({ id: "skill2", name: "Skill 2" }),
      new Skill({ id: "skill3", name: "Skill 3" }),
      new Skill({ id: "skill4", name: "Skill 4" }),
      new Skill({ id: "skill5", name: "Skill 5" }),
      new Skill({ id: "skill6", name: "Skill 6" }),
    ];

    applySpeciesSkills(char, skills, dummyGenProps);
    expect(Object.keys(char.skills).length).toBeGreaterThan(0);
  });

  test("generateSpeciesTalentsForSpecies returns talents when species is supported", () => {
    const talents = [
      new Talent({ id: "talent1", name: "Talent 1" }),
      new Talent({ id: "talent2", name: "Talent 2" }),
    ];

    const result = generateSpeciesTalentsForSpecies(
      SpeciesWithRegion.HumanReikland,
      talents,
      dummyGenProps,
    );

    expect(result).toEqual({ talent1: 1, talent2: 1 });
  });

  test("generateSpeciesTalentsForSpecies returns empty object when species is not supported", () => {
    const result = generateSpeciesTalentsForSpecies(
      SpeciesWithRegion.None,
      [],
      dummyGenProps,
    );
    expect(result).toEqual({});
  });

  test("applySpeciesTalents populates talents on character", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    const talents = [
      new Talent({ id: "talent1", name: "Talent 1" }),
      new Talent({ id: "talent2", name: "Talent 2" }),
    ];

    applySpeciesTalents(char, talents, dummyGenProps);
    expect(char.talents).toEqual({ talent1: 1, talent2: 1 });
  });

  test("generateClassItemsForCareer returns items for valid career class", () => {
    const career = new Career({ careerClass: 0 });
    const result = generateClassItemsForCareer(career, dummyGenProps, () => 5);
    expect(result.equipped.length).toEqual(2);
    expect(result.carried.length).toEqual(1);
  });

  test("applyClassItems updates equipped and carried items on character", () => {
    const career = new Career({ id: "c1", careerClass: 0 });
    const char = new Character({ career: { id: "c1", number: 1 } });

    applyClassItems(char, [career], dummyGenProps, () => 3);
    expect(Object.keys(char.equippedItems).length).toBe(2);
    expect(Object.keys(char.carriedItems).length).toBe(1);
  });

  test("generateStatusAndStanding returns level status and standing", () => {
    const career = new Career();
    career.level1.status = StatusTier.Silver;
    career.level1.standing = 3;

    const result = generateStatusAndStanding(career, 1);
    expect(result).toEqual({ status: StatusTier.Silver, standing: 3 });
  });

  test("applyStatusAndStanding updates status on character", () => {
    const career = new Career({ id: "c1" });
    career.level2.status = StatusTier.Gold;
    career.level2.standing = 2;
    const char = new Character({ career: { id: "c1", number: 2 } });

    applyStatusAndStanding(char, [career]);
    expect(char.status).toEqual(StatusTier.Gold);
    expect(char.standing).toEqual(2);
  });

  test("applyFateAndResilience generates and updates fate and resilience", () => {
    const char = new Character({ species: SpeciesWithRegion.HumanReikland });
    applyFateAndResilience(char, () => 2);
    expect(char.fate).toBeGreaterThanOrEqual(2);
    expect(char.resilience).toBeGreaterThanOrEqual(1);
    expect(char.fortune).toEqual(char.fate);
    expect(char.resolve).toEqual(char.resilience);
  });

  test("applyName sets non-empty name on character", () => {
    const char = new Character({ species: SpeciesWithRegion.DwarfDefault });
    applyName(char);
    expect(char.name.length).toBeGreaterThan(0);
  });

  test("applyDescription sets non-empty description on character", () => {
    const char = new Character({ species: SpeciesWithRegion.HighElfDefault });
    applyDescription(char);
    expect(char.description).toMatch(/^Age: \d+, Height: \d+'\d+", Eyes: .+, Hair: .+$/);
  });
});
