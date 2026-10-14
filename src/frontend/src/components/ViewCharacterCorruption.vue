<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import SheetCell from "./SheetCell.vue";
import ViewCharacterList from "./ViewCharacterList.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The character view's Corruption and Mutation box: Corruption Points, then the mutations and creature traits as
// compact lists of names. The page leaves it out when there are no points and no entries.
defineProps<{ character: CharacterFull }>();

const bandClass = "px-2 py-1 bg-neutral-100 border-y border-neutral-300 font-semibold";
</script>

<template>
  <SectionCard title="Corruption and Mutation">
    <SheetCell title="Corruption Points">{{ character.corruption }}</SheetCell>
    <template v-if="character.mutations.length > 0">
      <div :class="bandClass">Mutations</div>
      <ViewCharacterList :items="character.mutations" routeName="mutation" />
    </template>
    <template v-if="character.traits.length > 0">
      <div :class="bandClass">Creature Traits</div>
      <ViewCharacterList :items="character.traits" routeName="trait" />
    </template>
  </SectionCard>
</template>

<style scoped></style>
