import { describe, expect, test, vi } from "vitest";
import { nextTick, ref, Ref } from "vue";
import { Prayer } from "@/services/wh/content/prayer.ts";
import { prayerFilters } from "@/components/filter/prayerFilters.ts";

// The query string values by name, standing in for the router.
const queries: Record<string, Ref<string>> = {};

vi.mock("@vueuse/router", () => ({
  useRouteQuery: (name: string, initial: string) => (queries[name] ??= ref(initial)),
}));

const { useListFilters } = await import("./listFilters.ts");

function prayer(sources: string[]): Prayer {
  return new Prayer({ source: Object.fromEntries(sources.map((x) => [x, ""])) });
}

describe("useListFilters", () => {
  test("keeps the ticked values in the query string, comma-separated under the filter's key", () => {
    const list = ref([prayer(["3"]), prayer(["5"])]);
    const { ticked, matches } = useListFilters(prayerFilters, list);

    ticked.value = { source: ["3", "5"] };
    expect(queries.source.value).toBe("3,5");

    queries.source.value = "5";
    expect(ticked.value).toEqual({ source: ["5"] });
    expect(list.value.map((x) => matches(x))).toEqual([false, true]);
  });

  test("unticks the sources the list no longer has, e.g. when the list of another edition is loaded", async () => {
    const list = ref([prayer(["3"]), prayer(["5"])]);
    const { ticked } = useListFilters(prayerFilters, list);
    ticked.value = { source: ["3", "5"] };
    await nextTick();

    list.value = [prayer(["5"])];
    await nextTick();

    expect(ticked.value).toEqual({ source: ["5"] });
  });
});
