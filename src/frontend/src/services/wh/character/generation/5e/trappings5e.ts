// 5e trappings and wealth in guided creation (pp. 36, 39): the class trappings, the career's level 1 trappings and
// money, the level 2 bonus trappings of the career roll, and the starting wealth. Every roll is made once, when it first
// shows, and kept.
import { Career, CareerClass } from "@/services/wh/content/career.ts";
import { Item } from "@/services/wh/content/item.ts";
import { CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { IdNumberValue, mergeEntries } from "@/utils/idNumberValue.ts";
import { rollDice, RollDiceFn } from "@/utils/random.ts";
import {
  ClassTrappingEntry,
  rollCareerMoney,
  rollCareerTrappings,
  rollClassTrappings,
} from "@/services/wh/character/generation/shared/trappings.ts";
import { generateCoins5e } from "./wealth5e.ts";

type Coins = [number, number, number];
type CareerItems = { carried: IdNumberValue[]; stored: IdNumberValue[] };

// The trappings step of guided creation. Picks and rolls are kept by what they are for (the class, the career and its
// entry), so a change of career shows that career's own picks and never rolls anything twice.
export interface GuidedTrappings5e {
  // The option taken of each entry with a choice: "<class>:<entry>" for class trappings, "<career>:<level>:<entry>"
  // for career trappings.
  options: Record<string, number>;
  // The level 2 bonus trappings taken (p. 36): "<career>:entry:<index>" or "<career>:money:<index>".
  bonus: string[];
  // The rolls: class options ("<class>:<entry>:<option>"), career options ("<career>:<level>:<entry>:<option>"),
  // money ("<career>:1" for level 1, "<career>:money:<index>" for a level 2 item) and wealth ("<career>:wealth").
  rolledClass: Record<string, IdNumberValue[]>;
  rolledCareer: Record<string, CareerItems>;
  rolledCoins: Record<string, Coins>;
}

export function newGuidedTrappings5e(): GuidedTrappings5e {
  return { options: {}, bonus: [], rolledClass: {}, rolledCareer: {}, rolledCoins: {} };
}

// What the trappings step works with: the career, its class trappings, the items and how many level 2 trappings the
// career roll gives.
export interface TrappingsContext5e {
  career: Career | null;
  classEntries: ClassTrappingEntry[];
  items: Item[];
  bonusTrappings: number;
}

// The option of an entry: its only one, or the one taken; null while not taken.
function optionOf(entry: { options: unknown[] }, key: string, g: GuidedTrappings5e): number | null {
  return entry.options.length === 1 ? 0 : (g.options[key] ?? null);
}

export function classOptionKey5e(careerClass: CareerClass, index: number): string {
  return `${careerClass}:${index}`;
}

export function careerOptionKey5e(career: Career, level: 1 | 2, index: number): string {
  return `${career.id}:${level}:${index}`;
}

// The level 2 bonus trappings taken for the career.
export function bonusOf5e(g: GuidedTrappings5e, career: Career): string[] {
  return g.bonus.filter((x) => x.startsWith(`${career.id}:`));
}

// The career entries the character gets, with the level they are from: level 1's, and the level 2 entries taken as a
// bonus.
interface CareerEntry {
  level: 1 | 2;
  index: number;
  entry: CareerTrappingEntry;
}

function careerEntries(g: GuidedTrappings5e, career: Career): CareerEntry[] {
  const bonusEntries = bonusOf5e(g, career)
    .map((x) => x.split(":"))
    .filter(([, kind]) => kind === "entry")
    .map(([, , index]) => Number(index));
  return [
    ...career.level1.trappings.map((entry, index): CareerEntry => ({ level: 1, index, entry })),
    ...bonusEntries.map((index): CareerEntry => ({ level: 2, index, entry: career.level2.trappings[index] })),
  ];
}

// rollMissingTrappings5e makes the rolls the current picks need and haven't had yet; the same object when there are
// none, so it can run after every change.
export function rollMissingTrappings5e(
  g: GuidedTrappings5e,
  context: TrappingsContext5e,
  rollDiceFn: RollDiceFn = rollDice,
): GuidedTrappings5e {
  const career = context.career;
  if (career === null) {
    return g;
  }
  const rolledClass = { ...g.rolledClass };
  const rolledCareer = { ...g.rolledCareer };
  const rolledCoins = { ...g.rolledCoins };
  let rolled = false;

  context.classEntries.forEach((entry, index) => {
    const option = optionOf(entry, classOptionKey5e(career.careerClass, index), g);
    const key = `${classOptionKey5e(career.careerClass, index)}:${option}`;
    if (option !== null && !(key in rolledClass)) {
      rolledClass[key] = rollClassTrappings([entry], [option], rollDiceFn);
      rolled = true;
    }
  });
  for (const { level, index, entry } of careerEntries(g, career)) {
    const option = optionOf(entry, careerOptionKey5e(career, level, index), g);
    const key = `${careerOptionKey5e(career, level, index)}:${option}`;
    if (option !== null && !(key in rolledCareer)) {
      rolledCareer[key] = rollCareerTrappings([entry], [option], context.items, rollDiceFn);
      rolled = true;
    }
  }
  const coinRolls: [string, () => Coins][] = [
    [`${career.id}:wealth`, () => generateCoins5e(career.level1.status, career.level1.standing, rollDiceFn)],
    [`${career.id}:1`, () => rollCareerMoney(career.level1.money, rollDiceFn)],
    ...bonusOf5e(g, career)
      .filter((x) => x.split(":")[1] === "money")
      .map((x): [string, () => Coins] => [
        x,
        () => rollCareerMoney([career.level2.money[Number(x.split(":")[2])]], rollDiceFn),
      ]),
  ];
  for (const [key, roll] of coinRolls) {
    if (!(key in rolledCoins)) {
      rolledCoins[key] = roll();
      rolled = true;
    }
  }
  return rolled ? { ...g, rolledClass, rolledCareer, rolledCoins } : g;
}

// The coins: starting wealth, level 1 money and level 2 money taken as a bonus; null until rolled.
export function guidedCoins5e(g: GuidedTrappings5e, career: Career): Coins | null {
  const keys = [
    `${career.id}:wealth`,
    `${career.id}:1`,
    ...bonusOf5e(g, career).filter((x) => x.split(":")[1] === "money"),
  ];
  const coins: Coins = [0, 0, 0];
  for (const key of keys) {
    const rolled = g.rolledCoins[key];
    if (rolled === undefined) {
      return null;
    }
    rolled.forEach((x, i) => (coins[i] += x));
  }
  return coins;
}

export interface GuidedTrappingsResult5e {
  classTrappings: IdNumberValue[];
  careerTrappings: CareerItems;
  coins: Coins;
  bonusTicks: number;
}

// guidedTrappings5e gives what the character starts with once every choice is made and rolled; null before.
export function guidedTrappings5e(g: GuidedTrappings5e, context: TrappingsContext5e): GuidedTrappingsResult5e | null {
  const career = context.career;
  if (career === null || bonusOf5e(g, career).length !== context.bonusTrappings) {
    return null;
  }
  const classItems: IdNumberValue[] = [];
  for (const [index, entry] of context.classEntries.entries()) {
    const option = optionOf(entry, classOptionKey5e(career.careerClass, index), g);
    const rolled = g.rolledClass[`${classOptionKey5e(career.careerClass, index)}:${option}`];
    if (option === null || rolled === undefined) {
      return null;
    }
    classItems.push(...rolled);
  }
  const carried: IdNumberValue[] = [];
  const stored: IdNumberValue[] = [];
  for (const { level, index, entry } of careerEntries(g, career)) {
    const option = optionOf(entry, careerOptionKey5e(career, level, index), g);
    const rolled = g.rolledCareer[`${careerOptionKey5e(career, level, index)}:${option}`];
    if (option === null || rolled === undefined) {
      return null;
    }
    carried.push(...rolled.carried);
    stored.push(...rolled.stored);
  }
  const coins = guidedCoins5e(g, career);
  if (coins === null) {
    return null;
  }
  return {
    classTrappings: mergeEntries(classItems),
    careerTrappings: { carried: mergeEntries(carried), stored: mergeEntries(stored) },
    coins: coins,
    // One tick for each level 2 trapping taken (p. 36).
    bonusTicks: context.bonusTrappings,
  };
}

// fitGuidedTrappings5e drops level 2 bonus trappings beyond what the career roll now gives. Picks and rolls of
// other careers and classes are kept for when the player comes back to them.
export function fitGuidedTrappings5e(g: GuidedTrappings5e, context: TrappingsContext5e): GuidedTrappings5e {
  const career = context.career;
  if (career === null) {
    return g;
  }
  const mine = bonusOf5e(g, career);
  if (mine.length <= context.bonusTrappings) {
    return g;
  }
  const dropped = mine.slice(context.bonusTrappings);
  return { ...g, bonus: g.bonus.filter((x) => !dropped.includes(x)) };
}
