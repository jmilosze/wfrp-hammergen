import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
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
  };
};

const convertModelToApiData = (itemProperty, includeId) => {
  let apiData = {
    name: itemProperty.name,
    description: itemProperty.description,
    type: itemProperty.type,
    applicable_to: itemProperty.applicableTo,
    shared: itemProperty.shared,
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
    if (key !== "applicableTo") {
      if (itemProperty2[key] !== value) {
        return false;
      }
    } else {
      if (!compareArrayIgnoreOrder(itemProperty1.applicableTo, itemProperty2.applicableTo)) {
        return false;
      }
    }
  }
  return true;
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
  };
};

const generateNewItemProperty = (canEdit) => {
  const itemProperty = generateEmptyItemProperty();
  itemProperty.name = "New item property";
  itemProperty.canEdit = canEdit;
  itemProperty.shared = true;
  return itemProperty;
};

export { ItemPropertyApi, generateEmptyItemProperty, generateNewItemProperty, itemPropertyTypes, compareItemProperty };
