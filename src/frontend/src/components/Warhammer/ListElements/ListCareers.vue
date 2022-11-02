<template>
  <div class="careers">
    <b-container>
      <h1>Available Careers</h1>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="career"
        @elementDeleted="deleteElement"
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

<script>
import { CareerApi, careerClasses } from "../../../services/wh/career";
import { species } from "../../../services/wh/character";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

export default {
  name: "ListCareers",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new CareerApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "class", sortable: true },
        { key: "species", sortable: false },
        { key: "description", sortable: false },
        { key: "actions", sortable: false },
      ],
      listOfElements: [],
      errors: [],
      loaded: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    formatList(career) {
      return {
        name: addSpaces(career.name, MAX_CHARS),
        description: addSpaces(career.description, MAX_CHARS),
        class: careerClasses[career.class],
        species: career.species.map((speciesValue) => species[speciesValue]).join(", "),
        canEdit: career.canEdit,
        id: career.id,
      };
    },
  },
};
</script>

<style scoped></style>