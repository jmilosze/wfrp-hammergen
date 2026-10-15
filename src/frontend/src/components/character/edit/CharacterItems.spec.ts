// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterItems from "./CharacterItems.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const valid = { valid: true, message: "" };

const itemList = [
  new Item({ id: "dagger", name: "Dagger", type: ItemType.Melee }),
  new Item({ id: "rope", name: "Rope", type: ItemType.Melee }),
  // An Other item that is neither carried nor worn, e.g. a house.
  new Item({ id: "house", name: "House", type: ItemType.Other }),
];

function mountItems(equipped: Record<string, number>, carried: Record<string, number>, stored: Record<string, number>) {
  return mount(CharacterItems, {
    props: {
      itemList,
      equipped,
      carried,
      stored,
      equippedValidationStatus: valid,
      carriedValidationStatus: valid,
      storedValidationStatus: valid,
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

// The row of a trapping in a section, found by its quantity field.
function row(wrapper: ReturnType<typeof mountItems>, name: string, section: string): DOMWrapper<Element> {
  const remove = wrapper.find(`button[aria-label='Remove ${name} from ${section}']`);
  const element = remove.element.closest("div.flex");
  if (element === null) {
    throw new Error(`No row ${name} in ${section}`);
  }
  return new DOMWrapper(element);
}

describe("CharacterItems", () => {
  test("lists the trappings of each section by name with their quantities", () => {
    const wrapper = mountItems({ dagger: 1 }, { rope: 2 }, {});

    const quantities = wrapper
      .findAll<HTMLInputElement>("input[aria-label^='Quantity of']")
      .map((x) => [x.attributes("aria-label"), x.element.value]);
    expect(quantities).toEqual([
      ["Quantity of Dagger", "1"],
      ["Quantity of Rope", "2"],
    ]);
    expect(wrapper.text()).toContain("None");
  });

  test("moves one trapping between sections through Carried", async () => {
    const wrapper = mountItems({}, { dagger: 2 }, {});

    await findButton(row(wrapper, "Dagger", "Carried"), "Equip").trigger("click");
    await findButton(row(wrapper, "Dagger", "Carried"), "Store").trigger("click");

    expect(wrapper.emitted("carriedUpdated")).toEqual([[{ id: "dagger", number: 1 }], [{ id: "dagger", number: 1 }]]);
    expect(wrapper.emitted("equippedUpdated")).toEqual([[{ id: "dagger", number: 1 }]]);
    expect(wrapper.emitted("storedUpdated")).toEqual([[{ id: "dagger", number: 1 }]]);
  });

  test("doesn't carry a trapping that can't be carried", () => {
    const wrapper = mountItems({}, {}, { house: 1 });

    expect(findButton(row(wrapper, "House", "Stored/Assets"), "Carry").attributes("disabled")).toBeDefined();
  });

  test("sets a typed quantity, and 0 when removed", async () => {
    const wrapper = mountItems({}, { rope: 1 }, {});

    await row(wrapper, "Rope", "Carried").find("input").setValue("3");
    await findButton(wrapper, "Remove Rope from Carried").trigger("click");

    expect(wrapper.emitted("carriedUpdated")).toEqual([[{ id: "rope", number: 3 }], [{ id: "rope", number: 0 }]]);
  });

  test("offers only the trappings that fit the section it adds to", async () => {
    const wrapper = mountItems({}, {}, {});

    // The first Add is Equipped's.
    await findButton(wrapper, "Add").trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);

    expect(picker.props("items").map((x) => x.name)).toEqual(["Dagger", "Rope"]);
  });
});
