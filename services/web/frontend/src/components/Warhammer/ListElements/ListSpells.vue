<template>
  <div class="spells">
    <b-container>
      <h1>Available Prayers and Spells</h1>

      <ElementList
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="spell"
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
import {SpellApi, spellTypes} from "../../../services/wh/spell";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

export default {
  name: "ListSpells",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new SpellApi(authRequest),

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
    formatList(spell) {
      return {
        name: addSpaces(spell.name, MAX_CHARS),
        description: addSpaces(spell.description, MAX_CHARS),
        type: spellTypes[spell.type],
        canEdit: spell.canEdit,
        id: spell.id,
      };
    },
  },
};
</script>

<style scoped></style>
