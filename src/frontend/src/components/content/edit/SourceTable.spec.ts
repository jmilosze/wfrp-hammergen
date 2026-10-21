// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, mount } from "@vue/test-utils";
import SourceTable from "./SourceTable.vue";
import ChecklistRow from "@/components/picker/ChecklistRow.vue";
import { updateSource } from "@/services/wh/core/source.ts";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

function mountTable(sources: Record<string, string>) {
  return mount(SourceTable, {
    props: { sources, edition: "4e" },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

// The sources listed in the table, by name, each with its notes field.
function rows(wrapper: ReturnType<typeof mountTable>): string[] {
  return wrapper
    .findAll("tbody tr")
    .map((r) => `${r.find("td").text()} | ${r.find<HTMLInputElement>("input").element.value}`);
}

function popupRow(wrapper: ReturnType<typeof mountTable>, name: string): DOMWrapper<Element> {
  const row = wrapper.findAllComponents(ChecklistRow).find((x) => x.props("item").name === name);
  if (row === undefined) {
    throw new Error(`No source ${name}`);
  }
  return new DOMWrapper(row.element);
}

describe("SourceTable", () => {
  test("lists the entry's sources by name with their notes", () => {
    const wrapper = mountTable({ "1": "p. 42", "0": "" });

    expect(rows(wrapper)).toEqual(["Custom | ", "WFRP 4e | p. 42"]);
  });

  test("keeps the notes of an unticked source and brings them back when it is ticked again", async () => {
    const sources: Record<string, string> = { "1": "p. 42" };
    const wrapper = mountTable(sources);

    await findButton(wrapper, "Edit").trigger("click");
    const checkbox = popupRow(wrapper, "WFRP 4e").find("input[type=checkbox]");
    await checkbox.trigger("change");
    // The editor applies the change, as it does with every emitted change.
    const emitted = wrapper.emitted<[{ id: string; notes: string; selected: boolean }]>("selected");
    if (emitted === undefined) {
      throw new Error("Nothing unticked");
    }
    updateSource(sources, emitted[0][0]);
    await wrapper.setProps({ sources: { ...sources } });
    expect(rows(wrapper)).toEqual([]);

    await checkbox.trigger("change");
    expect(wrapper.emitted("selected")?.at(-1)).toEqual([{ id: "1", notes: "p. 42", selected: true }]);
  });

  test("the popup only picks sources; notes of up to 25 characters are typed in the table", async () => {
    const wrapper = mountTable({ "1": "p. 42" });

    await findButton(wrapper, "Edit").trigger("click");
    expect(popupRow(wrapper, "WFRP 4e").find("input[type=text]").exists()).toBe(false);

    const notes = wrapper.find<HTMLInputElement>("tbody input");
    expect(notes.attributes("maxlength")).toBe("25");
    await notes.setValue("p. 43");

    expect(wrapper.emitted("selected")).toEqual([[{ id: "1", notes: "p. 43", selected: true }]]);
  });

  test("reports invalid notes", () => {
    const wrapper = mountTable({ "1": "x".repeat(200) });

    expect(wrapper.text()).toContain("Some of the sources are invalid.");
  });
});
