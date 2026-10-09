import { describe, expect, test } from "vitest";
import { StatusTier } from "../../../content/career.ts";
import { generateCoins4e } from "./wealth4e.ts";

describe("wealth4e", () => {
  test("generateCoins4e follows the starting wealth rules", () => {
    const rollMax = (sides: number, rolls: number) => sides * rolls;
    expect(generateCoins4e(StatusTier.Brass, 3, rollMax)).toEqual([60, 0, 0]);
    expect(generateCoins4e(StatusTier.Silver, 3, rollMax)).toEqual([0, 30, 0]);
    expect(generateCoins4e(StatusTier.Gold, 3, rollMax)).toEqual([0, 0, 3]);
  });
});
