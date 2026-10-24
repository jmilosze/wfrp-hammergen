import { describe, expect, test } from "vitest";
import { detailsNotes5e, guidedDetailsValid5e, newGuidedDetails5e } from "./details5e.ts";

describe("details5e", () => {
  test("the ambitions and the background become the notes, leaving out what is empty", () => {
    const details = {
      ...newGuidedDetails5e(),
      ambition: " Own an inn ",
      partyAmbition: "Clear the old mill",
      background: "Grew up in Ubersreik.",
    };
    expect(detailsNotes5e(details)).toBe(
      "Ambition: Own an inn\nParty ambition: Clear the old mill\n\nGrew up in Ubersreik.",
    );
    expect(detailsNotes5e({ ...details, ambition: "", partyAmbition: "" })).toBe("Grew up in Ubersreik.");
    expect(detailsNotes5e(newGuidedDetails5e())).toBe("");
  });

  test("needs a name that fits the field", () => {
    expect(guidedDetailsValid5e(newGuidedDetails5e())).toBe(false);
    expect(guidedDetailsValid5e({ ...newGuidedDetails5e(), name: "Anna" })).toBe(true);
    expect(guidedDetailsValid5e({ ...newGuidedDetails5e(), name: "<Anna>" })).toBe(false);
  });
});
