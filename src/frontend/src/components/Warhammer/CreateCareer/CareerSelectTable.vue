<template>
  <div class="career-select-table">
    <b-table
      hover
      :items="displayElements"
      :fields="dispElementFields"
      :responsive="true"
      :sort-by="dispElementFields[2].key"
    >
    </b-table>

    <b-button size="sm" class="mb-2" @click="showSelectionModal" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>

    <b-modal :id="modalId" :title="title" ok-only ok-title="Close" scrollable>
      <b-form-group>
        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="createNew"> Create New </b-button>

        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="loadData">
          <span v-if="elementsLoading" class="spinner-border spinner-border-sm" />
          Reload List
        </b-button>
      </b-form-group>
      <b-form-group>
        <b-input-group>
          <b-form-input v-model="editElementFilter" type="search" id="filterInput" placeholder="Type to Search">
          </b-form-input>
        </b-input-group>
      </b-form-group>

      <p>{{ resultRange }}</p>

      <b-table
        hover
        :items="listOfElements"
        :fields="editElementFields"
        :responsive="true"
        :filter="editElementFilter"
        :no-local-sorting="true"
        :per-page="perPage"
        :current-page="currentPage"
        @filtered="onFiltered"
        @sort-changed="onSort"
      >
        <template v-slot:cell(select)="row">
          <b-form-checkbox v-model="row.item.selected1" @change="selectItem($event, row.item.id, 'level1')">
            <span class="text-nowrap">Level 1</span>
          </b-form-checkbox>

          <b-form-checkbox v-model="row.item.selected2" @change="selectItem($event, row.item.id, 'level2')">
            <span class="text-nowrap">Level 2</span>
          </b-form-checkbox>

          <b-form-checkbox v-model="row.item.selected3" @change="selectItem($event, row.item.id, 'level3')">
            <span class="text-nowrap">Level 3</span>
          </b-form-checkbox>

          <b-form-checkbox v-model="row.item.selected4" @change="selectItem($event, row.item.id, 'level4')">
            <span class="text-nowrap">Level 4</span>
          </b-form-checkbox>
        </template>
      </b-table>

      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
      <p>{{ resultRange }}</p>
    </b-modal>
  </div>
</template>

<script>
import NavHelpers from "../../NavHelpers.vue";
import { addAnyToGroup, addSpaces } from "../../../utils/stringUtils";
import { compareAnyBoolFn, compareStringFn } from "../../../utils/comapreUtils";

const MAX_CHARS = 15;
let uuid = 0;

function formatLevels({ selected1, selected2, selected3, selected4 }) {
  return [selected1, selected2, selected3, selected4]
    .map(function (val, idx) {
      return +val * (idx + 1);
    })
    .filter((x) => x > 0)
    .join(", ");
}

export default {
  name: "CareerSelectTable",
  mixins: [NavHelpers],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    elementApi: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    level1: {
      type: Array,
      required: true,
    },
    level2: {
      type: Array,
      required: true,
    },
    level3: {
      type: Array,
      required: true,
    },
    level4: {
      type: Array,
      required: true,
    },
  },
  beforeCreate() {
    this.modalId = "modify-elements-" + uuid.toString();
    uuid += 1;
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      editElementFilter: null,
      elementsLoading: false,
      dispElementFields: [
        { key: "name", sortable: false },
        { key: "description", sortable: false },
        { key: "levels", sortable: false },
      ],
      editElementFields: [
        { key: "name", sortable: true },
        { key: "description", sortable: false },
        { key: "select", sortable: true },
      ],
      listOfElements: [],
      perPage: 30,
      currentPage: 1,
      totalRows: 1,
    };
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortDesc, ctx.sortBy);
    },
    sortListOfItems(sortDesc, key = "select") {
      if (key !== "select") {
        this.listOfElements.sort(compareStringFn(key));
      } else {
        this.listOfElements.sort(
          compareAnyBoolFn(["selected1", "selected2", "selected3", "selected4"], compareStringFn("name"))
        );
      }
      if (sortDesc) {
        this.listOfElements.reverse();
      }
    },
    showSelectionModal() {
      this.editElementFilter = null;
      this.totalRows = this.listOfElements.length;
      this.currentPage = 1;
      this.sortListOfItems(false);
      this.$bvModal.show(this.modalId);
    },
    async loadData() {
      this.elementsLoading = true;

      let listOfElements = [];
      try {
        listOfElements = await this.callAndLogoutIfUnauthorized(this.elementApi.listElements)();
        listOfElements.forEach((x) => {
          x.selected1 = !!this.level1.includes(x.id);
          x.selected2 = !!this.level2.includes(x.id);
          x.selected3 = !!this.level3.includes(x.id);
          x.selected4 = !!this.level4.includes(x.id);

          x.name = addSpaces(addAnyToGroup(x.name, x.isGroup), MAX_CHARS);
          x.description = addSpaces(x.description, MAX_CHARS);
        });
      } catch (error) {
        this.$emit("apiCallError");
      }
      this.listOfElements = listOfElements;
      this.elementsLoading = false;
      this.sortListOfItems(false);
    },
    createNew() {
      this.$emit("createNewElement");
    },
    selectItem(selected, id, level) {
      const eventName = `update:${level}`;
      if (selected === true) {
        this.$emit(eventName, this[level].concat(id));
      } else if (selected === false) {
        this.$emit(
          eventName,
          this[level].filter((x) => x !== id)
        );
      }
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  computed: {
    displayElements() {
      try {
        return this.listOfElements
          .filter((x) => x.selected1 || x.selected2 || x.selected3 || x.selected4)
          .map(function (x) {
            x.levels = formatLevels(x);
            return x;
          });
      } catch {
        return [];
      }
    },
    resultRange() {
      const beginRange = Math.min(1 + (this.currentPage - 1) * this.perPage, this.totalRows);
      const endRange = Math.min(this.currentPage * this.perPage, this.totalRows);
      return `Results ${beginRange} - ${endRange} of ${this.totalRows}`;
    },
  },
  watch: {
    level1() {
      this.listOfElements.forEach((x) => {
        x.selected1 = !!this.level1.includes(x.id);
      });
    },
    level2() {
      this.listOfElements.forEach((x) => {
        x.selected2 = !!this.level2.includes(x.id);
      });
    },
    level3() {
      this.listOfElements.forEach((x) => {
        x.selected3 = !!this.level3.includes(x.id);
      });
    },
    level4() {
      this.listOfElements.forEach((x) => {
        x.selected4 = !!this.level4.includes(x.id);
      });
    },
    listOfElements() {
      this.totalRows = this.listOfElements.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped></style>
