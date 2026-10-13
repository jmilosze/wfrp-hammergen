<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { EditionFilter, matchesEditionFilter } from "../services/wh/core/edition.ts";
import SheetCheckbox from "./SheetCheckbox.vue";
import SectionButton from "./SectionButton.vue";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";

// repeatable: picked any number of times (e.g. a creature trait with a value), with Add instead of a checkbox; count is
// how many times it is picked. number: picked with a number (e.g. skill advances) typed in instead of ticked; 0 is not
// picked. note: a short line under the description (e.g. a skill's type and characteristic). text: a text typed in next
// to the checkbox (e.g. a source's page numbers), with textError shown under it when invalid. choices: several labelled
// checkboxes at the row's end instead of one (e.g. a career level's Current and Past). linkId: the id of the item's page
// when it differs from id (e.g. the career of a career level).
type Choice = { key: string; label: string; checked: boolean; disabled?: boolean };
type Item = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  repeatable?: boolean;
  count?: number;
  number?: number;
  note?: string;
  text?: string;
  textError?: string;
  choices?: Choice[];
  linkId?: string;
};

// The content of a picker popup, in the style of the character sheet: a search row, then the items as a checklist, each
// row a checkbox with the name and description. The items picked when the popup opened (opened changes) are listed
// first under "Selected", the rest under "Available"; ticking a row doesn't move it, so rows don't jump. A repeatable
// item's row has Add at its end and is not ticked by clicking it.
const props = defineProps<{
  items: Item[];
  // The items' page: names link to it and Create new and Reload are offered. Without it (e.g. sources) names are text.
  routeName?: string;
  opened: number;
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
  // The label and step of the number input of number items.
  numberLabel?: string;
  numberStep?: number;
  // The label of the text input of text items.
  textLabel?: string;
}>();

const emit = defineEmits<{
  (e: "toggle", value: { id: string; selected: boolean }): void;
  (e: "add", id: string): void;
  (e: "setNumber", value: { id: string; number: number }): void;
  (e: "setText", value: { id: string; text: string }): void;
  (e: "choose", value: { id: string; key: string; checked: boolean }): void;
  (e: "reload"): void;
}>();

const SEARCH_DEBOUNCE_MS = 250;

const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, SEARCH_DEBOUNCE_MS);
const editionFilter = ref<EditionFilter>("both");
const pinned = ref(new Set<string>());

watch(
  () => props.opened,
  () => {
    searchTerm.value = "";
    pinned.value = new Set(props.items.filter((x) => x.selected).map((x) => x.id));
  },
  { immediate: true },
);

const shownItems = computed(() => {
  const query = searchTermDebounced.value.toLowerCase();
  return props.items.filter(
    (x) =>
      matchesEditionFilter(x.linkId ?? x.id, props.fourEIds, editionFilter.value) &&
      [x.name, x.description, x.note ?? ""].some((text) => text.toLowerCase().includes(query)),
  );
});

const bands = computed(() =>
  [
    { title: "Selected", items: shownItems.value.filter((x) => pinned.value.has(x.id)) },
    { title: "Available", items: shownItems.value.filter((x) => !pinned.value.has(x.id)) },
  ].filter((band) => band.items.length > 0),
);

// A row is ticked by clicking anywhere on it, unless it has an Add button or several checkboxes.
function clickable(item: Item): boolean {
  return !item.repeatable && !item.choices;
}

// An emptied number input gives NaN, which validation then reports.
function onNumberInput(id: string, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  emit("setNumber", { id: id, number: event.target.value === "" ? Number.NaN : Number(event.target.value) });
}

function onTextInput(id: string, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  emit("setText", { id: id, text: event.target.value });
}

const EDITION_FILTER_OPTIONS: { text: string; value: EditionFilter }[] = [
  { text: "5e and 4e", value: "both" },
  { text: "5e only", value: "5e" },
  { text: "4e only", value: "4e" },
];
</script>

