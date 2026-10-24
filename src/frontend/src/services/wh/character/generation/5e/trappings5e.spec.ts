import { describe, expect, test } from "vitest";
import { getRollDiceTest } from "@/testing.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import {
  fitGuidedTrappings5e,
  GuidedTrappings5e,
  guidedTrappings5e,
  newGuidedTrappings5e,
  rollMissingTrappings5e,
  TrappingsContext5e,
} from "./trappings5e.ts";

// Rope stands for a trapping that can't be carried (Other), the rest are carried.
const items = ["weapon", "bow", "arrow", "rope"].map(
  (id) => new Item({ id, name: id, type: id === "rope" ? ItemType.Other : ItemType.Melee }),
);

// testCareer: class 0, Brass 3 at level 1. Level 1: Hand Weapon or Bow; level 2: Rope, and 1d10 silver.
function career() {
  const c = testCareer();
  c.level1.trappings = [
    {
      options: [
        [{ id: "weapon", number: "1", value: "" }],
        [
          { id: "bow", number: "1", value: "" },
          { id: "arrow", number: "1d10", value: "" },
        ],
      ],
    },
  ];
  c.level2.trappings = [{ options: [[{ id: "rope", number: "1", value: "" }]] }];
  c.level2.money = [{ coin: "silver", number: "1d10" }];
  return c;
}

function context(bonusTrappings: number): TrappingsContext5e {
  return {
    career: career(),
    classEntries: [{ options: ["hood", "mask"], number: "1" }],
    items,
    bonusTrappings,
  };
}

describe("guided trappings5e", () => {
  test("rolls what the picks need, once", () => {
    const g: GuidedTrappings5e = { ...newGuidedTrappings5e(), options: { "0:0": 0, "career1:1:0": 1 } };
    const rolled = rollMissingTrappings5e(g, context(0), getRollDiceTest(4));
    expect(rolled.rolledCareer["career1:1:0:1"].carried).toEqual([
      { id: "bow", number: 1, value: "" },
      { id: "arrow", number: 4, value: "" },
    ]);
    // Brass 3: 20 + 2d10 per Standing.
    expect(rolled.rolledCoins["career1:wealth"]).toEqual([24, 0, 0]);
    expect(rollMissingTrappings5e(rolled, context(0), getRollDiceTest(9))).toBe(rolled);
    // Back to the bow after trying the weapon: the arrows keep their first roll.
    const back = rollMissingTrappings5e({ ...rolled, options: { ...rolled.options, "career1:1:0": 0 } }, context(0));
    expect(rollMissingTrappings5e({ ...back, options: rolled.options }, context(0)).rolledCareer["career1:1:0:1"]).toBe(
      rolled.rolledCareer["career1:1:0:1"],
    );
  });

  test("the character gets the picks, the bonus trappings and money, and a tick for each bonus", () => {
    const g: GuidedTrappings5e = {
      ...newGuidedTrappings5e(),
      options: { "0:0": 1, "career1:1:0": 0 },
      bonus: ["career1:entry:0", "career1:money:0"],
    };
    const rolled = rollMissingTrappings5e(g, context(2), getRollDiceTest(5));
    expect(guidedTrappings5e(rolled, context(2))).toEqual({
      classTrappings: [{ id: "mask", number: 1, value: "" }],
      careerTrappings: {
        carried: [{ id: "weapon", number: 1, value: "" }],
        stored: [{ id: "rope", number: 1, value: "" }],
      },
      coins: [25, 5, 0],
      bonusTicks: 2,
    });
    expect(guidedTrappings5e(rolled, context(1))).toBeNull();
    expect(guidedTrappings5e({ ...rolled, options: { "career1:1:0": 0 } }, context(2))).toBeNull();
  });

  test("fitting drops bonus trappings beyond what the career roll gives", () => {
    const g = { ...newGuidedTrappings5e(), bonus: ["career1:entry:0", "career1:money:0", "other:entry:0"] };
    expect(fitGuidedTrappings5e(g, context(1)).bonus).toEqual(["career1:entry:0", "other:entry:0"]);
    expect(fitGuidedTrappings5e(g, context(2))).toBe(g);
  });
});
