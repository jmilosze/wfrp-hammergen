<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import CharacterModifiersAttributes from "./CharacterModifiersAttributes.vue";
import { ref } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
const modal = useModal();

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.lg, contentContainerRef);
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex items-center mb-2">
      <div class="mb-1 mr-2">Character modifiers</div>
      <ActionButton size="sm" @click="modal.showModal('modifiersHelpModal')">What are modifiers?</ActionButton>
    </div>

    <div v-if="isEqualOrGreater" class="flex gap-2 justify-between">
      <div class="rounded-xl border border-neutral-300 bg-neutral-50">
        <table class="w-full">
          <tbody>
            <tr>
              <th class="p-2 font-semibold">WS</th>
              <th class="p-2 font-semibold rounded">BS</th>
              <th class="p-2 font-semibold">S</th>
              <th class="p-2 font-semibold rounded">T</th>
              <th class="p-2 font-semibold">I</th>
              <th class="p-2 font-semibold rounded">Ag</th>
              <th class="p-2 font-semibold">Dex</th>
              <th class="p-2 font-semibold rounded">int</th>
              <th class="p-2 font-semibold">WP</th>
              <th class="p-2 font-semibold rounded">Fel</th>
            </tr>
            <tr>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 justify-between">
        <CharacterModifiersAttributes attribute2Name="WS" attribute1Name="BS" />
        <CharacterModifiersAttributes attribute2Name="S" attribute1Name="T" />
      </div>
      <div class="flex gap-2 justify-between mt-2">
        <CharacterModifiersAttributes attribute2Name="I" attribute1Name="Ag" />
        <CharacterModifiersAttributes attribute2Name="Dex" attribute1Name="Int" />
      </div>
      <div class="w-full mt-2">
        <CharacterModifiersAttributes attribute2Name="WP" attribute1Name="Fel" />
      </div>
    </div>

    <ModalWindow id="modifiersHelpModal">
      <template #header> Character modifiers </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div>
        Talent modifiers are automatically added to character sheet in both edit and view modes. For example, if you add
        a talent that modifies the Size, it will automatically affect the number of Wounds. Sum of all Attribute
        modifiers is displayed in "other" row in character sheet.
      </div>
      <div>
        All characters have default size Average, by using size modifier you can change is to Small (-1), Large (+1)
        etc.
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
