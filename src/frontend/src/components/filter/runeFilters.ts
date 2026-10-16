import { printRuneLabel, Rune, runeLabelList } from "@/services/wh/content/rune.ts";
import { ContentFilters } from "./contentFilter.ts";
import { applicableToFilter } from "./applicableToFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The label filter's value for runes without labels.
const NO_LABEL = "no";

// The filters of runes. The labels some rune has are offered, and "No label" when some rune has none.
export const runeFilters = {
  label: {
    title: "Label",
    options: (list) => {
      const labelsInData = new Set(list.flatMap((wh) => wh.labels));
      const options = runeLabelList
        .filter((x) => labelsInData.has(x))
        .map((x) => ({ text: printRuneLabel(x), value: x.toString() }));
      if (list.some((wh) => wh.labels.length === 0)) {
        options.push({ text: "No label", value: NO_LABEL });
      }
      return options;
    },
    matches: (wh, values) =>
      wh.labels.length === 0 ? values.includes(NO_LABEL) : wh.labels.some((x) => values.includes(x.toString())),
  },
  applicableTo: applicableToFilter,
  source: sourceFilter(true),
} satisfies ContentFilters<Rune>;
