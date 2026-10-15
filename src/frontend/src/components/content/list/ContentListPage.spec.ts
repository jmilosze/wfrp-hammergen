// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount, RouterLinkStub } from "@vue/test-utils";
import { h, ref } from "vue";
import ContentListPage from "./ContentListPage.vue";
import { BrowseRow } from "./browseRow.ts";
import { NEW_ID, Visibility } from "@/services/wh/core/entity.ts";
import PageHeader from "@/components/ui/PageHeader.vue";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

// The search query string and the login state, standing in for the router and the auth state.
const loggedIn = ref(true);
vi.mock("@vueuse/router", () => ({ useRouteQuery: () => ref("") }));
vi.mock("@/composables/auth.ts", () => ({ useAuth: () => ({ loggedIn, canEdit: () => true }) }));

enableAutoUnmount(afterEach);

function row(id: string, name: string): BrowseRow {
  return { id, name, meta: "", description: "", ownerId: "", visibility: Visibility.Public };
}

function mountPage(apiError = "", slots = {}) {
  const list = { apiError: ref(apiError), showApiError: ref(true), copyWh: vi.fn(async () => {}) };
  const wrapper = mount(ContentListPage, {
    props: {
      title: "Talents",
      routeName: "talent",
      items: [row("b", "Beta"), row("a", "Alpha")],
      sections: [],
      list,
      filters: {},
    },
    slots,
    global: { stubs: componentStubs },
  });
  return { wrapper, list };
}

function createLinks(wrapper: ReturnType<typeof mountPage>["wrapper"]) {
  return wrapper.findAllComponents(RouterLinkStub).filter((x) => x.text() === "Create new");
}

describe("ContentListPage", () => {
  test("shows the title and the rows by name", () => {
    const { wrapper } = mountPage();

    expect(wrapper.findComponent(PageHeader).text()).toBe("Talents");
    expect(wrapper.findAll("li a").map((x) => x.text())).toEqual(["Alpha", "Beta"]);
  });

  test("offers Create new and Copy to logged in users only", async () => {
    const { wrapper, list } = mountPage();

    expect(createLinks(wrapper).map((x) => x.props("to"))).toEqual([
      { name: "talent", params: { id: NEW_ID } },
      { name: "talent", params: { id: NEW_ID } },
    ]);
    await wrapper.findAll("button[aria-label='Copy']")[0].trigger("click");
    expect(list.copyWh).toHaveBeenCalledWith("a");

    loggedIn.value = false;
    const { wrapper: visitor } = mountPage();
    expect(createLinks(visitor)).toHaveLength(0);
    expect(visitor.findAll("button[aria-label='Copy']")).toHaveLength(0);
    loggedIn.value = true;
  });

  test("shows the load error until it is closed", async () => {
    const { wrapper, list } = mountPage("Error. Could not pull data from server.");

    expect(wrapper.text()).toContain("Could not pull data");
    await findButton(wrapper, "Close").trigger("click");

    expect(list.showApiError.value).toBe(false);
    expect(wrapper.text()).not.toContain("Could not pull data");
  });

  test("puts the actions slot in place of Copy", () => {
    const { wrapper } = mountPage("", { actions: ({ id }: { id: string }) => h("span", { class: "own" }, id) });

    expect(wrapper.findAll(".own").map((x) => x.text())).toEqual(["a", "b"]);
    expect(wrapper.findAll("button[aria-label='Copy']")).toHaveLength(0);
  });
});
