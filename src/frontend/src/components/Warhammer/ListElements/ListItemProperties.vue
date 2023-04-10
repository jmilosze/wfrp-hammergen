<template>
  <div class="item-properties">
    <b-container>
      <h1>Available Item Qualities and Flaws</h1>

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
      />

      <div v-else class="text-center">
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
import { ItemPropertyApi, itemPropertyTypes, itemPropertyOptions } from "../../../services/wh/itemproperty";
import { authRequest } from "../../../services/auth";
import { onBeforeMount, ref, computed, reactive, watch } from "vue";
import { useListWh } from "../../../composables/listWh";
import { itemTypes, itemTypeOptions } from "../../../services/wh/item";
import { addSpaces } from "../../../utils/stringUtils";
import { sourceOptions, source } from "../../../services/wh/source";
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

const { deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation } = useListWh(itemPropertyApi);
const route = useRoute();

const filterOptions = reactive({
  source: [{ value: -1, text: "Any" }].concat(sourceOptions()),
  type: [{ value: -1, text: "Any" }].concat(itemPropertyOptions()),
  applicableTo: [{ value: -1, text: "Any" }].concat(itemTypeOptions()),
});

const selectedFilter = reactive({
  source: route.query.selectedSource ? Number(route.query.selectedSource) : -1,
  type: route.query.selectedType ? Number(route.query.selectedType) : -1,
  applicableTo: route.query.selectedApplicableTo ? Number(route.query.selectedApplicableTo) : -1,
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
