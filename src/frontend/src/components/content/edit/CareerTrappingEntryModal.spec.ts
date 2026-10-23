// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CareerTrappingEntryModal from "./CareerTrappingEntryModal.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import { CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const names: Record<string, string> = { bow: "Bow", arrow: "Arrow", weapon: "Hand Weapon" };
const pickerItems = Object.entries(names).map(([id, name]) => ({ id: id, name: name, description: "" }));

const bowAndArrows = (): CareerTrappingEntry => ({
  options: [
    [
      { id: "bow", number: "1", value: "" },
      { id: "arrow", number: "10", value: "" },
    ],
  ],
});

// The popup opens as in the app: mounted closed, then opened. Its content is in the body (the window teleports there).
async function openModal(entry: CareerTrappingEntry) {
  const wrapper = mount(CareerTrappingEntryModal, {
    props: {
      open: false,
      entry,
      pickerItems,
      nameOf: (id: string) => names[id],
      "onUpdate:open": (value: boolean) => wrapper.setProps({ open: value }),
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
  await wrapper.setProps({ open: true });
  await nextTick();
  return wrapper;
}

const body = () => new DOMWrapper(document.body);

describe("CareerTrappingEntryModal", () => {
  test("Save emits the edited entry and closes; the given entry is not changed", async () => {
    const entry = bowAndArrows();
    const wrapper = await openModal(entry);

    await body().find("input[aria-label='Quantity of Arrow']").setValue(" 2d10 ");
    await body().find("input[aria-label='Note for Bow']").setValue("Elf Bow");
    await findButton(body(), "Save").trigger("click");

    expect(wrapper.emitted("save")).toEqual([
      [
        {
          options: [
            [
              { id: "bow", number: "1", value: "Elf Bow" },
              { id: "arrow", number: "2d10", value: "" },
            ],
          ],
        },
      ],
    ]);
    expect(wrapper.props("open")).toBe(false);
    expect(entry).toEqual(bowAndArrows());
  });

  test("Cancel closes without saving", async () => {
    const wrapper = await openModal(bowAndArrows());

    await body().find("input[aria-label='Quantity of Arrow']").setValue("20");
    await findButton(body(), "Cancel").trigger("click");

    expect(wrapper.emitted("save")).toBeUndefined();
    expect(wrapper.props("open")).toBe(false);
  });

  test("+ Option adds the picked trappings as another option", async () => {
    const wrapper = await openModal(bowAndArrows());

    await findButton(body(), "Option").trigger("click");
    wrapper.findComponent(ChecklistPicker).vm.$emit("add", "weapon");
    await nextTick();
    expect(body().text()).toContain("Option 2");
    await findButton(body(), "Save").trigger("click");

    expect(wrapper.emitted("save")?.[0][0]).toEqual({
      options: [...bowAndArrows().options, [{ id: "weapon", number: "1", value: "" }]],
    });
  });

  test("+ Trapping adds to its option", async () => {
    const wrapper = await openModal(bowAndArrows());

    await findButton(body(), "Trapping").trigger("click");
    wrapper.findComponent(ChecklistPicker).vm.$emit("add", "weapon");
    await nextTick();
    await findButton(body(), "Save").trigger("click");

    expect(wrapper.emitted("save")?.[0][0]).toEqual({
      options: [[...bowAndArrows().options[0], { id: "weapon", number: "1", value: "" }]],
    });
  });

  test("removing the last trapping of an option removes the option", async () => {
    const wrapper = await openModal({
      options: [...bowAndArrows().options, [{ id: "weapon", number: "1", value: "" }]],
    });

    await findButton(body(), "Remove Hand Weapon").trigger("click");
    expect(body().text()).not.toContain("Option 1");
    await findButton(body(), "Save").trigger("click");

    expect(wrapper.emitted("save")?.[0][0]).toEqual(bowAndArrows());
  });

  test("an invalid quantity is reported and can't be saved", async () => {
    await openModal(bowAndArrows());

    await body().find("input[aria-label='Quantity of Arrow']").setValue("0");

    expect(body().text()).toContain("quantities have to be a number");
    expect(findButton(body(), "Save").attributes("disabled")).toBeDefined();
  });
});
