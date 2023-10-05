<template>
  <div class="items">
    <b-container>
      <h1>Available Trappings</h1>

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
          <b-form-group label="Group" label-for="group-options">
            <b-form-select
              v-if="selectedFilter.type === 0"
              v-model="selectedFilter.group"
              :options="filterOptions.meleeGroup"
              id="group-options"
            ></b-form-select>
            <b-form-select
              v-else-if="selectedFilter.type === 1"
              v-model="selectedFilter.group"
              :options="filterOptions.rangedGroup"
              id="group-options"
            ></b-form-select>
            <b-form-select
              v-else-if="selectedFilter.type === 2"
              v-model="selectedFilter.group"
              :options="filterOptions.ammunitionGroup"
              id="group-options"
            ></b-form-select>
            <b-form-select
              v-else-if="selectedFilter.type === 3"
              v-model="selectedFilter.group"
              :options="filterOptions.armourGroup"
              id="group-options"
            ></b-form-select>
            <b-form-select v-else disabled id="group-options"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="item"
        @elementDeleted="deleteWh"
        @elementCopied="copyWh"
        @createNew="modifyWh('item', 'create')"
        @modifyElement="modifyWh('item', $event)"
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
import { onBeforeMount, ref, computed, reactive, watch } from "vue";
import { useListWh } from "../../../composables/listWh";
import { ItemApi, itemTypes, itemTypeOptions, itemGroupOptions } from "../../../services/wh/item";
import { addSpaces } from "../../../utils/stringUtils";
import { hasValue } from "../../../utils/otherUtils";
import { sourceOptions, source } from "../../../services/wh/source";
import { useRoute } from "vue-router/composables";

const MAX_CHARS = 15;
const itemApi = new ItemApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "itemType", sortable: true },
  { key: "source", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation, modifyWh } = useListWh(itemApi);
const route = useRoute();

const selectedFilter = reactive({
  source: hasValue(route.query.selectedSource) ? Number(route.query.selectedSource) : -1,
  type: hasValue(route.query.selectedType) ? Number(route.query.selectedType) : -1,
  group: hasValue(route.query.selectedGroup) ? Number(route.query.selectedGroup) : -1,
});

const filterOptions = computed(() => {
  let sourcesInData = {};
  let typesInData = {};
  let meleeGroupsInData = {};
  let rangedGroupsInData = {};
  let ammunitionGroupsInData = {};
  let armourGroupsInData = {};
  for (const wh of listOfWh.value) {
    typesInData[wh.type] = "";
    if (wh.type === 0) {
      meleeGroupsInData[wh.stats[0].group] = "";
    }
    if (wh.type === 1) {
      rangedGroupsInData[wh.stats[1].group] = "";
    }
    if (wh.type === 2) {
      ammunitionGroupsInData[wh.stats[2].group] = "";
    }
    if (wh.type === 3) {
      armourGroupsInData[wh.stats[3].group] = "";
    }
    for (const source of Object.keys(wh.source)) {
      sourcesInData[source] = "";
    }
  }

  const sourceTypeOpts = sourceOptions().filter((x) => x.value in sourcesInData);
  const typeOpts = itemTypeOptions().filter((x) => x.value in typesInData);
  const meleeGroupOpts = itemGroupOptions(0).filter((x) => x.value in meleeGroupsInData);
  const rangedGroupOpts = itemGroupOptions(1).filter((x) => x.value in rangedGroupsInData);
  const ammunitionGroupOpts = itemGroupOptions(2).filter((x) => x.value in ammunitionGroupsInData);
  const armourGroupOpts = itemGroupOptions(3).filter((x) => x.value in armourGroupsInData);

  return {
    source: [{ value: -1, text: "Any" }].concat(sourceTypeOpts),
    type: [{ value: -1, text: "Any" }].concat(typeOpts),
    meleeGroup: [{ value: -1, text: "Any" }].concat(meleeGroupOpts),
    rangedGroup: [{ value: -1, text: "Any" }].concat(rangedGroupOpts),
    ammunitionGroup: [{ value: -1, text: "Any" }].concat(ammunitionGroupOpts),
    armourGroup: [{ value: -1, text: "Any" }].concat(armourGroupOpts),
  };
});

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    source: Object.entries(wh.source)
      .map((x) => source[x[0]])
      .join(", "),
    itemType: itemTypes[wh.type],
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    if (selectedFilter.source === -1 || Object.hasOwn(wh.source, selectedFilter.source)) {
      if (selectedFilter.type === -1 || wh.type === selectedFilter.type) {
        const whType = selectedFilter.type;

        if ([0, 1, 2, 3].includes(whType)) {
          if (selectedFilter.group === -1 || wh.stats[whType].group === selectedFilter.group) {
            filteredListOfWh.push(formatListOfWh(wh));
          }
        } else {
          filteredListOfWh.push(formatListOfWh(wh));
        }
      }
    }
  }
  return filteredListOfWh;
});

watch(
  () => ({ ...selectedFilter }),
  (newValue, oldValue) => {
    if (newValue.type !== oldValue.type) {
      selectedFilter.group = -1;
    } else {
      selectedFilter.group = newValue.group;
    }

    const query = {
      selectedSource: newValue.source,
      selectedType: newValue.type,
      selectedGroup: selectedFilter.group,
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
