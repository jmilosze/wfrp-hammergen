<template>
  <div class="item-properties">
    <b-container>
      <h1>Available Qualities and Runes</h1>

      <b-row>
        <b-col>
          <b-form-group label="Source" label-for="source-options">
            <b-form-select
              v-model="selectedFilter.source"
              :options="filterOptions.source"
              id="source-options"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Type" label-for="type-options">
            <b-form-select
              v-model="selectedFilter.type"
              :options="filterOptions.type"
              id="type-options"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Applicable to" label-for="applicable-to-options">
            <b-form-select
              v-model="selectedFilter.applicableTo"
              :options="filterOptions.applicableTo"
              id="applicable-to-options"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="property"
        @elementDeleted="deleteWh"
        @elementCopied="copyWh"
        @createNew="modifyWh('property', 'create')"
        @modifyElement="modifyWh('property', $event)"
      />

      <div v-if="!loaded && errors.length === 0" class="text-center">
        <div class="spinner-border" style="width: 3rem; height: 3rem" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-if="errors.length" class="text-danger field-validation-error mt-3">
        <ul>
          <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
        </ul>
      </div>
    </b-container>
  </div>
</template>

<script setup>
import ElementList from "./ListTemplate.vue";
import { ItemPropertyApi, itemPropertyOptions, itemPropertyTypes } from "../../../services/wh/itemproperty";
import { authRequest } from "../../../services/auth";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useListWh } from "../../../composables/listWh";
import { itemTypeOptions, itemTypes } from "../../../services/wh/item";
import { addSpaces } from "../../../utils/stringUtils";
import { hasValue } from "../../../utils/otherUtils";
import { source, sourceOptions } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";

const MAX_CHARS = 15;
const itemPropertyApi = new ItemPropertyApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "propertyType", sortable: true },
  { key: "applicableTo", sortable: false },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation, modifyWh } =
  useListWh(itemPropertyApi);
const route = useRoute();

const selectedFilter = reactive({
  source: hasValue(route.query.selectedSource) ? Number(route.query.selectedSource) : -1,
  type: hasValue(route.query.selectedType) ? Number(route.query.selectedType) : -1,
  applicableTo: hasValue(route.query.selectedApplicableTo) ? Number(route.query.selectedApplicableTo) : -1,
});

const filterOptions = computed(() => {
  let sourcesInData = {};
  let typesInData = {};
  let applicableToInData = {};
  for (const wh of listOfWh.value) {
    typesInData[wh.type] = "";
    for (const source of Object.keys(wh.source)) {
      sourcesInData[source] = "";
    }
    for (const applicableTo of Object.keys(wh.applicableTo)) {
      applicableToInData[applicableTo] = "";
    }
  }

  const sourceTypeOpts = sourceOptions().filter((x) => x.value in sourcesInData);
  const typeOpts = itemPropertyOptions().filter((x) => x.value in typesInData);
  const applicableToTypeOpts = itemTypeOptions().filter((x) => x.value in applicableToInData);

  return {
    source: [{ value: -1, text: "Any" }].concat(sourceTypeOpts),
    type: [{ value: -1, text: "Any" }].concat(typeOpts),
    applicableTo: [{ value: -1, text: "Any" }].concat(applicableToTypeOpts),
  };
});

function formatListOfWh(wh) {
  let applicableTo;
  if (wh.applicableTo.length === Object.keys(itemTypes).length) {
    applicableTo = "All";
  } else {
    applicableTo = wh.applicableTo.map((itemValue) => itemTypes[itemValue]).join(", ");
  }
  return {
    applicableTo: applicableTo,
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    name: addSpaces(wh.name, MAX_CHARS),
    propertyType: itemPropertyTypes[wh.type],
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    if (selectedFilter.source === -1 || Object.hasOwn(wh.source, selectedFilter.source)) {
      if (selectedFilter.type === -1 || wh.type === selectedFilter.type) {
        if (selectedFilter.applicableTo === -1 || wh.applicableTo.includes(selectedFilter.applicableTo)) {
          filteredListOfWh.push(formatListOfWh(wh));
        }
      }
    }
  }
  return filteredListOfWh;
});

watch(
  () => selectedFilter,
  (newValue) => {
    const query = {
      selectedSource: newValue.source,
      selectedType: newValue.type,
      selectedApplicableTo: newValue.applicableTo,
    };
    addParamsToLocation(route.path, query);
  },
  { deep: true }
);

onBeforeMount(() => {
  loadWhList();
});
</script>

<style scoped></style>
