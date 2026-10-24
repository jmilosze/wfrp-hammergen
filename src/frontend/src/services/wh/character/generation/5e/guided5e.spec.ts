import { describe, expect, test } from "vitest";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { Species, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { AttributeName, zeroAttributes } from "@/services/wh/core/attributes.ts";
import { Career } from "@/services/wh/content/career.ts";
import { testGuidedContext5e } from "./fixtures5e.ts";
import {
  completeChoices5e,
  fickleFateBonus5e,
  GUIDED_STEPS_5E,
  GuidedState5e,
  guidedStepDone5e,
  newGuidedState5e,
  revalidate5e,
} from "./guided5e.ts";

const HUMAN = SpeciesWithRegion.HumanReikland;
const DWARF = SpeciesWithRegion.DwarfDefault;

function career(id: string, species: Species[]): Career {
  const c = testCareer();
  c.id = id;
  c.species = species;
  return c;
}
const careers = [career("soldier", [Species.Human, Species.Dwarf]), career("priest", [Species.Human])];
const context = testGuidedContext5e({ careers });

function finished(): GuidedState5e {
  return {
    ...newGuidedState5e(),
    speciesRolls: [{ roll: 10, species: HUMAN }],
    species: { fromRoll: 0 },
    career: { chosen: "soldier" },
    characteristics: {
      firstRolls: { ...zeroAttributes(), WS: 12 },
      newRolls: null,
      method: "inOrder",
      assigned: zeroAttributes(),
      points: { ...zeroAttributes(), WS: 6 },
    },
    skills: {
      species: { sp1: "sp1", sp2: "sp2", sp3: "sp3", sp4: "sp4", stealth: "stealthRural" },
      specialisations: {},
      advances: { s1: 3, s2: 3, s3: 2 },
    },
    talents: { options: {}, members: {}, randomRolls: ["rand1", "rand2"], career: "t1a" },
    // Class 0: Clothing, Hood or Mask, 1d10 Matches; testCareer has no career trappings or money.
    trappings: {
      options: { "0:1": 1 },
      bonus: [],
      rolledClass: {
        "0:0:0": [{ id: "clothing", number: 1, value: "" }],
        "0:1:1": [{ id: "mask", number: 1, value: "" }],
        "0:2:0": [{ id: "match", number: 4, value: "" }],
      },
      rolledCareer: {},
      rolledCoins: { "soldier:wealth": [26, 0, 0], "soldier:1": [0, 0, 0] },
    },
    details: { name: "Anna", description: "Tall", ambition: "Own an inn", partyAmbition: "", background: "" },
  };
}

describe("guided5e", () => {
  test("nothing is done at the start", () => {
    expect(GUIDED_STEPS_5E.some((x) => guidedStepDone5e(x.id, newGuidedState5e(), context))).toBe(false);
  });

  test("every step is done once every choice is made; the species roll gives its Fortune", () => {
    const state = finished();
    expect(GUIDED_STEPS_5E.every((x) => guidedStepDone5e(x.id, state, context))).toBe(true);
    const choices = completeChoices5e(state, context);
    expect(choices?.species).toBe(HUMAN);
    expect(choices?.career.id).toBe("soldier");
    expect(choices?.bonusFortune).toBe(1);
    expect(choices?.attributeRolls.WS).toBe(12);
    expect(choices?.attributePoints.WS).toBe(6);
    expect(choices?.speciesTalents).toEqual(["doomed", "rand1", "rand2"]);
    expect(choices?.careerTalent).toBe("t1a");
    expect(choices?.classTrappings.map((x) => x.id)).toEqual(["clothing", "mask", "match"]);
    expect(choices?.coins).toEqual([26, 0, 0]);
    expect(choices?.bonusTicks).toBe(0);
    expect([choices?.name, choices?.description, choices?.notes]).toEqual(["Anna", "Tall", "Ambition: Own an inn"]);
  });

  test("Oh Fickle Fate needs the first species, career and characteristics rolls kept", () => {
    const state = finished();
    expect(fickleFateBonus5e(state)).toBe(0);
    state.careerRolls = [{ roll: 96, species: HUMAN, career: "soldier" }];
    state.career = { fromRoll: 0 };
    expect(fickleFateBonus5e(state)).toBe(1);
    state.characteristics.method = "rearranged";
    state.characteristics.assigned = { ...zeroAttributes(), BS: 12 };
    state.characteristics.points = { ...zeroAttributes(), WS: 3 };
    expect(fickleFateBonus5e(state)).toBe(0);
  });

  test("creation points on characteristics the new career doesn't have are cleared", () => {
    const state = finished();
    const other = career("scholar", [Species.Human]);
    other.level1.attributes = [AttributeName.Int, AttributeName.WP, AttributeName.Fel];
    state.career = { chosen: "scholar" };
    revalidate5e(state, testGuidedContext5e({ careers: [...careers, other] }));
    expect(state.characteristics.points).toEqual(zeroAttributes());
    expect(state.characteristics.firstRolls?.WS).toBe(12);
    expect(state.attention).toEqual(["characteristics"]);
  });

  test("a career not open to the new species is cleared and marked; one that is open stays", () => {
    const state = finished();
    state.career = { chosen: "priest" };
    state.species = { chosen: DWARF };
    revalidate5e(state, context);
    expect(state.career).toBeNull();
    // Without a career, its creation points, skill Advances and talent go too; the test data has no dwarf species skills.
    expect(state.attention).toEqual(["career", "characteristics", "skills", "talents"]);
    expect(completeChoices5e(state, context)).toBeNull();

    const open = finished();
    open.species = { chosen: DWARF };
    revalidate5e(open, context);
    expect(open.career).toEqual({ chosen: "soldier" });
    expect(open.skills.advances).toEqual({ s1: 3, s2: 3, s3: 2 });
    expect(open.attention).toEqual(["skills"]);
  });

  test("a rolled career is cleared when the species changes, though it is open to the new one (Q7)", () => {
    const state = finished();
    state.careerRolls = [{ roll: 96, species: HUMAN, career: "soldier" }];
    state.career = { fromRoll: 0 };
    state.species = { chosen: DWARF };
    revalidate5e(state, context);
    expect(state.career).toBeNull();
    expect(state.careerRolls).toHaveLength(1);
  });

  test("the attention mark goes once the player opens the step", () => {
    const state = finished();
    state.attention = ["career", "characteristics"];
    state.step = "career";
    revalidate5e(state, context);
    expect(state.attention).toEqual(["characteristics"]);
  });
});
