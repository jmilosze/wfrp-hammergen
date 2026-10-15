import { describe, expect, test, vi } from "vitest";
import { nextTick, ref } from "vue";
import { Edition } from "@/services/wh/core/edition.ts";
import { Prayer } from "@/services/wh/content/prayer.ts";

// The "source" query string, standing in for the router.
const sourceQuery = ref("");

vi.mock("@vueuse/router", () => ({
  useRouteQuery: () => sourceQuery,
}));

vi.mock("./auth.ts", () => ({
  useAuth: () => ({}),
}));

const { useSourceFilter } = await import("./whList.ts");

function prayer(sources: string[]): Prayer {
  return new Prayer({ source: Object.fromEntries(sources.map((x) => [x, ""])) });
}

describe("useSourceFilter", () => {
  test("clears the source filter when the edition changes", async () => {
    const edition = ref<Edition>("4e");
    const { term } = useSourceFilter(ref([]), edition, true);

    term.value = ["1"];
    await nextTick();
    expect(sourceQuery.value).toBe("1");

    edition.value = "5e";
    await nextTick();
    expect(term.value).toEqual([]);
  });

  test("keeps the source filter while the edition stays the same", async () => {
    const edition = ref<Edition>("5e");
    const { term } = useSourceFilter(ref([]), edition, true);

    term.value = ["44", "3"];
    await nextTick();
    expect(sourceQuery.value).toBe("44,3");
    expect(term.value).toEqual(["44", "3"]);
  });

  test("matches entries with any ticked source, or all when none is ticked", () => {
    const { term, matches } = useSourceFilter(ref<Prayer[]>([]), ref<Edition>("4e"), true);

    term.value = [];
    expect(matches(prayer(["2"]))).toBe(true);

    term.value = ["1", "3"];
    expect(matches(prayer(["3", "5"]))).toBe(true);
    expect(matches(prayer(["2"]))).toBe(false);
  });

  test("offers the sources some entry has, Custom first", () => {
    const list = ref([prayer(["5", "0"]), prayer(["3"])]);
    const { section } = useSourceFilter(list, ref<Edition>("4e"), false);

    expect(section.value).toEqual({
      key: "source",
      title: "Source",
      collapsed: false,
      options: [
        { text: "Custom", value: "0" },
        { text: "Archives Volume I", value: "3" },
        { text: "Archives Volume III", value: "5" },
      ],
    });
  });
});
