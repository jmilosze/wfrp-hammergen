<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { printSkillType, Skill } from "../services/wh/content/skill.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, getAttributeValue, printAttributeName } from "../services/wh/core/attributes.ts";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SectionButton from "./SectionButton.vue";
import SectionCard from "./SectionCard.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

const DESC_CHARS = 100;

type SkillWithNumber = {
  id: string;
  name: string;
  description: string;
  attributeName: string;
  attributeValue: number;
  type: string;
  number: number;
};

const props = defineProps<{
  disabled?: boolean;
  skillList: Skill[];
  initSkills: Record<string, number>;
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

function isNonzero(skillWithNumber: SkillWithNumber): boolean {
  return skillWithNumber.number !== 0;
}

const skillsWithNumber: Ref<Record<string, SkillWithNumber>> = ref({});
const skillsWithNumberList: Ref<SkillWithNumber[]> = ref([]);

function updateSkillsWithNumber(selectedSkills: Record<string, number>, skillList: Skill[], attributes: Attributes) {
  skillsWithNumber.value = {};
  for (const skill of skillList) {
    if (!skill.isGroup) {
      skillsWithNumber.value[skill.id] = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        attributeName: printAttributeName(skill.attribute),
        attributeValue: getAttributeValue(skill.attribute, attributes),
        type: printSkillType(skill.type),
        number: 0,
      };
      if (skill.id in selectedSkills) {
        skillsWithNumber.value[skill.id].number = selectedSkills[skill.id];
      }
    }
  }
  skillsWithNumberList.value = Object.values(skillsWithNumber.value).sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}

watch(
  () => props.initSkills,
  (newVal) => {
    updateSkillsWithNumber(newVal, props.skillList, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.skillList,
  (newVal) => {
    updateSkillsWithNumber(props.initSkills, newVal, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.attributes,
  (newVal) => {
    updateSkillsWithNumber(props.initSkills, props.skillList, newVal);
  },
  { immediate: true },
);

const selectedSkills = computed(() => skillsWithNumberList.value.filter((x) => isNonzero(x)));

const modal = useModal();
const openedCounter = ref(0);

function removeSkill(id: string) {
  skillsWithNumber.value[id].number = 0;
  emit("updated", { id: id, number: 0 });
}

function onEditClick() {
  if (props.loading) {
    return;
  }
  skillsWithNumberList.value.sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
  openedCounter.value += 1;
  modal.showModal("modifySkillsModal");
}

// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  skillsWithNumberList.value.map((x) => ({
    id: x.id,
    name: x.name,
    description: truncate(x.description, DESC_CHARS),
    note: `${x.type} · ${x.attributeName}`,
    get selected() {
      return isNonzero(x);
    },
    get number() {
      return x.number;
    },
  })),
);

function setNumber(id: string, number: number) {
  skillsWithNumber.value[id].number = number;
  emit("updated", { id: id, number: number });
}
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
          <tr class="text-left" :class="{ 'bg-primary-50': !disabled }">
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
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeValue + src.number }}</td>
            <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
              <button
                class="text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 rounded p-1"
                :aria-label="`Remove ${src.name}`"
                @click="removeSkill(src.id)"
              >
                <Icon icon="lucide:x" class="size-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
    <div class="text-sm text-danger-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow id="modifySkillsModal" fullHeight>
      <template #header> Edit skills </template>
      <ChecklistPicker
        :items="modalItems"
        routeName="skill"
        :opened="openedCounter"
        :loading="props.loading"
        :fourEIds="fourEIds"
        numberLabel="Adv"
        :numberStep="step"
        @setNumber="(e) => setNumber(e.id, e.number)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
