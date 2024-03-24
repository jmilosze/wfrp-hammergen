<script setup lang="ts">
import ActionButton from "./ActionButton.vue";

const props = defineProps<{
  disabled?: boolean;
  title?: string;
  itemList: { name: string; id: string; description: string; selected: boolean }[];
}>();
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
