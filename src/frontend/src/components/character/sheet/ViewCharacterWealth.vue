<script setup lang="ts">
import SheetCell from "@/components/sheet/SheetCell.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import { CharacterFull } from "@/services/wh/character/characterFull.ts";

// The character view's Wealth and Encumbrance boxes; the total is marked when over the limit. The wrapper is display:
// contents, so the two boxes are laid out by the page (side by side in its grid or flex row).
defineProps<{ character: CharacterFull }>();
</script>

<template>
  <div class="contents text-left">
    <SheetTable title="Wealth" columns="short" class="grow basis-80">
      <SheetCell title="Gold">{{ character.gold }}</SheetCell>
      <SheetCell title="Silver">{{ character.silver }}</SheetCell>
      <SheetCell title="Brass">{{ character.brass }}</SheetCell>
    </SheetTable>
    <SheetTable title="Encumbrance" columns="short-6" class="grow basis-80">
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
