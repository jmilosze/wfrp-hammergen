<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { EditionFilter, matchesEditionFilter } from "../services/wh/core/edition.ts";
import ChecklistRow from "./ChecklistRow.vue";
import { ChecklistItem } from "./checklistItem.ts";
import SectionButton from "./SectionButton.vue";
import SectionLink from "./SectionLink.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";

// The content of a picker popup, in the style of the character sheet: a search row, then the items as a checklist, each
// row a checkbox with the name and description. The items picked when the popup opened (opened changes) are listed
// first under "Selected", the rest under "Available"; ticking a row doesn't move it, so rows don't jump. A repeatable
// item's row has Add at its end and is not ticked by clicking it.
const props = defineProps<{
  items: ChecklistItem[];
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
            <!-- Only the magnifying glass on small screens; the word stays for screen readers. -->
            <span class="sr-only @md:not-sr-only">Search</span>
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
          <SectionLink
            v-if="routeName"
            icon="lucide:plus"
            variant="neutral"
            :routeName="routeName"
            :params="{ id: 'create' }"
            newWindow
          >
            Create new
          </SectionLink>
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
        <ChecklistRow
          v-for="item in band.items"
          :key="item.id"
          :item="item"
          :routeName="routeName"
          :fourEIds="fourEIds"
          :numberLabel="numberLabel"
          :numberStep="numberStep"
          :textLabel="textLabel"
          @toggle="(e) => emit('toggle', e)"
          @add="(id) => emit('add', id)"
          @setNumber="(e) => emit('setNumber', e)"
          @setText="(e) => emit('setText', e)"
          @choose="(e) => emit('choose', e)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
