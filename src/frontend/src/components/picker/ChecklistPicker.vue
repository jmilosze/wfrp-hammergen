<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import { NEW_ID } from "@/services/wh/core/entity.ts";
import { computed, ref } from "vue";
import { refDebounced } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { matchesEditions } from "@/services/wh/core/edition.ts";
import ChecklistRow from "./ChecklistRow.vue";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { ChecklistItem } from "./checklistItem.ts";
import AppButton from "@/components/ui/AppButton.vue";
import ButtonLink from "@/components/ui/ButtonLink.vue";
import SpinnerAnimation from "@/components/ui/SpinnerAnimation.vue";
import FilterSections from "@/components/filter/FilterSections.vue";
import { IdFilter, untickUnoffered } from "@/components/filter/contentFilter.ts";
import { FilterSection } from "@/components/filter/filterSection.ts";
import { filterMark, Marks, markList, printMark } from "@/services/wh/character/marks.ts";

// The content of a picker popup, in the style of the character sheet: a search row, then the items as a checklist, each
// row a checkbox with the name and description. The items picked when the popup opened (it is created afresh on each
// opening) are listed first under "Selected", the rest under "Available"; ticking a row doesn't move it, so rows don't
// jump. A repeatable item's row has Add at its end and is not ticked by clicking it. With a filter, 4e content or marks, a
// Filters button opens a panel of the content type's filters (as on its list page), the edition and the marks under the
// search row. The marks (what the character's career, species or class give) are shown in the rows' notes by the caller;
// their filter section also offers Selected (the "Selected" band), so the character's items and e.g. its career's show
// together.
const props = defineProps<{
  items: ChecklistItem[];
  // The items' page: names link to it and Create new and Reload are offered. Without it (e.g. sources) names are text.
  routeName?: RouteName;
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable by edition.
  fourEIds?: Set<string>;
  // The label and step of the number input of number items.
  numberLabel?: string;
  numberStep?: number;
  // The content type's filters over the items' entries (looked up by linkId, else id).
  filter?: IdFilter;
  // What the character's career, species or class give, by item (looked up by linkId, else id).
  marks?: Marks;
}>();

const emit = defineEmits<{
  (e: "toggle", value: { id: string; selected: boolean }): void;
  (e: "add", id: string): void;
  (e: "setNumber", value: { id: string; number: number }): void;
  (e: "choose", value: { id: string; key: string; checked: boolean }): void;
  (e: "reload"): void;
}>();

const SEARCH_DEBOUNCE_MS = 250;

const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, SEARCH_DEBOUNCE_MS);
const pinned = new Set(props.items.filter((x) => x.selected).map((x) => x.id));

const ticked = ref<Record<string, string[]>>({});
const filterOpen = ref(false);
// The edition is a section of the panel like the content type's filters, ahead of them.
const EDITION_SECTION: FilterSection = {
  key: "edition",
  title: "Edition",
  options: [
    { text: "5e", value: "5e" },
    { text: "4e", value: "4e" },
  ],
};
// The marks section offers Selected and the marks some item has (Species for Species (Random) too), after the edition.
const SELECTED_OPTION = "selected";
const marksSection = computed((): FilterSection[] => {
  const marks = props.marks;
  if (marks === undefined) {
    return [];
  }
  const present = new Set(props.items.flatMap((x) => [...(marks.get(x.linkId ?? x.id) ?? [])].map(filterMark)));
  const shown = markList.filter((mark) => present.has(mark));
  return [
    {
      key: "marks",
      title: "Character",
      options: [
        { text: "Selected", value: SELECTED_OPTION },
        ...shown.map((mark) => ({ text: printMark(mark), value: mark })),
      ],
    },
  ];
});
const filterSections = computed(() => [
  ...(props.fourEIds ? [EDITION_SECTION] : []),
  ...marksSection.value,
  ...(props.filter?.sections(ticked.value) ?? []),
]);
untickUnoffered(ticked, filterSections);

const tickedCount = computed(() => Object.values(ticked.value).reduce((sum, values) => sum + values.length, 0));

