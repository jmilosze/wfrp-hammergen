<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { ref, Ref } from "vue";
import { source } from "../services/wh/source.ts";

const props = defineProps<{ initSources: Record<string, string> }>();

const sources: Ref<{ name: string; dispName: string; notes: string; selected: boolean }[]> = ref([]);

for (const [allSourceName, allSourceDispName] of Object.entries(source)) {
  if (props.initSources && allSourceName in props.initSources) {
    sources.value.push({
      name: allSourceName,
      dispName: allSourceDispName,
      notes: props.initSources[allSourceName],
      selected: true,
    });
  } else {
    sources.value.push({ name: allSourceName, dispName: allSourceDispName, notes: "", selected: false });
  }
}
</script>

<template>
  <div>
    <div class="flex items-center mb-3">
      <div class="mb-1 mr-2">Sources</div>
      <ActionButton size="sm">Modify</ActionButton>
    </div>
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in sources.filter((x) => x.selected)" :key="src.name" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.dispName }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.notes }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
