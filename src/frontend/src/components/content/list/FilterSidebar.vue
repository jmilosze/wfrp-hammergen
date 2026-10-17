<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import AppButton from "@/components/ui/AppButton.vue";
import FilterSections from "@/components/filter/FilterSections.vue";
import { FilterSection } from "@/components/filter/filterSection.ts";

// The filters of a browse list, as a column of collapsible sections of checkboxes (FilterSections). On narrow screens
// the column is a drawer opened from a "Filters" button. Widths follow the page (the named page container).
const selected = defineModel<Record<string, string[]>>({ required: true });

const props = defineProps<{ sections: FilterSection[] }>();

const drawerOpen = ref(false);

const activeCount = computed(() => Object.values(selected.value).reduce((sum, values) => sum + values.length, 0));

function clear() {
  selected.value = Object.fromEntries(props.sections.map((x) => [x.key, []]));
}
</script>

<template>
  <!-- On narrow screens: the Filters button, with the page's actions (the slot, e.g. Create new) beside it on very small ones. -->
  <div class="flex items-stretch gap-2 @3xl/page:hidden">
    <AppButton icon="lucide:filter" variant="dark" @click="drawerOpen = true">
      Filters<span v-if="activeCount > 0"> ({{ activeCount }})</span>
    </AppButton>
    <!-- Only on very small screens; above that the page shows its actions elsewhere (e.g. beside the search). -->
    <div class="flex items-stretch gap-2 @md/page:hidden">
      <slot name="actions" />
    </div>
  </div>
  <!-- A drawer over the page on narrow screens, sliding in from the left like the navigation drawer (the shade fades,
  and the closed drawer is hidden once it has slid out); a column that scrolls on its own beside the list on wide ones. -->
  <div
    :class="drawerOpen ? 'visible bg-neutral-900/40' : 'invisible bg-transparent'"
    class="fixed inset-0 z-40 flex transition-[background-color,visibility] duration-300 @3xl/page:visible @3xl/page:static @3xl/page:inset-auto @3xl/page:z-auto @3xl/page:bg-transparent @3xl/page:w-60 @3xl/page:shrink-0 @3xl/page:self-start @3xl/page:sticky @3xl/page:top-4"
    @click.self="drawerOpen = false"
  >
    <aside
      aria-label="Filters"
      :class="drawerOpen ? 'translate-x-0' : '-translate-x-full'"
      class="flex flex-col w-72 max-w-[85vw] h-full bg-white border-r border-neutral-400 overflow-hidden transition-transform duration-300 @3xl/page:translate-x-0 @3xl/page:w-full @3xl/page:h-auto @3xl/page:max-h-[calc(100svh-2rem)] @3xl/page:border @3xl/page:rounded-lg"
    >
      <div class="flex items-center gap-2 px-3 py-2 bg-brand text-parchment font-semibold">
        <Icon icon="lucide:filter" class="size-4" />
        <span class="flex-1">Filters</span>
        <button
          v-if="activeCount > 0"
          type="button"
          class="text-sm font-normal text-neutral-300 transition-colors duration-100 hover:text-white cursor-pointer"
          @click="clear"
        >
          Clear
        </button>
        <button
          type="button"
          class="@3xl/page:hidden p-0.5 rounded text-neutral-300 transition-colors duration-100 hover:text-white cursor-pointer"
          aria-label="Close filters"
          @click="drawerOpen = false"
        >
          <Icon icon="lucide:x" class="size-5" />
        </button>
      </div>
      <FilterSections v-model="selected" :sections="sections" class="overflow-auto" />
    </aside>
  </div>
</template>
