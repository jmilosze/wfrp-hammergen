import { Career, careerClassList, printClassName } from "@/services/wh/content/career.ts";
import { printSpeciesName, speciesList } from "@/services/wh/core/species.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of careers; the classes and species some career has are offered.
export const careerFilters = {
  class: {
    title: "Class",
    options: (list) => {
      const classesInData = new Set(list.map((wh) => wh.careerClass));
      return careerClassList
        .filter((x) => classesInData.has(x))
        .map((x) => ({ text: printClassName(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.careerClass.toString()),
  },
  // A career matches when it is open to any ticked species.
  species: {
    title: "Species",
    options: (list) => {
      const speciesInData = new Set(list.flatMap((wh) => wh.species));
      return speciesList
        .filter((x) => speciesInData.has(x))
        .map((x) => ({ text: printSpeciesName(x), value: x.toString() }));
    },
    matches: (wh, values) => wh.species.some((x) => values.includes(x.toString())),
  },
  source: sourceFilter(true),
} satisfies ContentFilters<Career>;
