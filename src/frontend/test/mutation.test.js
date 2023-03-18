import { describe, expect, test, vi } from "vitest";
import { MutationApi, compareMutation } from "../src/services/wh/mutation";

const mutation1 = {
  id: "id1",
  name: "mutation1",
  description: "desc1",
  type: 0,
  modifiers: {
    size: 0,
    movement: 1,
    attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
  },
  can_edit: true,
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const mutation2 = {
  id: "id2",
  name: "mutation2",
  description: "desc2",
  type: 1,
  modifiers: {
    size: 0,
    movement: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  },
  can_edit: false,
  shared: false,
  source: {},
};

const mockAxios = {
  get: async (path) => {
    let apiData;
    if (path === "/api/mutation") {
      apiData = [JSON.parse(JSON.stringify(mutation1)), JSON.parse(JSON.stringify(mutation2))];
    } else if (path === "/api/mutation/id1") {
      apiData = JSON.parse(JSON.stringify(mutation1));
    } else if (path === "/api/mutation/id2") {
      apiData = JSON.parse(JSON.stringify(mutation2));
    } else {
      throw "invalid id";
    }

    return { data: { data: apiData } };
  },
  post: async () => {
    return { data: { data: "inserted_id" } };
  },
  delete: async () => {},
};

describe("getElement returns expected mutation", () => {
  test("when mutation has modifiers", async () => {
    const client = new MutationApi(mockAxios);
    const result = await client.getElement("id1");

    expect(result).toMatchObject({
      id: "id1",
      name: "mutation1",
      description: "desc1",
      type: 0,
      hasModifiers: true,
      modifiers: {
        size: 0,
        movement: 1,
        attributes: { WS: 1, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 2, Int: 3, WP: 0, Fel: 0 },
      },
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    });
  });

  test("when mutation does not have modifiers", async () => {
    const client = new MutationApi(mockAxios);
    const result = await client.getElement("id2");

    expect(result).toMatchObject({
      id: "id2",
      name: "mutation2",
      description: "desc2",
      type: 1,
      hasModifiers: false,
      modifiers: {
        size: 0,
        movement: 0,
        attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
      },
      canEdit: false,
      shared: false,
      source: {},
    });
  });
});

test("listElements returns expected mutations", async () => {
  const client = new MutationApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([
    {
      id: "id1",
      name: "mutation1",
      description: "desc1",
      type: 0,
      canEdit: true,
      shared: true,
      source: { 1: "page 2", 3: "page 5-10" },
    },
    {
      id: "id2",
      name: "mutation2",
      description: "desc2",
      type: 1,
      canEdit: false,
      shared: false,
      source: {},
    },
  ]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement({
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/mutation", {
    name: "mutation1",
    description: "desc1",
    type: 0,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.updateElement({
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });

  expect(result).toBe("inserted_id");

  expect(axiosSpy).toHaveBeenCalledWith("/api/mutation/update", {
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  });
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/mutation/id1");
});

test("compareMutation returns true if mutations are exactly the same", () => {
  const mutation = {
    id: "id",
    name: "mutation",
    description: "desc",
    type: 0,
    hasModifiers: true,
    modifiers: {
      size: 0,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  let otherMutation = JSON.parse(JSON.stringify(mutation));
  expect(compareMutation(mutation, otherMutation)).toBe(true);
});

describe("compareMutation returns false", () => {
  const mutation = {
    id: "id",
    name: "mutation",
    description: "desc",
    type: 0,
    hasModifiers: true,
    modifiers: {
      size: 0,
      attributes: { WS: 1, BS: 2, S: 3, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
    },
    canEdit: true,
    shared: true,
    source: { 1: "page 2", 3: "page 5-10" },
  };

  test.each([
    { field: "id", value: "otherId" },
    { field: "name", value: "otherName" },
    { field: "description", value: "otherDescription" },
    { field: "type", value: 1 },
    { field: "canEdit", value: false },
    { field: "shared", value: false },
  ])("when other mutation has different value of $field", (t) => {
    let otherMutation = JSON.parse(JSON.stringify(mutation));
    otherMutation[t.field] = t.value;
    expect(compareMutation(mutation, otherMutation)).toBe(false);
  });

  test.each([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other mutation has $diff", (t) => {
    let otherMutation = JSON.parse(JSON.stringify(mutation));
    otherMutation.source = t.source;
    expect(compareMutation(mutation, otherMutation)).toBe(false);
  });

  test.each([
    { field: "WS", value: 10 },
    { field: "BS", value: 10 },
    { field: "S", value: 10 },
    { field: "T", value: 10 },
    { field: "I", value: 10 },
    { field: "Ag", value: 10 },
    { field: "Dex", value: 10 },
    { field: "Int", value: 10 },
    { field: "WP", value: 10 },
    { field: "Fel", value: 10 },
  ])("when other mutation has different value of modifier $field", (t) => {
    let otherMutation = JSON.parse(JSON.stringify(mutation));
    otherMutation.modifiers.attributes[t.field] = t.value;
    expect(compareMutation(mutation, otherMutation)).toBe(false);
  });

  test.each([
    { field: "size", value: 1 },
    { field: "movement", value: -1 },
  ])("when other mutation has different value of modifier attribute $field", (t) => {
    let otherMutation = JSON.parse(JSON.stringify(mutation));
    otherMutation.modifiers[t.field] = t.value;
    expect(compareMutation(mutation, otherMutation)).toBe(false);
  });
});
