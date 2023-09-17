<template>
  <div class="characters">
    <b-container>
      <h1>Available Characters</h1>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="filteredListOfWh"
        elementType="character"
        @elementDeleted="deleteWh"
        @elementCopied="copyWh"
        @createNew="modifyWh('character', 'create')"
        @modifyElement="modifyWh('character', $event)"
        @viewElement="modifyWh('character', $event, true)"
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
import { computed, onBeforeMount, ref } from "vue";
import { CharacterApi, speciesWithRegion } from "../../../services/wh/character";
import { useListWh } from "../../../composables/listWh";
import { addSpaces } from "../../../utils/stringUtils";

const MAX_CHARS = 15;
const characterApi = new CharacterApi(authRequest);

const displayFields = ref([
  { key: "name", sortable: true },
  { key: "species", sortable: true },
  { key: "description", sortable: false },
  { key: "actions", sortable: false },
]);

const { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, modifyWh } = useListWh(characterApi);

function formatListOfWh(wh) {
  return {
    name: addSpaces(wh.name, MAX_CHARS),
    species: speciesWithRegion[wh.species],
    description: addSpaces(wh.description, MAX_CHARS),
    canEdit: wh.canEdit,
    id: wh.id,
  };
}

const filteredListOfWh = computed(() => {
  const filteredListOfWh = [];
  for (const wh of listOfWh.value) {
    filteredListOfWh.push(formatListOfWh(wh));
  }
  return filteredListOfWh;
});

onBeforeMount(() => {
  loadWhList();
});
</script>

<style scoped></style>
