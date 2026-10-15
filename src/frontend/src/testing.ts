import { describe, expect, test } from "vitest";
import { DOMWrapper, RouterLinkStub, VueWrapper } from "@vue/test-utils";
import { RollDiceFn, SelectRandomFn } from "./utils/random.ts";

/**
 * Creates a deterministic mock for `rollDice` that returns roll values from a predetermined sequence.
 */
export function getRollDiceTest(...rolls: number[]): RollDiceFn {
  const expectedRolls = [...rolls];
  let currentRoll = 0;

  return function () {
    const roll =
      currentRoll < expectedRolls.length ? expectedRolls[currentRoll] : expectedRolls[expectedRolls.length - 1];
    currentRoll += 1;
    return roll;
  };
}

/**
 * Creates a deterministic mock for `selectRandom` that selects array elements by index using a predetermined sequence.
 *
 * Each time the returned mock is called:
 * 1. It takes the next index from `selections` (or repeats the last index if `selections` is exhausted).
 * 2. It returns the element at that index from the passed array (`array[selection]`).
 */
export function getSelectRandomTest(...selections: number[]): SelectRandomFn {
  const expectedSelections = [...selections];
  let currentSelection = 0;

  return function <T>(array: T[]) {
    const selection =
      currentSelection < expectedSelections.length
        ? expectedSelections[currentSelection]
        : expectedSelections[expectedSelections.length - 1];
    currentSelection += 1;
    return array[selection];
  };
}

type Path = string[];

// valuePaths lists the paths to every value in a model's data, nested objects included: a value is a primitive, an
// array, a set or an empty object (e.g. an empty record), which a test changes as a whole.
function valuePaths(value: unknown, path: Path = []): Path[] {
  if (value === null || typeof value !== "object" || Array.isArray(value) || value instanceof Set) {
    return [path];
  }
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return [path];
  }
  return keys.flatMap((key) => valuePaths(Reflect.get(value, key), [...path, key]));
}

// changed returns a different value of the same kind.
function changed(value: unknown): unknown {
  if (typeof value === "string") {
    return value + "x";
  }
  if (typeof value === "number") {
    return value + 1;
  }
  if (typeof value === "boolean") {
    return !value;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.slice(1) : ["changed"];
  }
  if (value instanceof Set) {
    return new Set([...value, "changed"]);
  }
  if (value === undefined) {
    return "changed";
  }
  return { ...Object(value), changed: 1 };
}

function setAt(target: object, path: Path, value: unknown) {
  const parent = path.slice(0, -1).reduce<object>((x, key) => Reflect.get(x, key), target);
  Reflect.set(parent, path[path.length - 1], value);
}

function getAt(target: object, path: Path): unknown {
  return path.reduce<unknown>(
    (x, key) => (x === null || typeof x !== "object" ? undefined : Reflect.get(x, key)),
    target,
  );
}

// testIsEqualTo tests a model's isEqualTo through its own data: a copy is equal, and a copy with any one value changed
// (found by walking the model, so a new field is covered without a new test) is not. ignored: paths whose changes
// don't count (e.g. "modifiers"), and everything under them. unordered: array paths whose order doesn't count. The
// model should have every value filled in (e.g. two or more elements in an unordered array).
export function testIsEqualTo<T extends object & { copy(): T; isEqualTo(other: unknown): boolean }>(
  name: string,
  model: T,
  { ignored = [], unordered = [] }: { ignored?: string[]; unordered?: string[] } = {},
) {
  const isIgnored = (path: Path) => ignored.some((x) => path.join(".") === x || path.join(".").startsWith(x + "."));

  describe(`${name} isEqualTo`, () => {
    test("is true for a copy", () => {
      expect(model.isEqualTo(model.copy())).toBe(true);
    });

    test("is false when any one value differs, except the ignored ones", () => {
      const wrong = valuePaths(model).filter((path) => {
        const other = model.copy();
        setAt(other, path, changed(getAt(other, path)));
        return model.isEqualTo(other) !== isIgnored(path);
      });
      expect(wrong.map((x) => x.join("."))).toEqual([]);
    });

    if (unordered.length > 0) {
      test(`is true when the order of ${unordered.join(", ")} differs`, () => {
        for (const key of unordered) {
          const other = model.copy();
          const path = key.split(".");
          const array = getAt(other, path);
          expect(Array.isArray(array) && array.length > 1).toBe(true);
          setAt(other, path, Array.isArray(array) ? [...array].reverse() : array);
          expect(model.isEqualTo(other)).toBe(true);
        }
      });
    }
  });
}

// componentStubs is what component tests mount with: router links are plain links that keep their target (to). Icons
// are mocked in each component spec, as Iconify would fetch them over the network:
// vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));
export const componentStubs = { RouterLink: RouterLinkStub };

// Component tests find elements the way a user does, by what they read or a screen reader announces, not by styling.
// buttonNames lists the buttons by their text, or their aria-label when they show only an icon.
export function buttonNames(wrapper: VueWrapper | DOMWrapper<Element>): string[] {
  return wrapper.findAll("button").map((x) => x.text() || (x.attributes("aria-label") ?? ""));
}

// findButton finds the button with that text or aria-label.
export function findButton(wrapper: VueWrapper | DOMWrapper<Element>, name: string): DOMWrapper<HTMLButtonElement> {
  const button = wrapper.findAll("button").find((x) => x.text() === name || x.attributes("aria-label") === name);
  if (button === undefined) {
    throw new Error(`No button "${name}" in: ${buttonNames(wrapper).join(", ")}`);
  }
  return button;
}
