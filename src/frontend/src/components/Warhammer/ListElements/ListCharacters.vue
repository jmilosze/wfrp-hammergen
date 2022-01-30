<template>
  <div class="characters">
    <b-container>
      <h1>Available Characters</h1>

      <ElementList
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="character"
        @elementDeleted="deleteElement"
      />

      <div v-if="errors.length" class="text-danger field-validation-error mt-3">
        <ul>
          <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
        </ul>
      </div>
    </b-container>
  </div>
</template>

<script>
import {CharacterApi, species} from "../../../services/wh/character";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

export default {
  name: "ListCharacters",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new CharacterApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "species", sortable: true },
        { key: "description", sortable: false },
        { key: "actions", sortable: false },
      ],
      listOfElements: [],
      errors: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    formatList(character) {
      return {
        name: addSpaces(character.name, MAX_CHARS),
        species: species[character.species],
        description: addSpaces(character.description, MAX_CHARS),
        canEdit: character.canEdit,
        id: character.id,
      };
    },
  },
};
</script>

<style scoped></style>
