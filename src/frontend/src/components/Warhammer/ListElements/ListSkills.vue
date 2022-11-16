<template>
  <div class="skills">
    <b-container>
      <h1>Available Skills</h1>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="skill"
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
import { SkillApi, skillAttributeTypesGroup, skillTypesGroup } from "../../../services/wh/skill";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";

const MAX_CHARS = 15;

export default {
  name: "ListSkills",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new SkillApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "attr", sortable: true },
        { key: "skillType", sortable: true },
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
    formatList(skill) {
      return {
        name: addSpaces(skill.name, MAX_CHARS),
        description: addSpaces(skill.description, MAX_CHARS),
        attr: skillAttributeTypesGroup[skill.attribute],
        skillType: skillTypesGroup[skill.type],
        canEdit: skill.canEdit,
        id: skill.id,
      };
    },
  },
};
</script>

<style scoped></style>
