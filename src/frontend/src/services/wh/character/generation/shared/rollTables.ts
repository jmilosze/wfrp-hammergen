// d100 tables: Random Talents and the 5e Random Class and Career Table (generation data), the 5e Species Table.
import { rollDice, RollDiceFn } from "@/utils/random.ts";

const TABLE_ROLL = 100;

// A row gives its id for rolls from minRoll up to, not including, maxRoll: the book's 01–05 is minRoll 1, maxRoll 6
// (00 is 100).
export type RollTable<Id extends string = string> = Array<{
  id: Id;
  minRoll: number;
  maxRoll: number;
}>;

// rollTableValid checks that a table has every id once and covers 1 to 100 without gaps or overlaps. An empty table is
// valid (no rolls on it).
export function rollTableValid<Id extends string>(table: RollTable<Id>): boolean {
  if (table.length === 0) {
    return true;
  }
  if (new Set(table.map((x) => x.id)).size !== table.length) {
    return false;
  }
  const sortedRanges = table.map((x) => [x.minRoll, x.maxRoll]);
  sortedRanges.sort((a, b) => a[0] - b[0]);
  let prevMax = 1;
  for (const [start, end] of sortedRanges) {
    if (start !== prevMax || end > TABLE_ROLL + 1) {
      return false;
    }
    prevMax = end;
  }
  return prevMax === TABLE_ROLL + 1;
}

// rollOnTable rolls d100 and gives the roll and the row's id.
export function rollOnTable<Id extends string>(
  table: RollTable<Id>,
  rollDiceFn: RollDiceFn = rollDice,
): { roll: number; id: Id } {
  const roll = rollDiceFn(TABLE_ROLL, 1);
  const row = table.find((x) => roll >= x.minRoll && roll < x.maxRoll);
  if (row === undefined) {
    throw new Error(`no row for roll ${roll}`);
  }
  return { roll: roll, id: row.id };
}
