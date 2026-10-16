import { Trait } from "@/services/wh/content/trait.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of traits: the source is the only one, so it starts open.
export const traitFilters = {
  source: sourceFilter(false),
} satisfies ContentFilters<Trait>;
