<template>
  <div class="skill-select-table">
    <b-table hover :items="displayItems" :fields="displayFields" :responsive="true" :sort-by="displayFields[0].key">
      <template v-slot:cell(total)="row">
        {{ getAttValue(row.item.attribute) + row.item.number }}
      </template>
      <template v-slot:cell(skill)="row">
        <span class="text-nowrap">{{ row.item.name }}</span>
      </template>
    </b-table>

    <b-button size="sm" class="mb-2 mr-2" @click="showEdit('edit-skills')" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>

    <b-button
      size="sm"
      class="mb-2 mr-2"
      @click="addSpeciesSkills"
      variant="primary"
      :disabled="disabled || !canGenerateSkills"
    >
      Add Species Skills
    </b-button>

    <b-button size="sm" class="mb-2 mr-2" @click="clearAll" variant="danger" :disabled="disabled"> Clear All</b-button>

    <b-modal id="edit-skills" title="Add/Remove Skills" ok-only ok-title="Close" scrollable>
      <b-form-group>
        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="$emit('createNew')" :disabled="!canSave">
          Create New
        </b-button>

        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="loadData(true)">
          <span v-if="editLoading" class="spinner-border spinner-border-sm" />
          Reload List
        </b-button>

        <b-form-invalid-feedback :state="canSave" class="mb-2">
          To create new Skills, correct all invalid form fields.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group>
        <b-input-group>
          <b-form-input v-model="editFilter" type="search" id="filterInput" placeholder="Type to Search">
          </b-form-input>
        </b-input-group>
      </b-form-group>

      <p>{{ resultRange }}</p>

      <b-table
        hover
        :items="listOfItems"
        :fields="editFields"
        :responsive="true"
        :filter="editFilter"
        :no-local-sorting="true"
        :per-page="perPage"
        :current-page="currentPage"
        @sort-changed="onSort"
        @filtered="onFiltered"
      >
        <template #cell(name)="row">
          <b-link :to="'/skill/' + row.item.id" target="_blank">{{ row.item.name }}</b-link>
        </template>

        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="row.toggleDetails">
            <div class="text-nowrap">{{ row.detailsShowing ? "Hide" : "Show" }} Details</div>
          </b-button>
        </template>

        <template v-slot:cell(select)="row">
          <b-form-group>
            <b-form-input
              :number="true"
              type="number"
              min="0"
              max="1000"
              v-model="row.item.number"
              @change="selectItem(row.item)"
              class="rank"
            ></b-form-input>
            <b-form-invalid-feedback :state="row.item.state">
              Skill rank must be an integer between 0 and 1000.
            </b-form-invalid-feedback>
          </b-form-group>
        </template>

        <template v-slot:row-details="row">
          <dl class="row">
            <dt class="col-sm-3">Attribute</dt>
            <dd class="col-sm-9">{{ row.item.attName }}</dd>

            <dt class="col-sm-3">Type</dt>
            <dd class="col-sm-9">{{ row.item.typeName }}</dd>
          </dl>
          {{ row.item.description }}
        </template>
      </b-table>

      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
      <p>{{ resultRange }}</p>
    </b-modal>
  </div>
</template>

<script>
import TableCommon from "./TableCommon.vue";
import NavHelpers from "../../NavHelpers.vue";
import { addSpaces } from "../../../utils/stringUtils";
import { SkillApi, skillAttributeTypesGroup, skillTypesGroup } from "../../../services/wh/skill";
import { authRequest } from "../../../services/auth";
import { compareNumberFn, compareStringFn } from "../../../utils/comapreUtils";
import { generateSpeciesSkills, resolveSkillGroups } from "../../../services/wh/characterGeneration/skillGeneration";

const MAX_CHARS = 15;

