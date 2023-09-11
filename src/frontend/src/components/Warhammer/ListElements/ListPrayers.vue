<template>
  <div class="prayers">
    <b-container>
      <h1>Available Prayers</h1>

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
      </b-row>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="prayer"
        @elementDeleted="deleteWh"
        @elementCopied="copyWh"
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
import { authRequest } from "../../../services/auth";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useListWh } from "../../../composables/listWh";
import { PrayerApi } from "../../../services/wh/prayer";
import { addSpaces } from "../../../utils/stringUtils";
import { source, sourceOptions } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";

const MAX_CHARS = 15;
const prayerApi = new PrayerApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "description", sortable: true },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation } = useListWh(prayerApi);
const route = useRoute();

const selectedFilter = reactive({
  source: route.query.selectedSource ? Number(route.query.selectedSource) : -1,
});

const filterOptions = computed(() => {
  let sourcesInData = {};
  for (const wh of listOfWh.value) {
    for (const source of Object.keys(wh.source)) {
      sourcesInData[source] = "";
    }
  }

  const sourceTypeOpts = sourceOptions().filter((x) => x.value in sourcesInData);

  return {
    source: [{ value: -1, text: "Any" }].concat(sourceTypeOpts),
  };
});

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    description: wh.description,
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    if (selectedFilter.source === -1 || Object.hasOwn(wh.source, selectedFilter.source)) {
      filteredListOfWh.push(formatListOfWh(wh));
    }
  }
  return filteredListOfWh;
});

watch(
  () => selectedFilter,
  (newValue) => {
    const query = {
      selectedSource: newValue.source,
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
