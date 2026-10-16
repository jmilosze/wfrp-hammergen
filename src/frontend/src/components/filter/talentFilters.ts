import { Talent } from "@/services/wh/content/talent.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of talents: the source is the only one, so it starts open.
export const talentFilters = {
  source: sourceFilter(false),
} satisfies ContentFilters<Talent>;
