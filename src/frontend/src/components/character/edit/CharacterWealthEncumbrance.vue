<script setup lang="ts">
import { computed } from "vue";
import { Character } from "../../../services/wh/character/character.ts";
import { Item } from "../../../services/wh/content/item.ts";
import { encumbranceItems, getEncumbrance } from "../../../services/wh/character/encumbrance.ts";
import SheetTable from "../../sheet/SheetTable.vue";
import SheetField from "../../sheet/SheetField.vue";
import SheetCell from "../../sheet/SheetCell.vue";

// The character editor's Wealth (typed in) and Encumbrance (of the equipped and carried trappings, from itemList),
// side by side once there is room. A total over the limit is marked.
const character = defineModel<Character>({ required: true });

const props = defineProps<{ itemList: Item[]; disabled: boolean }>();

const validBrass = computed(() => character.value.validateBrass());
const validSilver = computed(() => character.value.validateSilver());
const validGold = computed(() => character.value.validateGold());

const encumbrance = computed(() =>
  getEncumbrance(
    encumbranceItems(character.value.equippedItems, props.itemList),
    encumbranceItems(character.value.carriedItems, props.itemList),
  ),
);
const maxEncumbrance = computed(() => character.value.getMaxEncumbrance());
</script>

<template>
  <div class="flex flex-wrap gap-4 my-4">
    <SheetTable title="Wealth" :columns="3" class="grow basis-80">
      <SheetField
        v-model="character.gold"
        type="number"
        title="Gold"
        :validationStatus="validGold"
        :disabled="disabled"
      />
      <SheetField
        v-model="character.silver"
        type="number"
        title="Silver"
        :validationStatus="validSilver"
        :disabled="disabled"
      />
      <SheetField
        v-model="character.brass"
        type="number"
        title="Brass"
        :validationStatus="validBrass"
        :disabled="disabled"
      />
    </SheetTable>
    <SheetTable title="Encumbrance" :columns="3" class="grow basis-80">
      <SheetCell title="Weapons">{{ encumbrance.weapons }}</SheetCell>
      <SheetCell title="Armour">{{ encumbrance.armour }}</SheetCell>
      <SheetCell title="Other">{{ encumbrance.otherEquipped }}</SheetCell>
      <SheetCell title="Carried">{{ encumbrance.carried }}</SheetCell>
      <SheetCell title="Total">
        <span
          :class="{ 'text-error font-semibold': encumbrance.total > maxEncumbrance }"
          :title="encumbrance.total > maxEncumbrance ? 'Over the Encumbrance limit' : undefined"
        >
          {{ encumbrance.total }}
        </span>
      </SheetCell>
      <SheetCell title="Max">{{ maxEncumbrance }}</SheetCell>
    </SheetTable>
  </div>
</template>
