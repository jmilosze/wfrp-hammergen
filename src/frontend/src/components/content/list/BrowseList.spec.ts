// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import BrowseList from "./BrowseList.vue";
import { BrowseRow } from "./browseRow.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { componentStubs } from "@/testing.ts";
import type { RouteName } from "@/router.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

function row(i: number, fields: Partial<BrowseRow> = {}): BrowseRow {
  const name = `Entry ${String(i).padStart(3, "0")}`;
  return { id: `id${i}`, name, meta: "", description: "", ownerId: "", visibility: Visibility.Public, ...fields };
}

const ROUTE: RouteName = "talent";

// The list's v-model (the search): an update is fed back as the new value, as a parent would.
function mountList(items: BrowseRow[], search = "") {
  const wrapper = mount(BrowseList, {
    props: {
      items,
      routeName: ROUTE,
      modelValue: search,
      "onUpdate:modelValue": (value: string) => wrapper.setProps({ modelValue: value }),
    },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

function names(wrapper: ReturnType<typeof mountList>): string[] {
  return wrapper.findAll("li a").map((x) => x.text());
}

function range(wrapper: ReturnType<typeof mountList>): string | undefined {
  return wrapper.text().match(/\d+–\d+ of \d+/)?.[0];
}

describe("BrowseList", () => {
  test("searches names, meta lines and descriptions", async () => {
    vi.useFakeTimers();
    const wrapper = mountList([
      row(1, { name: "Dagger" }),
      row(2, { name: "Bow", meta: "Ranged" }),
      row(3, { name: "Rope", description: "Ranged climbing aid" }),
    ]);

    await wrapper.find("input").setValue("ranged");
    await vi.advanceTimersByTimeAsync(300);

    expect(names(wrapper)).toEqual(["Bow", "Rope"]);
    vi.useRealTimers();
  });

  test("says when nothing is found", () => {
    const wrapper = mountList([]);

    expect(wrapper.text()).toContain("No results found.");
  });

  test("shows 50 rows a page, with pagers only when there is more than a page", async () => {
    const wrapper = mountList(Array.from({ length: 120 }, (_, i) => row(i)));

    expect(names(wrapper)).toHaveLength(50);
    expect(range(wrapper)).toBe("1–50 of 120");
    await wrapper.find("button[aria-label='Last page']").trigger("click");
    expect(names(wrapper)).toHaveLength(20);
    expect(names(wrapper)[0]).toBe("Entry 100");

    expect(range(mountList([row(1)]))).toBeUndefined();
  });

  test("goes back to the first page on a new search", async () => {
    vi.useFakeTimers();
    const wrapper = mountList(Array.from({ length: 120 }, (_, i) => row(i)));

    await wrapper.find("button[aria-label='Next page']").trigger("click");
    expect(range(wrapper)).toBe("51–100 of 120");
    await wrapper.find("input").setValue("Entry");
    await vi.advanceTimersByTimeAsync(300);

    expect(range(wrapper)).toBe("1–50 of 120");
    vi.useRealTimers();
  });
});
