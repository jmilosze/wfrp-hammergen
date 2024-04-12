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

type SkillWithNumber = {
  id: string;
  name: string;
  description: string;
  attribute: string;
  type: string;
  number: number;
};

const props = defineProps<{
  disabled?: boolean;
  skillList: Skill[];
  initSkills: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
}>();

function anySelected(skillsWithNumber: SkillWithNumber): boolean {
  return skillsWithNumber.number !== 0;
}

const skillsWithNumber: Ref<Record<string, SkillWithNumber>> = ref({});
const skillsWithNumberList: Ref<SkillWithNumber[]> = ref([]);

function updateSkillsWithNumber(selectedSkills: Record<string, number>, skillList: Skill[]) {
  skillsWithNumber.value = {};
  for (const skill of skillList) {
    if (!skill.isGroup) {
      skillsWithNumber.value[skill.id] = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        attribute: printAttributeName(skill.attribute),
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
    updateSkillsWithNumber(newVal, props.skillList);
  },
  { immediate: true },
);

watch(
  () => props.skillList,
  (newVal) => {
    updateSkillsWithNumber(props.initSkills, newVal);
  },
  { immediate: true },
);

const selectedSkills = computed(() => skillsWithNumberList.value.filter((x) => anySelected(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "type", displayName: "Type" },
  { name: "number", displayName: "Rank" },
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
    <div class="flex items-center gap-2 mb-1">
      <div>Skills</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
      <ActionButton v-if="!disabled" size="sm" variant="red" @click="emit('clearAll')"> Clear all </ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Att</th>
            <th class="border-b border-neutral-300 py-2 px-5">Adv</th>
            <th class="border-b border-neutral-300 py-2 px-5">Skill</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSkills" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.attribute }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.number }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ getAttributeValue(src.attribute, attributes) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
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
          <div>
            <FormInput
              v-model="skillsWithNumber[id].number"
              type="number"
              class="min-w-16"
              @update:modelValue="emit('updated', { id: id, number: skillsWithNumber[id].number })"
            />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
