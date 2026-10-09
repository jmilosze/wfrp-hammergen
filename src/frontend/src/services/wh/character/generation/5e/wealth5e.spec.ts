import { describe, expect, test } from "vitest";
import { StatusTier } from "../../../content/career.ts";
import { generateCoins5e } from "./wealth5e.ts";

describe("wealth5e", () => {
  test("generateCoins5e follows the starting wealth table", () => {
    const rollMax = (sides: number, rolls: number) => sides * rolls;
    expect(generateCoins5e(StatusTier.Brass, 3, rollMax)).toEqual([20 + 60, 0, 0]);
    expect(generateCoins5e(StatusTier.Silver, 3, rollMax)).toEqual([0, 10 + 30, 0]);
    expect(generateCoins5e(StatusTier.Gold, 3, rollMax)).toEqual([0, 0, 5]);
  });
});
