import { describe, expect, test } from "vitest";
import { Rune, RuneLabel } from "@/services/wh/content/rune.ts";
import { runeFilters } from "./runeFilters.ts";

const plain = new Rune({ id: "plain" });
const labelled = new Rune({ id: "labelled", labels: [RuneLabel.RuneLabelWeapon] });

describe("runeFilters", () => {
  test("offers No label when some rune has none", () => {
    expect(runeFilters.label.options([labelled]).map((x) => x.value)).toEqual([RuneLabel.RuneLabelWeapon.toString()]);
    expect(runeFilters.label.options([labelled, plain]).at(-1)).toEqual({ text: "No label", value: "no" });
  });

  test("matches runes without labels by No label", () => {
    expect(runeFilters.label.matches(plain, ["no"])).toBe(true);
    expect(runeFilters.label.matches(labelled, ["no"])).toBe(false);
    expect(runeFilters.label.matches(labelled, [RuneLabel.RuneLabelWeapon.toString()])).toBe(true);
  });
});
