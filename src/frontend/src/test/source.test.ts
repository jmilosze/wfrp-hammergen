import { describe, expect, test } from "vitest";
import { source, sourcesByEdition } from "../services/wh/source.ts";

describe("sources by edition", () => {
  test("5e offers Custom and the 5e core rulebook", () => {
    expect(sourcesByEdition["5e"]).toEqual(["0", "44"]);
    expect(source["44"]).toBe("WFRP 5e");
  });

  test("4e offers every source except the 5e core rulebook", () => {
    expect(sourcesByEdition["4e"]).toContain("0");
    expect(sourcesByEdition["4e"]).toContain("1");
    expect(sourcesByEdition["4e"]).not.toContain("44");
    expect(sourcesByEdition["4e"]).toHaveLength(Object.keys(source).length - 1);
  });
});
