import { describe, expect, test } from "vitest";
import { cloneEntity } from "../utils/clone.ts";
import { isEqualEntity } from "../utils/equal.ts";

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
      constructor(public name: string, public age: number) {}
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

describe("isEqualEntity", () => {
  test("compares primitives and special numbers", () => {
    expect(isEqualEntity(1, 1)).toBe(true);
    expect(isEqualEntity(1, 2)).toBe(false);
    expect(isEqualEntity("a", "a")).toBe(true);
    expect(isEqualEntity("a", "b")).toBe(false);
    expect(isEqualEntity(Number.NaN, Number.NaN)).toBe(true);
    expect(isEqualEntity(null, null)).toBe(true);
    expect(isEqualEntity(undefined, undefined)).toBe(true);
    expect(isEqualEntity(null, undefined)).toBe(false);
    expect(isEqualEntity(null, {})).toBe(false);
  });

  test("compares different prototypes as false", () => {
    class A {
      constructor(public x: number) {}
    }
    class B {
      constructor(public x: number) {}
    }

    expect(isEqualEntity(new A(1), new B(1))).toBe(false);
    expect(isEqualEntity(new A(1), { x: 1 })).toBe(false);
  });

  test("compares Sets regardless of insertion order", () => {
    const s1 = new Set(["a", "b", "c"]);
    const s2 = new Set(["c", "b", "a"]);
    const s3 = new Set(["a", "b"]);

    expect(isEqualEntity(s1, s2)).toBe(true);
    expect(isEqualEntity(s1, s3)).toBe(false);
  });

  test("compares Maps deeply", () => {
    const m1 = new Map([["k", { val: 1 }]]);
    const m2 = new Map([["k", { val: 1 }]]);
    const m3 = new Map([["k", { val: 2 }]]);

    expect(isEqualEntity(m1, m2)).toBe(true);
    expect(isEqualEntity(m1, m3)).toBe(false);
  });

  test("compares unordered arrays when key matches", () => {
    const obj1 = { species: [1, 2, 3], other: [1, 2, 3] };
    const obj2 = { species: [3, 1, 2], other: [1, 2, 3] };
    const obj3 = { species: [1, 2, 3], other: [3, 2, 1] };

    expect(isEqualEntity(obj1, obj2)).toBe(true);
    expect(isEqualEntity(obj1, obj3)).toBe(false);
  });

  test("compares complex unordered array elements like careerPath", () => {
    const obj1 = {
      careerPath: [
        { id: "c1", number: 1 },
        { id: "c2", number: 2 },
      ],
    };
    const obj2 = {
      careerPath: [
        { id: "c2", number: 2 },
        { id: "c1", number: 1 },
      ],
    };
    const obj3 = {
      careerPath: [
        { id: "c2", number: 2 },
        { id: "c1", number: 99 },
      ],
    };

    expect(isEqualEntity(obj1, obj2)).toBe(true);
    expect(isEqualEntity(obj1, obj3)).toBe(false);
  });

  test("supports ignoredKeys", () => {
    const obj1 = { id: "1", modifiers: { x: 10 } };
    const obj2 = { id: "1", modifiers: { x: 999 } };

    expect(isEqualEntity(obj1, obj2)).toBe(false);
    expect(isEqualEntity(obj1, obj2, { ignoredKeys: new Set(["modifiers"]) })).toBe(true);
  });
});
