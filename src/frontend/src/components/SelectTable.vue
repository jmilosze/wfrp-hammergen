<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";

interface itemWithSelect {
  item: { name: string; id: string; description: string };
  selected: boolean;
}
const props = defineProps<{
  disabled?: boolean;
  title?: string;
  itemList: { name: string; id: string; description: string }[];
  initSelectedItems: Set<string>;
}>();

const itemsWithSelect: Ref<Record<string, itemWithSelect>> = ref({});
const itemsWithSelectList: Ref<itemWithSelect[]> = ref([]);

watch(
  () => props.initSelectedItems,
  (newVal) => {
    itemsWithSelect.value = {};
    for (const item of props.itemList) {
      itemsWithSelect.value[item.id] = { item: item, selected: false };
      if (newVal && newVal.has(item.id)) {
        itemsWithSelect.value[item.id].selected = true;
      }
    }
    itemsWithSelectList.value = Object.values(itemsWithSelect.value).sort((a, b) =>
      a.item.name.localeCompare(b.item.name),
    );
  },
  { immediate: true },
);

function updateItemsWithSelect();

const selectedItems = computed(() => itemsWithSelectList.value.filter((x) => x.selected));
</script>

<template>
  <div>
    <div class="flex items-center" :class="disabled ? 'mb-1' : 'mb-2'">
      <div v-if="title" class="mr-2">{{ title }}</div>
      <ActionButton v-if="!disabled" size="sm">Modify</ActionButton>
    </div>
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Description</th>
          </tr>
        </thead>
        <tbody>
          <!--          <tr v-for="src in selectedSources" :key="src.id" class="bg-white hover:bg-neutral-200">-->
          <!--            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>-->
          <!--            <td class="py-2 px-5 border-b border-neutral-300">{{ src.notes }}</td>-->
          <!--          </tr>-->
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
