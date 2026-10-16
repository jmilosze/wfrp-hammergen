// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import FilterSidebar from "./FilterSidebar.vue";
import { FilterSection } from "@/components/filter/filterSection.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const sections: FilterSection[] = [
  {
    key: "type",
    title: "Type",
    options: [
      { text: "Melee", value: "0" },
      { text: "Ranged", value: "1" },
    ],
  },
  {
    key: "group",
    title: "Group",
    options: [
      { text: "Basic", value: "0:0", heading: "Melee" },
      { text: "Bow", value: "1:0", heading: "Ranged" },
    ],
  },
  { key: "source", title: "Source", collapsed: true, options: [{ text: "WFRP 4e", value: "1" }] },
  { key: "empty", title: "Empty", options: [] },
];

// The sidebar's v-model: an update is fed back as the new value, as a parent would.
function mountSidebar(selected: Record<string, string[]>) {
  const wrapper = mount(FilterSidebar, {
    props: {
      sections,
      modelValue: selected,
      "onUpdate:modelValue": (value: Record<string, string[]>) => wrapper.setProps({ modelValue: value }),
    },
  });
  return wrapper;
}

function checkbox(wrapper: ReturnType<typeof mountSidebar>, text: string) {
  const label = wrapper.findAll("label").find((x) => x.text() === text);
  if (label === undefined) {
    throw new Error(`No option ${text}`);
  }
  return label.find("input");
}

describe("FilterSidebar", () => {
  test("shows the sections with options, the collapsed ones folded, with headings", () => {
    const wrapper = mountSidebar({});

    expect(wrapper.findAll("button[aria-expanded]").map((x) => x.text())).toEqual(["Type", "Group", "Source"]);
    expect(wrapper.findAll("label").map((x) => x.text())).toEqual(["Melee", "Ranged", "Basic", "Bow"]);
    // Each option with the heading shown above it, in the order shown.
    expect(wrapper.findAll("li").map((x) => x.text())).toEqual(["Melee", "Ranged", "Melee Basic", "Ranged Bow"]);
  });

  test("ticks and unticks options in their section", async () => {
    const wrapper = mountSidebar({ type: ["0"] });

    await checkbox(wrapper, "Ranged").trigger("change");
    expect(wrapper.props("modelValue")).toEqual({ type: ["0", "1"] });

    await checkbox(wrapper, "Melee").trigger("change");
    expect(wrapper.props("modelValue")).toEqual({ type: ["1"] });
  });

  test("counts the ticked options and clears them", async () => {
    const wrapper = mountSidebar({ type: ["0", "1"], group: ["1:0"] });

    expect(wrapper.text()).toContain("Filters (3)");
    await wrapper
      .findAll("button")
      .find((x) => x.text() === "Clear")
      ?.trigger("click");

    expect(wrapper.props("modelValue")).toEqual({ type: [], group: [], source: [], empty: [] });
  });

  test("unfolds a collapsed section", async () => {
    const wrapper = mountSidebar({});

    await wrapper
      .findAll("button[aria-expanded]")
      .find((x) => x.text() === "Source")
      ?.trigger("click");

    expect(wrapper.findAll("label").map((x) => x.text())).toContain("WFRP 4e");
  });
});
