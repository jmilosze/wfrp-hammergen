<script setup lang="ts">
import { computed, ref, Ref, watch } from "vue";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import ActionButton from "./ActionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
// import FormInput from "./FormInput.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Item } from "../services/wh/item.ts";

type ItemWithNumber = {
  id: string;
  name: string;
  description: string;
  equipped: number;
  carried: number;
  stored: number;
};

const props = defineProps<{
  disabled?: boolean;
  itemList: Item[];
  initEquipped: Record<string, number>;
  initCarried: Record<string, number>;
  initStored: Record<string, number>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
  (e: "addClassItems"): void;
}>();

function anySelected(itemsWithNumber: ItemWithNumber): boolean {
  return itemsWithNumber.equipped !== 0 || itemsWithNumber.carried !== 0 || itemsWithNumber.stored !== 0;
}

const itemsWithNumber: Ref<Record<string, ItemWithNumber>> = ref({});
const itemsWithNumberList: Ref<ItemWithNumber[]> = ref([]);

function updateItemsWithNumber(
  selectedEquipped: Record<string, number>,
  selectedCarried: Record<string, number>,
  selectedStored: Record<string, number>,
  itemList: Item[],
) {
  itemsWithNumber.value = {};
  for (const item of itemList) {
    itemsWithNumber.value[item.id] = {
      id: item.id,
      name: item.name,
      description: item.description,
      equipped: 0,
      carried: 0,
      stored: 0,
    };
    if (item.id in selectedEquipped) {
      itemsWithNumber.value[item.id].equipped = selectedEquipped[item.id];
    }
    if (item.id in selectedCarried) {
      itemsWithNumber.value[item.id].carried = selectedCarried[item.id];
    }
    if (item.id in selectedStored) {
      itemsWithNumber.value[item.id].stored = selectedStored[item.id];
    }
  }
  itemsWithNumberList.value = Object.values(itemsWithNumberList.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

watch(
  () => props.initEquipped,
  (newVal) => {
    updateItemsWithNumber(newVal, props.initStored, props.initCarried, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.initCarried,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, props.initStored, newVal, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.initStored,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, props.initStored, newVal, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.itemList,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, props.initStored, props.initCarried, newVal);
  },
  { immediate: true },
);

const selectedItems = computed(() => itemsWithNumberList.value.filter((x) => anySelected(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "equipped", displayName: "Equipped", skipStackedTitle: false },
  { name: "carried", displayName: "Carried", skipStackedTitle: false },
  { name: "stored", displayName: "Stored", skipStackedTitle: false },
];

const resetPaginationCounter = ref(0);

function onModifyClick() {
  resetPaginationCounter.value += 1;
  modal.showModal("modifyTalentsModal");
  searchTerm.value = "";
  itemsWithNumberList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <div>Talents</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
      <ActionButton v-if="!disabled" size="sm" @click="emit('addClassItems')">Add species talents</ActionButton>
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
          <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.equipped }}</td>
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
        :items="itemsWithNumberList"
        :stackedViewSize="ViewSize.sm"
        :addCreateNewBtn="true"
        :addReloadBtn="true"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
        @createNew="emit('createNew')"
        @reload="emit('reload')"
      >
        <!--        <template #number="{ id }: { id: string }">-->
        <!--          <FormInput-->
        <!--            v-model="talentsWithNumber[id].number"-->
        <!--            type="number"-->
        <!--            class="w-20"-->
        <!--            @update:modelValue="emit('updated', { id: id, number: talentsWithNumber[id].number })"-->
        <!--          />-->
        <!--        </template>-->

        <!--        <template #description="{ id }: { id: string }">-->
        <!--          <div>-->
        <!--            {{ talentsWithNumber[id].description }}-->
        <!--            <div class="mb-1">-->
        <!--              <span class="font-semibold mr-1">Max rank</span>-->
        <!--              {{ talentsWithNumber[id].maxRank }}-->
        <!--              {{-->
        <!--                talentsWithNumber[id].maxRankFormula.includes("Bonus")-->
        <!--                  ? "(" + talentsWithNumber[id].maxRankFormula + ")"-->
        <!--                  : ""-->
        <!--              }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </template>-->
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
