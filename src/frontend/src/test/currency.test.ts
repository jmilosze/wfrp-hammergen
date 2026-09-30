import { describe, expect, test } from "vitest";
import {
  BRASS_PER_GOLD,
  BRASS_PER_SILVER,
  SILVER_PER_GOLD,
  brassToCoins,
  coinsToBrass,
  printPrice,
} from "../utils/currency.ts";

describe("currency constants", () => {
  test("correct coin conversion rates per WFRP p. 288", () => {
    expect(BRASS_PER_SILVER).toBe(12);
    expect(SILVER_PER_GOLD).toBe(20);
    expect(BRASS_PER_GOLD).toBe(240);
  });
});

describe("brassToCoins", () => {
  test("converts 0 brass to 0 coins", () => {
    expect(brassToCoins(0)).toEqual({ gold: 0, silver: 0, brass: 0 });
  });

  test("converts negative or NaN brass to 0 coins", () => {
    expect(brassToCoins(-10)).toEqual({ gold: 0, silver: 0, brass: 0 });
    expect(brassToCoins(Number.NaN)).toEqual({ gold: 0, silver: 0, brass: 0 });
  });

  test("converts pennies only (< 12 brass)", () => {
    expect(brassToCoins(5)).toEqual({ gold: 0, silver: 0, brass: 5 });
    expect(brassToCoins(11)).toEqual({ gold: 0, silver: 0, brass: 11 });
  });

  test("converts shillings only (multiples of 12 < 240)", () => {
    expect(brassToCoins(12)).toEqual({ gold: 0, silver: 1, brass: 0 });
    expect(brassToCoins(192)).toEqual({ gold: 0, silver: 16, brass: 0 });
  });

  test("converts shillings and pennies", () => {
    expect(brassToCoins(18)).toEqual({ gold: 0, silver: 1, brass: 6 });
    expect(brassToCoins(218)).toEqual({ gold: 0, silver: 18, brass: 2 });
  });

  test("converts gold crowns only (multiples of 240)", () => {
    expect(brassToCoins(240)).toEqual({ gold: 1, silver: 0, brass: 0 });
    expect(brassToCoins(480)).toEqual({ gold: 2, silver: 0, brass: 0 });
  });

  test("converts gold, shillings, and pennies", () => {
    expect(brassToCoins(245)).toEqual({ gold: 1, silver: 0, brass: 5 });
    expect(brassToCoins(252)).toEqual({ gold: 1, silver: 1, brass: 0 });
    expect(brassToCoins(266)).toEqual({ gold: 1, silver: 2, brass: 2 });
  });

  test("handles fractional brass pennies", () => {
    expect(brassToCoins(2.5)).toEqual({ gold: 0, silver: 0, brass: 2.5 });
    expect(brassToCoins(254.5)).toEqual({ gold: 1, silver: 1, brass: 2.5 });
  });

  test("keeps real fractions of a penny", () => {
    expect(brassToCoins(10.333)).toEqual({ gold: 0, silver: 0, brass: 10.333 });
    expect(brassToCoins(11.996)).toEqual({ gold: 0, silver: 0, brass: 11.996 });
  });

  test("strips floating-point noise", () => {
    expect(brassToCoins(0.3330000042915344)).toEqual({ gold: 0, silver: 0, brass: 0.333 });
    expect(brassToCoins(0.16599999368190765)).toEqual({ gold: 0, silver: 0, brass: 0.166 });
    expect(brassToCoins(240.1)).toEqual({ gold: 1, silver: 0, brass: 0.1 });
  });

  test("cleans the total before splitting so pennies never reach 12", () => {
    expect(brassToCoins(11.9999999)).toEqual({ gold: 0, silver: 1, brass: 0 });
    expect(brassToCoins(239.9999999)).toEqual({ gold: 1, silver: 0, brass: 0 });
  });

  test("round-trips with coinsToBrass", () => {
    for (const price of [0, 0.1, 0.17, 0.333, 3.25, 10.333, 254.5, 1000000000, 24000000000]) {
      expect(coinsToBrass(brassToCoins(price))).toBe(price);
    }
  });
});

describe("coinsToBrass", () => {
  test("converts 0 coins to 0 brass", () => {
    expect(coinsToBrass({ gold: 0, silver: 0, brass: 0 })).toBe(0);
  });

  test("converts gold only", () => {
    expect(coinsToBrass({ gold: 1, silver: 0, brass: 0 })).toBe(240);
    expect(coinsToBrass({ gold: 5, silver: 0, brass: 0 })).toBe(1200);
  });

  test("converts silver only", () => {
    expect(coinsToBrass({ gold: 0, silver: 1, brass: 0 })).toBe(12);
    expect(coinsToBrass({ gold: 0, silver: 16, brass: 0 })).toBe(192);
  });

  test("converts brass only", () => {
    expect(coinsToBrass({ gold: 0, silver: 0, brass: 7 })).toBe(7);
  });

  test("converts mixed denominations", () => {
    expect(coinsToBrass({ gold: 1, silver: 2, brass: 2 })).toBe(266);
    expect(coinsToBrass({ gold: 0, silver: 18, brass: 2 })).toBe(218);
  });

  test("handles unnormalized coins correctly", () => {
    expect(coinsToBrass({ gold: 0, silver: 20, brass: 0 })).toBe(240);
    expect(coinsToBrass({ gold: 0, silver: 25, brass: 0 })).toBe(300);
  });

  test("handles fractional brass", () => {
    expect(coinsToBrass({ gold: 0, silver: 0, brass: 2.5 })).toBe(2.5);
    expect(coinsToBrass({ gold: 1, silver: 1, brass: 2.5 })).toBe(254.5);
  });
});

describe("printPrice", () => {
  test("prints fractions of a penny without float noise", () => {
    expect(printPrice(0.3330000042915344)).toBe("0.333d");
    expect(printPrice(11.9999999)).toBe("1/-");
    expect(printPrice(251.9999999)).toBe("1 GC 1/-");
  });

  test("formats 0 as 0d", () => {
    expect(printPrice(0)).toBe("0d");
    expect(printPrice(-5)).toBe("0d");
    expect(printPrice(Number.NaN)).toBe("0d");
  });

  test("formats pennies only", () => {
    expect(printPrice(1)).toBe("1d");
    expect(printPrice(5)).toBe("5d");
    expect(printPrice(11)).toBe("11d");
    expect(printPrice(2.5)).toBe("2.5d");
  });

  test("formats shillings only", () => {
    expect(printPrice(12)).toBe("1/-");
    expect(printPrice(192)).toBe("16/-");
  });

  test("formats shillings and pence", () => {
    expect(printPrice(18)).toBe("1/6");
    expect(printPrice(218)).toBe("18/2");
  });

  test("formats crowns only", () => {
    expect(printPrice(240)).toBe("1 GC");
    expect(printPrice(480)).toBe("2 GC");
  });

  test("formats crowns with shillings", () => {
    expect(printPrice(252)).toBe("1 GC 1/-");
    expect(printPrice(264)).toBe("1 GC 2/-");
  });

  test("formats crowns with shillings and pence", () => {
    expect(printPrice(266)).toBe("1 GC 2/2");
  });

  test("formats crowns with pence only", () => {
    expect(printPrice(245)).toBe("1 GC 5d");
  });
});
