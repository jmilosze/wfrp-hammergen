<template>
  <div class="item-properties">
    <b-container>
      <h1>Available Item Qualities and Flaws</h1>

      <ElementList
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="property"
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
import { ItemPropertyApi, itemPropertyTypes } from "../../../services/wh/itemproperty";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import { itemTypes } from "../../../services/wh/item";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

export default {
  name: "ListItemProperties",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new ItemPropertyApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "propertyType", sortable: true },
        { key: "applicableTo", sortable: false },
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
    formatList(itemProperty) {
      let applicableTo;
      if (itemProperty.applicableTo.length === Object.keys(itemTypes).length) {
        applicableTo = "All";
      } else {
        applicableTo = itemProperty.applicableTo.map((itemValue) => itemTypes[itemValue]).join(", ");
      }
      return {
        applicableTo: applicableTo,
        description: addSpaces(itemProperty.description, MAX_CHARS),
        name: addSpaces(itemProperty.name, MAX_CHARS),
        propertyType: itemPropertyTypes[itemProperty.type],
        canEdit: itemProperty.canEdit,
        id: itemProperty.id,
      };
    },
  },
};
</script>

<style scoped></style>