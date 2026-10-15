// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useCharacterContent, useCharacterEdit, useGenerationCareers } from "./characterEdit.ts";
import { authRequest } from "@/services/auth.ts";
import { ApiResponse, CharacterApiResponse, WhApi } from "@/services/wh/core/api.ts";
import { Edition } from "@/services/wh/core/edition.ts";
import { NEW_ID, Visibility } from "@/services/wh/core/entity.ts";
import { CharacterModifiers } from "@/services/wh/core/characterModifiers.ts";
import { zeroAttributes } from "@/services/wh/core/attributes.ts";
import { Species, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Character, CharacterApiData, modelToApi as characterToApi } from "@/services/wh/character/character.ts";
import { Career, copyCareerLevel, zeroCareerLevel } from "@/services/wh/content/career.ts";
import { Spell, modelToApi as spellToApi } from "@/services/wh/content/spell.ts";
import { Talent, modelToApi as talentToApi } from "@/services/wh/content/talent.ts";

// Whether the user may edit, standing in for the auth state.
const canEdit = ref(true);
vi.mock("./auth.ts", () => ({ useAuth: () => ({ isAdmin: ref(false), canEdit: () => canEdit.value }) }));

// The content the fake API serves: path to edition to the API documents of that edition, and the paths that fail.
let served: Record<string, Partial<Record<Edition, ApiResponse<unknown>[]>>> = {};
let failing = new Set<string>();
let requests: string[] = [];
const originalAdapter = authRequest.defaults.adapter;

beforeEach(() => {
  served = {};
  failing = new Set();
  requests = [];
  canEdit.value = true;
  authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const path = config.url ?? "";
    const edition: Edition = config.params.edition;
    requests.push(`${path}?${edition}`);
    if (failing.has(path)) {
      throw new Error("Network Error");
    }
    return { status: 200, statusText: "OK", headers: {}, config, data: { data: served[path]?.[edition] ?? [] } };
  };
});

afterEach(() => {
  authRequest.defaults.adapter = originalAdapter;
});

function document<T>(model: T & { id: string }, edition: Edition, toApi: (x: T) => unknown): ApiResponse<unknown> {
  return { id: model.id, ownerId: "admin", visibility: Visibility.Public, editions: { [edition]: toApi(model) } };
}

function serveSpells(edition: Edition, spells: Spell[]) {
  served["/api/wh/spell"] = {
    ...served["/api/wh/spell"],
    [edition]: spells.map((x) => document(x, edition, spellToApi)),
  };
}

function serveTalents(edition: Edition, talents: Talent[]) {
  served["/api/wh/talent"] = {
    ...served["/api/wh/talent"],
    [edition]: talents.map((x) => document(x, edition, talentToApi)),
  };
}

// A talent adding 5 to WS per rank.
function wsTalent(id: string): Talent {
  return new Talent({
    id,
    name: id,
    maxRank: 1,
    modifiers: new CharacterModifiers({ attributes: { ...zeroAttributes(), WS: 5 } }),
  });
}

describe("useCharacterContent", () => {
  test("a 4e character gets the 4e lists only, with no 4e badges", async () => {
    serveSpells("4e", [new Spell({ id: "s1", name: "Dart" })]);
    const content = useCharacterContent(ref(new Character({ edition: "4e" })), "4e");
    await flushPromises();

    expect(content.spells.withAllowed.value.map((x) => x.id)).toEqual(["s1"]);
    expect(content.spells.fourEIds.value).toBeUndefined();
    expect(requests.every((x) => x.endsWith("?4e"))).toBe(true);
  });

  test("a 5e character without 4e content gets the 5e lists only", async () => {
    serveSpells("5e", [new Spell({ id: "s1", name: "Dart" })]);
    serveSpells("4e", [new Spell({ id: "s2", name: "Old" })]);
    const content = useCharacterContent(ref(new Character({ edition: "5e" })), "5e");
    await flushPromises();

    expect(content.spells.withAllowed.value.map((x) => x.id)).toEqual(["s1"]);
    expect(requests.some((x) => x.endsWith("?4e"))).toBe(false);
  });

  test("allowing 4e content adds the 4e content without a 5e version, badged", async () => {
    serveSpells("5e", [new Spell({ id: "both", name: "Dart" })]);
    serveSpells("4e", [new Spell({ id: "both", name: "Dart (4e)" }), new Spell({ id: "old", name: "Old" })]);
    const wh = ref(new Character({ edition: "5e" }));
    const content = useCharacterContent(wh, "5e");
    await flushPromises();

    wh.value.allow4e = true;
    await flushPromises();

    expect(content.spells.withAllowed.value.map((x) => x.name)).toEqual(["Dart", "Old"]);
    expect(content.spells.fourEOnly.value.map((x) => x.id)).toEqual(["old"]);
    expect(content.spells.fourEIds.value).toEqual(new Set(["old"]));
  });

  test("applies the modifiers of the character's talents of its own edition only", async () => {
    serveTalents("5e", [wsTalent("own")]);
    serveTalents("4e", [wsTalent("old")]);
    const wh = ref(new Character({ edition: "5e", allow4e: true, talents: { own: 1, old: 1 } }));
    useCharacterContent(wh, "5e");
    await flushPromises();

    expect(wh.value.getModifierAttributes().WS).toBe(5);
  });

  test("gives each list's load state, and is loading until all lists are in", async () => {
    failing.add("/api/wh/trait");
    const content = useCharacterContent(ref(new Character({ edition: "4e" })), "4e");

    expect(content.loading.value).toBe(true);
    await flushPromises();

    expect(content.loading.value).toBe(false);
    expect(content.loadStates).toHaveLength(16);
    expect(content.traits.own.apiError.value).not.toBe("");
    expect(content.loadStates.filter((x) => x.apiError.value !== "")).toHaveLength(1);
  });
});

