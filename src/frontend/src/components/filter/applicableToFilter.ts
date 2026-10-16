import { ItemType, itemTypeList, printItemType } from "@/services/wh/content/item.ts";
import { ContentFilter } from "./contentFilter.ts";

// Entries (qualities and flaws, runes) by the trapping types they apply to; the types some entry applies to are offered.
export const applicableToFilter: ContentFilter<{ applicableTo: ItemType[] }> = {
  title: "Applicable to",
  options: (list) => {
    const applicableInData = new Set(list.flatMap((wh) => wh.applicableTo));
    return itemTypeList
      .filter((x) => applicableInData.has(x))
      .map((x) => ({ text: printItemType(x), value: x.toString() }));
  },
  matches: (wh, values) => wh.applicableTo.some((x) => values.includes(x.toString())),
};
