<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { printSkillType, Skill } from "../services/wh/content/skill.ts";
import { computed, ref } from "vue";
import { Attributes, getAttributeValue, printAttributeName } from "../services/wh/core/attributes.ts";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SectionButton from "./SectionButton.vue";
import SectionCard from "./SectionCard.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

const DESC_CHARS = 100;

const props = defineProps<{
  disabled?: boolean;
  skillList: Skill[];
  // The character's skills: id to advances, read directly (the parent changes them on the emitted events).
  skills: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
  validationStatus: ValidationStatus;
  step?: number;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "addSpeciesSkills"): void;
}>();

function advancesOf(id: string): number {
  return props.skills[id] ?? 0;
}

// The skills that can be taken (not groups), by name.
const takeableSkills = computed(() =>
  props.skillList.filter((x) => !x.isGroup).sort((a, b) => a.name.localeCompare(b.name)),
);

const selectedSkills = computed(() =>
  takeableSkills.value
    .filter((x) => advancesOf(x.id) !== 0)
    .map((x) => ({
      id: x.id,
      name: x.name,
      attributeName: printAttributeName(x.attribute),
      number: advancesOf(x.id),
      value: getAttributeValue(x.attribute, props.attributes) + advancesOf(x.id),
    })),
);

const modalOpen = ref(false);

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}

// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  takeableSkills.value.map((x) => ({
    id: x.id,
    name: x.name,
    description: truncate(x.description, DESC_CHARS),
    note: `${printSkillType(x.type)} · ${printAttributeName(x.attribute)}`,
    get selected() {
      return advancesOf(x.id) !== 0;
    },
    get number() {
      return advancesOf(x.id);
    },
  })),
);
</script>

<template>
  <div>
    <SectionCard title="Skills" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
        <SectionButton icon="lucide:plus" variant="neutral" :disabled="props.loading" @click="emit('addSpeciesSkills')">
          Add species skills
        </SectionButton>
      </template>
      <table class="w-full">
        <thead>
          <tr class="text-left" :class="{ 'bg-editable': !disabled }">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th class="border-b border-neutral-300 py-2 px-2">Att</th>
            <th class="border-b border-neutral-300 py-2 px-2">Adv</th>
            <th class="border-b border-neutral-300 py-2 px-2">Skill</th>
            <th v-if="!disabled" class="border-b border-neutral-300 py-2 px-2 w-0" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSkills" :key="src.id" class="bg-white hover:bg-neutral-100">
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink routeName="skill" :params="{ id: src.id }">
                {{ src.name }}
              </TextLink>
              <Edition4eBadge v-if="fourEIds?.has(src.id)" />
            </td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeName }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.value }}</td>
            <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
              <IconButton
                icon="lucide:x"
                :label="`Remove ${src.name}`"
                @click="emit('updated', { id: src.id, number: 0 })"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header> Edit skills </template>
      <ChecklistPicker
        :items="modalItems"
        routeName="skill"
        :loading="props.loading"
        :fourEIds="fourEIds"
        numberLabel="Adv"
        :numberStep="step"
        @setNumber="(e) => emit('updated', e)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
