import { describe, expect, test } from "vitest";
import {
  copyIdNumberArray,
  fillUpIdNumberRecord,
  idNumberArrayToRecord,
  updateIdNumberRecord,
} from "../utils/idNumber.ts";

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
