import { ItemProperty, itemPropertyTypeList, printItemPropertyType } from "@/services/wh/content/itemproperty.ts";
import { ContentFilters } from "./contentFilter.ts";
import { applicableToFilter } from "./applicableToFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of qualities and flaws; the types some entry has are offered.
export const itemPropertyFilters = {
  type: {
    title: "Type",
    options: (list) => {
      const typesInData = new Set(list.map((wh) => wh.type));
      return itemPropertyTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printItemPropertyType(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.type.toString()),
  },
  applicableTo: applicableToFilter,
  source: sourceFilter(true),
} satisfies ContentFilters<ItemProperty>;
