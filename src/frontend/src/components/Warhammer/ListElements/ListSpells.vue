<template>
  <div class="spells">
    <b-container>
      <h1>Available Prayers and Spells</h1>

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
      </b-row>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="spell"
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
import { SpellApi, spellTypeOptions, spellTypes } from "../../../services/wh/spell";
import { addSpaces } from "../../../utils/stringUtils";
import { source, sourceOptions } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";

const MAX_CHARS = 15;
const spellApi = new SpellApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "spellType", sortable: true },
  { key: "description", sortable: true },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation } = useListWh(spellApi);
const route = useRoute();

const filterOptions = reactive({
  source: [{ value: -1, text: "Any" }].concat(sourceOptions()),
  type: [{ value: "any", text: "Any" }].concat(spellTypeOptions()),
});

const selectedFilter = reactive({
  source: route.query.selectedSource ? Number(route.query.selectedSource) : -1,
  type: route.query.selectedType ? route.query.selectedType : "any",
});

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    spellType: spellTypes[wh.type],
    description: wh.description,
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    if (selectedFilter.source === -1 || Object.hasOwn(wh.source, selectedFilter.source)) {
      if (selectedFilter.type === "any" || wh.type === selectedFilter.type) {
        filteredListOfWh.push(formatListOfWh(wh));
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
