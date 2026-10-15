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
import { ValidationStatus } from "@/utils/validation.ts";

const name = defineModel<string>("name", { required: true });
const attributes = defineModel<AttributeName[]>("attributes", { required: true });
const status = defineModel<StatusTier>("status", { required: true });
const standing = defineModel<StatusStanding>("standing", { required: true });
const items = defineModel<string>("items", { required: true });
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
  validName: ValidationStatus;
  validItems: ValidationStatus;
}>();

const emit = defineEmits<{
  (e: "reloadWhSkillList"): void;
  (e: "reloadWhTalentList"): void;
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
            <SheetCard title="Trappings">
              <FormTextarea v-model="items" :validationStatus="validItems" :disabled="!canEdit" bare size="sm" />
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
