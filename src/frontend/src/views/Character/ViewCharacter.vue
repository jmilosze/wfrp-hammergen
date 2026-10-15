<script setup lang="ts">
import { ref } from "vue";
import { characterApi } from "../../services/wh/character/character.ts";
import { CharacterFull } from "../../services/wh/character/characterFull.ts";
import { authRequest } from "../../services/auth.ts";
import AlertBlock from "../../components/ui/AlertBlock.vue";
import ViewCharacter4e from "./ViewCharacter4e.vue";
import ViewCharacter5e from "./ViewCharacter5e.vue";

const props = defineProps<{
  id: string;
}>();

const character = ref<CharacterFull>();
const apiError = ref("");

try {
  character.value = await characterApi(authRequest).getElementForDisplay(props.id);
} catch {
  apiError.value = "Error. Could not pull data from server.";
}
</script>

<template>
  <AlertBlock v-if="apiError" alertType="red" :centered="true" @close="apiError = ''">{{ apiError }}</AlertBlock>
  <!-- data-print-desktop: printed at desktop layout, scaled to the paper (see style.css). -->
  <div v-else-if="character" data-print-desktop>
    <ViewCharacter5e v-if="character.edition === '5e'" :character="character" />
    <ViewCharacter4e v-else :character="character" />
  </div>
</template>
