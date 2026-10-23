import { describe, expect, test } from "vitest";
import {
  CareerMoney,
  CareerTrapping,
  CareerTrappingEntry,
  copyCareerTrappingEntries,
  printCareerTrappingEntry,
  validateCareerTrappings,
} from "./careerTrapping.ts";

const one = (number: string, value = ""): CareerTrapping[] => [{ id: "bow", number, value }];
const entry = (...options: CareerTrapping[][]): CareerTrappingEntry => ({ options });
const many = (n: number): CareerTrappingEntry[] => Array.from({ length: n }, () => entry(one("1")));

describe("validateCareerTrappings", () => {
  test.each<[string, CareerTrappingEntry[], CareerMoney[]]>([
    ["none", [], []],
    ["a single trapping", [entry(one("1"))], []],
    ["a bundle", [entry([...one("1"), { id: "arrow", number: "10", value: "" }])], []],
    ["a choice", [entry(one("1"), one("2"))], []],
    ["dice", [entry(one("1d10")), entry(one("2d6+3")), entry(one("1d10-1"))], []],
    ["a value of 40 characters", [entry(one("1", "a".repeat(40)))], []],
    [
      "money",
      [],
      [
        { coin: "gold", number: "20" },
        { coin: "brass", number: "3d10" },
      ],
    ],
    ["100 entries", many(100), []],
  ])("accepts %s", (_, entries, money) => {
    expect(validateCareerTrappings("Level 1 trappings", entries, money).valid).toBe(true);
  });

  test.each<[string, CareerTrappingEntry[], CareerMoney[], string]>([
    ["101 entries", many(101), [], "at most 100"],
    ["an entry without options", [entry()], [], "empty"],
    ["an empty option", [entry([])], [], "empty"],
    ["number 0", [entry(one("0"))], [], "quantities"],
    ["an empty number", [entry(one(""))], [], "quantities"],
    ["dice without a count", [entry(one("d10"))], [], "quantities"],
    ["a number with a modifier", [entry(one("10+2"))], [], "quantities"],
    ["money with an invalid number", [], [{ coin: "silver", number: "1x" }], "quantities"],
    ["a value too long", [entry(one("1", "a".repeat(41)))], [], "notes"],
    ["a value with <>", [entry(one("1", "<b>"))], [], "notes"],
  ])("rejects %s", (_, entries, money, message) => {
    const status = validateCareerTrappings("Level 1 trappings", entries, money);
    expect(status.valid).toBe(false);
    expect(status.message).toContain("Level 1 trappings");
    expect(status.message).toContain(message);
  });
});

test("copyCareerTrappingEntries copies every level", () => {
  const entries = [entry(one("1"), one("2"))];
  const copy = copyCareerTrappingEntries(entries);
  expect(copy).toEqual(entries);
  copy[0].options[0][0].value = "changed";
  copy[0].options.push(one("3"));
  expect(entries[0].options).toEqual([one("1"), one("2")]);
});

test("printCareerTrappingEntry joins trappings with commas and options with or, with quantities and notes", () => {
  const names: Record<string, string> = { bow: "Bow", arrow: "Arrow", weapon: "Hand Weapon" };
  const entry: CareerTrappingEntry = {
    options: [
      [
        { id: "bow", number: "1", value: "" },
        { id: "arrow", number: "10", value: "" },
      ],
      [{ id: "weapon", number: "1d6+1", value: "Sickle" }],
    ],
  };
  expect(printCareerTrappingEntry(entry, (id) => names[id])).toBe("Bow, 10 × Arrow or 1d6+1 × Hand Weapon (Sickle)");
});
