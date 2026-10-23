// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import MarksHelp from "./MarksHelp.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { Edition } from "@/services/wh/core/edition.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

async function helpText(kind: "skills" | "talents" | "trappings", edition: Edition): Promise<string> {
  const wrapper = mount(MarksHelp, {
    props: { kind, edition },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
  await findButton(
    wrapper,
    `Help: ${kind === "trappings" ? "Class and career trappings" : `Career and species ${kind}`}`,
  ).trigger("click");
  return document.body.textContent ?? "";
}

describe("MarksHelp", () => {
  test("explains the edition's career talents", async () => {
    expect(await helpText("talents", "5e")).toContain("and of the lower levels of the same career");
  });

  test("4e career talents are the current level's only", async () => {
    expect(await helpText("talents", "4e")).toContain("the talents of your current career level only");
  });

  test("trappings explain the Class marks", async () => {
    expect(await helpText("trappings", "5e")).toContain("the class trappings of your current career's class");
  });
});
