// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterItems from "./CharacterItems.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import { buttonNames, componentStubs, findButton } from "@/testing.ts";
import FormInput from "@/components/form/FormInput.vue";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const valid = { valid: true, message: "" };

const itemList = [
  new Item({ id: "dagger", name: "Dagger", type: ItemType.Melee }),
  new Item({ id: "rope", name: "Rope", type: ItemType.Melee }),
  // An Other item that is neither carried nor worn, e.g. a house.
  new Item({ id: "house", name: "House", type: ItemType.Other }),
];

type Entry = { id: string; number: number; value: string };

const entry = (id: string, number: number, value = ""): Entry => ({ id: id, number: number, value: value });

function mountItems(equipped: Entry[], carried: Entry[], stored: Entry[], disabled = false) {
  return mount(CharacterItems, {
    props: {
      itemList,
      equipped,
      carried,
      stored,
      disabled,
      equippedValidationStatus: valid,
      carriedValidationStatus: valid,
      storedValidationStatus: valid,
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

// The row of a trapping in a section, found by its remove button ("Dagger (Axe)" for one with a note).
function row(wrapper: ReturnType<typeof mountItems>, name: string, section: string): DOMWrapper<Element> {
  const remove = wrapper.find(`button[aria-label='Remove ${name} from ${section}']`);
  const element = remove.element.closest("div.flex");
  if (element === null) {
    throw new Error(`No row ${name} in ${section}`);
  }
  return new DOMWrapper(element);
}

describe("CharacterItems", () => {
  test("lists the trappings of each section by name and note with their quantities", () => {
    const wrapper = mountItems([entry("rope", 2)], [entry("dagger", 1), entry("dagger", 3, "Axe")], []);

    const quantities = wrapper
      .findAll<HTMLInputElement>("input[aria-label^='Quantity of']")
      .map((x) => [x.attributes("aria-label"), x.element.value]);
    expect(quantities).toEqual([
      ["Quantity of Rope", "2"],
      ["Quantity of Dagger", "1"],
      ["Quantity of Dagger (Axe)", "3"],
    ]);
    expect(row(wrapper, "Dagger (Axe)", "Carried").text()).toContain("Axe");
    expect(row(wrapper, "Dagger", "Carried").text()).not.toContain("Axe");
    expect(wrapper.text()).toContain("None");
  });

  test("shows the note under the name, also when it can't be edited", () => {
    const wrapper = mountItems([], [entry("dagger", 1, "Axe")], [], true);

    expect(wrapper.text()).toContain("DaggerAxe");
    expect(buttonNames(wrapper)).not.toContain("Note");
  });

  test("moves one of an entry between sections through Carried", async () => {
    const wrapper = mountItems([], [entry("rope", 1), entry("dagger", 2, "Axe")], []);

    await findButton(row(wrapper, "Dagger (Axe)", "Carried"), "Equip").trigger("click");
    await findButton(row(wrapper, "Dagger (Axe)", "Carried"), "Store").trigger("click");

    expect(wrapper.emitted("move")).toEqual([
      [{ from: "carried", index: 1, to: "equipped" }],
      [{ from: "carried", index: 1, to: "stored" }],
    ]);
  });

  test("doesn't carry a trapping that can't be carried", () => {
    const wrapper = mountItems([], [], [entry("house", 1)]);

    expect(findButton(row(wrapper, "House", "Stored/Assets"), "Carry").attributes("disabled")).toBeDefined();
  });

  test("changes a typed quantity of the entry, and removes it", async () => {
    const wrapper = mountItems([], [entry("rope", 1)], []);

    await row(wrapper, "Rope", "Carried").find("input[type='number']").setValue("3");
    await findButton(wrapper, "Remove Rope from Carried").trigger("click");

    expect(wrapper.emitted("updateItem")).toEqual([
      [{ location: "carried", index: 0, number: 3 }],
      [{ location: "carried", index: 0, number: 0 }],
    ]);
  });

  test("a narrow card offers the row's actions in a menu", async () => {
    // happy-dom has no popover API; the browser's opens and closes the menu.
    HTMLElement.prototype.hidePopover = vi.fn();
    const wrapper = mountItems([], [entry("house", 1), entry("rope", 2, "old")], []);
    const menu = row(wrapper, "Rope (old)", "Carried").find("[role='menu']");

    expect(menu.findAll("[role='menuitem']").map((x) => x.text())).toEqual(["Note", "Equip", "Store"]);
    expect(
      row(wrapper, "House", "Carried")
        .findAll("[role='menuitem']")
        .find((x) => x.text() === "Equip")
        ?.attributes("disabled"),
    ).toBeDefined();
    await findButton(menu, "Store").trigger("click");

    expect(wrapper.emitted("move")).toEqual([[{ from: "carried", index: 1, to: "stored" }]]);
  });

  test("edits the note in a popup of at most 40 characters; Cancel keeps it", async () => {
    const wrapper = mountItems([], [entry("rope", 1, "old")], []);
    const body = new DOMWrapper(document.body);

    await findButton(row(wrapper, "Rope (old)", "Carried"), "Note").trigger("click");
    const input = wrapper.findComponent(FormInput).find("input");
    expect(input.element.value).toBe("old");
    expect(input.attributes("maxlength")).toBe("40");
    await input.setValue(" for climbing ");
    await findButton(body, "Save").trigger("click");

    await findButton(row(wrapper, "Rope (old)", "Carried"), "Note").trigger("click");
    await wrapper.findComponent(FormInput).find("input").setValue("discarded");
    await findButton(body, "Cancel").trigger("click");

    expect(wrapper.emitted("updateItem")).toEqual([[{ location: "carried", index: 0, value: "for climbing" }]]);
  });

  test("offers only the trappings that fit the section it adds to", async () => {
    const wrapper = mountItems([], [], []);

    // The first Add is Equipped's.
    await findButton(wrapper, "Add").trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);

    expect(picker.props("items").map((x) => x.name)).toEqual(["Dagger", "Rope"]);
  });

  test("the popup shows a trapping as selected with how many rows it has, notes or not, and adds a row", async () => {
    const wrapper = mountItems([], [entry("dagger", 2, "Axe"), entry("dagger", 1), entry("dagger", 1)], []);

    // The second Add is Carried's.
    await wrapper
      .findAll("button")
      .filter((x) => x.text() === "Add")[1]
      .trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);
    const dagger = picker.props("items").find((x) => x.id === "dagger");
    expect(dagger).toMatchObject({ selected: true, repeatable: true, count: 3 });
    expect(dagger?.number).toBeUndefined();

    picker.vm.$emit("add", "dagger");
    expect(wrapper.emitted("addItem")).toEqual([[{ location: "carried", id: "dagger" }]]);
  });
});
