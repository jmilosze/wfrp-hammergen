// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import SelectTable from "./SelectTable.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import { componentStubs } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const itemList = [
  { id: "c", name: "Charm", description: "Be charming" },
  { id: "a", name: "Anger", description: "Be angry" },
  { id: "b", name: "Bless", description: "Be blessed" },
];

function mountTable(selected: Set<string>) {
  return mount(SelectTable, {
    props: { title: "Prayers", itemList, selected, routeName: "prayer", removable: true },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

function tableNames(wrapper: ReturnType<typeof mountTable>): string[] {
  return wrapper.findAll("tbody tr td:first-child").map((x) => x.text());
}

describe("SelectTable", () => {
  test("lists the selected entries by name", () => {
    const wrapper = mountTable(new Set(["c", "a"]));

    expect(tableNames(wrapper)).toEqual(["Anger", "Charm"]);
  });

  test("follows the selection the parent changes", async () => {
    const wrapper = mountTable(new Set(["c"]));

    await wrapper.setProps({ selected: new Set(["c", "b"]) });

    expect(tableNames(wrapper)).toEqual(["Bless", "Charm"]);
  });

  test("asks to deselect a removed entry, leaving the change to the parent", async () => {
    const wrapper = mountTable(new Set(["c", "a"]));

    await wrapper.find("button[aria-label='Remove Anger']").trigger("click");

    expect(wrapper.emitted("selected")).toEqual([[{ id: "a", selected: false }]]);
    expect(tableNames(wrapper)).toEqual(["Anger", "Charm"]);
  });

  test("offers every entry in the popup, by name, and passes on its ticks", async () => {
    const wrapper = mountTable(new Set(["b"]));

    await wrapper
      .findAll("button")
      .find((x) => x.text() === "Edit")
      ?.trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);
    expect(picker.props("items").map((x) => [x.name, x.selected])).toEqual([
      ["Anger", false],
      ["Bless", true],
      ["Charm", false],
    ]);

    picker.vm.$emit("toggle", { id: "c", selected: true });
    expect(wrapper.emitted("selected")).toEqual([[{ id: "c", selected: true }]]);
  });
});
