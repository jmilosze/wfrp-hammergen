import { computed, Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { ContentFilters, filterSections, matchesFilters, untickUnoffered } from "@/components/filter/contentFilter.ts";

// useListFilters is a list page's filters over its list: the ticked values, kept in the query string (a filter's
// values comma-separated under its key), the sections of the FilterSidebar, and whether an entry matches. A ticked
// value no longer offered is unticked.
export function useListFilters<T>(filters: ContentFilters<T>, list: Ref<T[]>) {
  const queries = Object.keys(filters).map((key) => ({ key: key, query: useRouteQuery<string>(key, "") }));

  const ticked = computed<Record<string, string[]>>({
    get: () => Object.fromEntries(queries.map((x) => [x.key, x.query.value === "" ? [] : x.query.value.split(",")])),
    set: (value) => {
      for (const x of queries) {
        x.query.value = (value[x.key] ?? []).join(",");
      }
    },
  });

  const sections = computed(() => filterSections(filters, list.value, ticked.value));
  untickUnoffered(ticked, sections);

  function matches(wh: T): boolean {
    return matchesFilters(filters, wh, ticked.value);
  }

  return { ticked, sections, matches };
}