describe("useGenerationCareers", () => {
  function career(id: string, name: string, species: Species[], levels: number): Career {
    const level = (exists: boolean) => ({ ...copyCareerLevel(zeroCareerLevel), exists });
    return new Career({
      id,
      name,
      species,
      level1: level(levels >= 1),
      level2: level(levels >= 2),
      level3: level(levels >= 3),
      level4: level(levels >= 4),
    });
  }

  const careers = [
    career("w", "Witch", [Species.Human], 4),
    career("a", "Apothecary", [Species.Human, Species.Dwarf], 4),
    career("s", "Slayer", [Species.Dwarf], 4),
    career("h", "Half", [Species.Human], 2),
  ];

  test("offers the careers open to the species that have all four levels, by name, and picks the first", () => {
    const { careerOpts, selectedCareer } = useGenerationCareers(ref(SpeciesWithRegion.HumanReikland), ref(careers));

    expect(careerOpts.value.map((x) => x.text)).toEqual(["Apothecary", "Witch"]);
    expect(selectedCareer.value).toBe("a");
  });

  test("keeps the chosen career while it is offered and moves to the first when it isn't", async () => {
    const species = ref(SpeciesWithRegion.HumanReikland);
    const { selectedCareer } = useGenerationCareers(species, ref(careers));

    selectedCareer.value = "w";
    species.value = SpeciesWithRegion.DwarfDefault;
    await nextTick();
    expect(selectedCareer.value).toBe("a");

    selectedCareer.value = "s";
    species.value = SpeciesWithRegion.HumanReikland;
    await nextTick();
    expect(selectedCareer.value).toBe("a");
  });

  test("chooses no career when none is offered", () => {
    const { selectedCareer } = useGenerationCareers(ref(SpeciesWithRegion.HumanReikland), ref([]));

    expect(selectedCareer.value).toBe("");
  });
});

describe("useCharacterEdit", () => {
  type CharacterApi = WhApi<Character, CharacterApiResponse<CharacterApiData>>;

  function fakeApi() {
    const response = { id: "c1", ownerId: "me", modifiedOn: "", object: characterToApi(new Character()) };
    return {
      getElement: vi.fn(),
      listElements: vi.fn(),
      createElement: vi.fn(async () => response),
      updateElement: vi.fn(async () => response),
      deleteElement: vi.fn(async () => {}),
    } satisfies CharacterApi;
  }

  function newCharacter() {
    return new Character({ id: NEW_ID, name: "New character", edition: "5e" });
  }

  test("a new character can be edited, and saving creates it", async () => {
    const api = fakeApi();
    const edit = useCharacterEdit(newCharacter(), undefined, api, "5e");

    expect(edit.canEdit.value).toBe(true);
    expect(await edit.submitForm()).toBe(true);
    expect(api.createElement).toHaveBeenCalledOnce();
    expect(edit.submissionState.value.status).toBe("success");
  });

  test("saving a loaded character updates it; an invalid one is not sent", async () => {
    const api = fakeApi();
    const loaded = new Character({ id: "c1", name: "Ada", edition: "5e" });
    const edit = useCharacterEdit(newCharacter(), loaded, api, "5e");

    expect(await edit.submitForm()).toBe(true);
    expect(api.updateElement).toHaveBeenCalledOnce();

    edit.wh.value.gold = -1;
    expect(await edit.submitForm()).toBe(false);
    expect(edit.submissionState.value.status).toBe("validationError");
    expect(api.updateElement).toHaveBeenCalledOnce();
  });

  test("tracks changes from the loaded character and resets to a new one", () => {
    const edit = useCharacterEdit(
      newCharacter(),
      new Character({ id: "c1", name: "Ada", edition: "5e" }),
      fakeApi(),
      "5e",
    );

    expect(edit.hasChanged.value).toBe(false);
    edit.wh.value.name = "Bea";
    expect(edit.hasChanged.value).toBe(true);

    edit.resetForm();
    expect(edit.wh.value.name).toBe("New character");
    expect(edit.hasChanged.value).toBe(false);
  });

  test("deletes a loaded character in its edition, and nothing for a new one", async () => {
    const api = fakeApi();

    expect(await useCharacterEdit(newCharacter(), undefined, api, "5e").deleteItem()).toBe(false);
    expect(await useCharacterEdit(newCharacter(), new Character({ id: "c1" }), api, "5e").deleteItem()).toBe(true);
    expect(api.deleteElement).toHaveBeenCalledWith("c1", "5e");
  });

  test("someone else's character can't be edited", () => {
    canEdit.value = false;

    expect(useCharacterEdit(newCharacter(), new Character({ id: "c1" }), fakeApi(), "5e").canEdit.value).toBe(false);
  });
});
