import { describe, expect, test, vi } from "vitest";
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
    name: "c1",
    status: 1,
    standing: 1,
    attributes: [1, 2],
    skills: ["s11", "s12"],
    talents: ["t11", "t12"],
    items: "items1",
  },
  level_2: {
    name: "c2",
    status: 2,
    standing: 2,
    attributes: [3, 4],
    skills: ["s21", "s22"],
    talents: ["t21", "t22"],
    items: "items2",
  },
  level_3: {
    name: "c3",
    status: 3,
    standing: 3,
    attributes: [5, 6],
    skills: ["s31", "s32"],
    talents: ["t31", "t32"],
    items: "items3",
  },
  level_4: {
    name: "c4",
    status: 4,
    standing: 4,
    attributes: [7, 8],
    skills: ["s41", "s42"],
    talents: ["t41", "t42"],
    items: "items4",
  },
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
    name: "c1",
    status: 1,
    standing: 1,
    attributes: [1, 2],
    skills: ["s11", "s12"],
    talents: ["t11", "t12"],
    items: "items1",
  },
  levelTwo: {
    name: "c2",
    status: 2,
    standing: 2,
    attributes: [3, 4],
    skills: ["s21", "s22"],
    talents: ["t21", "t22"],
    items: "items2",
  },
  levelThree: {
    name: "c3",
    status: 3,
    standing: 3,
    attributes: [5, 6],
    skills: ["s31", "s32"],
    talents: ["t31", "t32"],
    items: "items3",
  },
  levelFour: {
    name: "c4",
    status: 4,
    standing: 4,
    attributes: [7, 8],
    skills: ["s41", "s42"],
    talents: ["t41", "t42"],
    items: "items4",
  },
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
  get: async (path) => {
    let apiData;
    if (path === "/api/career") {
      apiData = [JSON.parse(JSON.stringify(career1ApiForm)), JSON.parse(JSON.stringify(career2ApiForm))];
    } else if (path === "/api/career/id1") {
      apiData = JSON.parse(JSON.stringify(career1ApiForm));
    } else if (path === "/api/career/id2") {
      apiData = JSON.parse(JSON.stringify(career2ApiForm));
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

test("getElement returns expected career", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.getElement("id1");

  expect(result).toMatchObject(career1ModelForm);
});

test("listElements returns expected careers", async () => {
  const client = new CareerApi(mockAxios);
  const result = await client.listElements();

  expect(result).toMatchObject([career1ModelForm, career2ModelForm]);
});

test("createElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.createElement(career1ModelForm);

  expect(result).toBe("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(career1ApiForm));
  delete expectedCareerCall.id;
  delete expectedCareerCall.can_edit;
  expect(axiosSpy).toHaveBeenCalledWith("/api/career", expectedCareerCall);
});

test("updateElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "post");
  const result = await client.updateElement(career1ModelForm);

  expect(result).toBe("inserted_id");

  const expectedCareerCall = JSON.parse(JSON.stringify(career1ApiForm));
  delete expectedCareerCall.can_edit;
  expect(axiosSpy).toHaveBeenCalledWith("/api/career/update", expectedCareerCall);
});

test("deleteElement calls axios with expected arguments", async () => {
  const client = new CareerApi(mockAxios);
  const axiosSpy = vi.spyOn(mockAxios, "delete");
  await client.deleteElement("id1");

  expect(axiosSpy).toHaveBeenCalledWith("/api/career/id1");
});

describe("compareCareer returns true", () => {
  test("when other career is exactly the same", () => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });

  test("when other career species has elements in different order", () => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.species = [1, 0];
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });

  test.each([
    { field: "attributes", value: [2, 1] },
    { field: "skills", value: ["s12", "s11"] },
    { field: "talents", value: ["t12", "t11"] },
  ])("when level 1 has table values of $field in different order", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelOne[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });

  test.each([
    { field: "attributes", value: [4, 3] },
    { field: "skills", value: ["s22", "s21"] },
    { field: "talents", value: ["t22", "t21"] },
  ])("when level 2 has table values of $field in different order", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelTwo[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });

  test.each([
    { field: "attributes", value: [6, 5] },
    { field: "skills", value: ["s32", "s31"] },
    { field: "talents", value: ["t32", "t31"] },
  ])("when level 3 has table values of $field in different order", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelThree[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });

  test.each([
    { field: "attributes", value: [8, 7] },
    { field: "skills", value: ["s42", "s41"] },
    { field: "talents", value: ["t42", "t41"] },
  ])("when level 4 has table values of $field in different order", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelFour[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(true);
  });
});

