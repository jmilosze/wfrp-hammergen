<script setup lang="ts">
import SheetCheckbox from "./SheetCheckbox.vue";
import SectionButton from "./SectionButton.vue";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import { ChecklistItem } from "./checklistItem.ts";

// A row of a ChecklistPicker. Rows are components of their own, so a change to one item (e.g. a typed quantity) redraws
// only its row, not the whole list.
defineProps<{
  item: ChecklistItem;
  routeName?: string;
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

// A row is ticked by clicking anywhere on it, unless it has an Add button or several checkboxes.
function clickable(item: ChecklistItem): boolean {
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
</script>

<template>
  <component
    :is="clickable(item) ? 'label' : 'div'"
    class="flex items-start gap-3 px-2 py-2 border-b border-neutral-300 last:border-b-0 [content-visibility:auto] [contain-intrinsic-size:auto_4rem]"
    :class="[item.selected ? 'bg-editable' : 'bg-white', { 'cursor-pointer hover:bg-neutral-100': clickable(item) }]"
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

<style scoped></style>
