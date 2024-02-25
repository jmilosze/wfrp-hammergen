<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { UnauthorizedError, useAuthStore } from "../../stores/auth.ts";
import { ref, Ref } from "vue";
import { CharacterApi } from "../../services/wh/character.ts";
import { authRequest } from "../../services/auth.ts";
import { newCharacterFull } from "../../services/wh/characterFull.ts";
import ActionButton from "../../components/ActionButton.vue";
import { saveAs } from "file-saver";

const props = defineProps<{
  id: string;
}>();

const authStore = useAuthStore();
const characterApi = new CharacterApi(authRequest);

const errors: Ref<string[]> = ref([]);
const character = ref(newCharacterFull());
await loadCharacter();

async function loadCharacter() {
  errors.value = [];
  try {
    character.value = await authStore.callAndLogoutIfUnauthorized(characterApi.getElementForDisplay)(props.id);
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      errors.value.push("Server Error.");
      throw error;
    }
  }
}

function saveJson() {
  const blob = new Blob([JSON.stringify(character.value, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.json`);
}
</script>

<template>
  <Header title="Character details"> </Header>
  <div class="flex flex-wrap">
    <ActionButton :size="'sm'" class="m-1">Download CSV</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="saveJson()">Download JSON</ActionButton>
    <ActionButton :size="'sm'" class="m-1">Print</ActionButton>
    <ActionButton v-if="character.canEdit" :size="'sm'" class="m-1">Edit</ActionButton>
    <ActionButton :size="'sm'" class="m-1">Back to list</ActionButton>
  </div>
</template>

<style scoped></style>
