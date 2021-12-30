import { CareerApi, compareCareer } from "../src/services/wh/career";

const career1ApiForm = {
  id: "id1",
  name: "career1",
  description: "desc1",
  species: [0, 1],
  class: 1,
  can_edit: true,
  shared: false,
  level_1: {
    name: "c1l1",
    status: 1,
    standing: 1,
    attributes: [1, 2, 5],
    skills: ["a", "s", "d"],
    talents: ["q", "w", "e"],
    items: "items11",
  },
  level_2: {
    name: "c1l2",
    status: 2,
    standing: 2,
    attributes: [1, 2],
    skills: ["z"],
    talents: ["z", "x", "c"],
    items: "i12",
  },
  level_3: { name: "c1l3", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  level_4: { name: "c1l4", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
};

const career1ModelForm = {
  id: "id1",
  name: "career1",
  description: "desc1",
  species: [0, 1],
  class: 1,
  canEdit: true,
  shared: false,
  levelOne: {
    name: "c1l1",
    status: 1,
    standing: 1,
    attributes: [1, 2, 5],
    skills: ["a", "s", "d"],
    talents: ["q", "w", "e"],
    items: "items11",
  },
  levelTwo: {
    name: "c1l2",
    status: 2,
    standing: 2,
    attributes: [1, 2],
    skills: ["z"],
    talents: ["z", "x", "c"],
    items: "i12",
  },
  levelThree: { name: "c1l3", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  levelFour: { name: "c1l4", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
};

const career2ApiForm = {
  id: "id2",
  name: "career2",
  description: "desc2",
  species: [0],
  class: 3,
  can_edit: false,
  shared: true,
  level_1: { name: "c2l1", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  level_2: { name: "c2l2", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  level_3: {
    name: "c2l3",
    status: 1,
    standing: 1,
    attributes: [1, 2, 5],
    skills: ["a", "s", "d"],
    talents: ["q", "w", "e"],
    items: "items11",
  },
  level_4: {
    name: "c2l4",
    status: 2,
    standing: 2,
    attributes: [1, 2],
    skills: ["z"],
    talents: ["z", "x", "c"],
    items: "i12",
  },
};

const career2ModelForm = {
  id: "id2",
  name: "career2",
  description: "desc2",
  species: [0],
  class: 3,
  canEdit: false,
  shared: true,
  levelOne: { name: "c2l1", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  levelTwo: { name: "c2l2", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  levelThree: {
    name: "c2l3",
    status: 1,
    standing: 1,
    attributes: [1, 2, 5],
    skills: ["a", "s", "d"],
    talents: ["q", "w", "e"],
    items: "items11",
  },
  levelFour: {
    name: "c2l4",
    status: 2,
    standing: 2,
    attributes: [1, 2],
    skills: ["z"],
    talents: ["z", "x", "c"],
    items: "i12",
  },
};

const mockAxios = {
  get: jest.fn(async (path) => {
    if (path === "/api/career") {
      return {
        data: {
          data: [career1ApiForm, career2ApiForm],
        },
      };
    } else if (path === "/api/career/id1") {
      return {
        data: {
          data: career1ApiForm,
        },
      };
    } else if (path === "/api/career/id2") {
      return {
        data: {
          data: career2ApiForm,
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

test("test getElement returns expected career", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject(career1ModelForm);
});

test("test listElements returns expected careers", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([career1ModelForm, career2ModelForm]);
});

test("test createElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.createElement(career1ModelForm);

  expect(result).toBe("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(career1ApiForm));
  delete expectedCareerCall.id;
  delete expectedCareerCall.can_edit;
  expect(mockAxios.post).toHaveBeenCalledWith("/api/career", expectedCareerCall);
});

test("test updateElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.updateElement(career1ModelForm);

  expect(result).toBe("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(career1ApiForm));
  delete expectedCareerCall.can_edit;
  expect(mockAxios.post).toHaveBeenCalledWith("/api/career/update", expectedCareerCall);
});

test("test deleteElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  await client.deleteElement("id1");

  expect(mockAxios.delete).toHaveBeenCalledWith("/api/career/id1");
});

test("test compareCareers returns true if objects are the same", () => {
  const skill1 = {
    id: "id1",
    name: "career1",
    description: "desc1",
    species: [0, 1],
    class: 1,
    canEdit: true,
    shared: false,
    levelOne: {
      name: "c1l1",
      status: 1,
      standing: 1,
      attributes: [1, 2, 5],
      skills: ["a", "s", "d"],
      talents: ["q", "w", "e"],
      items: "items11",
    },
    levelTwo: {
      name: "c1l2",
      status: 2,
      standing: 2,
      attributes: [1, 2],
      skills: ["z"],
      talents: ["z", "x", "c"],
      items: "i12",
    },
    levelThree: { name: "c1l3", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
    levelFour: { name: "c1l4", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  };

  const skill2 = {
    id: "id1",
    name: "career1",
    description: "desc1",
    species: [1, 0],
    class: 1,
    canEdit: true,
    shared: false,
    levelOne: {
      name: "c1l1",
      status: 1,
      standing: 1,
      attributes: [2, 1, 5],
      skills: ["s", "a", "d"],
      talents: ["e", "w", "q"],
      items: "items11",
    },
    levelTwo: {
      name: "c1l2",
      status: 2,
      standing: 2,
      attributes: [1, 2],
      skills: ["z"],
      talents: ["x", "z", "c"],
      items: "i12",
    },
    levelThree: { name: "c1l3", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
    levelFour: { name: "c1l4", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  };

  const result = compareCareer(skill1, skill2);
  expect(result).toBe(true);
});

test("test compareCareers returns false if objects are different", () => {
  const skill1 = {
    id: "id1",
    name: "career1",
    description: "desc1",
    species: [0, 1],
    class: 1,
    canEdit: true,
    shared: false,
    levelOne: {
      name: "c1l1",
      status: 1,
      standing: 1,
      attributes: [1, 2, 5],
      skills: ["a", "s", "d"],
      talents: ["q", "w", "e"],
      items: "items11",
    },
    levelTwo: {
      name: "c1l2",
      status: 2,
      standing: 2,
      attributes: [1, 2],
      skills: ["z"],
      talents: ["z", "x", "c"],
      items: "i12",
    },
    levelThree: { name: "c1l3", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
    levelFour: { name: "c1l4", status: 0, standing: 0, attributes: [], skills: [], talents: [], items: "" },
  };

  const skill2 = JSON.parse(JSON.stringify(skill1));
  skill2.species = [3];

  const skill3 = JSON.parse(JSON.stringify(skill1));
  skill3.levelOne.attributes = [1, 2, 3, 4];

  const skill4 = JSON.parse(JSON.stringify(skill1));
  skill4.levelOne.skills = ["a", "s", "zxc"];

  const skill5 = JSON.parse(JSON.stringify(skill1));
  skill5.levelOne.talents = ["q", "w", "e", "x"];

  const skill6 = JSON.parse(JSON.stringify(skill1));
  skill6.class = 2;

  const skill7 = JSON.parse(JSON.stringify(skill1));
  skill7.levelOne.name = "something else";

  expect(compareCareer(skill1, skill2)).toBe(false);
  expect(compareCareer(skill1, skill3)).toBe(false);
  expect(compareCareer(skill1, skill4)).toBe(false);
  expect(compareCareer(skill1, skill5)).toBe(false);
  expect(compareCareer(skill1, skill6)).toBe(false);
  expect(compareCareer(skill1, skill7)).toBe(false);
});
