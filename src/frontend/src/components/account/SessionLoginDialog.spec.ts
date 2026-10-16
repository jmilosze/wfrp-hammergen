// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { DOMWrapper, enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import SessionLoginDialog from "./SessionLoginDialog.vue";
import { findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

// Each test gives the dialog a fresh ref for the user of the expired session.
const relogin = vi.hoisted(() => {
  const username: { value: string | null } = { value: null };
  return { username, login: vi.fn(), cancel: vi.fn() };
});

vi.mock("@/composables/auth.ts", () => ({ useRelogin: () => relogin }));

enableAutoUnmount(afterEach);

beforeEach(() => {
  relogin.username = ref<string | null>(null);
  relogin.login.mockReset();
  relogin.cancel.mockReset();
});

async function openDialog() {
  const wrapper = mount(SessionLoginDialog, { attachTo: document.body });
  relogin.username.value = "testuser";
  await nextTick();
  await nextTick();
  return { wrapper, body: new DOMWrapper(document.body) };
}

describe("SessionLoginDialog", () => {
  test("logs in again as the user of the expired session", async () => {
    const { body } = await openDialog();
    expect(body.text()).toContain("Log in again as testuser");

    await body.find("input[type=password]").setValue("secret");
    await findButton(body, "Log in").trigger("click");

    expect(relogin.login).toHaveBeenCalledWith("testuser", "secret");
  });

  test("asks for the password before logging in", async () => {
    const { body } = await openDialog();

    await findButton(body, "Log in").trigger("click");

    expect(relogin.login).not.toHaveBeenCalled();
    expect(body.text()).toContain("Password is required.");
  });

  test("shows a wrong password", async () => {
    relogin.login.mockImplementation(() => {
      const config = { headers: new AxiosHeaders() };
      const response: AxiosResponse = { status: 403, statusText: "Forbidden", headers: {}, config, data: {} };
      return Promise.reject(new AxiosError("Forbidden", AxiosError.ERR_BAD_REQUEST, config, null, response));
    });
    const { body } = await openDialog();

    await body.find("input[type=password]").setValue("wrong");
    await findButton(body, "Log in").trigger("click");
    await flushPromises();

    expect(body.text()).toContain("Invalid password.");
    expect(relogin.cancel).not.toHaveBeenCalled();
  });

  test("Log out cancels the login", async () => {
    const { body } = await openDialog();

    await findButton(body, "Log out").trigger("click");

    expect(relogin.cancel).toHaveBeenCalled();
  });
});
