<script setup lang="ts">
import { printSkillType, Skill } from "../services/wh/skill.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, getAttributeValue, printAttributeName } from "../services/wh/attributes.ts";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import ActionButton from "./ActionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { addSpaces } from "../utils/string.ts";

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
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
  (e: "addSpeciesSkills"): void;
}>();

function anySelected(skillsWithNumber: SkillWithNumber): boolean {
  return skillsWithNumber.number !== 0;
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
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
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

const selectedSkills = computed(() => skillsWithNumberList.value.filter((x) => anySelected(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "number", displayName: "Rank", skipStackedTitle: false },
];

const resetPaginationCounter = ref(0);

function onModifyClick() {
  resetPaginationCounter.value += 1;
  modal.showModal("modifySkillsModal");
  searchTerm.value = "";
  skillsWithNumberList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1 flex-wrap">
      <div>Skills</div>
      <div class="flex gap-2 flex-wrap">
        <ActionButton v-if="!disabled" size="sm" class="flex-1 text-center" @click="onModifyClick">
          <span class="flex-1">Modify</span>
        </ActionButton>
        <ActionButton v-if="!disabled" size="sm" class="whitespace-nowrap flex-1" @click="emit('addSpeciesSkills')">
          <span class="flex-1">Add species skills</span>
        </ActionButton>
        <ActionButton
          v-if="!disabled"
          size="sm"
          variant="red"
          class="whitespace-nowrap flex-1"
          @click="emit('clearAll')"
        >
          <span class="flex-1">Clear all</span>
        </ActionButton>
      </div>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th class="border-b border-neutral-300 py-2 px-2">Att</th>
            <th class="border-b border-neutral-300 py-2 px-2">Adv</th>
            <th class="border-b border-neutral-300 py-2 px-2">Skill</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSkills" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">{{ addSpaces(src.name) }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeName }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeValue + src.number }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow id="modifySkillsModal">
      <template #header> Modify skills </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="skillsWithNumberList"
        :stackedViewSize="ViewSize.sm"
        :addCreateNewBtn="true"
        :addReloadBtn="true"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
        @createNew="emit('createNew')"
        @reload="emit('reload')"
      >
        <template #number="{ id }: { id: string }">
          <FormInput
            v-model="skillsWithNumber[id].number"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('updated', { id: id, number: skillsWithNumber[id].number })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div>
            {{ addSpaces(skillsWithNumber[id].description) }}
            <div class="mb-1"><span class="font-semibold mr-1">Type</span> {{ skillsWithNumber[id].type }}</div>
            <div class="mb-1">
              <span class="font-semibold mr-1">Attribute</span> {{ skillsWithNumber[id].attributeName }}
            </div>
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
