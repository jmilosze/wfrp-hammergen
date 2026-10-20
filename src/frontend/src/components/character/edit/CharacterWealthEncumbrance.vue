<script setup lang="ts">
import { computed } from "vue";
import { Item } from "@/services/wh/content/item.ts";
import { encumbranceItems, getEncumbrance } from "@/services/wh/character/encumbrance.ts";
import { ValidationStatus } from "@/utils/validation.ts";
import { IdNumberValue } from "@/utils/idNumberValue.ts";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";

// The character editor's Wealth (typed in) and Encumbrance (of the equipped and carried trappings, looked up in
// itemList), side by side once there is room. A total over maxEncumbrance is marked.
const gold = defineModel<number>("gold", { required: true });
const silver = defineModel<number>("silver", { required: true });
const brass = defineModel<number>("brass", { required: true });

const props = defineProps<{
  goldValidation: ValidationStatus;
  silverValidation: ValidationStatus;
  brassValidation: ValidationStatus;
  equipped: IdNumberValue[];
  carried: IdNumberValue[];
  itemList: Item[];
  maxEncumbrance: number;
  disabled: boolean;
}>();

const encumbrance = computed(() =>
  getEncumbrance(encumbranceItems(props.equipped, props.itemList), encumbranceItems(props.carried, props.itemList)),
);
</script>

<template>
  <div class="flex flex-wrap gap-4 my-4">
    <SheetTable title="Wealth" :columns="3" class="grow basis-80">
      <SheetField v-model="gold" type="number" title="Gold" :validationStatus="goldValidation" :disabled="disabled" />
      <SheetField
        v-model="silver"
        type="number"
        title="Silver"
        :validationStatus="silverValidation"
        :disabled="disabled"
      />
      <SheetField
        v-model="brass"
        type="number"
        title="Brass"
        :validationStatus="brassValidation"
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
