<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { UnauthorizedError, useAuthStore } from "../../stores/auth.ts";
import { ref, Ref } from "vue";
import { CharacterApi } from "../../services/wh/character.ts";
import { authRequest } from "../../services/auth.ts";
import { CharacterFullToCsv, newCharacterFull } from "../../services/wh/characterFull.ts";
import ActionButton from "../../components/ActionButton.vue";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
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

function saveCsv() {
  const blob = new Blob([CharacterFullToCsv(character.value)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.csv`);
}

function print() {
  const divContents = document.getElementById("character")?.innerHTML as string;
  const a = window.open("", "") as Window;
  a.document.write("<html>");
  a.document.write("<body >");
  a.document.write(divContents);
  a.document.write("</body></html>");
  a.document.close();
  a.print();
  a.close();
}
</script>

<template>
  <Header title="Character details"> </Header>
  <div class="flex flex-wrap">
    <ActionButton :size="'sm'" class="m-1" @click="saveCsv()">Download CSV</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="saveJson()">Download JSON</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="print()">Print</ActionButton>
    <ActionButton
      v-if="character.canEdit"
      :size="'sm'"
      class="m-1"
      @click="router.push({ name: 'character', params: { id: id } })"
      >Edit</ActionButton
    >
    <ActionButton :size="'sm'" class="m-1" @click="router.push({ name: 'characters' })">Back to list</ActionButton>
  </div>
  <div id="character">Description of the character asd asd asd asda das asd asd</div>
</template>

<style scoped></style>
