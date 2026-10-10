<script setup lang="ts">
import { computed, ref } from "vue";
import { useEdition } from "../../../composables/edition.ts";
import { Character, characterApi } from "../../../services/wh/character/character.ts";
import { authRequest } from "../../../services/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import EditCharacter4e from "./EditCharacter4e.vue";
import EditCharacter5e from "./EditCharacter5e.vue";

const props = defineProps<{
  id: string;
}>();

const { edition: selectedEdition } = useEdition();

// A new character uses the selected edition; an existing one is loaded once here and keeps its own.
const character = ref<Character>();
const apiError = ref("");

if (props.id !== "create") {
  try {
    character.value = await characterApi(authRequest).getElement(props.id);
  } catch {
    apiError.value = "Error. Could not pull data from server.";
  }
}

const edition = computed(() => (props.id === "create" ? selectedEdition.value : character.value?.edition));
</script>

<template>
  <AlertBlock v-if="apiError" alertType="red" :centered="true" @close="apiError = ''">{{ apiError }}</AlertBlock>
  <EditCharacter5e v-else-if="edition === '5e'" :id="id" :character="character" />
  <EditCharacter4e v-else-if="edition === '4e'" :id="id" :character="character" />
</template>