<template>
  <div class="@container">
    <!-- The search row stays at the top of the popup while the list scrolls. Search takes the spare width; when narrow
    the buttons wrap below it and their cell fills that line. -->
    <div class="sticky -top-3 z-10 -mt-3 pt-3 pb-2 bg-white">
      <div class="flex flex-wrap gap-px border border-neutral-400 bg-neutral-300">
        <label
          class="flex flex-[999_1_0%] min-w-72 bg-white focus-within:outline-2 focus-within:-outline-offset-2 outline-neutral-700"
        >
          <span class="flex items-center gap-1 px-2 border-r border-neutral-300 font-semibold">
            <Icon icon="lucide:search" class="size-4" />
            Search
          </span>
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="items.some((x) => x.description) ? 'Name or description' : 'Name'"
            class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-primary-50"
          />
        </label>
        <div v-if="routeName || fourEIds" class="flex flex-wrap grow items-center gap-1 p-1 bg-white">
          <select
            v-if="fourEIds"
            v-model="editionFilter"
            aria-label="Show content of edition"
            class="rounded border border-neutral-400 px-2 py-1 text-sm bg-white cursor-pointer"
          >
            <option v-for="option in EDITION_FILTER_OPTIONS" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <RouterLink
            v-if="routeName"
            :to="{ name: routeName, params: { id: 'create' } }"
            target="_blank"
            class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm font-medium bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200"
          >
            <Icon icon="lucide:plus" class="size-4" />
            Create new
          </RouterLink>
          <SectionButton
            v-if="routeName"
            icon="lucide:refresh-cw"
            variant="neutral"
            :busy="loading"
            @click="emit('reload')"
          >
            Reload
          </SectionButton>
        </div>
      </div>
    </div>

    <div v-if="loading && items.length === 0" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else-if="bands.length === 0" class="py-2">No results found.</div>
    <!-- Rows off screen skip layout and painting (content-visibility), sized at a typical row until first shown. -->
    <div v-else class="border border-neutral-400">
      <template v-for="band in bands" :key="band.title">
        <div
          class="px-2 py-1 bg-neutral-200 border-b border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-600 select-none"
        >
          {{ band.title }}
        </div>
        <component
          :is="clickable(item) ? 'label' : 'div'"
          v-for="item in band.items"
          :key="item.id"
          class="flex items-start gap-3 px-2 py-2 border-b border-neutral-300 last:border-b-0 [content-visibility:auto] [contain-intrinsic-size:auto_4rem]"
          :class="[
            item.selected ? 'bg-primary-50' : 'bg-white',
            { 'cursor-pointer hover:bg-neutral-100': clickable(item) },
          ]"
        >
          <span class="pt-0.5">
            <!-- Repeatable and number rows keep the checkbox's space, so the names line up. -->
            <span v-if="item.repeatable || item.number !== undefined || item.choices" class="block size-5" />
            <SheetCheckbox
              v-else
              :checked="item.selected"
              :aria-label="item.name"
              @change="emit('toggle', { id: item.id, selected: !item.selected })"
            />
          </span>
          <span class="flex-1 min-w-0">
            <span class="block">
              <TextLink v-if="routeName" :routeName="routeName" :params="{ id: item.linkId ?? item.id }">{{
                item.name
              }}</TextLink>
              <span v-else class="font-semibold">{{ item.name }}</span>
              <Edition4eBadge v-if="fourEIds?.has(item.linkId ?? item.id)" />
            </span>
            <span v-if="item.description" class="block text-sm text-neutral-600 wrap-anywhere">
              {{ item.description }}
            </span>
            <span v-if="item.note" class="block text-sm font-semibold text-neutral-700">{{ item.note }}</span>
          </span>
          <span v-if="item.number !== undefined" class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-semibold">{{ numberLabel }}</span>
            <input
              :value="item.number"
              type="number"
              :step="numberStep"
              :aria-label="`${numberLabel} ${item.name}`"
              class="w-16 min-h-8 px-2 border border-neutral-400 rounded-sm bg-primary-50 outline-neutral-700 focus:outline-2"
              @input="onNumberInput(item.id, $event)"
            />
          </span>
          <span v-if="item.text !== undefined" class="flex flex-col shrink-0 w-40 @sm:w-56">
            <span class="flex items-center gap-2">
              <span class="text-sm font-semibold">{{ textLabel }}</span>
              <input
                :value="item.text"
                type="text"
                :aria-label="`${textLabel} ${item.name}`"
                :aria-invalid="item.textError ? 'true' : undefined"
                class="flex-1 min-w-0 min-h-8 px-2 border border-neutral-400 rounded-sm bg-primary-50 outline-neutral-700 focus:outline-2"
                @input="onTextInput(item.id, $event)"
              />
            </span>
            <span v-if="item.textError" role="alert" class="text-sm text-danger-600">{{ item.textError }}</span>
          </span>
          <span v-if="item.choices" class="flex items-center gap-3 shrink-0 self-center">
            <label
              v-for="choice in item.choices"
              :key="choice.key"
              class="flex items-center gap-1 text-sm font-semibold"
              :class="choice.disabled ? 'text-neutral-400' : 'cursor-pointer'"
            >
              <SheetCheckbox
                :checked="choice.checked"
                :disabled="choice.disabled"
                @change="emit('choose', { id: item.id, key: choice.key, checked: !choice.checked })"
              />
              {{ choice.label }}
            </label>
          </span>
          <span v-if="item.repeatable" class="flex items-center gap-2 shrink-0">
            <span v-if="item.count" class="font-semibold">×{{ item.count }}</span>
            <SectionButton icon="lucide:plus" :aria-label="`Add ${item.name}`" @click="emit('add', item.id)">
              Add
            </SectionButton>
          </span>
        </component>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
