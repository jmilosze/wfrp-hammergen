<script setup lang="ts">
import { ref, watch } from "vue";
import { authRequest } from "../services/auth.ts";
import {
  CareerMatch,
  findCareerMatches,
  getCareersForSkill,
  getCareersForTalent,
  printClassName,
} from "../services/wh/content/career.ts";
import { Edition } from "../services/wh/core/edition.ts";
import ListTable from "./ListTable.vue";
import AlertBlock from "./AlertBlock.vue";
import TextLink from "./TextLink.vue";

const props = defineProps<{
  entityId: string;
  parentGroupIds: Set<string>;
  type: "skill" | "talent";
  edition: Edition;
}>();

const loading = ref(false);
const apiError = ref("");
const careerMatches = ref<CareerMatch[]>([]);

async function loadCareers() {
  if (!props.entityId || props.entityId === "create") {
    careerMatches.value = [];
    return;
  }

  loading.value = true;
  apiError.value = "";

  const searchIds = new Set<string>([props.entityId, ...props.parentGroupIds]);
  const searchIdArray = Array.from(searchIds);

  try {
    const careers =
      props.type === "skill"
        ? await getCareersForSkill(authRequest, searchIdArray, props.edition)
        : await getCareersForTalent(authRequest, searchIdArray, props.edition);

    const matches: CareerMatch[] = [];
    for (const career of careers) {
      const match = findCareerMatches(career, searchIds, props.type);
      if (match !== null) {
        matches.push(match);
      }
    }
    matches.sort((a, b) => a.name.localeCompare(b.name));
    careerMatches.value = matches;
  } catch {
    apiError.value = "Error. Could not pull career data from server.";
  } finally {
    loading.value = false;
  }
}

watch(
  [() => props.entityId, () => props.parentGroupIds, () => props.edition],
  () => {
    loadCareers();
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div v-if="entityId && entityId !== 'create'" class="my-4 text-left">
    <AlertBlock v-if="apiError" alertType="red" @close="apiError = ''">
      {{ apiError }}
    </AlertBlock>

    <ListTable :title="`Careers with this ${type === 'skill' ? 'skill' : 'talent'}`" :loading="loading">
      <template #headers>
        <th class="py-2 px-2 border-b border-neutral-300">Class</th>
        <th class="py-2 px-2 border-b border-neutral-300">Levels</th>
      </template>
      <tr v-if="careerMatches.length === 0">
        <td colspan="3" class="text-neutral-500 italic px-2 py-2">
          No careers have this {{ type === "skill" ? "skill" : "talent" }}.
        </td>
      </tr>
      <tr v-for="match in careerMatches" :key="match.id" class="hover:bg-neutral-200">
        <td class="py-2 px-2 border-b border-neutral-300 font-semibold">
          <TextLink routeName="career" :params="{ id: match.id }">
            {{ match.name }}
          </TextLink>
        </td>
        <td class="py-2 px-2 border-b border-neutral-300 text-neutral-600">
          {{ printClassName(match.careerClass) }}
        </td>
        <td class="py-2 px-2 border-b border-neutral-300 text-neutral-800">
          {{ match.levels.join(", ") }}
        </td>
      </tr>
    </ListTable>
  </div>
</template>

<style scoped></style>
