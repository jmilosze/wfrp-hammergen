<template>
  <div class="mutations">
    <b-container>
      <h1>Available Mutations</h1>

      <ElementList
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="mutation"
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
import { MutationApi, mutationTypes } from "../../../services/wh/mutation";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

export default {
  name: "ListMutations",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new MutationApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "type", sortable: true },
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
    formatList(mutation) {
      return {
        name: addSpaces(mutation.name, MAX_CHARS),
        description: addSpaces(mutation.description, MAX_CHARS),
        type: mutationTypes[mutation.type],
        canEdit: mutation.canEdit,
        id: mutation.id,
      };
    },
  },
};
</script>

<style scoped></style>
