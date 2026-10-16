import { describe, expect, test } from "vitest";
import { Career } from "@/services/wh/content/career.ts";
import { Species } from "@/services/wh/core/species.ts";
import { careerFilters } from "./careerFilters.ts";

const soldier = new Career({ id: "soldier", species: [Species.Human, Species.Dwarf] });
const gnomeCareer = new Career({ id: "gnome", species: [Species.Gnome] });

describe("careerFilters", () => {
  test("offers the species some career is open to", () => {
    const options = careerFilters.species.options([soldier, gnomeCareer]);
    expect(options.map((x) => x.text)).toEqual(["Human", "Dwarf", "Gnome"]);
  });

  test("matches a career open to any ticked species", () => {
    expect(careerFilters.species.matches(soldier, [Species.Dwarf.toString(), Species.Gnome.toString()])).toBe(true);
    expect(careerFilters.species.matches(soldier, [Species.Gnome.toString()])).toBe(false);
  });
});
