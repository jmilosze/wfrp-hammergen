import { expect, test } from "vitest";
import { rules5e } from "./rules5e.ts";
import { rulesFor } from "./rules.ts";
import { rules4e } from "./rules4e.ts";

test("rulesFor picks the edition's rules", () => {
  expect(rulesFor("4e")).toBe(rules4e);
  expect(rulesFor("5e")).toBe(rules5e);
});
