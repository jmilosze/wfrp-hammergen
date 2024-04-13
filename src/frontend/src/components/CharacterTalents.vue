<script setup lang="ts">
import { Talent } from "../services/wh/talent.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, printAttributeName } from "../services/wh/attributes.ts";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import ActionButton from "./ActionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";

type TalentWithNumber = {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  maxRankFormula: string;
  attributeName: string;
  number: number;
};

const props = defineProps<{
  disabled?: boolean;
  talentList: Talent[];
  initTalents: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
  (e: "addSpeciesTalents"): void;
}>();

function anySelected(talentsWithNumber: TalentWithNumber): boolean {
  return talentsWithNumber.number !== 0;
}

const talentsWithNumber: Ref<Record<string, TalentWithNumber>> = ref({});
const talentsWithNumberList: Ref<TalentWithNumber[]> = ref([]);

function updateTalentsWithNumber(
  selectedTalents: Record<string, number>,
  talentList: Talent[],
  attributes: Attributes,
) {
  talentsWithNumber.value = {};
  for (const talent of talentList) {
    if (!talent.isGroup) {
      talentsWithNumber.value[talent.id] = {
        id: talent.id,
        name: talent.name,
        description: talent.description,
        maxRank: talent.getMaxRank(attributes),
        maxRankFormula: talent.getMaxRankDisplay(),
        attributeName: printAttributeName(talent.attribute),
        number: 0,
      };
      if (talent.id in selectedTalents) {
        talentsWithNumber.value[talent.id].number = selectedTalents[talent.id];
      }
    }
  }
  talentsWithNumberList.value = Object.values(talentsWithNumber.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

watch(
  () => props.initTalents,
  (newVal) => {
    updateTalentsWithNumber(newVal, props.talentList, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.talentList,
  (newVal) => {
    updateTalentsWithNumber(props.initTalents, newVal, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.attributes,
  (newVal) => {
    updateTalentsWithNumber(props.initTalents, props.talentList, newVal);
  },
  { immediate: true },
);

const selectedTalents = computed(() => talentsWithNumberList.value.filter((x) => anySelected(x)));

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
  modal.showModal("modifyTalentsModal");
  searchTerm.value = "";
  talentsWithNumberList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <div>Talents</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
      <ActionButton v-if="!disabled" size="sm" @click="emit('addSpeciesTalents')">Add species talents</ActionButton>
      <ActionButton v-if="!disabled" size="sm" variant="red" @click="emit('clearAll')">Clear all</ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th class="border-b border-neutral-300 py-2 px-2">Times taken</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedTalents" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <ModalWindow id="modifyTalentsModal">
      <template #header> Modify talents </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="talentsWithNumberList"
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
            v-model="talentsWithNumber[id].number"
            type="number"
            class="w-20"
            @update:modelValue="emit('updated', { id: id, number: talentsWithNumber[id].number })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div>
            {{ talentsWithNumber[id].description }}
            <div class="mb-1">
              <span class="font-semibold mr-1">Max rank</span>
              {{ talentsWithNumber[id].maxRank }}
              {{
                talentsWithNumber[id].maxRankFormula.includes("Bonus")
                  ? "(" + talentsWithNumber[id].maxRankFormula + ")"
                  : ""
              }}
            </div>
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
