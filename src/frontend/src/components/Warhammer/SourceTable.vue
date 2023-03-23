<template>
  <div>
    <div class="mb-2">Source</div>
    <b-table :items="displayTable" :fields="displayTableFields"></b-table>
    <b-button size="sm" class="mb-2" variant="primary" @click="showModal">Modify</b-button>
    <b-modal v-model="modal" title="Modify Sources" ok-only ok-title="Close" scrollable>
      <b-table
        hover
        :items="editTable"
        :fields="editTableFields"
        :responsive="true"
        :no-local-sorting="true"
        @sort-changed="onSort"
      >
        <template v-slot:cell(select)="row">
          <b-form-checkbox v-model="row.item.select"> </b-form-checkbox>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { getAllSources } from "../../services/wh/sources";
import { compareBoolFn, compareStringFn } from "../../utils/comapreUtils";

const props = defineProps({
  initialSources: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emits = defineEmits(["update"]);

const modal = ref(false);
function showModal() {
  sortWithSelect(editTable.value, "select", false);
  modal.value = true;
}

function sortWithSelect(table, key, sortDesc) {
  if (key !== "select") {
    table.sort(compareStringFn(key));
  } else {
    table.sort(compareBoolFn("select", compareStringFn("name")));
  }
  if (sortDesc) {
    table.reverse();
  }
}

const editTable = ref(
  getAllSources().map((x) => {
    return {
      name: x.name,
      source: x.source,
      notes: "",
      select: false,
    };
  })
);

const editTableFields = ref([
  { key: "name", label: "Name", sortable: true },
  { key: "notes", label: "Notes", sortable: true },
  { key: "select", label: "Select", sortable: true },
]);

const displayTable = ref([]);

const displayTableFields = ref([
  { key: "name", label: "Name" },
  { key: "notes", label: "Notes" },
]);

watch(
  () => props.initialSources,
  (initialSources) => {
    for (let item of editTable.value) {
      if (Object.hasOwn(initialSources, item.source)) {
        item.select = true;
        item.notes = initialSources[item.source];

        displayTable.value.push({ source: item.source, name: item.name, notes: item.notes });
      }
    }
  }
);

function onSort(ctx) {
  sortWithSelect(editTable.value, ctx.sortBy, ctx.sortDesc);
}
</script>

<style scoped></style>
