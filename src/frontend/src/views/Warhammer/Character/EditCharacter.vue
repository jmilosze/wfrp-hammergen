<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Edition, EDITIONS } from "../../../services/wh/common.ts";
import { useEdition } from "../../../composables/edition.ts";
import EditCharacter4e from "./EditCharacter4e.vue";
import EditCharacter5e from "./EditCharacter5e.vue";

const props = defineProps<{
  id: string;
}>();

const route = useRoute();
const { edition: selectedEdition } = useEdition();

// The edition comes from the URL (?edition=5e); a new character uses the selected edition; old links are 4e.
const edition = computed<Edition>(
  () => EDITIONS.find((e) => e === route.query.edition) ?? (props.id === "create" ? selectedEdition.value : "4e"),
);
</script>

<template>
  <EditCharacter5e v-if="edition === '5e'" :id="id" />
  <EditCharacter4e v-else :id="id" />
</template>
