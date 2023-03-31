<template>
  <div>
    <div class="mb-2">Source</div>
    <b-table :items="displayTable" :fields="displayTableFields"></b-table>
    <b-form-invalid-feedback :state="allValid">One or more selected sources are invalid.</b-form-invalid-feedback>
    <b-button size="sm" class="mb-2 mt-2" variant="primary" @click="showModal" :disabled="props.disabled"
      >Modify</b-button
    >
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
          <b-form-checkbox v-model="row.item.select"></b-form-checkbox>
        </template>

        <template v-slot:cell(notes)="row">
          <b-form-group>
            <b-form-input v-model="row.item.notes" @input="validNotes(row.item)" type="text"> </b-form-input>
            <b-form-invalid-feedback :state="row.item.valid">{{ row.item.validMsg }}</b-form-invalid-feedback>
          </b-form-group>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { getAllSources } from "../../services/wh/sources";
import { compareBoolFn, compareStringFn } from "../../utils/comapreUtils";
import { validWhVeryShortDesc } from "../../utils/validation/wh";
import { compareObjects } from "../../utils/objectUtils";

const props = defineProps({
  value: {
    type: Object,
    default() {
      return {};
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["input", "isValid"]);

const modal = ref(false);
const editTable = ref(
  getAllSources().map((x) => {
    return {
      name: x.name,
      source: x.source,
      notes: "",
      select: false,
      valid: true,
      validMsg: "",
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
const allValid = ref(true);

function showModal() {
  sortWithSelect(editTable.value, "select", false);
  modal.value = true;
}
function validNotes(item) {
  [item.valid, item.validMsg] = validWhVeryShortDesc(item.notes);
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
function onSort(ctx) {
  sortWithSelect(editTable.value, ctx.sortBy, ctx.sortDesc);
}

watch(
  () => modal.value,
  (newVal) => {
    if (newVal === false) {
      displayTable.value = [];
      allValid.value = true;
      const updatedSources = {};
      for (let item of editTable.value) {
        if (item.select) {
          displayTable.value.push({ name: item.name, notes: item.notes });
          allValid.value = allValid.value && item.valid;
          updatedSources[item.source] = item.notes;
        }
      }

      emits("isValid", allValid.value);
      emits("input", updatedSources);
      displayTable.value.sort(compareStringFn("name"));
    }
  }
);
watch(
  () => props.value,
  (newSources, prevSources) => {
    if (compareObjects(newSources, prevSources)) {
      return;
    }
    displayTable.value = [];
    allValid.value = true;
    for (let item of editTable.value) {
      if (Object.hasOwn(newSources, item.source)) {
        item.select = true;
        item.notes = newSources[item.source];
        validNotes(item);

        displayTable.value.push({ name: item.name, notes: item.notes });
      } else {
        item.select = false;
        item.notes = "";
        item.valid = true;
        item.validMsg = "";
      }

      allValid.value = allValid.value && item.valid;
    }
    emits("isValid", allValid.value);
    displayTable.value.sort(compareStringFn("name"));
  }
);
</script>

<style scoped></style>
