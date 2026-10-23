// @vitest-environment happy-dom
import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ChecklistPicker from "./ChecklistPicker.vue";
import { ChecklistItem } from "./checklistItem.ts";
import ChecklistRow from "./ChecklistRow.vue";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { IdFilter } from "@/components/filter/contentFilter.ts";
import { Mark } from "@/services/wh/character/marks.ts";

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

  test("a repeatable row adds once when clicked anywhere or on Add, but not on its name", async () => {
    const wrapper = mountPicker({ items: [item("b", "Beta", { repeatable: true })], routeName: "trait" });
    const row = wrapper.findComponent(ChecklistRow);

    await row.find("div").trigger("click");
    await findButton(row, "Add Beta").trigger("click");
    await row.find("a").trigger("click");

    expect(wrapper.emitted("add")).toEqual([["b"], ["b"]]);
  });

  test("a plain row has its checkbox at the end, the row is its label", () => {
    const wrapper = mountPicker({ items: [item("a", "Alpha")], routeName: "spell" });
    const row = wrapper.findComponent(ChecklistRow);

    expect(row.element.tagName).toBe("LABEL");
    expect(row.element.lastElementChild?.querySelector("input[type=checkbox]")).not.toBeNull();
  });

  test("filters by edition in the Filters panel when 4e content is offered", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha"), item("b", "Beta")],
      fourEIds: new Set(["b"]),
    });

    await findButton(wrapper, "Filters").trigger("click");
    await wrapper
      .findAll("label")
      .filter((x) => x.text() === "4e")[0]
      .find("input")
      .setValue(true);

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

  test("filters by the marks the rows have", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha"), item("b", "Beta"), item("c", "Gamma")],
      marks: new Map([
        ["a", new Set(["career", "species"] as const)],
        ["b", new Set(["species"] as const)],
      ]),
    });

    await findButton(wrapper, "Filters").trigger("click");
    // Only the marks some row has are offered.
    expect(wrapper.findAll("label").map((x) => x.text())).not.toContain("Class");
    await wrapper
      .findAll("label")
      .filter((x) => x.text() === "Career")[0]
      .find("input")
      .setValue(true);

    expect(rowNames(wrapper)).toEqual(["Alpha"]);
  });

  test("filters Species (Random) rows by Species", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha"), item("b", "Beta"), item("c", "Gamma")],
      marks: new Map<string, Set<Mark>>([
        ["a", new Set(["species"])],
        ["b", new Set(["randomSpecies"])],
      ]),
    });

    await findButton(wrapper, "Filters").trigger("click");
    const labels = wrapper.findAll("label").map((x) => x.text());
    expect(labels).toContain("Species");
    expect(labels).not.toContain("Species (Random)");
    await wrapper
      .findAll("label")
      .filter((x) => x.text() === "Species")[0]
      .find("input")
      .setValue(true);

    expect(rowNames(wrapper)).toEqual(["Alpha", "Beta"]);
  });

  test("filters by Selected with the marks, so selected and marked rows show together", async () => {
    const wrapper = mountPicker({
      items: [item("a", "Alpha", { selected: true }), item("b", "Beta"), item("c", "Gamma")],
      marks: new Map<string, Set<Mark>>([["b", new Set(["career"])]]),
    });

    await findButton(wrapper, "Filters").trigger("click");
    for (const option of ["Selected", "Career"]) {
      await wrapper
        .findAll("label")
        .filter((x) => x.text() === option)[0]
        .find("input")
        .setValue(true);
    }

    expect(rowNames(wrapper)).toEqual(["Alpha", "Beta"]);
  });
});
