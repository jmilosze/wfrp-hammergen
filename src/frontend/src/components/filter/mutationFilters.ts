import { Mutation, mutationTypeList, printMutationType } from "@/services/wh/content/mutation.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of mutations; the types some mutation has are offered.
export const mutationFilters = {
  type: {
    title: "Type",
    options: (list) => {
      const typesInData = new Set(list.map((wh) => wh.type));
      return mutationTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printMutationType(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.type.toString()),
  },
  source: sourceFilter(true),
} satisfies ContentFilters<Mutation>;
