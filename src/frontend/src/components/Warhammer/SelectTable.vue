<template>
  <div class="select-table">
    <b-table
      hover
      :items="displayElements"
      :fields="dispElementFields"
      :responsive="true"
      :sort-by="dispElementFields[0].key"
    >
    </b-table>
    <b-button size="sm" class="mb-2" @click="showSelectionModal" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>
    <b-modal :id="modalId" :title="title" ok-only ok-title="Close" scrollable>
      <b-form-group>
        <b-button v-if="showCreateNew" variant="secondary" size="sm" class="mr-2 mb-1" @click="createNew">
          Create New
        </b-button>

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
        :items="editElements"
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
          <b-form-checkbox v-model="row.item.selected" @change="selectItem($event, row.item.id)"> </b-form-checkbox>
        </template>
      </b-table>

      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
      <p>{{ resultRange }}</p>
    </b-modal>
  </div>
</template>

<script>
import { addSpaces } from "../../utils/stringUtils";
import { logoutIfUnauthorized } from "../../utils/navigation";

const MAX_CHARS = 15;
let uuid = 0;

export default {
  name: "SelectTable",
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
    filterFunction: {
      type: Function,
      default() {
        return true;
      },
    },
    value: {
      type: Array,
      required: true,
    },
    showCreateNew: {
      type: Boolean,
      default: true,
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
      elementsLoading: false,
      editElementFilter: null,
      dispElementFields: [
        { key: "name", sortable: false },
        { key: "description", sortable: false },
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
  watch: {
    value() {
      this.listOfElements.forEach((x) => {
        x.selected = !!this.value.includes(x.id);
      });
    },
    editElements() {
      this.totalRows = this.editElements.length;
      this.currentPage = 1;
    },
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortBy, ctx.sortDesc);
    },
    sortListOfItems(key, sortDesc) {
      if (key !== "select") {
        this.listOfElements.sort((a, b) => a[key].localeCompare(b[key]));
      } else {
        this.listOfElements.sort((a, b) =>
          a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1
        );
      }
      if (sortDesc) {
        this.listOfElements.reverse();
      }
    },
    showSelectionModal() {
      this.editElementFilter = null;
      this.totalRows = this.editElements.length;
      this.currentPage = 1;
      this.sortListOfItems("select", false);
      this.$bvModal.show(this.modalId);
    },
    loadData: async function () {
      this.elementsLoading = true;

      let listOfElements = [];
      try {
        listOfElements = await logoutIfUnauthorized(this.elementApi.listElements)();
        listOfElements.forEach((x) => {
          x.selected = !!this.value.includes(x.id);
          x.name = addSpaces(x.name, MAX_CHARS);
          x.description = addSpaces(x.description, MAX_CHARS);
        });
      } catch (error) {
        this.$emit("apiCallError");
      }
      this.listOfElements = listOfElements;
      this.elementsLoading = false;

      this.sortListOfItems("select", true);
    },
    createNew() {
      this.$emit("createNewElement");
    },
    selectItem(selected, id) {
      if (selected === true) {
        this.$emit("input", this.value.concat(id));
      } else if (selected === false) {
        this.$emit(
          "input",
          this.value.filter((x) => x !== id)
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
        return this.listOfElements.filter((x) => x.selected);
      } catch {
        return [];
      }
    },
    editElements() {
      try {
        return this.listOfElements.filter(this.filterFunction);
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
};
</script>

<style scoped></style>
