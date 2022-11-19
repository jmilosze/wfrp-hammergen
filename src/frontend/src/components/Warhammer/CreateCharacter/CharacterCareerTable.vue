<template>
  <div class="character-career">
    <b-form-group label="Current Career">
      <div>{{ displayCurrent }}</div>
    </b-form-group>
    <div>Past Careers</div>
    <b-table
      :items="displayPast"
      :fields="displayFields"
      :responsive="true"
      :sort-by="displayFields[0].key"
      thead-class="d-none"
    >
    </b-table>

    <b-modal id="edit-careers" title="Add/Remove Careers" ok-only ok-title="Close" scrollable>
      <b-form-group>
        <b-input-group>
          <b-form-input v-model="editFilter" type="search" id="filterInput" placeholder="Type to Search">
          </b-form-input>
        </b-input-group>
      </b-form-group>

      <p>{{ resultRange }}</p>

      <b-table
        hover
        :items="listOfLevels"
        :fields="editFields"
        :responsive="true"
        :filter="editFilter"
        :no-local-sorting="true"
        :per-page="perPage"
        :current-page="currentPage"
        @sort-changed="onSort"
        @filtered="onFiltered"
        stacked="lg"
      >
        <template #cell(select)="row">
          <b-form-checkbox
            :disabled="row.item.past"
            :checked="row.item.current"
            @change="selectCurrent($event, row.item.id, row.item.number)"
          >
            Current
          </b-form-checkbox>
          <b-form-checkbox
            :disabled="row.item.current"
            :checked="row.item.past"
            @change="selectPast($event, row.item.id, row.item.number)"
          >
            Past
          </b-form-checkbox>
        </template>

        <template #cell(name)="row">
          <b-link :to="'/career/' + row.item.id" target="_blank">{{ row.item.name }}</b-link>
        </template>

        <template #cell(actions)="row">
          <b-button size="sm" @click="row.toggleDetails">
            <div class="text-nowrap">{{ row.detailsShowing ? "Hide" : "Show" }} Details</div>
          </b-button>
        </template>

        <template #row-details="row">
          <dl class="row">
            <dt class="col-sm-4">Class</dt>
            <dd class="col-sm-8">{{ row.item.class }}</dd>

            <dt class="col-sm-4">Species</dt>
            <dd class="col-sm-8">{{ row.item.species }}</dd>
          </dl>
        </template>
      </b-table>

      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
      <p>{{ resultRange }}</p>
    </b-modal>

    <b-button size="sm" class="mb-2" @click="showEdit('edit-careers')" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>
  </div>
</template>

<script>
import TableCommon from "./TableCommon.vue";
import { addSpaces } from "../../../utils/stringUtils";
import { CareerApi, careerClasses } from "../../../services/wh/career";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";
import { species } from "../../../services/wh/character";

const MAX_CHARS = 15;

export default {
  name: "CharacterCareerTable",
  mixins: [TableCommon],
  props: {
    pastCareers: {
      type: Array,
      required: true,
    },
    currentCareer: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      careerApi: new CareerApi(authRequest),

      listOfLevels: [],
      editFilter: null,
      editFields: [
        { key: "name", sortable: true },
        { key: "actions", sortable: false },
        { key: "select", sortable: true },
      ],
      displayFields: [{ key: "name", sortable: false }],
      perPage: 50,
      currentPage: 1,
      totalRows: 1,

      internalCurrentCareer: {},
    };
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortBy, ctx.sortDesc);
    },
    sortListOfItems(key, sortDesc) {
      if (key !== "select") {
        this.listOfLevels.sort((a, b) => a[key].localeCompare(b[key]));
      } else {
        this.listOfLevels.sort((a, b) => {
          return a.current === b.current ? (a.past === b.past ? 0 : a.past ? 1 : -1) : a.current ? 1 : -1;
        });
      }
      if (sortDesc) {
        this.listOfLevels.reverse();
      }
    },
    selectCurrent(selected, id, number) {
      // if there is already other current career selected, deselect it
      if (this.internalCurrentCareer.id) {
        let oldSelected = this.listOfLevels.find(
          (x) => x.id === this.internalCurrentCareer.id && x.number === this.internalCurrentCareer.number
        );
        oldSelected.current = false;
      }

      // if selected is being toggled on, mark a new career as current
      if (selected) {
        let newSelected = this.listOfLevels.find((x) => x.id === id && x.number === number);
        if (!newSelected) {
          newSelected = this.listOfLevels[0];
        }
        newSelected.current = true;
        this.internalCurrentCareer = { id: newSelected.id, number: newSelected.number };
      }
      // if selected is being toggle off, make current as empty
      else {
        this.internalCurrentCareer = {};
      }
      this.$emit("update:currentCareer", Object.assign({}, this.internalCurrentCareer));
      this.$emit("stateChanged", selected);
    },
    selectPast(selected, id, number) {
      let changedItem = this.listOfLevels.find((x) => x.id === id && x.number === number);
      changedItem.past = selected;
      this.$emit("pastCareerChanged", {
        id: id,
        number: number,
        selected: selected,
      });
    },
    resetPast(newPastCareerLevels) {
      this.listOfLevels.forEach((x) => (x.past = false));
      for (let newPast of newPastCareerLevels) {
        let careerLevel = this.listOfLevels.find((x) => x.id === newPast.id && x.number === newPast.number);
        if (careerLevel) {
          careerLevel.past = true;
        } else {
          // Potentially implement cleanup when career/level is not available anymore.
        }
      }
    },
    async loadData() {
      const listOfCareers = await logoutIfUnauthorized(this.careerApi.listElements)();
      this.$emit("listOfCareers", JSON.parse(JSON.stringify(listOfCareers)));
      const listOfLevels = [];
      let idx = 0;
      for (let career of listOfCareers) {
        for (let i of [
          ["levelOne", 1],
          ["levelTwo", 2],
          ["levelThree", 3],
          ["levelFour", 4],
        ]) {
          let lvlName = i[0];
          let lvlNumber = i[1];

          let allowedSpecies = career.species.map((x) => species[x]).join(", ");
          listOfLevels.push({
            id: career.id,
            number: lvlNumber,
            name: addSpaces(`${career.name}  ${lvlNumber} (${career[lvlName].name})`, MAX_CHARS),
            past: false,
            current: false,
            class: careerClasses[career.class],
            species: allowedSpecies,
            idx: idx,
          });
          ++idx;
        }
      }
      this.listOfLevels = listOfLevels;
      this.totalRows = listOfLevels.length;

      this.resetPast(this.pastCareers);
      this.selectCurrent(true, this.currentCareer.id, this.currentCareer.number);

      this.sortListOfItems("select", true);
    },
  },
  computed: {
    displayPast() {
      try {
        return this.listOfLevels.filter((x) => x.past);
      } catch {
        return [];
      }
    },
    displayCurrent() {
      let item = this.listOfLevels.find((x) => x.current);
      return item ? item.name : "";
    },
  },
  watch: {
    pastCareers(newVal) {
      if (this.listOfLevels.length < 1) {
        return;
      }
      this.resetPast(newVal);
    },
    currentCareer(newVal) {
      if (this.listOfLevels.length < 1) {
        return;
      }
      if (this.internalCurrentCareer.id !== newVal.id || this.internalCurrentCareer.number !== newVal.number) {
        if (newVal.id && newVal.number) {
          this.selectCurrent(true, newVal.id, newVal.number);
        } else {
          this.selectCurrent(true, this.listOfLevels[0].id, this.listOfLevels[0].number);
        }
      }
    },
  },
};
</script>

<style scoped></style>
