// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import ActionMenu from "./ActionMenu.vue";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// happy-dom has no popover API; the browser's opens and closes the menu.
beforeEach(() => {
  HTMLElement.prototype.hidePopover = vi.fn();
});

function mountMenu(save: () => void, remove: () => void) {
  return mount(ActionMenu, {
    props: {
      label: "Actions for Rope",
      items: [
        { label: "Save", icon: "lucide:check", action: save },
        { label: "Remove", icon: "lucide:x", action: remove, disabled: true, title: "Can't be removed" },
      ],
    },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

describe("ActionMenu", () => {
  test("its button opens and closes the menu (popovertarget)", () => {
    const wrapper = mountMenu(vi.fn(), vi.fn());

    const button = findButton(wrapper, "Actions for Rope");
    const menu = wrapper.find("[role='menu']");
    expect(button.attributes("aria-haspopup")).toBe("menu");
    expect(button.attributes("popovertarget")).toBe(menu.attributes("id"));
    expect(menu.attributes("popover")).toBe("auto");
  });

  test("runs the chosen action and closes; a disabled action can't be chosen", async () => {
    const save = vi.fn();
    const remove = vi.fn();
    const wrapper = mountMenu(save, remove);

    await findButton(wrapper, "Save").trigger("click");
    const removeItem = findButton(wrapper, "Remove");
    expect(removeItem.attributes("disabled")).toBeDefined();
    expect(removeItem.attributes("title")).toBe("Can't be removed");
    await removeItem.trigger("click");

    expect(save).toHaveBeenCalledOnce();
    expect(remove).not.toHaveBeenCalled();
    expect(HTMLElement.prototype.hidePopover).toHaveBeenCalled();
  });
});
