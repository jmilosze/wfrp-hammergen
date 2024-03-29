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

const apiBasePath = "/api/wh/career";

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

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    description: apiData.object.description,
    species: JSON.parse(JSON.stringify(apiData.object.species)),
    class: apiData.object.class,
    levelOne: JSON.parse(JSON.stringify(apiData.object.level1)),
    levelTwo: JSON.parse(JSON.stringify(apiData.object.level2)),
    levelThree: JSON.parse(JSON.stringify(apiData.object.level3)),
    levelFour: JSON.parse(JSON.stringify(apiData.object.level4)),
    shared: apiData.object.shared,
    source: apiData.object.source,
  };
};

const convertModelToApiData = (career) => {
  return {
    name: career.name,
    description: career.description,
    species: JSON.parse(JSON.stringify(career.species)),
    class: career.class,
    shared: career.shared,
    source: career.source,
    level1: JSON.parse(JSON.stringify(career.levelOne)),
    level2: JSON.parse(JSON.stringify(career.levelTwo)),
    level3: JSON.parse(JSON.stringify(career.levelThree)),
    level4: JSON.parse(JSON.stringify(career.levelFour)),
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

const species = {
  0: "Human",
  1: "Halfling",
  2: "Dwarf",
  3: "High Elf",
  4: "Wood Elf",
  5: "Gnome",
  6: "Ogre",
};

function speciesOptions() {
  const options = [];
  for (let [k, v] of Object.entries(species)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
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

function getCareerLevel(career, number) {
  if (number === 1) {
    return career.levelOne;
  }

  if (number === 2) {
    return career.levelTwo;
  }

  if (number === 3) {
    return career.levelThree;
  }

  if (number === 4) {
    return career.levelFour;
  }

  return generateEmptyLevel();
}

export {
  careerClasses,
  statusTiers,
  statusStandings,
  generateEmptyCareer,
  generateNewCareer,
  CareerApi,
  compareCareer,
  careerClassOptions,
  species,
  speciesOptions,
  getCareerLevel,
};
