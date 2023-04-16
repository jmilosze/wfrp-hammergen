<template>
  <div class="careers">
    <b-container>
      <h1>Available Careers</h1>

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
          <b-form-group label="Class" label-for="class-options">
            <b-form-select
              v-model="selectedFilter.class"
              :options="filterOptions.class"
              id="class-options"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Species" label-for="species-options">
            <b-form-select
              v-model="selectedFilter.species"
              :options="filterOptions.species"
              id="species-options"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="career"
        @elementDeleted="deleteWh"
        @elementCopied="copyWh"
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
import { authRequest } from "../../../services/auth";
import { onBeforeMount, ref, computed, reactive, watch } from "vue";
import { useListWh } from "../../../composables/listWh";
import { CareerApi, careerClasses, careerClassOptions } from "../../../services/wh/career";
import { addSpaces } from "../../../utils/stringUtils";
import { sourceOptions, source } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";
import { species, speciesOptions } from "../../../services/wh/character";

const MAX_CHARS = 15;
const careerApi = new CareerApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "class", sortable: true },
  { key: "species", sortable: false },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation } = useListWh(careerApi);
const route = useRoute();

const filterOptions = reactive({
  source: [{ value: -1, text: "Any" }].concat(sourceOptions()),
  class: [{ value: -1, text: "Any" }].concat(careerClassOptions()),
  species: [{ value: -1, text: "Any" }].concat(speciesOptions()),
});

const selectedFilter = reactive({
  source: route.query.selectedSource ? Number(route.query.selectedSource) : -1,
  class: route.query.selectedClass ? Number(route.query.selectedClass) : -1,
  species: route.query.selectedSpecies ? Number(route.query.selectedSpecies) : -1,
});

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    class: careerClasses[wh.class],
    species: wh.species.map((speciesValue) => species[speciesValue]).join(", "),
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    if (selectedFilter.source === -1 || Object.hasOwn(wh.source, selectedFilter.source)) {
      if (selectedFilter.class === -1 || wh.class === selectedFilter.class) {
        if (selectedFilter.species === -1 || wh.species.includes(selectedFilter.species)) {
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
      selectedClass: newValue.class,
      selectedSpecies: newValue.species,
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
