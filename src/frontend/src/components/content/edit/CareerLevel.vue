<script setup lang="ts">
import SelectTable from "@/components/picker/SelectTable.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import LabelPicker from "@/components/picker/LabelPicker.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import { AttributeName, attributeNameList, printAttributeName } from "@/services/wh/core/attributes.ts";
import {
  printStatusStanding,
  printStatusTier,
  StatusStanding,
  statusStandingList,
  StatusTier,
  statusTierList,
} from "@/services/wh/content/career.ts";
import type { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { Item } from "@/services/wh/content/item.ts";
import { CareerMoney, CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import CareerTrappings from "./CareerTrappings.vue";
import CareerTrappingsHelp from "./CareerTrappingsHelp.vue";
import { ValidationStatus } from "@/utils/validation.ts";

const name = defineModel<string>("name", { required: true });
const attributes = defineModel<AttributeName[]>("attributes", { required: true });
const status = defineModel<StatusTier>("status", { required: true });
const standing = defineModel<StatusStanding>("standing", { required: true });
const items = defineModel<string>("items", { required: true });
const trappings = defineModel<CareerTrappingEntry[]>("trappings", { required: true });
const money = defineModel<CareerMoney[]>("money", { required: true });
const exists = defineModel<boolean>("exists", { required: true });

defineProps<{
  level: string;
  canEdit: boolean;
  skills: Set<string>;
  talents: Set<string>;
  whSkillList: Skill[];
  whSkillListLoading: boolean;
  whTalentList: Talent[];
  whTalentListLoading: boolean;
  whItemList: Item[];
  whItemListLoading: boolean;
  validName: ValidationStatus;
  validItems: ValidationStatus;
  validTrappings: ValidationStatus;
}>();

const emit = defineEmits<{
  (e: "reloadWhSkillList"): void;
  (e: "reloadWhTalentList"): void;
  (e: "reloadWhItemList"): void;
  (e: "updateSkill", value: { id: string; selected: boolean }): void;
  (e: "updateTalent", value: { id: string; selected: boolean }): void;
}>();

// The level's characteristics are labels in the order added; Add offers those not in the list yet.
// The level's characteristics keep the order they were added in.
const characteristicOpts = attributeNameList
  .filter((x) => x !== AttributeName.None && x !== AttributeName.Various)
  .map((x) => ({ text: printAttributeName(x), value: x }));

const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));
</script>
<template>
  <!-- A level of the career: ticking the box in the title band adds the level, unticking clears it. -->
  <SheetCard :title="`Level ${level}`">
    <template #hint>
      <FormCheckbox
        :checked="exists"
        :disabled="!canEdit"
        :aria-label="`Level ${level} exists`"
        @change="exists = !exists"
      />
    </template>
    <Transition
      enterActiveClass="transition-all duration-150 ease-out"
      enterFromClass="opacity-0"
      enterToClass="opacity-100"
      leaveActiveClass="transition-all duration-150 ease-in"
      leaveFromClass="opacity-100"
      leaveToClass="opacity-0"
    >
      <div v-if="exists" class="@container p-2">
        <div class="flex flex-col @3xl:flex-row text-left gap-4">
          <div class="flex-1 flex flex-col gap-4">
            <SheetTable>
              <SheetField v-model="name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
              <SheetSelect v-model="status" title="Status" :options="statusTierOpts" :disabled="!canEdit" />
              <SheetSelect v-model="standing" title="Standing" :options="statusStandingOpts" :disabled="!canEdit" />
            </SheetTable>
            <LabelPicker
              v-model="attributes"
              title="Characteristics"
              :options="characteristicOpts"
              :disabled="!canEdit"
              inAddedOrder
            />
            <!-- The level's trappings as data and, for careers whose trappings are not data yet, their text (it goes
                 once emptied), straight in the card. Read-only, a level without trappings as data shows only its text. -->
            <SheetCard title="Trappings">
              <template v-if="canEdit" #hint>
                <CareerTrappingsHelp />
              </template>
              <div class="flex flex-col gap-4 p-2">
                <CareerTrappings
                  v-if="canEdit || trappings.length > 0 || money.length > 0"
                  v-model:trappings="trappings"
                  v-model:money="money"
                  :itemList="whItemList"
                  :loading="whItemListLoading"
                  :disabled="!canEdit"
                  :validationStatus="validTrappings"
                  @reload="emit('reloadWhItemList')"
                />
                <template v-if="items !== ''">
                  <FormTextarea v-if="canEdit" v-model="items" :validationStatus="validItems" size="sm" />
                  <p v-else class="whitespace-pre-line">{{ items }}</p>
                </template>
              </div>
            </SheetCard>
          </div>
          <div class="flex-1 flex flex-col gap-4">
            <SelectTable
              :disabled="!canEdit"
              :selected="skills"
              :itemList="whSkillList"
              title="Skills"
              modalTitle="Edit skills"
              :loading="whSkillListLoading"
              routeName="skill"
              :truncateModalDescription="100"
              removable
              disableDescription
              @reload="emit('reloadWhSkillList')"
              @selected="(e) => emit('updateSkill', { id: e.id, selected: e.selected })"
            />
            <SelectTable
              :disabled="!canEdit"
              :selected="talents"
              :itemList="whTalentList"
              title="Talents"
              modalTitle="Edit talents"
              :loading="whTalentListLoading"
              routeName="talent"
              :truncateModalDescription="100"
              removable
              disableDescription
              @reload="emit('reloadWhTalentList')"
              @selected="(e) => emit('updateTalent', { id: e.id, selected: e.selected })"
            />
          </div>
        </div>
      </div>
    </Transition>
  </SheetCard>
</template>
