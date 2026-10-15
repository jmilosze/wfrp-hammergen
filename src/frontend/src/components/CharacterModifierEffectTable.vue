<script setup lang="ts">
import IconButton from "./IconButton.vue";
import ListTable from "./ListTable.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import { modifierEffectsByEdition, printEffectDesc, printEffectName } from "../services/wh/core/characterModifiers.ts";
import { Edition } from "../services/wh/core/edition.ts";

// Picks the modifier effects of the edition (e.g. Hardy); effects is the picked ones, read directly (the parent changes
// it on the emitted events).
const props = defineProps<{ effects: Set<number>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: number; selected: boolean }): void;
}>();

const modalOpen = ref(false);

// The edition's effects, by name.
const effectList = computed(() =>
  modifierEffectsByEdition[props.edition]
    .map((effectType) => ({ id: effectType, name: printEffectName(effectType), desc: printEffectDesc(effectType) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const selectedEffects = computed(() => effectList.value.filter((x) => props.effects.has(x.id)));

// Popup rows are made once per edition; each reads whether it is picked through a getter.
const modalItems = computed(() =>
  effectList.value.map((x) => ({
    id: x.id.toString(),
    name: x.name,
    description: x.desc,
    get selected() {
      return props.effects.has(x.id);
    },
  })),
);
</script>

<template>
  <div class="flex flex-col">
    <ListTable :editable="!disabled" title="Effects" :titleColspan="disabled ? 2 : 3" class="grow">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" @click="modalOpen = true">Edit</SectionButton>
      </template>
      <tr v-for="src in selectedEffects" :key="src.id" class="bg-white hover:bg-neutral-100">
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.desc }}</td>
        <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
          <IconButton
            icon="lucide:x"
            :label="`Remove ${src.name}`"
            @click="emit('selected', { id: src.id, selected: false })"
          />
        </td>
      </tr>
    </ListTable>
    <ModalWindow v-model:open="modalOpen">
      <template #header> Edit effects </template>
      <ChecklistPicker
        :items="modalItems"
        @toggle="(e) => emit('selected', { id: Number(e.id), selected: e.selected })"
      />
    </ModalWindow>
  </div>
</template>
