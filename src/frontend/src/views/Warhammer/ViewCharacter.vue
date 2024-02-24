<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { UnauthorizedError, useAuthStore } from "../../stores/auth.ts";
import { ref, Ref } from "vue";
import { CharacterApi } from "../../services/wh/character.ts";
import { authRequest } from "../../services/auth.ts";
import { newCharacterFull } from "../../services/wh/characterFull.ts";

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
</script>

<template>
  <Header title="Character details"> </Header>
  <div v-if="id === 'create'">Viewcharacter.</div>
  <div v-else>View character {{ id }}</div>
</template>

<style scoped></style>
