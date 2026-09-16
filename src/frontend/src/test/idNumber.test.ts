import { describe, expect, test } from "vitest";
import {
  compareIdNumber,
  copyIdNumberArray,
  fillUpIdNumberRecord,
  idNumberArrayToRecord,
  updateIdNumberRecord,
} from "../utils/idNumber.ts";

describe("compareIdNumber", () => {
  test("returns 0 for equal id and number", () => {
    expect(compareIdNumber({ id: "talent1", number: 2 }, { id: "talent1", number: 2 })).toBe(0);
  });

  test("sorts by id first", () => {
    expect(compareIdNumber({ id: "a", number: 5 }, { id: "b", number: 1 })).toBe(-1);
    expect(compareIdNumber({ id: "b", number: 1 }, { id: "a", number: 5 })).toBe(1);
  });

  test("sorts numbers numerically rather than lexicographically", () => {
    // In lexicographical sort "talent_2" > "talent_10", but numerically 2 < 10
    expect(compareIdNumber({ id: "talent", number: 2 }, { id: "talent", number: 10 })).toBe(-1);
    expect(compareIdNumber({ id: "talent", number: 10 }, { id: "talent", number: 2 })).toBe(1);
  });
});

describe("idNumberArrayToRecord", () => {
  test("converts array of IdNumber into a record", () => {
    const result = idNumberArrayToRecord([
      { id: "a", number: 1 },
      { id: "b", number: 2 },
    ]);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});

describe("copyIdNumberArray", () => {
  test("creates a deep copy of the array elements", () => {
    const original = [{ id: "a", number: 1 }];
    const copy = copyIdNumberArray(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy[0]).not.toBe(original[0]);
  });
});

describe("updateIdNumberRecord", () => {
  test("updates record when number is non-zero", () => {
    const record: Record<string, number> = { a: 1 };
    updateIdNumberRecord(record, { id: "a", number: 3 });
    expect(record).toEqual({ a: 3 });
  });

  test("removes key from record when number is zero", () => {
    const record: Record<string, number> = { a: 1, b: 2 };
    updateIdNumberRecord(record, { id: "a", number: 0 });
    expect(record).toEqual({ b: 2 });
  });
});

describe("fillUpIdNumberRecord", () => {
  test("fills new values and takes maximum when key exists", () => {
    const record: Record<string, number> = { a: 2, b: 5 };
    fillUpIdNumberRecord(record, { a: 4, b: 3, c: 1 });
    expect(record).toEqual({ a: 4, b: 5, c: 1 });
  });
});
