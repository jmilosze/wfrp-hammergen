import { describe, expect, test } from "vitest";
import { MAX_VALUE_LENGTH, printWithValue, validateValues } from "./idValue.ts";

describe("printWithValue", () => {
  test.each([
    { name: "Ward (Rating)", hasValue: true, value: "8", expected: "Ward (8)" },
    { name: "Hatred (Target)", hasValue: true, value: "Elves", expected: "Hatred (Elves)" },
    { name: "Tentacles (Number, Rating)", hasValue: true, value: "2, 1", expected: "Tentacles (2, 1)" },
    { name: "Ward", hasValue: true, value: "8", expected: "Ward (8)" },
    { name: "Ward (Rating)", hasValue: true, value: "", expected: "Ward (Rating)" },
    { name: "Night Vision", hasValue: false, value: "8", expected: "Night Vision" },
  ])("$name with hasValue $hasValue and value '$value' prints '$expected'", (t) => {
    expect(printWithValue(t.name, t.hasValue, t.value)).toBe(t.expected);
  });
});

describe("validateValues", () => {
  test.each([
    { name: "no values", values: [], valid: true },
    { name: "empty and short values", values: ["", "8", "Daemons of Slaanesh"], valid: true },
    { name: "value at max length", values: ["a".repeat(MAX_VALUE_LENGTH)], valid: true },
    { name: "value over max length", values: ["8", "a".repeat(MAX_VALUE_LENGTH + 1)], valid: false },
    { name: "value with <> symbols", values: ["<b>"], valid: false },
  ])("$name", (t) => {
    expect(validateValues("Trait", t.values).valid).toBe(t.valid);
  });
});
