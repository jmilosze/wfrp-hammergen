import { beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick, ref } from "vue";
import { useWhEdit } from "./whEdit.ts";
import { useEdition } from "./edition.ts";
import { ContentApi } from "../services/wh/core/api.ts";
import { Variants } from "../services/wh/core/edition.ts";
import { Visibility } from "../services/wh/core/entity.ts";
import { Talent } from "../services/wh/content/talent.ts";
import { AttributeName } from "../services/wh/core/attributes.ts";

vi.hoisted(() => {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

vi.mock("./auth.ts", () => ({
  useAuth: () => ({ isAdmin: ref(false), canEdit: () => true }),
}));

function fakeApi(document: Variants<Talent>) {
  const api: ContentApi<Talent> = {
    listElements: vi.fn(),
    getDocument: vi.fn().mockResolvedValue(document),
    createDocument: vi.fn().mockResolvedValue({ id: "new", ownerId: "user1" }),
    updateDocument: vi.fn().mockResolvedValue({ id: "t1", ownerId: "user1" }),
    deleteElement: vi.fn().mockResolvedValue(undefined),
  };
  return api;
}

const talent4e = () =>
  new Talent({
    id: "t1",
    ownerId: "user1",
    name: "Luck",
    tests: "Fate",
    attribute: AttributeName.Fel,
    source: { 1: "" },
  });

describe("useWhEdit", () => {
  beforeEach(() => {
    useEdition().edition.value = "4e";
  });

  test("opens on the global edition and shows its variant", async () => {
    useEdition().edition.value = "4e";
    const edit = useWhEdit(new Talent({ id: "create" }), fakeApi({ "4e": talent4e() }));
    await edit.loadWh("t1");

    expect(edit.edition.value).toBe("4e");
    expect(edit.hasVariant.value).toBe(true);
    expect(edit.wh.value.name).toBe("Luck");
    expect(edit.hasChanged.value).toBe(false);
  });

  test("a new document follows the selected edition's rules", () => {
    useEdition().edition.value = "5e";
    expect(useWhEdit(new Talent({ id: "create" }), fakeApi({})).wh.value.maxRank).toBe(1);

    useEdition().edition.value = "4e";
    expect(useWhEdit(new Talent({ id: "create" }), fakeApi({})).wh.value.maxRank).toBe(0);
  });

  test("a missing variant is reported and can be added, pre-filled for its edition", async () => {
    useEdition().edition.value = "5e";
    const edit = useWhEdit(new Talent({ id: "create" }), fakeApi({ "4e": talent4e() }));
    await edit.loadWh("t1");

    expect(edit.hasVariant.value).toBe(false);
    edit.addVariant();

    expect(edit.hasVariant.value).toBe(true);
    expect(edit.wh.value.name).toBe("Luck");
    expect(edit.wh.value.tests).toBe("");
    expect(edit.wh.value.attribute).toBe(AttributeName.None);
    expect(edit.wh.value.source).toEqual({ 1: "" });
    expect(edit.hasChanged.value).toBe(true);
  });

  test("save sends every variant with the shown variant's visibility", async () => {
    const api = fakeApi({ "4e": talent4e() });
    const edit = useWhEdit(new Talent({ id: "create" }), api);
    await edit.loadWh("t1");

    edit.edition.value = "5e";
    edit.addVariant();
    edit.wh.value.name = "Luck 5e";
    edit.wh.value.visibility = Visibility.Shared;

    expect(await edit.submitForm()).toBe(true);
    const [id, visibility, variants] = vi.mocked(api.updateDocument).mock.calls[0];
    expect(id).toBe("t1");
    expect(visibility).toBe(Visibility.Shared);
    expect(variants["4e"]?.name).toBe("Luck");
    expect(variants["5e"]?.name).toBe("Luck 5e");
    expect(variants["4e"]?.visibility).toBe(Visibility.Shared);
    expect(edit.hasChanged.value).toBe(false);
  });

  test("save is blocked when a variant is invalid for its edition", async () => {
    const api = fakeApi({ "4e": talent4e() });
    const edit = useWhEdit(new Talent({ id: "create" }), api);
    await edit.loadWh("t1");

    edit.edition.value = "5e";
    edit.addVariant();
    edit.wh.value.maxRank = 0;

    expect(await edit.submitForm()).toBe(false);
    expect(api.updateDocument).not.toHaveBeenCalled();
  });

  test("switching edition does not trigger watchWh callbacks", async () => {
    const edit = useWhEdit(new Talent({ id: "create" }), fakeApi({ "4e": talent4e() }));
    await edit.loadWh("t1");
    const calls: boolean[] = [];
    edit.watchWh(
      (w) => w.isGroup,
      (v) => calls.push(v),
    );

    edit.edition.value = "5e";
    edit.addVariant();
    await nextTick();
    edit.wh.value.isGroup = true;
    await nextTick();

    expect(calls).toEqual([true]);
  });

  test("delete deletes the whole document", async () => {
    const api = fakeApi({ "4e": talent4e(), "5e": talent4e().forEdition("5e") });
    const edit = useWhEdit(new Talent({ id: "create" }), api);
    await edit.loadWh("t1");
    edit.edition.value = "5e";

    expect(await edit.deleteItem()).toBe(true);
    expect(api.deleteElement).toHaveBeenCalledWith("t1");
  });
});
