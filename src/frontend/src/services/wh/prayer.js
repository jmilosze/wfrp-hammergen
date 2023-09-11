import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/wh/prayer";

const convertApiToModelData = (apiData) => {
  const prayer = {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    range: apiData.object.range,
    target: apiData.object.target,
    duration: apiData.object.duration,
    description: apiData.object.description,
    shared: apiData.object.shared,
    source: apiData.object.source,
  };

  return prayer;
};

const convertModelToApiData = (prayer) => {
  const apiData = {
    name: prayer.name,
    range: prayer.range,
    target: prayer.target,
    duration: prayer.duration,
    description: prayer.description,
    shared: prayer.shared,
    source: prayer.source,
  };

  return apiData;
};

class PrayerApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const comparePrayer = (prayer1, prayer2) => {
  for (let [key, value] of Object.entries(prayer1)) {
    if (key !== "source") {
      if (prayer2[key] !== value) {
        return false;
      }
    }
  }

  return compareObjects(prayer1.source, prayer2.source);
};

const generateEmptyPrayer = () => {
  return {
    id: "",
    name: "",
    range: "",
    target: "",
    duration: "",
    description: "",
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewPrayer = (canEdit) => {
  const prayer = generateEmptyPrayer();
  prayer.name = "New prayer";
  prayer.canEdit = canEdit;
  prayer.shared = true;
  prayer.source = defaultSource();
  return prayer;
};

export { PrayerApi, generateEmptyPrayer, generateNewPrayer, comparePrayer };
