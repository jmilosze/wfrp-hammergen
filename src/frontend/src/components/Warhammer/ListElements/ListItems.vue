<template>
  <div class="items">
    <b-container>
      <h1>Available Items</h1>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="item"
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
import ElementList from "./ListTemplate.vue";
import ListCommon from "./ListCommon.vue";
import { ItemApi, itemTypes } from "../../../services/wh/item";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";

const MAX_CHARS = 15;

export default {
  name: "ListItems",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new ItemApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "itemType", sortable: true },
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
    formatList(item) {
      return {
        name: addSpaces(item.name, MAX_CHARS),
        description: addSpaces(item.description, MAX_CHARS),
        itemType: itemTypes[item.stats.type],
        canEdit: item.canEdit,
        id: item.id,
      };
    },
  },
};
</script>

<style scoped></style>
