// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import SelectIdValueTable from "./SelectIdValueTable.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import { IdValue } from "@/utils/idValue.ts";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const itemList = [
  { id: "ward", name: "Ward", description: "Ignores damage", hasValue: true },
  { id: "bestial", name: "Bestial", description: "Wild", hasValue: false },
];

function mountTable(selected: IdValue[]) {
  return mount(SelectIdValueTable, {
    props: {
      title: "Creature Traits",
      itemList,
      selected,
      routeName: "trait",
      allowRepeat: true,
      validationStatus: { valid: true, message: "" },
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

describe("SelectIdValueTable", () => {
  test("lists the picked entries by name, with a value field for those that take one", () => {
    const wrapper = mountTable([
      { id: "ward", value: "8" },
      { id: "bestial", value: "" },
      { id: "ward", value: "9" },
    ]);

    const rows = wrapper
      .findAll("tbody tr")
      .map((r) => [r.find("td").text(), r.findAll<HTMLInputElement>("input").map((x) => x.element.value)]);
    expect(rows).toEqual([
      ["Bestial", []],
      ["Ward", ["8"]],
      ["Ward", ["9"]],
    ]);
  });

  test("passes on a typed value and a removal with the entry's position", async () => {
    const wrapper = mountTable([
      { id: "bestial", value: "" },
      { id: "ward", value: "8" },
    ]);

    await wrapper.find("tbody input").setValue("10");
    await findButton(wrapper, "Remove Bestial").trigger("click");

    expect(wrapper.emitted("updateValue")).toEqual([[{ index: 1, id: "ward", value: "10" }]]);
    expect(wrapper.emitted("remove")).toEqual([[{ index: 0, id: "bestial" }]]);
  });

  test("adds entries that take a value as often as wanted, and ticks the others", async () => {
    const wrapper = mountTable([
      { id: "ward", value: "8" },
      { id: "ward", value: "9" },
    ]);

    await findButton(wrapper, "Edit").trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);
    expect(picker.props("items").map((x) => [x.name, x.repeatable, x.count])).toEqual([
      ["Bestial", false, undefined],
      ["Ward", true, 2],
    ]);

    await findButton(picker, "Add Ward").trigger("click");
    await picker.find("input[type=checkbox]").setValue(true);
    expect(wrapper.emitted("add")).toEqual([["ward"]]);
    expect(wrapper.emitted("selected")).toEqual([[{ id: "bestial", selected: true }]]);
  });
});
