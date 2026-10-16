import { Ref, watch } from "vue";
import { FilterSection } from "./filterSection.ts";

// A filter of a content type, shown as a section of checkboxes. The list page of the type uses all its filters, a
// picker the ones it needs. options: the values the entries of list can be filtered by, given the ticked values of
// all filters by key (e.g. the groups of the ticked types). matches: whether an entry has one of the ticked values
// (called only when some are ticked). collapsed: the section starts folded.
export type ContentFilter<T> = {
  title: string;
  collapsed?: boolean;
  options: (list: T[], ticked: Record<string, string[]>) => FilterSection["options"];
  matches: (wh: T, values: string[]) => boolean;
};

// The filters of a content type by key, in the order of their sections.
export type ContentFilters<T> = Record<string, ContentFilter<T>>;

export function filterSections<T>(
  filters: ContentFilters<T>,
  list: T[],
  ticked: Record<string, string[]>,
): FilterSection[] {
  return Object.entries(filters).map(([key, filter]) => ({
    key: key,
    title: filter.title,
    collapsed: filter.collapsed,
    options: filter.options(list, ticked),
  }));
}

// In a section an entry matches any ticked value; the sections combine.
export function matchesFilters<T>(filters: ContentFilters<T>, wh: T, ticked: Record<string, string[]>): boolean {
  return Object.entries(filters).every(([key, filter]) => {
    const values = ticked[key] ?? [];
    return values.length === 0 || filter.matches(wh, values);
  });
}

// Filters over a fixed list whose entries are looked up by id, e.g. for the rows of a picker.
export type IdFilter = {
  sections: (ticked: Record<string, string[]>) => FilterSection[];
  matches: (id: string, ticked: Record<string, string[]>) => boolean;
};

export function idFilter<T extends { id: string }>(filters: ContentFilters<T>, list: T[]): IdFilter {
  const byId = new Map(list.map((x) => [x.id, x]));
  return {
    sections: (ticked) => filterSections(filters, list, ticked),
    matches: (id, ticked) => {
      const wh = byId.get(id);
      return wh !== undefined && matchesFilters(filters, wh, ticked);
    },
  };
}

// untickUnoffered unticks the values their section doesn't offer: at once (e.g. from an old link) and whenever the
// sections change, e.g. the groups of a type that was unticked, or the sources of the other edition once the list of a
// new edition is loaded.
export function untickUnoffered(ticked: Ref<Record<string, string[]>>, sections: Ref<FilterSection[]>) {
  watch(
    sections,
    (shown) => {
      let changed = false;
      const kept = { ...ticked.value };
      for (const section of shown) {
        const values = kept[section.key] ?? [];
        const offered = values.filter((x) => section.options.some((option) => option.value === x));
        if (offered.length !== values.length) {
          kept[section.key] = offered;
          changed = true;
        }
      }
      if (changed) {
        ticked.value = kept;
      }
    },
    { immediate: true },
  );
}
