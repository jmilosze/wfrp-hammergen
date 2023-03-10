<template>
  <div class="mutation-select-table">
    <b-row>
      <b-col>
        <b-table
          hover
          :items="displaySelectedItems"
          :fields="displaySelectedItemsFields"
          :responsive="true"
          :sort-by="displaySelectedItemsFields[0].key"
        >
        </b-table>
      </b-col>
    </b-row>

    <b-button size="sm" class="mb-2 mr-2" @click="showEdit('edit-mutations')" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>

    <b-button size="sm" class="mb-2 mr-2" @click="clearAll" variant="danger" :disabled="disabled"> Clear All </b-button>

    <b-modal id="edit-mutations" title="Add/Remove Mutations" ok-only ok-title="Close" size="lg" scrollable>
      <b-form-group>
        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="$emit('createNew')" :disabled="!canSave">
          Create New
        </b-button>

        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="loadData(true)">
          <span v-if="editLoading" class="spinner-border spinner-border-sm" />
          Reload List
        </b-button>

        <b-form-invalid-feedback :state="canSave" class="mb-2">
          To create new Mutations, correct all invalid form fields.
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
        @filtered="onFiltered"
        @sort-changed="onSort"
        stacked="lg"
      >
        <template #cell(name)="row">
          <b-link :to="'/mutation/' + row.item.id" target="_blank">{{ row.item.name }}</b-link>
        </template>

        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="row.toggleDetails">
            <div class="text-nowrap">{{ row.detailsShowing ? "Hide" : "Show" }} Details</div>
          </b-button>
        </template>

        <template v-slot:cell(select)="row">
          <b-form-checkbox v-model="row.item.selected" @change="selectItem(row.item)"></b-form-checkbox>
        </template>

        <template v-slot:row-details="row">
          <dl class="row">
            <dt class="col-3">Type</dt>
            <dd class="col-3">
              {{ getMutationName(row.item.type) }}
            </dd>
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
import { addSpaces } from "../../../utils/stringUtils";
import { MutationApi, mutationTypes } from "../../../services/wh/mutation";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";
import { sumAndMultModifiers } from "../../../services/wh/characterModifiers";
import { compareBoolFn, compareStringFn } from "../../../utils/comapreUtils";

const MAX_CHARS = 15;

export default {
  name: "CharacterMutationsTable",
  props: {
    selectedItems: {
      type: Array,
      required: true,
    },
  },
  mixins: [TableCommon],
  data() {
    return {
      mutationApi: new MutationApi(authRequest),

      editFilter: null,
      listOfItems: [],
      displaySelectedItemsFields: [{ key: "name", sortable: true }],
      editFields: [
        { key: "name", sortable: true },
        { key: "actions", sortable: false },
        { key: "select", sortable: true },
      ],
      perPage: 50,
      currentPage: 1,
      totalRows: 1,
      editLoading: false,

      mutationsWithModifiers: [],
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    listOfItems() {
      this.totalRows = this.listOfItems.length;
    },
    selectedItems(newVal) {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(newVal);
    },
  },
  computed: {
    displaySelectedItems() {
      try {
        return this.listOfItems.filter((x) => x.selected);
      } catch {
        return [];
      }
    },
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortDesc, ctx.sortBy);
    },
    sortListOfItems(sortDesc, key = "select") {
      if (key !== "select") {
        this.listOfItems.sort(compareStringFn(key));
      } else {
        this.listOfItems.sort(compareBoolFn("selected", compareStringFn("name")));
      }
      if (sortDesc) {
        this.listOfItems.reverse();
      }
    },
    getMutationName(mutationValue) {
      return mutationTypes[mutationValue];
    },
    clearAll() {
      this.listOfItems.forEach((x) => {
        if (x.selected) {
          x.selected = false;
          this.selectItem(x);
        }
      });
    },
    resetItems(newMutations) {
      this.listOfItems.forEach((x) => {
        x.selected = false;
      });
      for (let newMutation of newMutations) {
        let item = this.listOfItems.find((x) => x.id === newMutation);
        if (item) {
          item.selected = true;
        } else {
          // this.$emit("changed", { id: newItem, selected: false });
        }
      }
      let newModifiers = this.calcModifiers();
      this.$emit("modifiersChanged", newModifiers);
      this.sortListOfItems(false);
    },
    selectItem(item) {
      this.$emit("changed", { id: item.id, selected: item.selected });

      if (item.hasModifiers) {
        let newModifiers = this.calcModifiers();
        this.$emit("modifiersChanged", newModifiers);
      }
    },
    calcModifiers() {
      return sumAndMultModifiers(
        this.mutationsWithModifiers.map((m) => ({ multiplier: m.selected ? 1 : 0, modifiers: m.modifiers }))
      );
    },
    async loadData(reload = false) {
      this.editLoading = true;
      let currentMutations = this.getCurrentMutations();

      const listOfItems = await logoutIfUnauthorized(this.mutationApi.listElements)();
      for (let item of listOfItems) {
        item.selected = false;
        item.name = addSpaces(item.name, MAX_CHARS);
        item.description = addSpaces(item.description, MAX_CHARS);

        if (item.hasModifiers === true) {
          this.mutationsWithModifiers.push(item);
        }
      }

      this.listOfItems = listOfItems;

      if (reload) {
        this.resetItems(currentMutations);
      } else {
        this.resetItems(this.selectedItems);
      }

      this.editLoading = false;
    },
    getCurrentMutations() {
      let currentMutations = [];
      for (let item of this.listOfItems) {
        if (item.selected > 0) {
          currentMutations.push(item.id);
        }
      }
      return currentMutations;
    },
  },
};
</script>

<style scoped></style>
