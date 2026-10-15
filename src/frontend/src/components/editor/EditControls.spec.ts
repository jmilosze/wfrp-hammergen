// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { h, reactive } from "vue";
import { createMemoryHistory, createRouter, RouterView } from "vue-router";
import EditControls from "./EditControls.vue";
import { SubmissionState } from "@/utils/submission.ts";
import { buttonNames, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

type Props = InstanceType<typeof EditControls>["$props"];

// The controls on an editor page (/edit) opened from the list (/prayers), as the app shows them: inside the router
// view, so leaving the page goes through their guard.
async function mountControls(props: Partial<Props> = {}) {
  const submissionState = new SubmissionState();
  const allProps = {
    propertyName: "Prayer",
    submissionState,
    showSubmissionStatus: false,
    readOnly: false,
    confirmExit: false,
    saving: false,
    list: "prayers" as const,
    submitForm: vi.fn(async () => true),
    resetForm: vi.fn(),
    ...props,
  };
  const page = { render: () => h(EditControls, allProps) };
  const empty = { render: () => null };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/prayers", name: "prayers", component: empty },
      { path: "/edit", component: page },
    ],
  });
  await router.push("/prayers");
  await router.push("/edit");
  const wrapper = mount(RouterView, { global: { plugins: [router] }, attachTo: document.body });
  await flushPromises();
  return { wrapper, router, props: allProps };
}

async function waitForRoute() {
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await flushPromises();
}

describe("EditControls", () => {
  test("Save saves and goes back to where the editor was opened from", async () => {
    const { wrapper, router, props } = await mountControls();

    await findButton(wrapper, "Save").trigger("click");
    await waitForRoute();

    expect(props.submitForm).toHaveBeenCalledOnce();
    expect(router.currentRoute.value.path).toBe("/prayers");
  });

  test("a failed save stays on the page", async () => {
    const { wrapper, router } = await mountControls({ submitForm: vi.fn(async () => false) });

    await findButton(wrapper, "Save").trigger("click");
    await waitForRoute();

    expect(router.currentRoute.value.path).toBe("/edit");
  });

  test("Save and add another saves, then starts a new entry on the same page", async () => {
    const { wrapper, router, props } = await mountControls({ allowAddAnother: true });

    await findButton(wrapper, "More save options").trigger("click");
    await findButton(wrapper, "Save and add another").trigger("click");
    await waitForRoute();

    expect(props.resetForm).toHaveBeenCalledOnce();
    expect(router.currentRoute.value.path).toBe("/edit");
  });

  test("read-only: Back only, titled with the property name", async () => {
    const { wrapper } = await mountControls({ readOnly: true });

    expect(buttonNames(wrapper)).toEqual(["Back"]);
    expect(wrapper.text()).toContain("Prayer");
    expect(wrapper.text()).not.toContain("Save prayer");
  });

  test("asks before leaving with unsaved changes, and stays when told to", async () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal("confirm", confirm);
    const { router } = await mountControls({ confirmExit: true });

    await router.push("/prayers");

    expect(confirm).toHaveBeenCalledOnce();
    expect(router.currentRoute.value.path).toBe("/edit");
  });

  test("doesn't ask after saving", async () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal("confirm", confirm);
    const { wrapper, router } = await mountControls({ confirmExit: true });

    await findButton(wrapper, "Save").trigger("click");
    await waitForRoute();

    expect(confirm).not.toHaveBeenCalled();
    expect(router.currentRoute.value.path).toBe("/prayers");
  });

  test("shows a success for a few seconds, an error until the next save", async () => {
    vi.useFakeTimers();
    // The editor's submission state, changed in place as the editor's saves change it.
    const state = reactive(new SubmissionState());
    state.setSuccess("Blessing created successfully.");
    const { wrapper } = await mountControls({ submissionState: state, showSubmissionStatus: true });

    expect(wrapper.find("[role=status]").text()).toBe("Blessing created successfully.");
    await vi.advanceTimersByTimeAsync(5000);
    expect(wrapper.find("[role=status]").exists()).toBe(false);

    state.setFailure("Unexpected error has occurred.");
    await vi.advanceTimersByTimeAsync(10000);
    expect(wrapper.find("[role=status]").text()).toBe("Unexpected error has occurred.");
  });
});
