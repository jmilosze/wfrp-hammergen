// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { h, ref } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import ContentEditorPage from "./ContentEditorPage.vue";
import { useWhEdit } from "@/composables/whEdit.ts";
import { useEdition } from "@/composables/edition.ts";
import { Prayer } from "@/services/wh/content/prayer.ts";
import { ContentApi } from "@/services/wh/core/api.ts";
import { NEW_ID, Visibility } from "@/services/wh/core/entity.ts";
import PageHeader from "@/components/ui/PageHeader.vue";
import { buttonNames, componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

// Whether the user may edit the loaded prayer, standing in for the auth state.
const canEdit = ref(true);
vi.mock("@/composables/auth.ts", () => ({
  useAuth: () => ({ loggedIn: ref(true), isAdmin: ref(false), canEdit: () => canEdit.value }),
}));

enableAutoUnmount(afterEach);

beforeEach(() => {
  canEdit.value = true;
  useEdition().edition.value = "4e";
});

const stored = new Prayer({ id: "p1", name: "Blessing of Courage", visibility: Visibility.Private });

const api: ContentApi<Prayer> = {
  listElements: async () => [],
  getDocument: async () => ({ "4e": stored.copy() }),
  createDocument: async () => ({ id: "p2", ownerId: "me" }),
  updateDocument: async () => ({ id: "p1", ownerId: "me" }),
  deleteElement: async () => {},
};

// The page of a new prayer (id NEW_ID) or of the stored one, with the editor's own fields and toolbar as slots and
// the load state of another list.
async function mountPage(id: string, otherList = { apiError: ref(""), showApiError: ref(true) }) {
  const edit = useWhEdit(new Prayer({ id: NEW_ID, name: "New prayer" }), api);
  await edit.loadWh(id);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: { render: () => null } }],
  });
  const wrapper = mount(ContentEditorPage, {
    props: { edit, id, propertyName: "Prayer", list: "prayers", lists: [otherList] },
    slots: {
      default: () => h("p", { class: "fields" }, "fields"),
      toolbar: () => h("span", { class: "tool" }, "tool"),
    },
    global: { stubs: componentStubs, plugins: [router] },
    attachTo: document.body,
  });
  await flushPromises();
  return wrapper;
}

function buttons(wrapper: Awaited<ReturnType<typeof mountPage>>): string[] {
  return buttonNames(wrapper);
}

describe("ContentEditorPage", () => {
  test("a new entry: Create title, its fields and toolbar, Save without Delete", async () => {
    const wrapper = await mountPage(NEW_ID);

    expect(wrapper.findComponent(PageHeader).text()).toBe("Create prayer");
    expect(wrapper.find(".fields").exists() && wrapper.find(".tool").exists()).toBe(true);
    expect(wrapper.text()).toContain("Save prayer");
    expect(buttons(wrapper)).toContain("Save");
    expect(buttons(wrapper)).not.toContain("Delete");
  });

  test("a stored entry the user can edit: Edit title and Delete", async () => {
    const wrapper = await mountPage("p1");

    expect(wrapper.findComponent(PageHeader).text()).toBe("Edit prayer");
    expect(buttons(wrapper)).toContain("Delete");
  });

  test("a stored entry the user can't edit: its name as title, Back only", async () => {
    canEdit.value = false;
    const wrapper = await mountPage("p1");

    expect(wrapper.findComponent(PageHeader).text()).toBe("Blessing of Courage");
    expect(buttons(wrapper)).not.toContain("Save");
    expect(buttons(wrapper)).not.toContain("Delete");
    expect(buttons(wrapper)).toContain("Back");
  });

  test("an edition without a variant: the notice, then the fields once it is added", async () => {
    const wrapper = await mountPage("p1");

    await findButton(wrapper, "5th Edition").trigger("click");
    expect(wrapper.text()).toContain("This prayer has no 5e version.");
    expect(wrapper.find(".fields").exists()).toBe(false);

    await findButton(wrapper, "Add 5e version").trigger("click");
    expect(wrapper.text()).not.toContain("has no 5e version");
    expect(wrapper.find(".fields").exists()).toBe(true);
  });

  test("shows the load errors of the other lists", async () => {
    const wrapper = await mountPage(NEW_ID, { apiError: ref("Could not load skills"), showApiError: ref(true) });

    expect(wrapper.text()).toContain("Could not load skills");
  });
});
