import { Prayer } from "@/services/wh/content/prayer.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of prayers: the source is the only one, so it starts open.
export const prayerFilters = {
  source: sourceFilter(false),
} satisfies ContentFilters<Prayer>;
