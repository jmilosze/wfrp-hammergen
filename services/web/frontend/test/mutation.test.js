import { MutationApi, compareMutation } from "../src/services/wh/mutation";

const mutation1 = {
  id: "id1",
  name: "mutation1",
  description: "desc1",
  type: 0,
  can_edit: true,
  shared: true,
};

const mutation2 = {
  id: "id2",
  name: "mutation2",
  description: "desc2",
  type: 1,
  can_edit: false,
  shared: false,
};

const mockAxios = {
  get: jest.fn(async (path) => {
    if (path === "/api/mutation") {
      return {
        data: {
          data: [mutation1, mutation2],
        },
      };
    } else if (path === "/api/mutation/id1") {
      return {
        data: {
          data: mutation1,
        },
      };
    } else if (path === "/api/mutation/id2") {
      return {
        data: {
          data: mutation2,
        },
      };
    }
  }),
  post: jest.fn(async () => {
    return {
        data: {
          data: "inserted_id",
        },
      };
  }),
  delete: jest.fn(),
};

test("test getElement returns expected mutation", async () => {
  const client = new MutationApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject({
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    canEdit: true,
    shared: true,
  });
});

test("test listElements returns expected mutations", async () => {
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
    },
    {
      id: "id2",
      name: "mutation2",
      description: "desc2",
      type: 1,
      canEdit: false,
      shared: false,
    },
  ]);
});

test("test createElement calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  const result = await client.createElement({
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id")

  expect(mockAxios.post).toHaveBeenCalledWith("/api/mutation", {
    name: "mutation1",
    description: "desc1",
    type: 0,
    shared: true,
  });
});

test("test updateItemProperty calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  const result = await client.updateElement({
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    canEdit: true,
    shared: true,
  });

  expect(result).toBe("inserted_id")

  expect(mockAxios.post).toHaveBeenCalledWith("/api/mutation/update", {
    id: "id1",
    name: "mutation1",
    description: "desc1",
    type: 0,
    shared: true,
  });
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new MutationApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/mutation/id1");
});

test("test compareMutation returns true if objects are the same", () => {
  const mutation = {
    id: "id",
    name: "mutation",
    description: "desc",
    type: 0,
    canEdit: true,
    shared: true,
  };

  const result = compareMutation(mutation, {
    id: "id",
    name: "mutation",
    description: "desc",
    type: 0,
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(true);

});

test("test compareMutation returns false if objects are different", () => {
  const mutation = {
    id: "id",
    name: "mutation",
    description: "desc",
    type: 0,
    canEdit: true,
    shared: true,
  };

  const result = compareMutation(mutation, {
    id: "otherId",
    name: "mutation",
    description: "desc",
    type: 0,
    canEdit: true,
    shared: true,
  });
  expect(result).toBe(false);
});