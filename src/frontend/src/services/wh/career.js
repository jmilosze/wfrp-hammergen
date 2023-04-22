import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator";
import { skillAttributeTypesGroup } from "@/services/wh/skill";

const apiBasePath = "/api/career";

const careerClasses = {
  0: "Academic",
  1: "Burghers",
  2: "Courtier",
  3: "Peasant",
  4: "Ranger",
  5: "Riverfolk",
  6: "Rougue",
  7: "Warrior",
  8: "Seafarer",
};

function careerClassOptions() {
  const options = [];
  for (let [k, v] of Object.entries(careerClasses)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
}

const statusTiers = {
  0: "Brass",
  1: "Silver",
  2: "Gold",
};

const statusStandings = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
};

const generateEmptyLevel = () => {
  return {
    name: "",
    status: 0,
    standing: 0,
    attributes: [],
    skills: [],
    talents: [],
    items: "",
  };
};

const generateEmptyCareer = () => {
  return {
    id: "",
    name: "",
    description: "",
    species: [],
    class: 0,
    canEdit: false,
    shared: false,
    source: {},
    levelOne: generateEmptyLevel(),
    levelTwo: generateEmptyLevel(),
    levelThree: generateEmptyLevel(),
    levelFour: generateEmptyLevel(),
  };
};

const generateNewCareer = (canEdit) => {
  const newCareer = generateEmptyCareer();
  newCareer.name = "New career";
  newCareer.levelOne.name = "New level 1";
  newCareer.levelTwo.name = "New level 2";
  newCareer.levelThree.name = "New level 3";
  newCareer.levelFour.name = "New level 4";
  newCareer.canEdit = canEdit;
  newCareer.shared = true;
  newCareer.source = defaultSource();

  return newCareer;
};

const convertModelToApiData = (career, includeId) => {
  const apiData = {
    name: career.name,
    description: career.description,
    species: JSON.parse(JSON.stringify(career.species)),
    class: career.class,
    shared: career.shared,
    source: career.source,
    level_1: JSON.parse(JSON.stringify(career.levelOne)),
    level_2: JSON.parse(JSON.stringify(career.levelTwo)),
    level_3: JSON.parse(JSON.stringify(career.levelThree)),
    level_4: JSON.parse(JSON.stringify(career.levelFour)),
  };

  if (includeId) {
    apiData.id = career.id;
  }

  return apiData;
};

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    species: JSON.parse(JSON.stringify(apiData.species)),
    class: apiData.class,
    levelOne: JSON.parse(JSON.stringify(apiData.level_1)),
    levelTwo: JSON.parse(JSON.stringify(apiData.level_2)),
    levelThree: JSON.parse(JSON.stringify(apiData.level_3)),
    levelFour: JSON.parse(JSON.stringify(apiData.level_4)),
    canEdit: apiData.can_edit,
    shared: apiData.shared,
    source: apiData.source,
  };
};

class CareerApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const compareCareer = (career1, career2) => {
  for (let [key, value] of Object.entries(career1)) {
    if (key !== "species" && !key.startsWith("level") && key !== "source") {
      if (career2[key] !== value) {
        return false;
      }
    }
  }

  for (let lvl of ["levelOne", "levelTwo", "levelThree", "levelFour"]) {
    let career1Level = career1[lvl];
    let career2Level = career2[lvl];
    for (let [key, value] of Object.entries(career1Level)) {
      if (key !== "attributes" && key !== "skills" && key !== "talents") {
        if (career2Level[key] !== value) {
          return false;
        }
      }
    }

    if (!compareArrayIgnoreOrder(career1Level.attributes, career2Level.attributes)) {
      return false;
    }

    if (!compareArrayIgnoreOrder(career1Level.skills, career2Level.skills)) {
      return false;
    }

    if (!compareArrayIgnoreOrder(career1Level.talents, career2Level.talents)) {
      return false;
    }
  }

  if (!compareArrayIgnoreOrder(career1.species, career2.species)) {
    return false;
  }

  return compareObjects(career1.source, career2.source);
};

export {
  careerClasses,
  statusTiers,
  statusStandings,
  generateEmptyCareer,
  generateNewCareer,
  CareerApi,
  compareCareer,
  careerClassOptions,
};