describe("compareItem returns false", () => {
  test.each([
    { field: "id", name: "id", value: "otherId" },
    { field: "name", name: "name", value: "otherName" },
    { field: "description", name: "description", value: "otherDescription" },
    { field: "species", name: "species (different number of elements)", value: [0] },
    { field: "species", name: "species (different elements)", value: [2, 1] },
    { field: "class", name: "class", value: 2 },
    { field: "canEdit", name: "canEdit", value: false },
    { field: "shared", name: "shared", value: true },
  ])("when other career has different value of $name", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(false);
  });

  test.each([
    { field: "name", name: "name", value: "otherName" },
    { field: "status", name: "status", value: "otherStanding" },
    { field: "standing", name: "standing", value: "otherStanding" },
    { field: "items", name: "items", value: "otherItems" },
    { field: "attributes", name: "attributes (different number of elements)", value: [1] },
    { field: "attributes", name: "attributes (different elements)", value: [1, 1] },
    { field: "skills", name: "skills (different number of elements)", value: ["s11"] },
    { field: "skills", name: "skills (different elements)", value: ["s11", "otherSkill"] },
    { field: "talents", name: "talents (different number of elements)", value: ["t11"] },
    { field: "talents", name: "talents (different elements)", value: ["t11", "otherTalent"] },
  ])("when level 1 has different value of $name", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelOne[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(false);
  });

  test.each([
    { field: "name", name: "name", value: "otherName" },
    { field: "status", name: "status", value: "otherStanding" },
    { field: "standing", name: "standing", value: "otherStanding" },
    { field: "items", name: "items", value: "otherItems" },
    { field: "attributes", name: "attributes (different number of elements)", value: [3] },
    { field: "attributes", name: "attributes (different elements)", value: [3, 3] },
    { field: "skills", name: "skills (different number of elements)", value: ["s21"] },
    { field: "skills", name: "skills (different elements)", value: ["s21", "otherSkill"] },
    { field: "talents", name: "talents (different number of elements)", value: ["t21"] },
    { field: "talents", name: "talents (different elements)", value: ["t21", "otherTalent"] },
  ])("when level 2 has different value of $name", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelTwo[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(false);
  });

  test.each([
    { field: "name", name: "name", value: "otherName" },
    { field: "status", name: "status", value: "otherStanding" },
    { field: "standing", name: "standing", value: "otherStanding" },
    { field: "items", name: "items", value: "otherItems" },
    { field: "attributes", name: "attributes (different number of elements)", value: [5] },
    { field: "attributes", name: "attributes (different elements)", value: [5, 5] },
    { field: "skills", name: "skills (different number of elements)", value: ["s31"] },
    { field: "skills", name: "skills (different elements)", value: ["s31", "otherSkill"] },
    { field: "talents", name: "talents (different number of elements)", value: ["t31"] },
    { field: "talents", name: "talents (different elements)", value: ["t31", "otherTalent"] },
  ])("when level 3 has different value of $name", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelThree[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(false);
  });

  test.each([
    { field: "name", name: "name", value: "otherName" },
    { field: "status", name: "status", value: "otherStanding" },
    { field: "standing", name: "standing", value: "otherStanding" },
    { field: "items", name: "items", value: "otherItems" },
    { field: "attributes", name: "attributes (different number of elements)", value: [7] },
    { field: "attributes", name: "attributes (different elements)", value: [7, 7] },
    { field: "skills", name: "skills (different number of elements)", value: ["s41"] },
    { field: "skills", name: "skills (different elements)", value: ["s41", "otherSkill"] },
    { field: "talents", name: "talents (different number of elements)", value: ["t41"] },
    { field: "talents", name: "talents (different elements)", value: ["t41", "otherTalent"] },
  ])("when level 4 has different value of $name", (t) => {
    let otherCareer = JSON.parse(JSON.stringify(career1ModelForm));
    otherCareer.levelFour[t.field] = t.value;
    expect(compareCareer(career1ModelForm, otherCareer)).toBe(false);
  });
});
