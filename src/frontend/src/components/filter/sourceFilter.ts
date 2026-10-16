import { WhProperty } from "@/services/wh/core/entity.ts";
import { source } from "@/services/wh/core/source.ts";
import { ContentFilter } from "./contentFilter.ts";

// Entries by source; the sources some entry has are offered, Custom first. collapsed: the section starts folded (it
// is not the list's only filter).
export function sourceFilter(collapsed: boolean): ContentFilter<WhProperty> {
  return {
    title: "Source",
    collapsed: collapsed,
    options: (list) => {
      const sourcesInData = new Set(list.flatMap((wh) => Object.keys(wh.source)));
      return Object.entries(source)
        .filter(([key]) => sourcesInData.has(key))
        .map(([key, text]) => ({ text, value: key }))
        .sort((a, b) => {
          if (a.text === "Custom") return -1;
          if (b.text === "Custom") return 1;
          return a.text.localeCompare(b.text);
        });
    },
    matches: (wh, values) => values.some((x) => x in wh.source),
  };
}
