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

type Item = { id: string; name: string; description: string; selected: boolean };

// The content of a picker popup, in the style of the character sheet: a search row, then the items as a checklist, each
// row a checkbox with the name and description. The items picked when the popup opened (opened changes) are listed
// first under "Selected", the rest under "Available"; ticking a row doesn't move it, so rows don't jump.
const props = defineProps<{
  items: Item[];
  routeName: string;
  opened: number;
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "toggle", value: { id: string; selected: boolean }): void;
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
      matchesEditionFilter(x.id, props.fourEIds, editionFilter.value) &&
      (x.name.toLowerCase().includes(query) || x.description.toLowerCase().includes(query)),
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
  <div>
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
            placeholder="Name or description"
            class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-primary-50"
          />
        </label>
        <div class="flex flex-wrap grow items-center gap-1 p-1 bg-white">
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
            :to="{ name: routeName, params: { id: 'create' } }"
            target="_blank"
            class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm font-medium bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200"
          >
            <Icon icon="lucide:plus" class="size-4" />
            Create new
          </RouterLink>
          <SectionButton icon="lucide:refresh-cw" variant="neutral" :busy="loading" @click="emit('reload')">
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
        <label
          v-for="item in band.items"
          :key="item.id"
          class="flex items-start gap-3 px-2 py-2 border-b border-neutral-300 last:border-b-0 cursor-pointer hover:bg-neutral-100 [content-visibility:auto] [contain-intrinsic-size:auto_4rem]"
          :class="item.selected ? 'bg-primary-50' : 'bg-white'"
        >
          <span class="pt-0.5">
            <SheetCheckbox
              :checked="item.selected"
              :aria-label="item.name"
              @change="emit('toggle', { id: item.id, selected: !item.selected })"
            />
          </span>
          <span class="min-w-0">
            <span class="block">
              <TextLink :routeName="routeName" :params="{ id: item.id }">{{ item.name }}</TextLink>
              <Edition4eBadge v-if="fourEIds?.has(item.id)" />
            </span>
            <span v-if="item.description" class="block text-sm text-neutral-600 wrap-anywhere">
              {{ item.description }}
            </span>
          </span>
        </label>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
