import {
  getAllowedLabels,
  printSpellLabel,
  printSpellType,
  Spell,
  SpellType,
  spellTypeList,
} from "@/services/wh/content/spell.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of spells; the types some spell has are offered.
export const spellFilters = {
  type: {
    title: "Type",
    options: (list) => {
      const typesInData = new Set(list.map((wh) => wh.classification.type));
      return spellTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printSpellType(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.classification.type.toString()),
  },
  // A label is "type:label" ("type:no" for spells of the type without labels), as labels depend on the type. Labels are
  // offered once a type with labels is ticked, under their type, and only narrow down their own type.
  label: {
    title: "Label",
    options: (_list, ticked) =>
      spellTypeList
        .filter((x) => getAllowedLabels(x).length > 0 && (ticked.type ?? []).includes(x.toString()))
        .flatMap((type: SpellType) => [
          ...getAllowedLabels(type)
            .sort((a, b) => a - b)
            .map((x) => ({ text: printSpellLabel(x), value: `${type}:${x}`, heading: printSpellType(type) })),
          { text: "No label", value: `${type}:no`, heading: printSpellType(type) },
        ]),
    matches: (wh, values) => {
      const prefix = `${wh.classification.type}:`;
      const labels = values.filter((x) => x.startsWith(prefix));
      if (labels.length === 0) {
        return true;
      }
      if (wh.classification.labels.size === 0) {
        return labels.includes(`${prefix}no`);
      }
      return [...wh.classification.labels].some((x) => labels.includes(`${prefix}${x}`));
    },
  },
  source: sourceFilter(true),
} satisfies ContentFilters<Spell>;