function matchesMarks(item: ChecklistItem): boolean {
  const values = ticked.value.marks ?? [];
  const itemMarks = props.marks?.get(item.linkId ?? item.id);
  return (
    values.length === 0 ||
    (values.includes(SELECTED_OPTION) && pinned.has(item.id)) ||
    (itemMarks !== undefined && [...itemMarks].some((mark) => values.includes(filterMark(mark))))
  );
}

const shownItems = computed(() => {
  const query = searchTermDebounced.value.toLowerCase();
  return props.items.filter(
    (x) =>
      matchesEditions(x.linkId ?? x.id, props.fourEIds, ticked.value.edition ?? []) &&
      matchesMarks(x) &&
      (props.filter === undefined || props.filter.matches(x.linkId ?? x.id, ticked.value)) &&
      [x.name, x.description, x.note ?? ""].some((text) => text.toLowerCase().includes(query)),
  );
});

const bands = computed(() =>
  [
    { title: "Selected", items: shownItems.value.filter((x) => pinned.has(x.id)) },
    { title: "Available", items: shownItems.value.filter((x) => !pinned.has(x.id)) },
  ].filter((band) => band.items.length > 0),
);
</script>

<template>
  <div class="@container">
    <!-- The search row and the filter panel stay at the top of the popup while the list scrolls, so Filters always shows
    or hides a panel in view. Search takes the spare width; when narrow the buttons wrap below it and their cell fills
    that line. -->
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
            class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-white"
          />
        </label>
        <div v-if="routeName || filterSections.length > 0" class="flex flex-wrap grow items-center gap-1 p-1 bg-white">
          <AppButton
            v-if="filterSections.length > 0"
            icon="lucide:filter"
            variant="neutral"
            :aria-expanded="filterOpen"
            @click="filterOpen = !filterOpen"
          >
            Filters<span v-if="tickedCount > 0"> ({{ tickedCount }})</span>
          </AppButton>
          <ButtonLink
            v-if="routeName"
            icon="lucide:plus"
            variant="neutral"
            :routeName="routeName"
            :params="{ id: NEW_ID }"
            newWindow
          >
            Create new
          </ButtonLink>
          <AppButton
            v-if="routeName"
            icon="lucide:refresh-cw"
            variant="neutral"
            :busy="loading"
            @click="emit('reload')"
          >
            Reload
          </AppButton>
        </div>
      </div>

      <!-- Scrolls on its own when taller than half the screen, so the list stays in view under it; its title row with Clear
      stays at its top. -->
      <div v-if="filterOpen" class="mt-2 max-h-[50svh] overflow-y-auto border border-neutral-400">
        <div
          class="sticky top-0 z-10 flex items-center gap-2 px-3 py-1 bg-neutral-100 border-b border-neutral-300 font-semibold"
        >
          <span class="sticky top-0 z-10 flex-1">Filters</span>
          <button
            v-if="tickedCount > 0"
            type="button"
            class="text-sm font-normal text-neutral-600 transition-colors duration-100 hover:text-neutral-900 cursor-pointer"
            @click="ticked = {}"
          >
            Clear
          </button>
        </div>
        <FilterSections v-model="ticked" :sections="filterSections" />
      </div>
    </div>

    <div v-if="loading && items.length === 0" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else-if="bands.length === 0" class="py-2">No results found.</div>
    <!-- Rows off screen skip layout and painting (content-visibility), sized at a typical row until first shown. -->
    <div v-else class="border border-neutral-400">
      <template v-for="band in bands" :key="band.title">
        <SheetTitle class="border-b border-neutral-300">{{ band.title }}</SheetTitle>
        <ChecklistRow
          v-for="item in band.items"
          :key="item.id"
          :item="item"
          :routeName="routeName"
          :fourEIds="fourEIds"
          :numberLabel="numberLabel"
          :numberStep="numberStep"
          @toggle="(e) => emit('toggle', e)"
          @add="(id) => emit('add', id)"
          @setNumber="(e) => emit('setNumber', e)"
          @choose="(e) => emit('choose', e)"
        />
      </template>
    </div>
  </div>
</template>
