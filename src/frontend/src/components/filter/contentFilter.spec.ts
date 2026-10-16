import { describe, expect, test } from "vitest";
import { computed, nextTick, ref } from "vue";
import { ContentFilters, filterSections, idFilter, matchesFilters, untickUnoffered } from "./contentFilter.ts";

type Entry = { id: string; kind: string; size: string };

function entry(id: string, kind: string, size: string): Entry {
  return { id, kind, size };
}

// Entries by kind and size; the values some entry has are offered.
function valueFilter(title: string, value: (x: Entry) => string) {
  return {
    title: title,
    options: (list: Entry[]) => [...new Set(list.map(value))].map((x) => ({ text: x, value: x })),
    matches: (wh: Entry, values: string[]) => values.includes(value(wh)),
  };
}

const filters: ContentFilters<Entry> = {
  kind: valueFilter("Kind", (x) => x.kind),
  size: { ...valueFilter("Size", (x) => x.size), collapsed: true },
};

const list = [entry("a", "x", "big"), entry("b", "y", "small"), entry("c", "x", "small")];

describe("filterSections", () => {
  test("makes a section per filter, in order, under its key", () => {
    expect(filterSections(filters, list, {})).toEqual([
      {
        key: "kind",
        title: "Kind",
        collapsed: undefined,
        options: [
          { text: "x", value: "x" },
          { text: "y", value: "y" },
        ],
      },
      {
        key: "size",
        title: "Size",
        collapsed: true,
        options: [
          { text: "big", value: "big" },
          { text: "small", value: "small" },
        ],
      },
    ]);
  });
});

describe("matchesFilters", () => {
  test("matches any ticked value of a filter, all filters combined, a filter with none ticked matching all", () => {
    const matching = (ticked: Record<string, string[]>) =>
      list.filter((x) => matchesFilters(filters, x, ticked)).map((x) => x.id);

    expect(matching({})).toEqual(["a", "b", "c"]);
    expect(matching({ kind: ["x", "y"], size: [] })).toEqual(["a", "b", "c"]);
    expect(matching({ kind: ["x"], size: ["small"] })).toEqual(["c"]);
  });
});

describe("idFilter", () => {
  const filter = idFilter({ kind: filters.kind }, list);

  test("offers the sections of the chosen filters", () => {
    expect(filter.sections({}).map((x) => x.key)).toEqual(["kind"]);
  });

  test("matches the entry with the id, and no unknown id", () => {
    expect(filter.matches("a", { kind: ["x"] })).toBe(true);
    expect(filter.matches("b", { kind: ["x"] })).toBe(false);
    expect(filter.matches("d", {})).toBe(false);
  });
});

describe("untickUnoffered", () => {
  test("unticks the values not offered at once", () => {
    const ticked = ref<Record<string, string[]>>({ kind: ["x", "z"] });
    untickUnoffered(
      ticked,
      computed(() => filterSections(filters, list, ticked.value)),
    );

    expect(ticked.value).toEqual({ kind: ["x"] });
  });

  test("unticks the values a section no longer offers, keeping the others", async () => {
    const shown = ref(list);
    const ticked = ref<Record<string, string[]>>({ kind: ["x", "y"], size: ["small"] });
    untickUnoffered(
      ticked,
      computed(() => filterSections(filters, shown.value, ticked.value)),
    );

    shown.value = [entry("a", "x", "small")];
    await nextTick();

    expect(ticked.value).toEqual({ kind: ["x"], size: ["small"] });
  });
});
