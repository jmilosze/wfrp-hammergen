<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import ViewCharacterWealth from "./ViewCharacterWealth.vue";
import ViewCharacterCorruption from "./ViewCharacterCorruption.vue";
import ViewCharacterTrappings from "./ViewCharacterTrappings.vue";
import ViewCharacterMagic from "./ViewCharacterMagic.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The second page of the paper character sheet: wealth, encumbrance and corruption side by side, the trappings, magic
// and faith, and the notes.
defineProps<{ character: CharacterFull }>();
</script>

<template>
  <div>
    <div class="grid @3xl:grid-cols-2 @5xl:grid-cols-3 items-start text-left gap-4 my-4">
      <ViewCharacterWealth :character="character" />
      <ViewCharacterCorruption :character="character" class="@3xl:col-span-2 @5xl:col-span-1" />
    </div>
    <ViewCharacterTrappings :character="character" class="my-4" />
    <ViewCharacterMagic :character="character" class="my-4" />
    <SectionCard v-if="character.notes" title="Notes" class="my-4">
      <p class="px-2 py-2 whitespace-pre-wrap wrap-anywhere">{{ character.notes }}</p>
    </SectionCard>
  </div>
</template>

<style scoped></style>
