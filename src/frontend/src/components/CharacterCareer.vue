<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Career, printClassName } from "../services/wh/career.ts";
import { IdNumber } from "../utils/idNumber.ts";
import TextLink from "./TextLink.vue";
import ReloadButton from "./ReloadButton.vue";
import LinkButton from "./LinkButton.vue";

type CareerWithSelect = {
  id: string;
  careerId: string;
  name: string;
  description: string;
  careerClass: string;
  level: number;
  levelName: string;
  current: boolean;
  past: boolean;
};

function anySelected(careerWithSelect: CareerWithSelect): boolean {
  return careerWithSelect.current || careerWithSelect.past;
}

const props = defineProps<{
  disabled?: boolean;
  careerList: Career[];
  initSelectedCurrentCareer: IdNumber;
  initSelectedPastCareers: IdNumber[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "pastSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "currentSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "reload"): void;
}>();

const careersWithSelect: Ref<Record<string, CareerWithSelect>> = ref({});
const careersWithSelectList: Ref<CareerWithSelect[]> = ref([]);
let currentId = "";

watch(
  () => props.initSelectedCurrentCareer,
  (newVal) => {
    updateCareersWithSelect(newVal, props.initSelectedPastCareers, props.careerList);
  },
  { immediate: true },
);

watch(
  () => props.initSelectedPastCareers,
  (newVal) => {
    updateCareersWithSelect(props.initSelectedCurrentCareer, newVal, props.careerList);
  },
  { immediate: true },
);

watch(
  () => props.careerList,
  (newVal) => {
    updateCareersWithSelect(props.initSelectedCurrentCareer, props.initSelectedPastCareers, newVal);
  },
  { immediate: true },
);

function updateCareersWithSelect(
  selectedCurrentCareer: IdNumber,
  selectedPastCareers: IdNumber[],
  careerList: Career[],
) {
  careersWithSelect.value = {};
  for (const career of careerList) {
    for (const i of [1, 2, 3, 4, 5]) {
      const lvl = career.getLevel(i as 1 | 2 | 3 | 4 | 5);
      if (lvl.exists) {
        careersWithSelect.value[career.id + "_" + i] = {
          id: career.id + "_" + i,
          careerId: career.id,
          name: career.name,
          description: career.description,
          careerClass: printClassName(career.careerClass),
          level: i,
          levelName: lvl.name,
          current: false,
          past: false,
        };

        if (selectedCurrentCareer && selectedCurrentCareer.id === career.id && selectedCurrentCareer.number === i) {
          currentId = career.id + "_" + i;
          careersWithSelect.value[career.id + "_" + i].current = true;
        }
        if (selectedPastCareers) {
          for (const pastCareer of selectedPastCareers) {
            if (pastCareer.id === career.id && pastCareer.number === i) {
              careersWithSelect.value[career.id + "_" + i].past = true;
            }
          }
        }
      }
    }
  }
  careersWithSelectList.value = Object.values(careersWithSelect.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

const selectedPastCareers = computed(() => careersWithSelectList.value.filter((x) => x.past));
const selectedCurrentCareer = computed(() => careersWithSelectList.value.find((x) => x.current));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "levelName", displayName: "Level name", skipStackedTitle: false },
  { name: "careerClass", displayName: "Class", skipStackedTitle: false },
  { name: "current", displayName: "Current", skipStackedTitle: false },
  { name: "past", displayName: "Past", skipStackedTitle: false },
];

const resetPaginationCounter = ref(0);

function onModifyClick() {
  resetPaginationCounter.value += 1;
  modal.showModal("modifyCareersModal");
  searchTerm.value = "";
  careersWithSelectList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

function selectNewCurrent(id: string) {
  if (id === currentId) {
    careersWithSelect.value[currentId].current = false;
    emitCurrentSelected(currentId);
    currentId = "";
    return;
  }

  if (currentId in careersWithSelect.value) {
    careersWithSelect.value[currentId].current = false;
    emitCurrentSelected(currentId);
  }
  currentId = id;
  careersWithSelect.value[currentId].current = true;
  emitCurrentSelected(currentId);
}

function emitCurrentSelected(id: string) {
  emit("currentSelected", {
    id: careersWithSelect.value[id].careerId,
    number: careersWithSelect.value[id].level,
    selected: careersWithSelect.value[id].current,
  });
}

function selectNewPast(id: string) {
  if (careersWithSelect.value[id].past) {
    emitPastSelected(id);
    return;
  }
  emitPastSelected(id);
}

function emitPastSelected(id: string) {
  emit("pastSelected", {
    id: careersWithSelect.value[id].careerId,
    number: careersWithSelect.value[id].level,
    selected: !careersWithSelect.value[id].past,
  });
}
</script>

<template>
  <div>
    <div class="flex items-center mb-1">
      <div class="mr-1">Career</div>
      <ActionButton v-if="!disabled" class="btn btn-sm" @click="onModifyClick">Modify</ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="border border-neutral-300 rounded p-2">
      <div class="mb-1">Current career</div>
      <div v-if="selectedCurrentCareer">
        <TextLink routeName="career" :params="{ id: selectedCurrentCareer.careerId }" class="mr-3">
          {{ selectedCurrentCareer.name }} {{ selectedCurrentCareer.level }} - {{ selectedCurrentCareer.levelName }}
        </TextLink>
      </div>
      <div class="border-t border-neutral-300 my-1" />
      <div class="mb-1">Past careers</div>
      <div v-for="pastCareer in selectedPastCareers" :key="pastCareer.id">
        <TextLink routeName="career" :params="{ id: pastCareer.careerId }" class="mr-3">
          {{ pastCareer.name }} {{ pastCareer.level }} - {{ pastCareer.levelName }}
        </TextLink>
      </div>
    </div>
    <ModalWindow id="modifyCareersModal" size="md">
      <template #header> Modify career </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="careersWithSelectList"
        :stackedViewSize="ViewSize.sm"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
        @reload="emit('reload')"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" routeName="career" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />

        <template #name="{ id }: { id: string }">
          <TextLink routeName="career" :params="{ id: careersWithSelect[id].careerId }">
            {{ careersWithSelect[id].name + ` (level ${careersWithSelect[id].level})` }}
          </TextLink>
        </template>

        <template #current="{ id }: { id: string }">
          <div>
            <input
              v-model="careersWithSelect[id].current"
              type="checkbox"
              :disabled="careersWithSelect[id].past"
              class="w-5 h-5 accent-neutral-600 my-1"
              @input="selectNewCurrent(id)"
            />
          </div>
        </template>
        <template #past="{ id }: { id: string }">
          <div>
            <input
              v-model="careersWithSelect[id].past"
              type="checkbox"
              :disabled="careersWithSelect[id].current"
              class="w-5 h-5 accent-neutral-600 my-1"
              @input="selectNewPast(id)"
            />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
