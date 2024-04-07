<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Career, CareerClass, isLevel } from "../services/wh/career.ts";
import { IdNumber } from "../utils/idNumber.ts";

type CareerWithSelect = {
  id: string;
  name: string;
  description: string;
  careerClass: CareerClass;
  levels: [
    {
      name: string;
      current: boolean;
      past: boolean;
    },
    {
      name: string;
      current: boolean;
      past: boolean;
    },
    {
      name: string;
      current: boolean;
      past: boolean;
    },
    {
      name: string;
      current: boolean;
      past: boolean;
    },
  ];
};

function anySelected(careerWithSelect: CareerWithSelect): boolean {
  for (const level of careerWithSelect.levels) {
    if (level.current || level.past) {
      return true;
    }
  }
  return false;
}

const props = defineProps<{
  disabled?: boolean;
  careerList: Career[];
  initSelectedCurrentCareer: IdNumber;
  initSelectedPastCareers: IdNumber[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
}>();

const careersWithSelect: Ref<Record<string, CareerWithSelect>> = ref({});
const careersWithSelectList: Ref<CareerWithSelect[]> = ref([]);

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
    careersWithSelect.value[career.id] = {
      id: career.id,
      name: career.name,
      description: career.description,
      careerClass: career.careerClass,
      levels: [
        {
          name: career.level1.name,
          current: false,
          past: false,
        },
        {
          name: career.level2.name,
          current: false,
          past: false,
        },
        {
          name: career.level3.name,
          current: false,
          past: false,
        },
        {
          name: career.level4.name,
          current: false,
          past: false,
        },
      ],
    };
    if (selectedCurrentCareer && selectedCurrentCareer.id === career.id && isLevel(selectedCurrentCareer.number)) {
      careersWithSelect.value[career.id].levels[selectedCurrentCareer.number - 1].current = true;
    }
    if (selectedPastCareers) {
      for (const pastCareer of selectedPastCareers) {
        if (pastCareer.id === career.id && isLevel(selectedCurrentCareer.number)) {
          careersWithSelect.value[career.id].levels[selectedCurrentCareer.number - 1].past = true;
        }
      }
    }
  }
  careersWithSelectList.value = Object.values(careersWithSelect.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

const selectedItems = computed(() => careersWithSelectList.value.filter((x) => anySelected(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name" },
  { name: "levels", displayName: "Levels" },
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
</script>

<template>
  <div>
    <div class="flex items-center" :class="disabled ? 'mb-1' : 'mb-2'">
      <div class="mr-2">Career</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.description }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <ModalWindow id="modifyCareersModal">
      <template #header> Modify career </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="careersWithSelectList"
        :stackedViewSize="ViewSize.sm"
        :addCreateNewBtn="true"
        :addReloadBtn="true"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
        @createNew="emit('createNew')"
        @reload="emit('reload')"
      >
        <template #levels="{ id }: { id: string }">
          <div class="max-w-48">
            <div v-for="i in [0, 1, 2, 3]" :key="i" class="flex items-center gap-2">
              <div>{{ careersWithSelect[id].levels[i].name }}</div>
              <div class="font-semibold">current:</div>
              <input
                v-model="careersWithSelect[id].levels[i].current"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600 my-1"
              />
              <div class="font-semibold">past:</div>
              <input
                v-model="careersWithSelect[id].levels[i].past"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600 my-1"
              />
            </div>
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
