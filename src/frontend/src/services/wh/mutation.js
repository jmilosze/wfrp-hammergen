import { checkModifiers, compareModifiers, generateEmptyModifiers } from "./characterModifiers";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/mutation";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    type: apiData.type,
    hasModifiers: checkModifiers(apiData.modifiers),
    modifiers: apiData.modifiers,
    canEdit: apiData.can_edit,
    shared: apiData.shared,
    source: apiData.source,
  };
};

const convertModelToApiData = (mutation, includeId) => {
  let apiData = {
    name: mutation.name,
    description: mutation.description,
    type: mutation.type,
    modifiers: mutation.modifiers,
    shared: mutation.shared,
    source: mutation.source,
  };

  if (includeId) {
    apiData.id = mutation.id;
  }

  return apiData;
};

class MutationApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const mutationTypes = {
  0: "Physical",
  1: "Mental",
};

const compareMutation = (mutation1, mutation2) => {
  for (let [key, value] of Object.entries(mutation1)) {
    if (key !== "modifiers" && key !== "source") {
      if (mutation2[key] !== value) {
        return false;
      }
    }
  }

  if (!compareObjects(mutation1.source, mutation2.source)) {
    return false;
  }

  return compareModifiers(mutation1.modifiers, mutation2.modifiers);
};

const generateEmptyMutation = () => {
  return {
    id: "",
    name: "",
    description: "",
    type: 0,
    hasModifiers: false,
    modifiers: generateEmptyModifiers(),
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewMutation = (canEdit) => {
  const mutation = generateEmptyMutation();
  mutation.name = "New mutation";
  mutation.canEdit = canEdit;
  mutation.shared = true;
  mutation.source = defaultSource();
  return mutation;
};

export { MutationApi, generateEmptyMutation, generateNewMutation, mutationTypes, compareMutation };
