<template>
  <div class="list-template">
    <div class="d-flex align-items-center mb-3">
      <b-button
        v-if="authStore.loggedIn"
        variant="primary"
        class="mr-2 text-nowrap"
        :to="{ name: elementType, params: { id: 'create' } }"
      >
        Create New
      </b-button>

      <label class="sr-only" for="filterInput">Search</label>
      <b-input-group>
        <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Type to Search"></b-form-input>
      </b-input-group>
    </div>

    <p>{{ resultRange }}</p>

    <b-row>
      <b-col>
        <b-table
          hover
          :items="listOfElements"
          :fields="displayFields"
          :filter="filter"
          :responsive="true"
          sort-by="name"
          :per-page="perPage"
          :current-page="currentPage"
          @filtered="onFiltered"
          stacked="md"
        >
          <template v-slot:cell(actions)="row">
            <span class="text-nowrap">
              <b-button
                v-if="elementType !== 'character' || (elementType === 'character' && row.item.canEdit)"
                variant="primary"
                :to="{ name: elementType, params: { id: row.item.id } }"
                size="sm"
                class="mr-2 mb-1"
              >
                {{ showViewEditLabel(row.item) }}
              </b-button>

              <b-button
                v-if="elementType === 'character'"
                :to="{ name: 'viewCharacter', params: { id: row.item.id } }"
                size="sm"
                class="mr-2 mb-1"
                variant="primary"
              >
                View
              </b-button>

              <b-button variant="info" size="sm" class="mr-2 mb-1" @click="copyItem(row.item.id)"> Copy </b-button>

              <b-button
                v-if="row.item.canEdit"
                variant="danger"
                size="sm"
                class="mb-1"
                @click="showDeleteModal(row.item.id)"
              >
                Delete
              </b-button>
            </span>
          </template>
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
        <p>{{ resultRange }}</p>
      </b-col>
    </b-row>

    <b-modal id="deleteModal" title="Delete Item Property" ok-variant="danger" ok-title="Delete" @ok="deleteItem">
      <div>Are you sure you want to delete {{ this.deleteData.name }}?</div>
    </b-modal>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "../../../stores/auth";

export default {
  name: "ElementList",
  props: {
    displayFields: {
      type: Array,
      required: true,
    },
    listOfElements: {
      type: Array,
      required: true,
    },
    elementType: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      deleteData: {
        index: null,
        name: "",
        id: "",
      },
      filter: null,
      perPage: 100,
      currentPage: 1,
      filteredItemsLength: 100000,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    resultRange: function () {
      const beginRange = Math.min(1 + (this.currentPage - 1) * this.perPage, this.totalRows);
      const endRange = Math.min(this.currentPage * this.perPage, this.totalRows);
      return `Results ${beginRange} - ${endRange} of ${this.totalRows}`;
    },
    totalRows: function () {
      return this.listOfElements.length < this.filteredItemsLength
        ? this.listOfElements.length
        : this.filteredItemsLength;
    },
  },
  methods: {
    onFiltered: function (filteredItems) {
      this.filteredItemsLength = filteredItems.length;
      this.currentPage = 1;
    },
    showViewEditLabel: function (item) {
      if (this.elementType === "character") {
        return "Edit";
      } else {
        return item.canEdit ? "View/Edit" : "View";
      }
    },
    showDeleteModal(id) {
      this.deleteData.index = this.listOfElements
        .map(function (x) {
          return x.id;
        })
        .indexOf(id);
      this.deleteData.name = this.listOfElements[this.deleteData.index].name;
      this.deleteData.id = id;
      this.$bvModal.show("deleteModal");
    },
    deleteItem() {
      this.$emit("elementDeleted", this.deleteData.index);
    },
    copyItem(id) {
      let index = -1;

      for (let i = 0; i < this.listOfElements.length; i++) {
        if (this.listOfElements[i].id === id) {
          index = i;
          break;
        }
      }

      this.$emit("elementCopied", index);
    },
  },
};
</script>

<style scoped></style>
