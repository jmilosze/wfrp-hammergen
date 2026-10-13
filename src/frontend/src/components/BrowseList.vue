<script setup lang="ts" generic="T extends BrowseRow">
import { computed, nextTick, ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import TablePagination from "./TablePagination.vue";
import { BrowseRow } from "./browseRow.ts";

// A browse page's list as an index: each row has the name (a link to the entry) with a short meta line after it (e.g.
// the type) and the badge slot (e.g. the visibility icon) after it, the description under it, and the end slot (e.g.
// Copy) at the row's end. The whole row opens the entry. A search field (the default slot holds buttons beside it)
// and pages of 50 rows.
const props = defineProps<{ items: T[]; routeName: string }>();

const searchTerm = defineModel<string>({ required: true });

const SEARCH_DEBOUNCE_MS = 250;
const ROWS_PER_PAGE = 50;

const searchTermDebounced = refDebounced(searchTerm, SEARCH_DEBOUNCE_MS);
const startRow = ref(0);

const searchedItems = computed(() => {
  const query = searchTermDebounced.value.toLowerCase();
  if (query === "") {
    return props.items;
  }
  return props.items.filter((x) => [x.name, x.meta, x.description].some((text) => text.toLowerCase().includes(query)));
});

const itemsOnPage = computed(() => searchedItems.value.slice(startRow.value, startRow.value + ROWS_PER_PAGE));

watch([searchTermDebounced, () => props.items], () => {
  startRow.value = 0;
});

const topPagination = ref<HTMLDivElement | null>(null);
const SCROLL_GAP = 8;

// The top pager changes the page where it is. The bottom pager scrolls so the top pager shows just under the site's
// sticky header, where the new page starts.
async function onBottomPageChange() {
  await nextTick();
  const header = document.querySelector("header");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const top = topPagination.value?.getBoundingClientRect().top ?? 0;
  window.scrollTo({ top: window.scrollY + top - headerHeight - SCROLL_GAP });
}
</script>

<template>
  <div class="@container">
    <div class="flex flex-wrap items-stretch gap-2">
      <label
        class="flex flex-[999_1_0%] min-w-60 border border-neutral-400 bg-white focus-within:outline-2 focus-within:-outline-offset-2 outline-neutral-700"
      >
        <span class="flex items-center gap-1 px-2 border-r border-neutral-300 font-semibold">
          <Icon icon="lucide:search" class="size-4" />
          <!-- Only the magnifying glass on small screens; the word stays for screen readers. -->
          <span class="sr-only @md:not-sr-only">Search</span>
        </span>
        <input v-model="searchTerm" type="text" class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-primary-50" />
      </label>
      <div v-if="$slots.default" class="contents">
        <slot />
      </div>
    </div>

    <div v-if="searchedItems.length > ROWS_PER_PAGE" ref="topPagination" class="mt-3">
      <TablePagination v-model="startRow" :totalRows="searchedItems.length" :rowsPerPage="ROWS_PER_PAGE" />
    </div>
    <ul v-if="searchedItems.length > 0" class="mt-3 list-none m-0 p-0 bg-white border border-neutral-300 rounded-lg">
      <li
        v-for="item in itemsOnPage"
        :key="item.id"
        class="relative flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 border-b border-neutral-200 last:border-b-0 hover:bg-neutral-100"
      >
        <div class="flex-1 min-w-48">
          <!-- The link covers the whole row (after:), so the row opens the entry; the end slot sits above it. -->
          <RouterLink
            :to="{ name: routeName, params: { id: item.id } }"
            class="font-semibold text-danger-800 hover:underline after:absolute after:inset-0"
          >
            {{ item.name }}
          </RouterLink>
          <span v-if="item.meta" class="text-sm text-neutral-600"> · {{ item.meta }}</span>
          <span v-if="$slots.badge" class="text-sm text-neutral-600"> · <slot name="badge" v-bind="item" /></span>
          <div v-if="item.description" class="text-sm text-neutral-600 line-clamp-2 wrap-anywhere">
            {{ item.description }}
          </div>
        </div>
        <div class="relative z-10 flex items-center gap-2 shrink-0">
          <slot name="end" v-bind="item" />
        </div>
      </li>
    </ul>
    <div v-else class="mt-3">No results found.</div>
    <TablePagination
      v-if="searchedItems.length > ROWS_PER_PAGE"
      v-model="startRow"
      :totalRows="searchedItems.length"
      :rowsPerPage="ROWS_PER_PAGE"
      class="mt-3"
      @update:modelValue="onBottomPageChange"
    />
  </div>
</template>

<style scoped></style>
