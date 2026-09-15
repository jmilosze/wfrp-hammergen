import { describe, expect, test } from "vitest";
import { objectsAreEqual } from "../utils/object.ts";

describe("objectsAreEqual", () => {
  test("returns true for identical objects", () => {
    const obj = { a: 1, b: "hello" };
    expect(objectsAreEqual(obj, obj)).toBe(true);
  });

  test("returns true for objects with same properties", () => {
    expect(objectsAreEqual({ a: 1, b: "test" }, { a: 1, b: "test" })).toBe(true);
  });

  test("returns false for objects with different property values", () => {
    expect(objectsAreEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  test("returns false for objects with different keys", () => {
    expect(objectsAreEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  test("returns false for objects with different number of keys", () => {
    expect(objectsAreEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test("handles null values without throwing", () => {
    expect(objectsAreEqual({ a: null }, { a: null })).toBe(true);
    expect(objectsAreEqual({ a: null }, { a: "notNull" })).toBe(false);
    expect(objectsAreEqual({ a: "notNull" }, { za: null })).toBe(false);
    expect(objectsAreEqual({ a: null }, { a: {} })).toBe(false);
    expect(objectsAreEqual({ a: {} }, { a: null })).toBe(false);
  });

  test("handles nested objects with null", () => {
    expect(objectsAreEqual({ nested: { a: null } }, { nested: { a: null } })).toBe(true);
    expect(objectsAreEqual({ nested: { a: null } }, { nested: { a: 1 } })).toBe(false);
  });

  test("handles non-object or null arguments safely", () => {
    expect(objectsAreEqual(null, null)).toBe(true);
    expect(objectsAreEqual(null, {})).toBe(false);
    expect(objectsAreEqual({}, null)).toBe(false);
    expect(objectsAreEqual(undefined, undefined)).toBe(true);
    expect(objectsAreEqual(undefined, {})).toBe(false);
  });
});
