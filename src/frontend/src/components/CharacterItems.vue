<script setup lang="ts">
import { computed, ref, Ref, watch } from "vue";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import ActionButton from "./ActionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Item, printItemType } from "../services/wh/item.ts";
import { ValidationStatus } from "../utils/validation.ts";
import { addSpaces, truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import ReloadButton from "./ReloadButton.vue";
import LinkButton from "./LinkButton.vue";

const DESC_CHARS = 100;

type ItemWithNumber = {
  id: string;
  name: string;
  description: string;
  canBeEquipped: boolean;
  canBeCarried: boolean;
  itemType: string;
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
  equippedValidationStatus: ValidationStatus;
  storedValidationStatus: ValidationStatus;
  carriedValidationStatus: ValidationStatus;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "equippedUpdated", value: { id: string; number: number }): void;
  (e: "carriedUpdated", value: { id: string; number: number }): void;
  (e: "storedUpdated", value: { id: string; number: number }): void;
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
      name: addSpaces(item.name),
      description: truncate(addSpaces(item.description), DESC_CHARS),
      equipped: 0,
      carried: 0,
      stored: 0,
      itemType: printItemType(item.type),
      canBeEquipped: item.canBeEquipped(),
      canBeCarried: item.canBeCarried(),
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
  itemsWithNumberList.value = Object.values(itemsWithNumber.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

watch(
  () => props.initEquipped,
  (newVal) => {
    updateItemsWithNumber(newVal, props.initCarried, props.initStored, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.initCarried,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, newVal, props.initStored, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.initStored,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, props.initCarried, newVal, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.itemList,
  (newVal) => {
    updateItemsWithNumber(props.initEquipped, props.initCarried, props.initStored, newVal);
  },
  { immediate: true },
);

const selectedItems = computed(() => itemsWithNumberList.value.filter((x) => anySelected(x)));
const selectedEquipped = computed(() => selectedItems.value.filter((x) => x.equipped !== 0));
const selectedStored = computed(() => selectedItems.value.filter((x) => x.stored !== 0));
const selectedCarried = computed(() => selectedItems.value.filter((x) => x.carried !== 0));

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
  modal.showModal("modifyItemsModal");
  searchTerm.value = "";
  itemsWithNumberList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1 flex-wrap">
      <div>Trappings</div>
      <div class="flex gap-2 flex-wrap">
        <ActionButton v-if="!disabled" class="flex-1 btn btn-sm" @click="onModifyClick">
          <span class="flex-1">Modify</span>
        </ActionButton>
        <ActionButton v-if="!disabled" class="whitespace-nowrap flex-1 btn btn-sm" @click="emit('addClassItems')">
          <span class="flex-1">Add class items</span>
        </ActionButton>
        <ActionButton v-if="!disabled" class="whitespace-nowrap flex-1 btn btn-danger btn-sm" @click="emit('clearAll')">
          <span class="flex-1">Clear all</span>
        </ActionButton>
      </div>
    </div>
    <div class="border border-neutral-300 rounded p-2 min-w-fit">
      <div v-if="props.loading" class="flex justify-center">
        <SpinnerAnimation class="w-14 m-2" />
      </div>
      <div v-else class="flex gap-4 flex-wrap">
        <div class="flex-1">
          <div class="mb-1">Equipped</div>
          <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="border-b border-neutral-300 py-2 px-2">Name</th>
                  <th class="border-b border-neutral-300 py-2 px-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="src in selectedEquipped" :key="src.id" class="bg-white hover:bg-neutral-200">
                  <td class="py-2 px-2 border-b border-neutral-300">
                    <TextLink routeName="item" :params="{ id: src.id }">
                      {{ addSpaces(src.name) }}
                    </TextLink>
                  </td>
                  <td class="py-2 px-2 border-b border-neutral-300">{{ src.equipped }}</td>
                </tr>
              </tbody>
            </table>
            <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
          </div>
        </div>
        <div class="flex-1">
          <div class="mb-1">Carried</div>
          <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="border-b border-neutral-300 py-2 px-2">Name</th>
                  <th class="border-b border-neutral-300 py-2 px-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="src in selectedCarried" :key="src.id" class="bg-white hover:bg-neutral-200">
                  <td class="py-2 px-2 border-b border-neutral-300">
                    <TextLink routeName="item" :params="{ id: src.id }">
                      {{ addSpaces(src.name) }}
                    </TextLink>
                  </td>
                  <td class="py-2 px-2 border-b border-neutral-300">{{ src.carried }}</td>
                </tr>
              </tbody>
            </table>
            <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
          </div>
        </div>
        <div class="flex-1">
          <div class="mb-1">Stored</div>
          <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="border-b border-neutral-300 py-2 px-2">Name</th>
                  <th class="border-b border-neutral-300 py-2 px-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="src in selectedStored" :key="src.id" class="bg-white hover:bg-neutral-200">
                  <td class="py-2 px-2 border-b border-neutral-300">
                    <TextLink routeName="item" :params="{ id: src.id }">
                      {{ addSpaces(src.name) }}
                    </TextLink>
                  </td>
                  <td class="py-2 px-2 border-b border-neutral-300">{{ src.stored }}</td>
                </tr>
              </tbody>
            </table>
            <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[equippedValidationStatus.valid ? 'hidden' : '']">
      {{ equippedValidationStatus.message }}
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[carriedValidationStatus.valid ? 'hidden' : '']">
      {{ carriedValidationStatus.message }}
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[storedValidationStatus.valid ? 'hidden' : '']">
      {{ storedValidationStatus.message }}
    </div>
    <ModalWindow id="modifyItemsModal" size="lg">
      <template #header> Modify trappings </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithNumberList"
        :stackedViewSize="ViewSize.md"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        cellPadding="px-2"
        elementId="modal"
        @reload="emit('reload')"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" routeName="item" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />

        <template #name="{ id }: { id: string }">
          <TextLink routeName="item" :params="{ id: id }">{{ addSpaces(itemsWithNumber[id].name) }}</TextLink>
        </template>

        <template #equipped="{ id }: { id: string }">
          <FormInput
            v-if="itemsWithNumber[id].canBeEquipped"
            v-model="itemsWithNumber[id].equipped"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('equippedUpdated', { id: id, number: itemsWithNumber[id].equipped })"
          />
          <div v-else>N/A</div>
        </template>

        <template #carried="{ id }: { id: string }">
          <FormInput
            v-if="itemsWithNumber[id].canBeCarried"
            v-model="itemsWithNumber[id].carried"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('carriedUpdated', { id: id, number: itemsWithNumber[id].carried })"
          />
          <div v-else>N/A</div>
        </template>

        <template #stored="{ id }: { id: string }">
          <FormInput
            v-model="itemsWithNumber[id].stored"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('storedUpdated', { id: id, number: itemsWithNumber[id].stored })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div class="min-w-40">
            <div class="mb-1">
              <span class="font-semibold mr-1">Type</span>
              {{ itemsWithNumber[id].itemType }}
            </div>
            {{ itemsWithNumber[id].description }}
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
