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
// itemList), side by side once there is room, Wealth in one column while Encumbrance takes two rows. A total over
// maxEncumbrance is marked.
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
  <div class="@container/sheet-row my-4">
    <div class="grid @3xl/sheet-row:grid-cols-[1fr_2fr] items-start gap-4">
      <SheetTable title="Wealth" columns="short-beside-6">
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
      <div class="flex flex-col gap-1">
        <SheetTable title="Encumbrance" columns="short-6">
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
        <p class="text-sm text-neutral-700">
          <template v-if="encumbrance.containerCapacity > 0">
            In containers: {{ encumbrance.inContainers }} of {{ encumbrance.containerCapacity }} Enc. Carried trappings
            in containers don't count towards Carried; only the containers' own Enc does.
          </template>
          <template v-else>
            No containers. Equip or carry a pouch, sling bag or backpack, and the trappings it carries stop counting
            towards Carried.
          </template>
        </p>
      </div>
    </div>
  </div>
</template>
