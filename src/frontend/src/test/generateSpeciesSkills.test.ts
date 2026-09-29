import { describe, expect, test } from "vitest";
import { Skill } from "../services/wh/skill.ts";
import { generateSpeciesSkills } from "../services/wh/characterGeneration/generateSpeciesSkills.ts";
import { resolveEntityGroups } from "../services/wh/characterGeneration/resolveEntityGroups.ts";
import { getSelectRandomTest } from "./commonTests.ts";

describe("generateSpeciesSkills", () => {
  const dummySkills: Skill[] = [
    new Skill({ id: "s1", name: "Skill 1" }),
    new Skill({ id: "s2", name: "Skill 2" }),
    new Skill({ id: "s3", name: "Skill 3" }),
    new Skill({ id: "s4", name: "Skill 4" }),
    new Skill({ id: "s5", name: "Skill 5" }),
    new Skill({ id: "s6", name: "Skill 6" }),
    new Skill({ id: "s7", name: "Skill 7" }),
    new Skill({ id: "s8", name: "Skill 8" }),
    new Skill({ id: "melee_basic", name: "Melee (Basic)", group: new Set(["melee"]) }),
    new Skill({ id: "melee_brawling", name: "Melee (Brawling)", group: new Set(["melee"]) }),
    new Skill({ id: "art_painting", name: "Art (Painting)", group: new Set(["art"]) }),
    new Skill({ id: "art_sculpture", name: "Art (Sculpture)", group: new Set(["art"]) }),
  ];

  const resolvedGroups = resolveEntityGroups(dummySkills);

  test("generates 3 skills at +3 and 3 skills at +5 advances", () => {
    const speciesCandidates = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    const result = generateSpeciesSkills(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    const values = Object.values(result);
    expect(values.length).toBe(6);
    expect(values.filter((v) => v === 3).length).toBe(3);
    expect(values.filter((v) => v === 5).length).toBe(3);
  });

  test("ensures 6 distinct skills are chosen without overlap between +3 and +5", () => {
    const speciesCandidates = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    const result = generateSpeciesSkills(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    const keys = Object.keys(result);
    expect(new Set(keys).size).toBe(6);
  });

  test("deduplicates candidate skills if input contains duplicates", () => {
    const speciesCandidates = ["s1", "s1", "s2", "s2", "s3", "s4", "s5", "s6", "s7"];
    const result = generateSpeciesSkills(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(Object.keys(result).length).toBe(6);
  });

  test("resolves group skill to concrete subskill instead of group placeholder", () => {
    const speciesCandidates = ["melee", "s1", "s2", "s3", "s4", "s5", "s6"];
    const result = generateSpeciesSkills(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(result).not.toHaveProperty("melee");
    const hasMeleeSubskill = "melee_basic" in result || "melee_brawling" in result;
    expect(hasMeleeSubskill).toBe(true);
  });

  test("resolves multiple distinct group skills", () => {
    const speciesCandidates = ["melee", "art", "s1", "s2", "s3", "s4", "s5", "s6"];
    const result = generateSpeciesSkills(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(result).not.toHaveProperty("melee");
    expect(result).not.toHaveProperty("art");
    const hasMeleeSubskill = "melee_basic" in result || "melee_brawling" in result;
    const hasArtSubskill = "art_painting" in result || "art_sculpture" in result;
    expect(hasMeleeSubskill).toBe(true);
    expect(hasArtSubskill).toBe(true);
  });

  test("returns empty record when speciesSkills is undefined", () => {
    const result = generateSpeciesSkills(undefined, resolvedGroups, getSelectRandomTest(0));
    expect(result).toEqual({});
  });
});
