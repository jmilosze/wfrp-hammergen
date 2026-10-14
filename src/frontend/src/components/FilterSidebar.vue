<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import SheetCheckbox from "./SheetCheckbox.vue";
import { FilterSection } from "./filterSection.ts";

// The filters of a browse list, as a column of collapsible sections of checkboxes. In a section an item matches any
// of the ticked values; the list page combines the sections. Options with a heading are listed under it (e.g. weapon
// groups under their type). On narrow screens the column is a drawer opened from a "Filters" button. Widths follow
// the page (the named page container).
const selected = defineModel<Record<string, string[]>>({ required: true });

const props = defineProps<{ sections: FilterSection[] }>();

const collapsed = ref(new Set(props.sections.filter((x) => x.collapsed).map((x) => x.key)));
const drawerOpen = ref(false);

// A section with nothing to choose from is left out (e.g. groups before a type is ticked).
const shownSections = computed(() => props.sections.filter((x) => x.options.length > 0));

const activeCount = computed(() => Object.values(selected.value).reduce((sum, values) => sum + values.length, 0));

function isTicked(key: string, value: string): boolean {
  return (selected.value[key] ?? []).includes(value);
}

function toggle(key: string, value: string) {
  const values = selected.value[key] ?? [];
  selected.value = {
    ...selected.value,
    [key]: values.includes(value) ? values.filter((x) => x !== value) : [...values, value],
  };
}

function toggleSection(key: string) {
  const next = new Set(collapsed.value);
  if (!next.delete(key)) {
    next.add(key);
  }
  collapsed.value = next;
}

function clear() {
  selected.value = Object.fromEntries(props.sections.map((x) => [x.key, []]));
}

// A heading is shown above the first option under it.
function showHeading(options: FilterSection["options"], index: number): boolean {
  const heading = options[index].heading;
  return heading !== undefined && (index === 0 || options[index - 1].heading !== heading);
}
</script>

<template>
  <!-- On narrow screens: the Filters button, with the page's actions (the slot, e.g. Create new) beside it on very small ones. -->
  <div class="flex items-stretch gap-2 @3xl/page:hidden">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded border border-neutral-700 bg-neutral-700 px-3 py-1.5 font-semibold text-primary-300"
      @click="drawerOpen = true"
    >
      <Icon icon="lucide:filter" class="size-4" />
      Filters<span v-if="activeCount > 0"> ({{ activeCount }})</span>
    </button>
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
      <div class="flex items-center gap-2 px-3 py-2 bg-neutral-700 text-primary-300 font-semibold">
        <Icon icon="lucide:filter" class="size-4" />
        <span class="flex-1">Filters</span>
        <button
          v-if="activeCount > 0"
          type="button"
          class="text-sm font-normal text-neutral-300 hover:text-white cursor-pointer"
          @click="clear"
        >
          Clear
        </button>
        <button
          type="button"
          class="@3xl/page:hidden p-0.5 rounded text-neutral-300 hover:text-white cursor-pointer"
          aria-label="Close filters"
          @click="drawerOpen = false"
        >
          <Icon icon="lucide:x" class="size-5" />
        </button>
      </div>
      <div class="overflow-auto">
        <section
          v-for="section in shownSections"
          :key="section.key"
          class="border-b border-neutral-200 last:border-b-0"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 font-semibold hover:bg-neutral-100 cursor-pointer"
            :aria-expanded="!collapsed.has(section.key)"
            @click="toggleSection(section.key)"
          >
            <span class="flex-1 text-left">{{ section.title }}</span>
            <span
              v-if="(selected[section.key] ?? []).length > 0"
              class="px-1.5 rounded-full bg-primary-200 text-xs text-neutral-900"
            >
              {{ (selected[section.key] ?? []).length }}
            </span>
            <Icon :icon="collapsed.has(section.key) ? 'lucide:chevron-right' : 'lucide:chevron-down'" class="size-4" />
          </button>
          <ul v-if="!collapsed.has(section.key)" class="list-none m-0 px-3 pb-2">
            <li v-for="(option, i) in section.options" :key="option.value">
              <div v-if="showHeading(section.options, i)" class="mt-1 text-xs font-semibold text-neutral-500 uppercase">
                {{ option.heading }}
              </div>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer">
                <SheetCheckbox
                  plain
                  :checked="isTicked(section.key, option.value)"
                  @change="toggle(section.key, option.value)"
                />
                {{ option.text }}
              </label>
            </li>
          </ul>
        </section>
      </div>
    </aside>
  </div>
</template>

<style scoped></style>
