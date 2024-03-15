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
const sm = useElSize(ViewSize.sm, contentContainerRef);
const lg = useElSize(ViewSize.lg, contentContainerRef);

const inputClass = ref([
  "border",
  "border-neutral-300",
  "rounded",
  "w-full",
  "h-10",
  "px-2",
  "focus:outline-neutral-700",
  "focus:border-transparent",
  "focus:outline",
  "focus:outline-2",
  "disabled:bg-neutral-200",
]);
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex items-center mb-2">
      <div class="mb-1 mr-2">Character modifiers</div>
      <ActionButton size="sm" @click="modal.showModal('modifiersHelpModal')">What are modifiers?</ActionButton>
    </div>

    <div v-if="lg.isEqualOrGreater.value">
      <CharacterModifiersAttributes :attributeNames="['WS', 'BS', 'S', 'T', 'I', 'Ag', 'Dex', 'Int', 'WP', 'Fel']">
        <template #WS><input type="number" :class="inputClass" /></template>
        <template #BS><input type="number" :class="inputClass" /></template>
        <template #S><input type="number" :class="inputClass" /></template>
        <template #T><input type="number" :class="inputClass" /></template>
        <template #I><input type="number" :class="inputClass" /></template>
        <template #Ag><input type="number" :class="inputClass" /></template>
        <template #Dex><input type="number" :class="inputClass" /></template>
        <template #Int><input type="number" :class="inputClass" /></template>
        <template #WP><input type="number" :class="inputClass" /></template>
        <template #Fel><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
    </div>
    <div v-else-if="sm.isEqualOrGreater.value">
      <CharacterModifiersAttributes :attributeNames="['WS', 'BS', 'S', 'T']" class="mt-2">
        <template #WS><input type="number" :class="inputClass" /></template>
        <template #BS><input type="number" :class="inputClass" /></template>
        <template #S><input type="number" :class="inputClass" /></template>
        <template #T><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['I', 'Ag', 'Dex', 'Int']" class="mt-2">
        <template #I><input type="number" :class="inputClass" /></template>
        <template #Ag><input type="number" :class="inputClass" /></template>
        <template #Dex><input type="number" :class="inputClass" /></template>
        <template #Int><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['WP', 'Fel']" class="mt-2">
        <template #WP><input type="number" :class="inputClass" /></template>
        <template #Fel><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
    </div>
    <div v-else>
      <CharacterModifiersAttributes :attributeNames="['WS', 'BS']" class="mt-2">
        <template #WS><input type="number" :class="inputClass" /></template>
        <template #BS><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['S', 'T']" class="mt-2">
        <template #S><input type="number" :class="inputClass" /></template>
        <template #T><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['I', 'Ag']" class="mt-2">
        <template #I><input type="number" :class="inputClass" /></template>
        <template #Ag><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['Dex', 'Int']" class="mt-2">
        <template #Dex><input type="number" :class="inputClass" /></template>
        <template #Int><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
      <CharacterModifiersAttributes :attributeNames="['WP', 'Fel']" class="mt-2">
        <template #WP><input type="number" :class="inputClass" /></template>
        <template #Fel><input type="number" :class="inputClass" /></template>
      </CharacterModifiersAttributes>
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
