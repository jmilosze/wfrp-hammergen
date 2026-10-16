import { describe, expect, test } from "vitest";
import { Prayer } from "@/services/wh/content/prayer.ts";
import { sourceFilter } from "./sourceFilter.ts";

function prayer(sources: string[]): Prayer {
  return new Prayer({ source: Object.fromEntries(sources.map((x) => [x, ""])) });
}

describe("sourceFilter", () => {
  test("offers the sources some entry has, Custom first", () => {
    expect(sourceFilter(false).options([prayer(["5", "0"]), prayer(["3"])], {})).toEqual([
      { text: "Custom", value: "0" },
      { text: "Archives Volume I", value: "3" },
      { text: "Archives Volume III", value: "5" },
    ]);
  });

  test("matches entries with any ticked source", () => {
    const filter = sourceFilter(true);
    expect(filter.matches(prayer(["3", "5"]), ["1", "3"])).toBe(true);
    expect(filter.matches(prayer(["2"]), ["1", "3"])).toBe(false);
  });
});
