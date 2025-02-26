<script setup lang="ts">
import { Talent } from "../services/wh/talent.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, attributesAreEqual, printAttributeName } from "../services/wh/attributes.ts";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import ActionButton from "./ActionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { addSpaces, truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import ReloadButton from "./ReloadButton.vue";
import LinkButton from "./LinkButton.vue";

const DESC_CHARS = 100;

type TalentWithNumber = {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  maxRankFormula: string;
  attributeName: string;
  number: number;
  fullTalentPos: number;
};

const props = defineProps<{
  disabled?: boolean;
  talentList: Talent[];
  initTalents: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
  validationStatus: ValidationStatus;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
  (e: "addSpeciesTalents"): void;
}>();

function isNonzero(talentWithNumber: TalentWithNumber): boolean {
  return talentWithNumber.number !== 0;
}

const talentsWithNumber: Ref<Record<string, TalentWithNumber>> = ref({});
const talentsWithNumberList: Ref<TalentWithNumber[]> = ref([]);

function updateTalentsWithNumber(
  selectedTalents: Record<string, number>,
  talentList: Talent[],
  attributes: Attributes,
) {
  talentsWithNumber.value = {};
  for (let i = 0; i < talentList.length; i++) {
    const talent = talentList[i];
    if (!talent.isGroup) {
      talentsWithNumber.value[talent.id] = {
        id: talent.id,
        name: talent.name,
        description: talent.description,
        maxRank: talent.getMaxRank(attributes),
        maxRankFormula: talent.getMaxRankDisplay(),
        attributeName: printAttributeName(talent.attribute),
        number: 0,
        fullTalentPos: i,
      };
      if (talent.id in selectedTalents) {
        talentsWithNumber.value[talent.id].number = selectedTalents[talent.id];
      }
    }
  }
  talentsWithNumberList.value = Object.values(talentsWithNumber.value).sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}

function updateAttributes(attributes: Attributes) {
  for (const talent of talentsWithNumberList.value) {
    const newMaxRank = props.talentList[talent.fullTalentPos].getMaxRank(attributes);
    talent.maxRank = newMaxRank;
    talentsWithNumber.value[talent.id].maxRank = newMaxRank;
  }
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
  (newVal, oldVal) => {
    if (oldVal === undefined || !attributesAreEqual(newVal, oldVal)) {
      updateAttributes(newVal);
    }
  },
  { immediate: true },
);

const selectedTalents = computed(() => talentsWithNumberList.value.filter((x) => isNonzero(x)));

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
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1 flex-wrap">
      <div>Talents</div>
      <div class="flex gap-2 flex-wrap">
        <ActionButton v-if="!disabled" class="flex-1 btn btn-sm" @click="onModifyClick">
          <span class="flex-1">Modify</span>
        </ActionButton>
        <ActionButton v-if="!disabled" class="whitespace-nowrap flex-1 btn btn-sm" @click="emit('addSpeciesTalents')">
          <span class="flex-1">Add species talents</span>
        </ActionButton>
        <ActionButton v-if="!disabled" class="whitespace-nowrap flex-1 btn btn-danger btn-sm" @click="emit('clearAll')">
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
            <th class="border-b border-neutral-300 py-2 px-2">Times taken</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedTalents" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink routeName="talent" :params="{ id: src.id }">
                {{ addSpaces(src.name) }}
              </TextLink>
            </td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow id="modifyTalentsModal">
      <template #header> Modify talents </template>
      <template #buttons>
        <ActionButton class="btn" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="talentsWithNumberList"
        :stackedViewSize="ViewSize.xs"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
        @reload="emit('reload')"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" routeName="talent" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />

        <template #name="{ id }: { id: string }">
          <TextLink routeName="talent" :params="{ id: id }">{{ addSpaces(talentsWithNumber[id].name) }}</TextLink>
        </template>

        <template #number="{ id }: { id: string }">
          <FormInput
            v-model="talentsWithNumber[id].number"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('updated', { id: id, number: talentsWithNumber[id].number })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div>
            {{ truncate(addSpaces(talentsWithNumber[id].description), DESC_CHARS) }}
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
