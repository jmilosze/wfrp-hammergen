import { describe, expect, test } from "vitest";
import { cloneEntity } from "./clone.ts";

describe("cloneEntity", () => {
  test("clones primitives", () => {
    expect(cloneEntity(42)).toBe(42);
    expect(cloneEntity("hello")).toBe("hello");
    expect(cloneEntity(true)).toBe(true);
    expect(cloneEntity(null)).toBeNull();
    expect(cloneEntity(undefined)).toBeUndefined();
  });

  test("clones Date and RegExp", () => {
    const date = new Date(123456789);
    const clonedDate = cloneEntity(date);
    expect(clonedDate).toEqual(date);
    expect(clonedDate).not.toBe(date);

    const reg = /^abc[0-9]+$/gi;
    const clonedReg = cloneEntity(reg);
    expect(clonedReg).toEqual(reg);
    expect(clonedReg).not.toBe(reg);
  });

  test("clones Set deeply", () => {
    const orig = new Set(["a", "b", "c"]);
    const cloned = cloneEntity(orig);
    expect(cloned).toEqual(orig);
    expect(cloned).not.toBe(orig);

    cloned.add("d");
    expect(orig.has("d")).toBe(false);
  });

  test("clones Map deeply", () => {
    const orig = new Map([["key1", { a: 1 }]]);
    const cloned = cloneEntity(orig);
    expect(cloned).toEqual(orig);
    expect(cloned.get("key1")).not.toBe(orig.get("key1"));
  });

  test("clones Array deeply", () => {
    const orig = [{ x: 1 }, { x: 2 }];
    const cloned = cloneEntity(orig);
    expect(cloned).toEqual(orig);
    expect(cloned).not.toBe(orig);
    expect(cloned[0]).not.toBe(orig[0]);
  });

  test("preserves class prototype and methods", () => {
    class Person {
      constructor(
        public name: string,
        public age: number,
      ) {}
      greet() {
        return `Hi, I'm ${this.name}`;
      }
    }

    const alice = new Person("Alice", 30);
    const cloned = cloneEntity(alice);

    expect(cloned).toBeInstanceOf(Person);
    expect(cloned).not.toBe(alice);
    expect(cloned.name).toBe("Alice");
    expect(cloned.age).toBe(30);
    expect(cloned.greet()).toBe("Hi, I'm Alice");
  });
});
