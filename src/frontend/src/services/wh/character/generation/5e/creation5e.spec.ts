import { describe, expect, test } from "vitest";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { StatusTier } from "@/services/wh/content/career.ts";
import { zeroAttributes } from "@/services/wh/core/attributes.ts";
import { buildCharacter5e, CreationChoices5e } from "./creation5e.ts";

describe("buildCharacter5e", () => {
  const choices: CreationChoices5e = {
    species: SpeciesWithRegion.HumanReikland,
    career: testCareer(),
    name: "Anna",
    description: "Tall",
    notes: "Ambition: own an inn",
    attributeRolls: { ...zeroAttributes(), WS: 12, BS: 7 },
    attributePoints: { ...zeroAttributes(), WS: 2, S: 4 },
    speciesSkills: { lang1: 30, s1: 5, sp1: 5 },
    careerSkillAdvances: { s1: 2, s2: 3 },
    speciesTalents: ["doomed", "rand1"],
    careerTalent: "t1a",
    classTrappings: [{ id: "clothing", number: 1, value: "" }],
    careerTrappings: {
      carried: [
        { id: "clothing", number: 1, value: "" },
        { id: "weapon", number: 1, value: "Sickle" },
      ],
      stored: [{ id: "command", number: 1, value: "Crew" }],
    },
    bonusTicks: 2,
    coins: [30, 1, 0],
    bonusFortune: 1,
    bonusFate: 1,
  };

  test("gives exactly the chosen values", () => {
    const character = buildCharacter5e(choices);
    expect(character.edition).toBe("5e");
    expect(character.name).toBe("Anna");
    expect(character.description).toBe("Tall");
    expect(character.notes).toBe("Ambition: own an inn");
    expect(character.career).toEqual({ id: "career1", number: 1 });
    expect(character.careerPath).toEqual([]);
    expect(character.fate).toBe(5);
    expect(character.fortune).toBe(4);
    expect(character.status).toBe(StatusTier.Brass);
    expect(character.standing).toBe(3);
    expect([character.brass, character.silver, character.gold]).toEqual([30, 1, 0]);
    expect(character.attributeRolls).toEqual({ ...zeroAttributes(), WS: 14, BS: 7, S: 4 });
    expect(character.attributeAdvances).toEqual(zeroAttributes());
    expect(character.skills).toEqual({ lang1: 30, s1: 15, s2: 15, sp1: 5 });
    expect(character.talents).toEqual({ doomed: 1, rand1: 1, t1a: 1 });
    expect(character.carriedItems).toEqual([
      { id: "clothing", number: 2, value: "" },
      { id: "weapon", number: 1, value: "Sickle" },
    ]);
    expect(character.storedItems).toEqual([{ id: "command", number: 1, value: "Crew" }]);
    expect(character.careerTicks).toBe(2);
    expect(character.spentExp).toBe(0);
    expect(character.currentExp).toBe(0);
  });

  test("a career talent the species already gives adds a rank", () => {
    expect(buildCharacter5e({ ...choices, careerTalent: "doomed" }).talents).toEqual({ doomed: 2, rand1: 1 });
    expect(buildCharacter5e({ ...choices, careerTalent: null }).talents).toEqual({ doomed: 1, rand1: 1 });
  });
});
