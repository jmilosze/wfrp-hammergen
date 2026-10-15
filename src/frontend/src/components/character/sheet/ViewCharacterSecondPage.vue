<script setup lang="ts">
import SheetCard from "@/components/sheet/SheetCard.vue";
import ViewCharacterWealth from "./ViewCharacterWealth.vue";
import ViewCharacterCorruption from "./ViewCharacterCorruption.vue";
import ViewCharacterTrappings from "./ViewCharacterTrappings.vue";
import ViewCharacterMagic from "./ViewCharacterMagic.vue";
import { CharacterFull } from "@/services/wh/character/characterFull.ts";

// The second page of the paper character sheet: wealth, encumbrance and corruption side by side, the trappings, magic
// and faith, and the notes.
const props = defineProps<{ character: CharacterFull }>();

// Without corruption, mutations or traits the Corruption and Mutation box is left out and Encumbrance takes its column.
const hasCorruption =
  props.character.corruption > 0 || props.character.mutations.length > 0 || props.character.traits.length > 0;
</script>

<template>
  <div>
    <div
      class="grid @3xl:grid-cols-2 items-start text-left gap-4 my-4"
      :class="hasCorruption ? '@5xl:grid-cols-3' : '@5xl:grid-cols-[1fr_2fr]'"
    >
      <ViewCharacterWealth :character="character" />
      <ViewCharacterCorruption v-if="hasCorruption" :character="character" class="@3xl:col-span-2 @5xl:col-span-1" />
    </div>
    <ViewCharacterTrappings :character="character" class="my-4" />
    <ViewCharacterMagic :character="character" class="my-4" />
    <SheetCard v-if="character.notes" title="Notes" class="my-4">
      <p class="px-2 py-2 whitespace-pre-wrap wrap-anywhere">{{ character.notes }}</p>
    </SheetCard>
  </div>
</template>
