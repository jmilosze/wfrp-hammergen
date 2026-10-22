// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CareerTrappings from "./CareerTrappings.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import CareerTrappingEntryModal from "./CareerTrappingEntryModal.vue";
import { Item, ItemType } from "@/services/wh/content/item.ts";
import { CareerMoney, CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { buttonNames, componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const valid = { valid: true, message: "" };

const itemList = [
  new Item({ id: "bow", name: "Bow", type: ItemType.Ranged }),
  new Item({ id: "arrow", name: "Arrow", type: ItemType.Ammunition }),
  new Item({ id: "weapon", name: "Hand Weapon", type: ItemType.Melee }),
];

const bowOrWeapon: CareerTrappingEntry = {
  options: [
    [
      { id: "bow", number: "1", value: "" },
      { id: "arrow", number: "10", value: "" },
    ],
    [{ id: "weapon", number: "1", value: "Sickle" }],
  ],
};

// The models are fed back as a parent's v-model would.
function mountTrappings(trappings: CareerTrappingEntry[], money: CareerMoney[], disabled = false) {
  const wrapper = mount(CareerTrappings, {
    props: {
      trappings,
      money,
      itemList,
      disabled,
      validationStatus: valid,
      "onUpdate:trappings": (value: CareerTrappingEntry[]) => wrapper.setProps({ trappings: value }),
      "onUpdate:money": (value: CareerMoney[]) => wrapper.setProps({ money: value }),
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
  return wrapper;
}

describe("CareerTrappings", () => {
  test("writes each entry as its options joined by or", () => {
    const wrapper = mountTrappings([bowOrWeapon], []);

    expect(wrapper.text()).toContain("Bow, 10 × Arrow or Hand Weapon (Sickle)");
    expect(findButton(wrapper, "Edit Bow, 10 × Arrow or Hand Weapon (Sickle)").text()).toBe("Edit");
  });

  test("shows None for a level without trappings or money", () => {
    const wrapper = mountTrappings([], []);

    expect(wrapper.findAll("td").map((x) => x.text())).toEqual(["None", "None"]);
  });

  test("each Add in the picker adds an entry of one trapping", async () => {
    const wrapper = mountTrappings([bowOrWeapon], []);

    await findButton(wrapper, "Add").trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);
    // Each click is its own event, after which the parent has the new list.
    picker.vm.$emit("add", "bow");
    await nextTick();
    picker.vm.$emit("add", "bow");
    await nextTick();

    expect(wrapper.props("trappings")).toEqual([
      bowOrWeapon,
      { options: [[{ id: "bow", number: "1", value: "" }]] },
      { options: [[{ id: "bow", number: "1", value: "" }]] },
    ]);
  });

  test("the cross removes an entry", async () => {
    const single = { options: [[{ id: "bow", number: "1", value: "" }]] };
    const wrapper = mountTrappings([bowOrWeapon, single], []);

    await findButton(wrapper, "Remove Bow, 10 × Arrow or Hand Weapon (Sickle)").trigger("click");

    expect(wrapper.props("trappings")).toEqual([single]);
  });

  test("Edit opens the entry, and its save replaces it", async () => {
    const single = { options: [[{ id: "bow", number: "1", value: "" }]] };
    const wrapper = mountTrappings([single, bowOrWeapon], []);

    await findButton(wrapper, "Edit Bow").trigger("click");
    const modal = wrapper.findComponent(CareerTrappingEntryModal);
    expect(modal.props("open")).toBe(true);
    expect(modal.props("entry")).toEqual(single);
    const changed = { options: [[{ id: "bow", number: "2", value: "Elf" }]] };
    modal.vm.$emit("save", changed);
    await nextTick();

    expect(wrapper.props("trappings")).toEqual([changed, bowOrWeapon]);
  });

  test("adds, changes and removes money", async () => {
    const wrapper = mountTrappings([], []);

    const addMoney = wrapper.findAll("button").filter((x) => x.text() === "Add")[1];
    await addMoney.trigger("click");
    expect(wrapper.props("money")).toEqual([{ coin: "gold", number: "1" }]);

    await wrapper.find("select[aria-label='Coin of money 1']").setValue("silver");
    await wrapper.find("input[aria-label='Quantity of money 1']").setValue(" 3d10 ");
    expect(wrapper.props("money")).toEqual([{ coin: "silver", number: "3d10" }]);

    await findButton(wrapper, "Remove 3d10 Silver").trigger("click");
    expect(wrapper.props("money")).toEqual([]);
  });

  test("names link to the trappings' pages", () => {
    const wrapper = mountTrappings([bowOrWeapon], []);

    const links = wrapper.findAll("a").map((x) => [x.text(), x.attributes("href")]);
    expect(links.map((x) => x[0])).toEqual(["Bow", "Arrow", "Hand Weapon (Sickle)"]);
  });

  test("read-only, a level without money has no Money table", () => {
    const wrapper = mountTrappings([bowOrWeapon], [], true);

    expect(wrapper.text()).not.toContain("Money");
    expect(mountTrappings([bowOrWeapon], [], false).text()).toContain("Money");
  });

  test("read-only, shows trappings and money as text", () => {
    const wrapper = mountTrappings([bowOrWeapon], [{ coin: "brass", number: "2d10" }], true);

    expect(buttonNames(wrapper)).toEqual([]);
    expect(wrapper.find("select").exists()).toBe(false);
    expect(wrapper.find("input").exists()).toBe(false);
    expect(wrapper.findAll("td").map((x) => x.text())).toEqual([
      "Bow, 10 × Arrow or Hand Weapon (Sickle)",
      "2d10 Brass",
    ]);
  });
});
