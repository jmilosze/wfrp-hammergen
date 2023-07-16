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

const apiBasePath = "/api/wh/mutation";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData["id"],
    canEdit: apiData["canEdit"],
    name: apiData["object"]["name"],
    description: apiData["object"]["description"],
    type: apiData["object"]["type"],
    hasModifiers: checkModifiers(apiData["object"]["modifiers"]),
    modifiers: apiData["object"]["modifiers"],
    shared: apiData["object"]["shared"],
    source: apiData["object"]["source"],
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

function mutationTypeOptions() {
  const options = [];
  for (let [k, v] of Object.entries(mutationTypes)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
}

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

export { MutationApi, generateEmptyMutation, generateNewMutation, mutationTypes, compareMutation, mutationTypeOptions };
