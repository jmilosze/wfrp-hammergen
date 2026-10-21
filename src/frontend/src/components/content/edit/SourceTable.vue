<script setup lang="ts">
import { computed, ref } from "vue";
import { source, sourcesByEdition, sourceIsValid } from "@/services/wh/core/source.ts";
import { Edition } from "@/services/wh/core/edition.ts";
import { VERY_SHORT_DESC_LENGTH } from "@/services/wh/core/validators.ts";
import { setValidationStatus } from "@/utils/validation.ts";
import SelectIdValueTable from "@/components/picker/SelectIdValueTable.vue";

// The entry's sources (source id to page notes), read directly (the parent changes them on the emitted events). Shown
// as the qualities and flaws of a trapping are: the popup only picks sources, and a source's notes are typed in its
// row of the table.
const props = defineProps<{ sources: Record<string, string>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; notes: string; selected: boolean }): void;
}>();

// The notes of sources unticked here, so ticking one again brings its notes back.
const keptNotes = ref<Record<string, string>>({});

// The edition's sources; every one takes notes.
const sourceList = computed(() =>
  sourcesByEdition[props.edition].map((id) => ({ id: id, name: source[id], description: "", hasValue: true })),
);

const selected = computed(() => Object.entries(props.sources).map(([id, notes]) => ({ id: id, value: notes })));

const validationStatus = computed(() =>
  setValidationStatus(sourceIsValid(props.sources), "Some of the sources are invalid."),
);

function setSelected(id: string, isSelected: boolean) {
  const notes = props.sources[id] ?? keptNotes.value[id] ?? "";
  if (!isSelected) {
    keptNotes.value[id] = notes;
  }
  emit("selected", { id: id, notes: notes, selected: isSelected });
}
</script>

<template>
  <SelectIdValueTable
    :disabled="disabled"
    :selected="selected"
    :itemList="sourceList"
    title="Sources"
    modalTitle="Edit sources"
    :maxlength="VERY_SHORT_DESC_LENGTH"
    :validationStatus="validationStatus"
    disableDescription
    @remove="(e) => setSelected(e.id, false)"
    @selected="(e) => setSelected(e.id, e.selected)"
    @updateValue="(e) => emit('selected', { id: e.id, notes: e.value, selected: true })"
  />
</template>
