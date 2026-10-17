<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import { FilterSection } from "./filterSection.ts";

// Filters as collapsible sections of checkboxes, as in a list page's sidebar and a picker's filter panel. In a section an
// item matches any of the ticked values; the owner combines the sections. Options with a heading are listed under it
// (e.g. weapon groups under their type). Where there is room (a picker), the options flow into columns.
const selected = defineModel<Record<string, string[]>>({ required: true });

const props = defineProps<{ sections: FilterSection[] }>();

const collapsed = ref(new Set(props.sections.filter((x) => x.collapsed).map((x) => x.key)));

// A section with nothing to choose from is left out (e.g. groups before a type is ticked).
const shownSections = computed(() => props.sections.filter((x) => x.options.length > 0));

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

// A heading is shown above the first option under it.
function showHeading(options: FilterSection["options"], index: number): boolean {
  const heading = options[index].heading;
  return heading !== undefined && (index === 0 || options[index - 1].heading !== heading);
}
</script>

<template>
  <div class="@container">
    <section v-for="section in shownSections" :key="section.key" class="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 font-semibold transition-colors duration-100 hover:bg-neutral-100 cursor-pointer"
        :aria-expanded="!collapsed.has(section.key)"
        @click="toggleSection(section.key)"
      >
        <span class="flex-1 text-left">{{ section.title }}</span>
        <span
          v-if="(selected[section.key] ?? []).length > 0"
          class="px-1.5 rounded-full bg-parchment text-xs text-brand"
        >
          {{ (selected[section.key] ?? []).length }}
        </span>
        <Icon :icon="collapsed.has(section.key) ? 'lucide:chevron-right' : 'lucide:chevron-down'" class="size-4" />
      </button>
      <ul v-if="!collapsed.has(section.key)" class="list-none m-0 px-3 pb-2 @lg:columns-2 @3xl:columns-3">
        <!-- An option stays in one column with the heading above it. -->
        <li v-for="(option, i) in section.options" :key="option.value" class="break-inside-avoid">
          <div v-if="showHeading(section.options, i)" class="mt-1 text-xs font-semibold text-neutral-500 uppercase">
            {{ option.heading }}
          </div>
          <label class="flex items-center gap-2 py-0.5 cursor-pointer">
            <FormCheckbox
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
</template>
