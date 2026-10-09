<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Edition, EDITIONS } from "../../../services/wh/core/edition.ts";
import ViewCharacter4e from "./ViewCharacter4e.vue";
import ViewCharacter5e from "./ViewCharacter5e.vue";

defineProps<{
  id: string;
}>();

const route = useRoute();

// The edition comes from the URL (?edition=5e); links without it are 4e.
const edition = computed<Edition>(() => EDITIONS.find((e) => e === route.query.edition) ?? "4e");
</script>

<template>
  <ViewCharacter5e v-if="edition === '5e'" :id="id" />
  <ViewCharacter4e v-else :id="id" />
</template>
