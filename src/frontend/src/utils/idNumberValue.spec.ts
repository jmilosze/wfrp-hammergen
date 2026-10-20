import { describe, expect, test } from "vitest";
import {
  addNumber,
  fillUp,
  IdNumberValue,
  mergeEntries,
  printItemWithValue,
  validateIdNumberValues,
} from "./idNumberValue.ts";

const entry = (id: string, number: number, value = ""): IdNumberValue => ({ id: id, number: number, value: value });

describe("idNumberValue", () => {
  test("addNumber adds to the entry with the same id and value, or adds a new entry", () => {
    const list = [entry("hw", 2)];
    addNumber(list, "hw", "", 1);
    addNumber(list, "hw", "Axe", 1);
    expect(list).toEqual([entry("hw", 3), entry("hw", 1, "Axe")]);
  });

  test("addNumber adds and takes away, removing the entry at 0", () => {
    const list: IdNumberValue[] = [];
    addNumber(list, "hw", "Axe", 2);
    addNumber(list, "hw", "Axe", -2);
    expect(list).toEqual([]);
  });

  test("fillUp counts identical rows together and tops up the first one", () => {
    const list = [entry("agurk", 1), entry("agurk", 1), entry("rope", 1)];
    fillUp(list, [entry("agurk", 2), entry("rope", 3)]);
    expect(list).toEqual([entry("agurk", 1), entry("agurk", 1), entry("rope", 3)]);
    fillUp(list, [entry("agurk", 5)]);
    expect(list).toEqual([entry("agurk", 4), entry("agurk", 1), entry("rope", 3)]);
  });

  test("fillUp raises entries to the new numbers and adds missing ones", () => {
    const list = [entry("rope", 3), entry("hw", 1, "Axe")];
    fillUp(list, [entry("rope", 1), entry("hw", 2)]);
    expect(list).toEqual([entry("rope", 3), entry("hw", 1, "Axe"), entry("hw", 2)]);
  });

  test("mergeEntries adds up entries with the same id and value", () => {
    const list = [entry("hw", 1, "Axe"), entry("hw", 2), entry("hw", 3, "Axe")];
    expect(mergeEntries(list)).toEqual([entry("hw", 4, "Axe"), entry("hw", 2)]);
    expect(list).toEqual([entry("hw", 1, "Axe"), entry("hw", 2), entry("hw", 3, "Axe")]);
  });

  test("validateIdNumberValues checks numbers and values", () => {
    expect(validateIdNumberValues("Carried", [entry("hw", 1000, "a".repeat(40))]).valid).toBe(true);
    expect(validateIdNumberValues("Carried", [entry("hw", 1001)]).valid).toBe(false);
    expect(validateIdNumberValues("Carried", [entry("hw", 1.5)]).valid).toBe(false);
    expect(validateIdNumberValues("Carried", [entry("hw", 1, "a".repeat(41))]).valid).toBe(false);
    expect(validateIdNumberValues("Carried", [entry("hw", 1, "<b>")]).valid).toBe(false);
  });

  test("printItemWithValue adds the value after the name, keeping the name's own brackets", () => {
    expect(printItemWithValue("Hand Weapon", "Axe")).toBe("Hand Weapon (Axe)");
    expect(printItemWithValue("Courtly Garb (Servant)", "Livery")).toBe("Courtly Garb (Servant) (Livery)");
    expect(printItemWithValue("Rope", "")).toBe("Rope");
  });
});
