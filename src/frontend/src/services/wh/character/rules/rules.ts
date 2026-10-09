// Character rules that differ between editions; each edition has its own module (rules4e.ts, rules5e.ts).
import { Attributes } from "../../core/attributes.ts";
import { SpeciesWithRegion } from "../../core/species.ts";
import { Edition } from "../../core/edition.ts";
import { rules4e } from "./rules4e.ts";
import { rules5e } from "./rules5e.ts";

export interface CharacterRules {
  getSpeciesAttributes(species: SpeciesWithRegion): Attributes;
  getMovement(species: SpeciesWithRegion, mods: number): number;
  getSize(mods: number): number;
  getWounds(size: number, T: number, WP: number, S: number, hardyRanks: number): number;
}

export function rulesFor(edition: Edition): CharacterRules {
  return edition === "5e" ? rules5e : rules4e;
}
