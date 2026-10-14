<script setup lang="ts">
import SheetCell from "./SheetCell.vue";
import SheetTable from "./SheetTable.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The top of the character view, as on the paper sheet: name, species, size and description, with Experience beside.
defineProps<{ character: CharacterFull }>();
</script>

<template>
  <div class="grid @3xl:grid-cols-[2fr_1fr] text-left gap-4 my-4">
    <!-- The description fills the height left beside Experience. -->
    <div class="flex flex-col">
      <SheetTable :columns="3">
        <SheetCell title="Name">{{ character.name }}</SheetCell>
        <SheetCell title="Species">{{ character.species }}</SheetCell>
        <SheetCell title="Size">{{ character.size }}</SheetCell>
      </SheetTable>
      <SheetTable v-if="character.description" class="-mt-px grow">
        <SheetCell title="Description">
          <p class="whitespace-pre-wrap wrap-anywhere">{{ character.description }}</p>
        </SheetCell>
      </SheetTable>
    </div>
    <SheetTable title="Experience" :columns="3">
      <SheetCell title="Unspent">{{ character.currentExp }}</SheetCell>
      <SheetCell title="Spent">{{ character.spentExp }}</SheetCell>
      <SheetCell title="Total">{{ character.totalExp }}</SheetCell>
    </SheetTable>
  </div>
</template>

<style scoped></style>
