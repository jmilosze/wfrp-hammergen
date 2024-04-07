<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Career, CareerClass } from "../services/wh/career.ts";
import { IdNumber } from "../services/wh/common.ts";

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

const props = defineProps<{
  disabled?: boolean;
  careerList: Career[];
  initSelectedCurrentCareer: IdNumber;
  initSelectedPastCareers: Record<string, IdNumber>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
}>();

const careersWithSelect: Ref<Record<string, CareerWithSelect>> = ref({});
const careersWithSelectList: Ref<CareerWithSelect[]> = ref([]);

// watch(
//   () => props.initSelectedCareers,
//   (newVal) => {
//     updateCareersWithSelect(newVal, props.careerList);
//   },
//   { immediate: true },
// );
//
// watch(
//   () => props.careerList,
//   (newVal) => {
//     updateCareersWithSelect(props.initSelectedCareers, newVal);
//   },
//   { immediate: true },
// );

function updateCareersWithSelect(
  selectedCurrentCareer: IdNumber,
  selectedPastCareers: Record<string, IdNumber>,
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
    if (selectedCurrentCareer && selectedCurrentCareer.id) {
      careersWithSelect.value[career.id].levels[selectedCurrentCareer.number].current = true;
    }
    if (selectedPastCareers && career.id in selectedPastCareers) {
    }
  }
  // itemsWithSelectList.value = Object.values(itemsWithSelect.value).sort((a, b) => {
  //   return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  // });
}

const selectedItems = computed(() => itemsWithSelectList.value.filter((x) => x.selected));

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
  itemsWithSelectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
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
        :items="itemsWithSelectList"
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
          <div class="flex items-center gap-2">
            <div>{{}}</div>
            <input v-model="itemsWithSelect[id].selected" type="checkbox" class="w-5 h-5 accent-neutral-600 my-1" />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
