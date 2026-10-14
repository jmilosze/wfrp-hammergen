<script setup lang="ts">
import SheetCell from "./SheetCell.vue";
import SheetTable from "./SheetTable.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The character view's Wealth beside Encumbrance, as in the editor; the total is marked when over the limit.
defineProps<{ character: CharacterFull }>();
</script>

<template>
  <div class="flex flex-wrap text-left gap-4">
    <SheetTable title="Wealth" :columns="3" class="grow basis-80">
      <SheetCell title="Gold">{{ character.gold }}</SheetCell>
      <SheetCell title="Silver">{{ character.silver }}</SheetCell>
      <SheetCell title="Brass">{{ character.brass }}</SheetCell>
    </SheetTable>
    <SheetTable title="Encumbrance" :columns="3" class="grow basis-80">
      <SheetCell title="Weapons">{{ character.encWeapon }}</SheetCell>
      <SheetCell title="Armour">{{ character.encArmor }}</SheetCell>
      <SheetCell title="Other">{{ character.encOther }}</SheetCell>
      <SheetCell title="Carried">{{ character.encCarried }}</SheetCell>
      <SheetCell title="Total">
        <span
          :class="{ 'text-error font-semibold': character.encTotal > character.encMax }"
          :title="character.encTotal > character.encMax ? 'Over the Encumbrance limit' : undefined"
        >
          {{ character.encTotal }}
        </span>
      </SheetCell>
      <SheetCell title="Max">{{ character.encMax }}</SheetCell>
    </SheetTable>
  </div>
</template>

<style scoped></style>
