<template>
  <div class="talents">
    <b-container>
      <h1>Available Talents</h1>

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
        elementType="talent"
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
import { TalentApi, maxRankTalentDisplay } from "../../../services/wh/talent";
import { addSpaces } from "../../../utils/stringUtils";
import { sourceOptions, source } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";

const MAX_CHARS = 15;
const talentApi = new TalentApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "maxRank", sortable: true },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation } = useListWh(talentApi);
const route = useRoute();

const filterOptions = reactive({
  source: [{ value: -1, text: "Any" }].concat(sourceOptions()),
});

const selectedFilter = reactive({
  source: route.query.selectedSource ? Number(route.query.selectedSource) : -1,
});

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    maxRank: maxRankTalentDisplay(wh.isGroup, wh.maxRank, wh.maxRankAtt),
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
