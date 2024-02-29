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
import { addSpaces } from "../../utils/string.ts";
import { useElSize } from "../../composables/viewSize.ts";
import { ViewSize } from "../../utils/viewSize.ts";

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

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);
</script>

<template>
  <Header title="Character details"> </Header>
  <div ref="contentContainerRef" class="flex flex-wrap">
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
  <div class="flex justify-between" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <div class="m-2 grow">
      <div class="mb-1">Basic</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Name</span>
                <span class="mr-3"> {{ addSpaces(character.name) }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Species</span>
                <span class="mr-3"> {{ addSpaces(character.species) }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Description</span>
                <span class="mr-3"> {{ addSpaces(character.description) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="m-2 grow">
      <div class="mb-1">Career</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Current</span>
                <span class="mr-3"> {{ addSpaces(character.careerName) }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Class</span>
                <span class="mr-3"> {{ addSpaces(character.className) }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Status</span>
                <span class="mr-3"> {{ addSpaces(character.status + " " + character.standing) }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Past Careers</span>
                <span class="mr-3"> {{ addSpaces(character.pastCareers.join(", ")) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex justify-between" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <div class="m-2 grow">
      <div class="mb-1">Movement</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Base</span>
                <span class="mr-3"> {{ character.movement }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Walk</span>
                <span class="mr-3"> {{ character.walk }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Run</span>
                <span class="mr-3"> {{ character.run }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="m-2 grow">
      <div class="mb-1">Wealth</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">D</span>
                <span class="mr-3"> {{ character.brass }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">SS</span>
                <span class="mr-3"> {{ character.silver }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">GC</span>
                <span class="mr-3"> {{ character.gold }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="m-2 grow">
      <div class="mb-1">Fate</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Fate</span>
                <span class="mr-3"> {{ character.fate }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Fortune</span>
                <span class="mr-3"> {{ character.fortune }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="m-2 grow">
      <div class="mb-1">Resilience</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Resilience</span>
                <span class="mr-3"> {{ character.resilience }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Resolve</span>
                <span class="mr-3"> {{ character.resolve }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
