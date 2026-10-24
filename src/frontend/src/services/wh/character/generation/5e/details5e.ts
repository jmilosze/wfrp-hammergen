// 5e personality and background in guided creation (pp. 41–42): name, description, ambitions and background. The
// character has no fields for ambitions and background yet (HG-7), so they go into the notes (D6).
import { validLongDescFn, validShortDescFn } from "@/services/wh/core/validators.ts";

export interface GuidedDetails5e {
  name: string;
  description: string;
  ambition: string;
  partyAmbition: string;
  background: string;
}

export function newGuidedDetails5e(): GuidedDetails5e {
  return { name: "", description: "", ambition: "", partyAmbition: "", background: "" };
}

// detailsNotes5e writes the ambitions and the background as the character's notes, leaving out what is empty.
export function detailsNotes5e(details: GuidedDetails5e): string {
  const ambitions = [
    details.ambition.trim() === "" ? "" : `Ambition: ${details.ambition.trim()}`,
    details.partyAmbition.trim() === "" ? "" : `Party ambition: ${details.partyAmbition.trim()}`,
  ].filter((x) => x !== "");
  return [ambitions.join("\n"), details.background.trim()].filter((x) => x !== "").join("\n\n");
}

// The step needs a name; every text must also fit the character's fields.
export function guidedDetailsValid5e(details: GuidedDetails5e): boolean {
  return (
    details.name.trim() !== "" &&
    validShortDescFn(details.name).valid &&
    validLongDescFn(details.description).valid &&
    validLongDescFn(detailsNotes5e(details)).valid
  );
}
