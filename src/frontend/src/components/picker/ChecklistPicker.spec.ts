// @vitest-environment happy-dom
import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ChecklistPicker from "./ChecklistPicker.vue";
import { ChecklistItem } from "./checklistItem.ts";
import ChecklistRow from "./ChecklistRow.vue";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { IdFilter } from "@/components/filter/contentFilter.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

function item(id: string, name: string, fields: Partial<ChecklistItem> = {}): ChecklistItem {
  return { id, name, description: `About ${name}`, selected: false, ...fields };
}

function mountPicker(props: InstanceType<typeof ChecklistPicker>["$props"]) {
  return mount(ChecklistPicker, { props, global: { stubs: componentStubs } });
}

function bandTitles(wrapper: ReturnType<typeof mountPicker>): string[] {
  return wrapper.findAllComponents(SheetTitle).map((x) => x.text());
}

function rowNames(wrapper: ReturnType<typeof mountPicker>): string[] {
  return wrapper.findAllComponents(ChecklistRow).map((x) => x.props("item").name);
}

describe("ChecklistPicker", () => {
  test("lists the items picked when it opens under Selected, the rest under Available", () => {
    const wrapper = mountPicker({ items: [item("a", "Alpha"), item("b", "Beta", { selected: true })] });

    expect(bandTitles(wrapper)).toEqual(["Selected", "Available"]);
    expect(rowNames(wrapper)).toEqual(["Beta", "Alpha"]);
  });

  test("keeps a ticked row in its band, so rows don't jump", async () => {
    const items = [item("a", "Alpha"), item("b", "Beta")];
    const wrapper = mountPicker({ items });

    await wrapper.find("input[type=checkbox]").setValue(true);
    expect(wrapper.emitted("toggle")).toEqual([[{ id: "a", selected: true }]]);
    await wrapper.setProps({ items: [item("a", "Alpha", { selected: true }), item("b", "Beta")] });

    expect(bandTitles(wrapper)).toEqual(["Available"]);
  });

  test("searches names and descriptions", async () => {
    vi.useFakeTimers();
    const wrapper = mountPicker({ items: [item("a", "Alpha"), item("b", "Beta", { description: "Gamma rays" })] });

    await wrapper.find("input[type=text]").setValue("gamma");
    await vi.advanceTimersByTimeAsync(300);

    expect(rowNames(wrapper)).toEqual(["Beta"]);
    vi.useRealTimers();
  });

  test("emits typed numbers and repeatable adds", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha", { number: 0 }), item("b", "Beta", { repeatable: true, count: 2 })],
      numberLabel: "Adv",
    });

    await wrapper.find("input[type=number]").setValue("10");
    await findButton(wrapper, "Add Beta").trigger("click");

    expect(wrapper.emitted("setNumber")).toEqual([[{ id: "a", number: 10 }]]);
    expect(wrapper.emitted("add")).toEqual([["b"]]);
    expect(wrapper.text()).toContain("×2");
  });

  test("filters by edition when 4e content is offered", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha"), item("b", "Beta")],
      fourEIds: new Set(["b"]),
    });

    await wrapper.find("select").setValue("4e");

    expect(rowNames(wrapper)).toEqual(["Beta"]);
  });

  test("narrows the rows with the filters of the Filters panel", async () => {
    // Rows by their first letter, a and b offered.
    const filter: IdFilter = {
      sections: () => [
        {
          key: "letter",
          title: "Letter",
          options: [
            { text: "A", value: "a" },
            { text: "B", value: "b" },
          ],
        },
      ],
      matches: (id, ticked) => (ticked.letter ?? []).length === 0 || (ticked.letter ?? []).includes(id[0]),
    };
    const wrapper = mountPicker({ items: [item("a1", "Alpha"), item("b1", "Beta")], filter });

    await findButton(wrapper, "Filters").trigger("click");
    await wrapper
      .findAll("label")
      .filter((x) => x.text() === "B")[0]
      .find("input")
      .setValue(true);

    expect(rowNames(wrapper)).toEqual(["Beta"]);
    expect(findButton(wrapper, "Filters (1)").attributes("aria-expanded")).toBe("true");

    await findButton(wrapper, "Clear").trigger("click");
    expect(rowNames(wrapper)).toEqual(["Alpha", "Beta"]);
  });
});
