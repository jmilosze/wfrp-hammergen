// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import WizardFrame, { WizardStep } from "./WizardFrame.vue";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const steps = (done: boolean[]): WizardStep[] =>
  ["Species", "Career", "Summary"].map((title, i) => ({ id: title.toLowerCase(), title, done: done[i] }));

// The current step's v-model is fed back, as a parent would.
function mountFrame(done: boolean[], current = "species") {
  const wrapper = mount(WizardFrame, {
    props: {
      title: "Guided creation",
      steps: steps(done),
      current,
      "onUpdate:current": (value: string) => wrapper.setProps({ current: value }),
    },
    slots: { default: () => "Step content" },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
  return wrapper;
}

function stepButton(wrapper: ReturnType<typeof mountFrame>, title: string) {
  const button = wrapper
    .find("nav")
    .findAll("button")
    .find((x) => x.text().endsWith(title));
  if (button === undefined) {
    throw new Error(`No step ${title}`);
  }
  return button;
}

describe("WizardFrame", () => {
  test("shows the current step and where the player is", () => {
    const wrapper = mountFrame([true, false, false], "career");
    expect(wrapper.text()).toContain("Step content");
    expect(wrapper.text()).toContain("Step 2 of 3");
    expect(stepButton(wrapper, "Career").attributes("aria-current")).toBe("step");
  });

  test("reaches the done steps and the first one not done", () => {
    const wrapper = mountFrame([true, false, false], "career");
    expect(stepButton(wrapper, "Species").attributes("disabled")).toBeUndefined();
    expect(stepButton(wrapper, "Career").attributes("disabled")).toBeUndefined();
    expect(stepButton(wrapper, "Summary").attributes("disabled")).toBeDefined();
  });

  test("Next needs the current step done and moves on", async () => {
    const notDone = mountFrame([false, false, false]);
    expect(findButton(notDone, "Next").attributes("disabled")).toBeDefined();

    const wrapper = mountFrame([true, false, false]);
    await findButton(wrapper, "Next").trigger("click");
    expect(wrapper.props("current")).toBe("career");
    await findButton(wrapper, "Back").trigger("click");
    expect(wrapper.props("current")).toBe("species");
  });

  test("the last step finishes once it is done", async () => {
    const wrapper = mountFrame([true, true, true], "summary");
    await findButton(wrapper, "Finish").trigger("click");
    expect(wrapper.emitted("finish")).toHaveLength(1);
    expect(findButton(mountFrame([true, true, false], "summary"), "Finish").attributes("disabled")).toBeDefined();
  });

  test("Close leaves at once; Start over asks first", async () => {
    const wrapper = mountFrame([true, false, false]);
    await findButton(wrapper, "Close").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);

    await findButton(wrapper, "Start over").trigger("click");
    await nextTick();
    expect(wrapper.emitted("startOver")).toBeUndefined();
    const dialog = document.body.querySelector("dialog");
    const confirm = [...(dialog?.querySelectorAll("button") ?? [])].find((x) => x.textContent?.trim() === "Start over");
    confirm?.click();
    await nextTick();
    expect(wrapper.emitted("startOver")).toHaveLength(1);
  });
});
