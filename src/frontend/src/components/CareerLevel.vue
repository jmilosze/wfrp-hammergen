<script setup lang="ts">
import SelectTable from "./SelectTable.vue";
import SelectInput from "./SelectInput.vue";
import MultipleCheckboxInput from "./MultipleCheckboxInput.vue";
import FormInput from "./FormInput.vue";
import FormTextarea from "./FormTextarea.vue";
import { AttributeName, attributeNameList, printAttributeName } from "../services/wh/attributes.ts";
import {
  printStatusStanding,
  printStatusTier,
  StatusStanding,
  statusStandingList,
  StatusTier,
  statusTierList,
} from "../services/wh/career.ts";
import type { Skill } from "../services/wh/skill.ts";
import { Talent } from "../services/wh/talent.ts";
import { ValidationStatus } from "../utils/validation.ts";
import { ref } from "vue";
import { useElSize } from "../composables/viewSize.ts";

const name = defineModel<string>("name", { required: true });
const attributes = defineModel<AttributeName[]>("attributes", { required: true });
const status = defineModel<StatusTier>("status", { required: true });
const standing = defineModel<StatusStanding>("standing", { required: true });
const items = defineModel<string>("items", { required: true });
const exists = defineModel<boolean>("exists", { required: true });

defineProps<{
  level: string;
  singleColumn: boolean;
  canEdit: boolean;
  initialSkills: Set<string>;
  initialTalents: Set<string>;
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

const attributeOpts = attributeNameList
  .filter((x) => x !== AttributeName.None && x !== AttributeName.Various)
  .map((x) => ({ text: printAttributeName(x), value: x }));
const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));

const skillsTableRef = ref<HTMLDivElement | null>(null);
const { isEqualOrGreater } = useElSize(400, skillsTableRef);
</script>
<template>
  <div>
    <div class="flex items-center gap-2">
      <input v-model="exists" type="checkbox" class="w-5 h-5 accent-neutral-600" :disabled="!canEdit" />
      <div class="text-xl">Level {{ level }}</div>
    </div>
    <Transition
      enterActiveClass="transition-all duration-150 ease-out"
      enterFromClass="opacity-0"
      enterToClass="opacity-100"
      leaveActiveClass="transition-all duration-150 ease-in"
      leaveFromClass="opacity-100"
      leaveToClass="opacity-0"
    >
      <div v-if="exists" class="border border-neutral-300 rounded p-2">
        <div class="justify-between text-left gap-4 my-4" :class="[singleColumn ? 'flex-col' : 'flex']">
          <div class="flex-1">
            <div class="flex flex-col gap-4">
              <FormInput v-model="name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
              <MultipleCheckboxInput
                v-model="attributes"
                title="Attributes"
                F
                :options="attributeOpts"
                :disabled="!canEdit"
              />

              <div class="flex flex-wrap gap-4 mt-2">
                <SelectInput
                  v-model="status"
                  title="Status"
                  :options="statusTierOpts"
                  :disabled="!canEdit"
                  class="min-w-24 flex-1"
                />
                <SelectInput
                  v-model="standing"
                  title="Standing"
                  :options="statusStandingOpts"
                  :disabled="!canEdit"
                  class="min-w-24 flex-1"
                />
              </div>
              <FormTextarea v-model="items" title="Trappings" :validationStatus="validItems" :disabled="!canEdit" />
            </div>
          </div>
          <div ref="skillsTableRef" class="flex-1" :class="[singleColumn ? 'mt-3' : '']">
            <div class="flex flex-col gap-4">
              <SelectTable
                :modalId="`skill${level}`"
                :disabled="!canEdit"
                :initSelectedItems="initialSkills"
                :itemList="whSkillList"
                title="Skills"
                modalTitle="Add/remove skills"
                :loading="whSkillListLoading"
                routeName="skill"
                :truncateModalDescription="100"
                :disableDescription="!isEqualOrGreater"
                @reload="emit('reloadWhSkillList')"
                @selected="(e) => emit('updateSkill', { id: e.id, selected: e.selected })"
              />
              <SelectTable
                :modalId="`talent${level}`"
                :disabled="!canEdit"
                :initSelectedItems="initialTalents"
                :itemList="whTalentList"
                title="Talents"
                modalTitle="Add/remove talents"
                :loading="whTalentListLoading"
                routeName="talent"
                :truncateModalDescription="100"
                :disableDescription="!isEqualOrGreater"
                @reload="emit('reloadWhTalentList')"
                @selected="(e) => emit('updateTalent', { id: e.id, selected: e.selected })"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
