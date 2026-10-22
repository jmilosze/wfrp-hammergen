<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import AppButton from "@/components/ui/AppButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import SheetList from "@/components/sheet/SheetList.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import CareerTrappingsHelp from "./CareerTrappingsHelp.vue";
import { ChecklistItem } from "@/components/picker/checklistItem.ts";
import { IdFilter } from "@/components/filter/contentFilter.ts";
import {
  CareerTrapping,
  CareerTrappingEntry,
  copyCareerTrappingEntries,
  validateCareerTrappings,
} from "@/services/wh/content/careerTrapping.ts";
import { MAX_ITEM_VALUE_LENGTH, printItemWithValue } from "@/utils/idNumberValue.ts";

// A popup to edit one trappings entry of a career level: its options, each a table of trappings with a quantity (a
// number or dice) and a note. + Trapping adds trappings to an option through the item picker, + Option adds an option
// the player can choose instead (an entry with several options is a choice). The popup edits a copy of the entry; Save
// emits it and closes, Cancel or closing leaves the entry as it was. Removing the last trapping of an option removes
// the option.
const props = defineProps<{
  entry: CareerTrappingEntry;
  // The trappings the picker offers, and the names of those in the entry.
  pickerItems: Omit<ChecklistItem, "selected">[];
  nameOf: (id: string) => string;
  filter?: IdFilter;
  loading?: boolean;
}>();

const open = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{
  (e: "save", value: CareerTrappingEntry): void;
  (e: "reload"): void;
}>();

const draft = ref<CareerTrappingEntry>({ options: [] });

watch(open, (isOpen) => {
  if (isOpen) {
    draft.value = copyCareerTrappingEntries([props.entry])[0];
  }
});

const validation = computed(() => validateCareerTrappings("Trappings", [draft.value], []));

function optionTitle(index: number): string {
  return draft.value.options.length > 1 ? `Option ${index + 1}` : "Trappings";
}

// The inputs fill their table cells, like the bare inputs of the sheet.
const CELL_INPUT_CLASS =
  "block w-full h-10 px-2 bg-editable outline-neutral-700 focus:outline-2 focus:-outline-offset-2";

function inputValue(event: Event): string {
  return event.target instanceof HTMLInputElement ? event.target.value : "";
}

function updateTrapping(option: number, index: number, update: Partial<CareerTrapping>) {
  Object.assign(draft.value.options[option][index], update);
}

function removeTrapping(option: number, index: number) {
  draft.value.options[option].splice(index, 1);
  if (draft.value.options[option].length === 0) {
    draft.value.options.splice(option, 1);
  }
}

// The picker adds to one option, or to a new one (+ Option); a new option is kept only once something is added to it.
const pickerOpen = ref(false);
const pickerOption = ref(0);

function openPicker(option: number) {
  pickerOption.value = option;
  pickerOpen.value = true;
}

const pickerRows = computed<ChecklistItem[]>(() => {
  const option = pickerOption.value;
  return props.pickerItems.map((x) => ({
    ...x,
    repeatable: true,
    get count() {
      return (draft.value.options[option] ?? []).filter((t) => t.id === x.id).length;
    },
    get selected() {
      return (draft.value.options[option] ?? []).some((t) => t.id === x.id);
    },
  }));
});

function addTrapping(id: string) {
  const option = pickerOption.value;
  if (option === draft.value.options.length) {
    draft.value.options.push([]);
  }
  draft.value.options[option].push({ id: id, number: "1", value: "" });
}

function save() {
  emit("save", draft.value);
  open.value = false;
}
</script>

<template>
  <ModalWindow v-model:open="open" size="md">
    <template #header>
      <span class="flex items-center gap-2">Edit trappings <CareerTrappingsHelp /></span>
    </template>
    <div class="flex flex-col gap-3">
      <SheetList v-for="(option, o) in draft.options" :key="o" :title="optionTitle(o)" editable class="min-w-0">
        <template #actions>
          <AppButton icon="lucide:plus" @click="openPicker(o)">Trapping</AppButton>
        </template>
        <template #headers>
          <th class="py-1 px-2 border-b border-neutral-300 font-normal">Quantity</th>
          <th class="py-1 px-2 border-b border-neutral-300 font-normal">Note</th>
          <th class="border-b border-neutral-300" />
        </template>
        <tr v-for="(trapping, t) in option" :key="t">
          <td class="px-2 border-b border-r border-neutral-300">{{ nameOf(trapping.id) }}</td>
          <td class="p-0 w-24 border-b border-r border-neutral-300">
            <input
              :value="trapping.number"
              type="text"
              :aria-label="`Quantity of ${nameOf(trapping.id)}`"
              :class="CELL_INPUT_CLASS"
              @input="updateTrapping(o, t, { number: inputValue($event).trim() })"
            />
          </td>
          <td class="p-0 w-40 border-b border-r border-neutral-300">
            <input
              :value="trapping.value"
              type="text"
              :maxlength="MAX_ITEM_VALUE_LENGTH"
              :aria-label="`Note for ${nameOf(trapping.id)}`"
              :class="CELL_INPUT_CLASS"
              @input="updateTrapping(o, t, { value: inputValue($event) })"
            />
          </td>
          <td class="w-0 px-1 border-b border-neutral-300">
            <IconButton
              icon="lucide:x"
              size="lg"
              :label="`Remove ${printItemWithValue(nameOf(trapping.id), trapping.value)}`"
              @click="removeTrapping(o, t)"
            />
          </td>
        </tr>
      </SheetList>
      <div>
        <AppButton icon="lucide:plus" variant="neutral" @click="openPicker(draft.options.length)">Option</AppButton>
      </div>
      <p class="font-sans text-xs text-neutral-600">
        Quantity: a number or dice, e.g. 10, 1d10 or 2d6+3. Note: at most {{ MAX_ITEM_VALUE_LENGTH }} characters, e.g.
        "Sickle" or "with a Footman"; it goes onto the character's trapping. Several options are a choice of one.
      </p>
      <div v-if="!validation.valid" class="text-sm text-error">{{ validation.message }}</div>
    </div>
    <template #buttons>
      <div class="flex justify-end gap-2">
        <AppButton icon="lucide:x" variant="neutral" @click="open = false">Cancel</AppButton>
        <AppButton icon="lucide:check" :disabled="!validation.valid" @click="save">Save</AppButton>
      </div>
    </template>
    <ModalWindow v-model:open="pickerOpen" size="lg" fullHeight>
      <template #header>
        <span class="flex items-center gap-2">Add trappings <CareerTrappingsHelp /></span>
      </template>
      <ChecklistPicker
        :items="pickerRows"
        routeName="item"
        :loading="loading"
        :filter="filter"
        @add="addTrapping"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </ModalWindow>
</template>
