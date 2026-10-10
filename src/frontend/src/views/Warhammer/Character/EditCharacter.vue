<script setup lang="ts">
import { computed, ref } from "vue";
import { Edition } from "../../../services/wh/core/edition.ts";
import { useEdition } from "../../../composables/edition.ts";
import { characterApi } from "../../../services/wh/character/character.ts";
import { authRequest } from "../../../services/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import EditCharacter4e from "./EditCharacter4e.vue";
import EditCharacter5e from "./EditCharacter5e.vue";

const props = defineProps<{
  id: string;
}>();

const { edition: selectedEdition } = useEdition();

// A new character uses the selected edition; an existing one keeps its own.
const savedEdition = ref<Edition>();
const apiError = ref("");

if (props.id !== "create") {
  try {
    savedEdition.value = await characterApi(authRequest).getEdition(props.id);
  } catch {
    apiError.value = "Error. Could not pull data from server.";
  }
}

const edition = computed(() => (props.id === "create" ? selectedEdition.value : savedEdition.value));
</script>

<template>
  <AlertBlock v-if="apiError" alertType="red" :centered="true" @close="apiError = ''">{{ apiError }}</AlertBlock>
  <EditCharacter5e v-else-if="edition === '5e'" :id="id" />
  <EditCharacter4e v-else-if="edition === '4e'" :id="id" />
</template>
