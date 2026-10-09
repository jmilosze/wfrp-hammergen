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
import SpinnerAnimation from "./SpinnerAnimation.vue";
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
    <div class="text-xl font-bold mb-2">Careers with this {{ type === "skill" ? "skill" : "talent" }}</div>

    <AlertBlock v-if="apiError" alertType="red" @close="apiError = ''">
      {{ apiError }}
    </AlertBlock>

    <div v-if="loading" class="flex justify-center my-4">
      <SpinnerAnimation class="w-8 h-8" />
    </div>

    <div v-else-if="careerMatches.length === 0" class="text-neutral-500 italic py-2">
      No careers have this {{ type === "skill" ? "skill" : "talent" }}.
    </div>

    <div v-else class="border border-neutral-300 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-300">
            <th class="py-2 px-5">Career</th>
            <th class="py-2 px-5">Class</th>
            <th class="py-2 px-5">Levels</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="match in careerMatches"
            :key="match.id"
            class="bg-white hover:bg-neutral-200 border-b border-neutral-300 last:border-b-0"
          >
            <td class="py-2 px-5 font-semibold">
              <TextLink routeName="career" :params="{ id: match.id }">
                {{ match.name }}
              </TextLink>
            </td>
            <td class="py-2 px-5 text-neutral-600">
              {{ printClassName(match.careerClass) }}
            </td>
            <td class="py-2 px-5 text-neutral-800">
              {{ match.levels.join(", ") }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-2 w-full" />
    </div>
  </div>
</template>

<style scoped></style>
