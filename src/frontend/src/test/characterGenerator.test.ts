import { describe, expect, test } from "vitest";
import { AttributeName } from "../services/wh/attributes.ts";
import {
  Career,
  copyCareerLevel,
  getCareerAttributesByLevel,
  getCareerSkillsByLevel,
  getCareerTalentsByLevel,
  StatusTier,
  zeroCareerLevel,
} from "../services/wh/career.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import { Skill } from "../services/wh/skill.ts";
import { Talent } from "../services/wh/talent.ts";
import { GenerationProps } from "../services/wh/generationProps.ts";
import {
  CharacterGenerationContext,
  generateCharacter,
  generateClassItems,
  generateFateAndResilience,
  generateStatusAndStanding,
  getSpeciesFateResilience,
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

  test("generateClassItems returns items for valid career class", () => {
    const career = new Career({ careerClass: 0 });
    const result = generateClassItems(career, dummyGenProps, () => 5);
    expect(result.equipped.length).toEqual(2);
    expect(result.carried.length).toEqual(1);
  });

  test("generateStatusAndStanding returns level status and standing", () => {
    const career = new Career();
    career.level1.status = StatusTier.Silver;
    career.level1.standing = 3;

    const result = generateStatusAndStanding(career, 1);
    expect(result).toEqual({ status: StatusTier.Silver, standing: 3 });
  });

  test("getSpeciesFateResilience returns correct base stats for each species", () => {
    expect(getSpeciesFateResilience(SpeciesWithRegion.HumanReikland)).toEqual({ fate: 2, resilience: 1, extra: 3 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.HalflingDefault)).toEqual({ fate: 0, resilience: 2, extra: 3 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.DwarfDefault)).toEqual({ fate: 0, resilience: 2, extra: 2 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.GnomeDefault)).toEqual({ fate: 2, resilience: 0, extra: 2 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.OgreDefault)).toEqual({ fate: 0, resilience: 3, extra: 1 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.HighElfDefault)).toEqual({ fate: 0, resilience: 0, extra: 2 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.WoodElfDefault)).toEqual({ fate: 0, resilience: 0, extra: 2 });
    expect(getSpeciesFateResilience(SpeciesWithRegion.None)).toEqual({ fate: 0, resilience: 0, extra: 0 });
  });

  test("generateFateAndResilience allocates extra points using dice rolls", () => {
    const [fateAllToFate, resAllToFate] = generateFateAndResilience(SpeciesWithRegion.HumanReikland, () => 1);
    expect(fateAllToFate).toBe(2 + 3);
    expect(resAllToFate).toBe(1 + 0);

    const [fateAllToRes, resAllToRes] = generateFateAndResilience(SpeciesWithRegion.HumanReikland, () => 2);
    expect(fateAllToRes).toBe(2 + 0);
    expect(resAllToRes).toBe(1 + 3);
  });

  test("generateCharacter successfully generates a character with CharacterGenerationContext", () => {
    const career = new Career({
      id: "career1",
      careerClass: 0,
      level1: {
        ...copyCareerLevel(zeroCareerLevel),
        status: StatusTier.Silver,
        standing: 2,
        skills: new Set(["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"]),
        talents: new Set(["talent1"]),
        attributes: [AttributeName.WS],
      },
    });

    const skills = [
      new Skill({ id: "skill1", name: "Skill 1" }),
      new Skill({ id: "skill2", name: "Skill 2" }),
      new Skill({ id: "skill3", name: "Skill 3" }),
      new Skill({ id: "skill4", name: "Skill 4" }),
      new Skill({ id: "skill5", name: "Skill 5" }),
      new Skill({ id: "skill6", name: "Skill 6" }),
    ];

    const talents = [
      new Talent({ id: "talent1", name: "Talent 1" }),
      new Talent({ id: "talent2", name: "Talent 2" }),
    ];

    const context: CharacterGenerationContext = {
      species: SpeciesWithRegion.HumanReikland,
      career,
      level: 1,
      skills,
      talents,
      generationProps: dummyGenProps,
    };

    const character = generateCharacter(context);

    expect(character.species).toBe(SpeciesWithRegion.HumanReikland);
    expect(character.career.id).toBe("career1");
    expect(character.career.number).toBe(1);
    expect(character.name.length).toBeGreaterThan(0);
    expect(character.description.length).toBeGreaterThan(0);
    expect(character.status).toBe(StatusTier.Silver);
    expect(character.standing).toBe(2);
    expect(character.equippedItems).toHaveProperty("item1");
    expect(character.carriedItems).toHaveProperty("item3");
    expect(Object.keys(character.skills).length).toBeGreaterThan(0);
    expect(Object.keys(character.talents).length).toBeGreaterThan(0);
  });

  test("career level extraction helpers extract level arrays properly", () => {
    const career = new Career({
      level1: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["s1"]), talents: new Set(["t1"]), attributes: [AttributeName.WS] },
      level2: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["s2"]), talents: new Set(["t2"]), attributes: [AttributeName.BS] },
      level3: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["s3"]), talents: new Set(["t3"]), attributes: [AttributeName.S] },
      level4: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["s4"]), talents: new Set(["t4"]), attributes: [AttributeName.T] },
    });

    expect(getCareerSkillsByLevel(career)).toEqual({ 1: ["s1"], 2: ["s2"], 3: ["s3"], 4: ["s4"] });
    expect(getCareerTalentsByLevel(career)).toEqual([["t1"], ["t2"], ["t3"], ["t4"]]);
    expect(getCareerAttributesByLevel(career)).toEqual([[AttributeName.WS], [AttributeName.BS], [AttributeName.S], [AttributeName.T]]);
    expect(career.getSkillsByLevel()).toEqual({ 1: ["s1"], 2: ["s2"], 3: ["s3"], 4: ["s4"] });
    expect(career.getTalentsByLevel()).toEqual([["t1"], ["t2"], ["t3"], ["t4"]]);
    expect(career.getAttributesByLevel()).toEqual([[AttributeName.WS], [AttributeName.BS], [AttributeName.S], [AttributeName.T]]);
  });
});
