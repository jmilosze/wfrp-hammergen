// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import ModalWindow from "./ModalWindow.vue";
import { findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// The window's v-model (open): an update is fed back as the new value, as a parent would. It starts closed, as in the
// app, and is opened by changing open.
function mountWindow() {
  const wrapper = mount(ModalWindow, {
    props: { open: false, "onUpdate:open": (value: boolean) => wrapper.setProps({ open: value }) },
    slots: { header: () => "Edit skills", default: () => h("p", { class: "content" }, "The list") },
    attachTo: document.body,
  });
  return wrapper;
}

async function openWindow() {
  const wrapper = mountWindow();
  await wrapper.setProps({ open: true });
  await nextTick();
  return wrapper;
}

function dialog(): HTMLDialogElement {
  const element = document.body.querySelector("dialog");
  if (element === null) {
    throw new Error("No dialog");
  }
  return element;
}

describe("ModalWindow", () => {
  test("shows its content only while open", async () => {
    const wrapper = mountWindow();
    expect(dialog().open).toBe(false);
    expect(document.body.textContent).not.toContain("The list");

    await wrapper.setProps({ open: true });
    await nextTick();
    expect(dialog().open).toBe(true);
    expect(document.body.textContent).toContain("Edit skillsThe list");
  });

  test("closes with its close button", async () => {
    const wrapper = await openWindow();

    // The window is teleported to the end of the body.
    await findButton(new DOMWrapper(dialog()), "Close").trigger("click");

    expect(wrapper.props("open")).toBe(false);
  });

  test("closes on a click on the shade, not on one inside", async () => {
    const wrapper = await openWindow();

    document.body.querySelector(".content")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();
    expect(wrapper.props("open")).toBe(true);
    dialog().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();
    expect(wrapper.props("open")).toBe(false);
  });

  test("closes when the browser closes the dialog (Escape)", async () => {
    const wrapper = await openWindow();

    dialog().close();
    dialog().dispatchEvent(new Event("close"));
    await nextTick();

    expect(wrapper.props("open")).toBe(false);
  });
});
