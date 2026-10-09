import { expect, test } from "vitest";
import { ApiResponse } from "./api.ts";
import { contentEdition, variantFor, with4eMark, matchesEditionFilter } from "./edition.ts";

const both: ApiResponse<{ name: string }> = {
  id: "both",
  ownerId: "owner",
  editions: { "4e": { name: "4e name" }, "5e": { name: "5e name" } },
};
const only4e: ApiResponse<{ name: string }> = { id: "only4e", ownerId: "owner", editions: { "4e": { name: "Old" } } };

test("contentEdition and variantFor use the character's edition, or 4e for 4e-only content", () => {
  expect(contentEdition(both, "5e")).toEqual("5e");
  expect(contentEdition(only4e, "5e")).toEqual("4e");
  expect(contentEdition(both, "4e")).toEqual("4e");
  expect(variantFor(both, "5e").name).toEqual("5e name");
  expect(variantFor(only4e, "5e").name).toEqual("Old");
});

test("with4eMark marks 4e content on a 5e character only", () => {
  expect(with4eMark(only4e, "5e", "Old")).toEqual("Old (4e)");
  expect(with4eMark(both, "5e", "5e name")).toEqual("5e name");
  expect(with4eMark(only4e, "4e", "Old")).toEqual("Old");
});

test("matchesEditionFilter", () => {
  const fourEIds = new Set(["only4e"]);
  expect(matchesEditionFilter("only4e", fourEIds, "both")).toBe(true);
  expect(matchesEditionFilter("only4e", fourEIds, "4e")).toBe(true);
  expect(matchesEditionFilter("only4e", fourEIds, "5e")).toBe(false);
  expect(matchesEditionFilter("both", fourEIds, "5e")).toBe(true);
  expect(matchesEditionFilter("both", fourEIds, "4e")).toBe(false);
  expect(matchesEditionFilter("both", undefined, "4e")).toBe(true);
});
