import { describe, expect, test, vi } from "vitest";
import { Router } from "vue-router";
import { returnToPreviousPage } from "./history.ts";

function fakeRouter(back: string | null) {
  const push = vi.fn();
  const goBack = vi.fn();
  const router = { options: { history: { state: { back: back } } }, push: push, back: goBack } as unknown as Router;
  return { router, push, goBack };
}

describe("returnToPreviousPage", () => {
  test("goes back when there is a previous page", async () => {
    const { router, push, goBack } = fakeRouter("/spells");
    await returnToPreviousPage(router, "spells");
    expect(goBack).toHaveBeenCalledOnce();
    expect(push).not.toHaveBeenCalled();
  });

  test("goes to the list when there is no previous page", async () => {
    const { router, push, goBack } = fakeRouter(null);
    await returnToPreviousPage(router, "spells");
    expect(push).toHaveBeenCalledWith({ name: "spells" });
    expect(goBack).not.toHaveBeenCalled();
  });
});
