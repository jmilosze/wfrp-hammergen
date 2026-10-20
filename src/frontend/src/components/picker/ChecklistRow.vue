<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import AppButton from "@/components/ui/AppButton.vue";
import TextLink from "@/components/ui/TextLink.vue";
import Edition4eBadge from "@/components/edition/Edition4eBadge.vue";
import { ChecklistItem } from "./checklistItem.ts";
import { useId } from "vue";

// A row of a ChecklistPicker. Rows are components of their own, so a change to one item (e.g. a typed quantity) redraws
// only its row, not the whole list.
defineProps<{
  item: ChecklistItem;
  routeName?: RouteName;
  fourEIds?: Set<string>;
  numberLabel?: string;
  numberStep?: number;
  textLabel?: string;
}>();

const emit = defineEmits<{
  (e: "toggle", value: { id: string; selected: boolean }): void;
  (e: "add", id: string): void;
  (e: "setNumber", value: { id: string; number: number }): void;
  (e: "setText", value: { id: string; text: string }): void;
  (e: "choose", value: { id: string; key: string; checked: boolean }): void;
}>();

// A row is a label, so a click anywhere on it ticks its checkbox (pointed at by for, as the checkbox is at the end, after a
// text input) or focuses its number; rows with an Add button or several checkboxes aren't. A repeatable row adds one
// when clicked anywhere, like its Add button; a click on the item's name opens its page instead.
function isLabel(item: ChecklistItem): boolean {
  return !item.repeatable && !item.choices;
}

function hasCheckbox(item: ChecklistItem): boolean {
  return isLabel(item) && item.number === undefined;
}

const checkboxId = useId();

function onRowClick(item: ChecklistItem, event: MouseEvent) {
  if (!item.repeatable || (event.target instanceof Element && event.target.closest("a"))) {
    return;
  }
  emit("add", item.id);
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
</script>

<template>
  <component
    :is="isLabel(item) ? 'label' : 'div'"
    :for="hasCheckbox(item) ? checkboxId : undefined"
    class="flex items-start gap-3 px-2 py-2 border-b border-neutral-300 last:border-b-0 [content-visibility:auto] [contain-intrinsic-size:auto_4rem]"
    :class="[
      item.selected ? 'bg-editable' : 'bg-white',
      { 'cursor-pointer transition-colors duration-100 hover:bg-neutral-100': isLabel(item) || item.repeatable },
    ]"
    @click="onRowClick(item, $event)"
  >
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
        class="w-16 min-h-8 px-2 border border-neutral-400 rounded-sm bg-editable outline-neutral-700 focus:outline-2"
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
          class="flex-1 min-w-0 min-h-8 px-2 border border-neutral-400 rounded-sm bg-editable outline-neutral-700 focus:outline-2"
          @input="onTextInput(item.id, $event)"
        />
      </span>
      <span v-if="item.textError" role="alert" class="text-sm text-error">{{ item.textError }}</span>
    </span>
    <span v-if="item.choices" class="flex items-center gap-3 shrink-0 self-center">
      <label
        v-for="choice in item.choices"
        :key="choice.key"
        class="flex items-center gap-1 text-sm font-semibold"
        :class="choice.disabled ? 'text-neutral-400' : 'cursor-pointer'"
      >
        <FormCheckbox
          :checked="choice.checked"
          :disabled="choice.disabled"
          @change="emit('choose', { id: item.id, key: choice.key, checked: !choice.checked })"
        />
        {{ choice.label }}
      </label>
    </span>
    <!-- The Add button is there for the keyboard; its click reaches the row, which adds. -->
    <span v-if="item.repeatable" class="flex items-center gap-2 shrink-0 self-center">
      <span v-if="item.count" class="font-semibold">×{{ item.count }}</span>
      <AppButton icon="lucide:plus" :aria-label="`Add ${item.name}`"> Add </AppButton>
    </span>
    <!-- A plain row's checkbox sits at the end, as the Add button and a career level's checkboxes do. -->
    <span v-if="hasCheckbox(item)" class="shrink-0 self-center">
      <FormCheckbox
        :id="checkboxId"
        :checked="item.selected"
        :aria-label="item.name"
        @change="emit('toggle', { id: item.id, selected: !item.selected })"
      />
    </span>
  </component>
</template>