export default {
  name: "CharacterSkillsTable",
  mixins: [TableCommon, NavHelpers],
  props: {
    characterSkills: {
      type: Array,
      required: true,
    },
    characterAtts: {
      type: Object,
      required: true,
    },
    speciesSkills: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      skillApi: new SkillApi(authRequest),

      listOfItems: [],
      editFilter: null,
      editFields: [
        { key: "name", sortable: true },
        { key: "actions", label: "Actions", sortable: false },
        { key: "select", label: "Rank", sortable: true },
      ],
      displayFields: [
        { key: "name", sortable: true },
        { key: "attName", label: "Att", sortable: true },
        { key: "number", label: "Adv", sortable: true },
        { key: "total", label: "Skill", sortable: true },
      ],
      perPage: 50,
      currentPage: 1,
      totalRows: 1,
      editLoading: false,
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    canGenerateSkills() {
      return !!this.speciesSkills.length;
    },
    displayItems() {
      try {
        return this.listOfItems.filter((x) => x.number !== 0);
      } catch {
        return [];
      }
    },
    isValid() {
      return this.listOfItems.reduce((x, y) => x && y.state, true);
    },
  },
  watch: {
    listOfItems() {
      this.totalRows = this.listOfItems.length;
    },
    characterSkills() {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(this.characterSkills);
    },
  },
  methods: {
    addSpeciesSkills() {
      const resolvedSkillGroups = resolveSkillGroups(this.listOfItems);
      const generatedSkills = generateSpeciesSkills(this.speciesSkills, resolvedSkillGroups);

      for (let [genSkillId, genSkillNum] of Object.entries(generatedSkills)) {
        let skillToUpdate = this.listOfItems.find((x) => x.id === genSkillId);
        if (skillToUpdate && skillToUpdate.number < genSkillNum) {
          skillToUpdate.number = genSkillNum;
          this.selectItem(skillToUpdate);
        }
      }
    },
    onSort(ctx) {
      this.sortListOfItems(ctx.sortDesc, ctx.sortBy);
    },
    sortListOfItems(sortDesc, key = "select") {
      if (key !== "select") {
        this.listOfItems.sort(compareStringFn(key));
      } else {
        this.listOfItems.sort(compareNumberFn("number", compareStringFn("name")));
      }
      if (sortDesc) {
        this.listOfItems.reverse();
      }
    },
    clearAll() {
      this.listOfItems.forEach((x) => {
        if (x.number !== 0) {
          x.number = 0;
          this.selectItem(x);
        }
      });
    },
    resetItems(newSkills) {
      this.listOfItems.forEach((x) => {
        x.number = 0;
        x.state = true;
      });
      for (let newSkill of newSkills) {
        let skill = this.listOfItems.find((x) => x.id === newSkill.id);
        if (skill) {
          skill.number = newSkill.number;
        } else {
          // this.$emit("selectedChanged", { id: newSkill.id, number: 0 });
        }
      }
      this.$emit("stateChanged", this.isValid);
      this.sortListOfItems(false);
    },
    getAttValue(attNumber) {
      return this.characterAtts[skillAttributeTypesGroup[attNumber]];
    },
    selectItem(item) {
      item.state = Number.isInteger(item.number) && item.number >= 0 && item.number <= 1000;
      this.$emit("selectedChanged", { id: item.id, number: item.number });
      this.$emit("stateChanged", this.isValid);
    },
    async loadData(reload = false) {
      this.editLoading = true;
      let currentSkills = this.getCurrentSkills();

      let listOfItems = await this.callAndLogoutIfUnauthorized(this.skillApi.listElements)();
      listOfItems = listOfItems.filter((x) => !x.isGroup);
      this.$emit("listOfSkills", JSON.parse(JSON.stringify(listOfItems)));

      for (let skill of listOfItems) {
        skill.name = addSpaces(skill.name, MAX_CHARS);
        skill.description = addSpaces(skill.description, MAX_CHARS);
        skill.number = 0;
        skill.state = true;
        skill.attName = skillAttributeTypesGroup[skill.attribute];
        skill.typeName = skillTypesGroup[skill.type];
      }
      this.listOfItems = listOfItems;

      if (reload) {
        this.resetItems(currentSkills);
      } else {
        this.resetItems(this.characterSkills);
      }

      this.editLoading = false;
    },
    getCurrentSkills() {
      let currentSkills = [];
      for (let item of this.listOfItems) {
        if (item.number > 0) {
          currentSkills.push({ id: item.id, number: item.number });
        }
      }
      return currentSkills;
    },
  },
};
</script>

<style scoped>
.rank {
  min-width: 65px;
}
</style>
