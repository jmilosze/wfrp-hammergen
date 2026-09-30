export interface Coins {
  gold: number;
  silver: number;
  brass: number;
}

export const BRASS_PER_SILVER = 12;
export const SILVER_PER_GOLD = 20;
export const BRASS_PER_GOLD = 240; // 20 * 12

// Strips floating-point noise (e.g. 240.1 - 240 = 0.09999999999999432, or float32 values
// like 0.3330000042915344) without changing any meaningful fraction of a penny.
function stripFloatNoise(value: number): number {
  return Number(value.toFixed(6));
}

export function brassToCoins(totalBrass: number): Coins {
  if (isNaN(totalBrass) || totalBrass <= 0) {
    return { gold: 0, silver: 0, brass: 0 };
  }
  // Clean the total first so a remainder like 11.9999999d can't come out as 12d.
  const total = stripFloatNoise(totalBrass);
  const gold = Math.floor(total / BRASS_PER_GOLD);
  const remAfterGold = total - gold * BRASS_PER_GOLD;
  const silver = Math.floor(remAfterGold / BRASS_PER_SILVER);
  const brass = stripFloatNoise(remAfterGold - silver * BRASS_PER_SILVER);
  return { gold, silver, brass };
}

export function coinsToBrass(coins: Coins): number {
  const gold = Number.isFinite(coins.gold) ? coins.gold : 0;
  const silver = Number.isFinite(coins.silver) ? coins.silver : 0;
  const brass = Number.isFinite(coins.brass) ? coins.brass : 0;
  return gold * BRASS_PER_GOLD + silver * BRASS_PER_SILVER + brass;
}

export function printPrice(priceInBrass: number): string {
  if (isNaN(priceInBrass) || priceInBrass <= 0) {
    return "0d";
  }

  const { gold, silver, brass } = brassToCoins(priceInBrass);

  if (gold > 0) {
    if (silver === 0 && brass === 0) {
      return `${gold} GC`;
    }
    if (silver > 0 && brass === 0) {
      return `${gold} GC ${silver}/-`;
    }
    if (silver > 0 && brass > 0) {
      return `${gold} GC ${silver}/${brass}`;
    }
    return `${gold} GC ${brass}d`;
  }

  if (silver > 0) {
    if (brass === 0) {
      return `${silver}/-`;
    }
    return `${silver}/${brass}`;
  }

  return `${brass}d`;
}
