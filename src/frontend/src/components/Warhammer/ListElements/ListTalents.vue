<template>
  <div class="talents">
    <b-container>
      <h1>Available Talents</h1>

      <ElementList
        v-if="loaded"
        :displayFields="displayFields"
        :listOfElements="listOfElements"
        elementType="talent"
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
import { TalentApi, talentAttributes } from "../../../services/wh/talent";
import { authRequest } from "../../../services/auth";
import { addSpaces } from "../../../utils/stringUtils";
import ElementList from "./ListTemplate";
import ListCommon from "./ListCommon";

const MAX_CHARS = 15;

function maxRankTalentDisplay(isGroup, maxRankValue, maxRankAttValue) {
  if (isGroup) {
    return "";
  }

  const constPart = maxRankValue > 0 ? maxRankValue.toString() : "";
  const attName = talentAttributes[maxRankAttValue];
  const bonusPart = attName !== "None" ? attName + " Bonus" : "";

  if (constPart !== "" && bonusPart !== "") {
    return constPart + " + " + bonusPart;
  } else {
    return constPart + bonusPart;
  }
}

export default {
  name: "ListTalents",
  mixins: [ListCommon],
  components: { ElementList },

  data() {
    return {
      elementApi: new TalentApi(authRequest),

      displayFields: [
        { key: "name", sortable: true },
        { key: "maxRank", sortable: false },
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
    formatList(talent) {
      return {
        name: addSpaces(talent.name, MAX_CHARS),
        description: addSpaces(talent.description, MAX_CHARS),
        maxRank: maxRankTalentDisplay(talent.isGroup, talent.maxRank, talent.maxRankAtt),
        canEdit: talent.canEdit,
        id: talent.id,
      };
    },
  },
};
</script>

<style scoped></style>
