import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/item_property";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    type: apiData.type,
    applicableTo: apiData.applicable_to,
    canEdit: apiData.can_edit,
    shared: apiData.shared,
    source: apiData.source,
  };
};

const convertModelToApiData = (itemProperty, includeId) => {
  let apiData = {
    name: itemProperty.name,
    description: itemProperty.description,
    type: itemProperty.type,
    applicable_to: itemProperty.applicableTo,
    shared: itemProperty.shared,
    source: itemProperty.source,
  };

  if (includeId) {
    apiData.id = itemProperty.id;
  }

  return apiData;
};

class ItemPropertyApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const itemPropertyTypes = {
  0: "Quality",
  1: "Flaw",
};

const compareItemProperty = (itemProperty1, itemProperty2) => {
  for (let [key, value] of Object.entries(itemProperty1)) {
    if (key !== "applicableTo" && key !== "source") {
      if (itemProperty2[key] !== value) {
        return false;
      }
    }
  }

  if (!compareObjects(itemProperty1.source, itemProperty2.source)) {
    return false;
  }

  return compareArrayIgnoreOrder(itemProperty1.applicableTo, itemProperty2.applicableTo);
};

const generateEmptyItemProperty = () => {
  return {
    id: "",
    name: "",
    description: "",
    type: 0,
    applicableTo: [0],
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewItemProperty = (canEdit) => {
  const itemProperty = generateEmptyItemProperty();
  itemProperty.name = "New item property";
  itemProperty.canEdit = canEdit;
  itemProperty.shared = true;
  itemProperty.source = defaultSource();
  return itemProperty;
};

export { ItemPropertyApi, generateEmptyItemProperty, generateNewItemProperty, itemPropertyTypes, compareItemProperty };
