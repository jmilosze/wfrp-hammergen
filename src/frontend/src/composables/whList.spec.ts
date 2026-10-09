import { describe, expect, test, vi } from "vitest";
import { nextTick, ref } from "vue";
import { Edition } from "../services/wh/core/edition.ts";

// The "source" query string, standing in for the router.
const sourceQuery = ref("");

vi.mock("@vueuse/router", () => ({
  useRouteQuery: () => sourceQuery,
}));

vi.mock("./auth.ts", () => ({
  useAuth: () => ({}),
}));

const { useSourceQuery } = await import("./whList.ts");

describe("useSourceQuery", () => {
  test("clears the source filter when the edition changes", async () => {
    const edition = ref<Edition>("4e");
    const sourceTerm = useSourceQuery(edition);

    sourceTerm.value = "1";
    await nextTick();
    expect(sourceQuery.value).toBe("1");

    edition.value = "5e";
    await nextTick();
    expect(sourceTerm.value).toBe("");
  });

  test("keeps the source filter while the edition stays the same", async () => {
    const edition = ref<Edition>("5e");
    const sourceTerm = useSourceQuery(edition);

    sourceTerm.value = "44";
    await nextTick();
    expect(sourceTerm.value).toBe("44");
  });
});
