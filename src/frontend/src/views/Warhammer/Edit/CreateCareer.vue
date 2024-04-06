<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import {
  Career,
  CareerApi,
  careerClassList,
  printClassName,
  printSpeciesName,
  printStatusStanding,
  printStatusTier,
  speciesList,
  statusStandingList,
  statusTierList,
} from "../../../services/wh/career.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import MultipleCheckboxInput from "../../../components/MultipleCheckboxInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import EditControls from "../../../components/EditControls.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { AttributeName, attributeNameList, printAttributeName } from "../../../services/wh/attributes.ts";
import { useWhList } from "../../../composables/whList.ts";
import { SkillApi } from "../../../services/wh/skill.ts";
import { TalentApi } from "../../../services/wh/talent.ts";
import SelectTable from "../../../components/SelectTable.vue";

const props = defineProps<{
  id: string;
}>();

const newCareer = new Career({
  name: "New career",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

const {
  wh,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newCareer, new CareerApi(authRequest));

const skillListUtils = useWhList(new SkillApi(authRequest));
skillListUtils.loadWhList();

const talentListUtils = useWhList(new TalentApi(authRequest));
talentListUtils.loadWhList();

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validLevel1Name = computed(() => wh.value.validateLevel1Name());
const validLevel2Name = computed(() => wh.value.validateLevel2Name());
const validLevel3Name = computed(() => wh.value.validateLevel3Name());
const validLevel4Name = computed(() => wh.value.validateLevel4Name());
const validLevel1Items = computed(() => wh.value.validateLevel1Items());
const validLevel2Items = computed(() => wh.value.validateLevel2Items());
const validLevel3Items = computed(() => wh.value.validateLevel3Items());
const validLevel4Items = computed(() => wh.value.validateLevel4Items());

const speciesOpts = speciesList.map((x) => ({ text: printSpeciesName(x), value: x }));
const classOpts = careerClassList.map((x) => ({ text: printClassName(x), value: x }));
const attributeOpts = attributeNameList
  .filter((x) => x !== AttributeName.None && x !== AttributeName.Various)
  .map((x) => ({ text: printAttributeName(x), value: x }));
const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create career' : wh.canEdit ? 'Edit career' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <MultipleCheckboxInput v-model="wh.species" title="Species" :options="speciesOpts" :disabled="!wh.canEdit" />
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <SelectInput
          v-model="wh.careerClass"
          :options="classOpts"
          :disabled="!wh.canEdit"
          title="Class"
          class="min-w-24"
        />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
  </div>
  <p class="text-xl mt-6">Level 1</p>
  <div class="border border-neutral-300 rounded p-2">
    <div
      ref="contentContainerRef"
      class="justify-between text-left gap-4 my-4"
      :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
    >
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput
            v-model="wh.level1.name"
            title="Name"
            :validationStatus="validLevel1Name"
            :disabled="!wh.canEdit"
          />
          <MultipleCheckboxInput
            v-model="wh.level1.attributes"
            title="Attributes"
            :options="attributeOpts"
            :disabled="!wh.canEdit"
          />

          <div class="flex flex-wrap gap-4 mt-2">
            <SelectInput
              v-model="wh.level1.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.level1.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
          </div>
          <FormTextarea
            v-model="wh.level1.items"
            title="Trappings"
            :validationStatus="validLevel1Items"
            :disabled="!wh.canEdit"
          />
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <SelectTable
            modalId="skill1"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level1.skills"
            :itemList="skillListUtils.whList.value"
            title="Skills"
            modalTitle="Add/remove skills"
            :loading="skillListUtils.loading.value"
            @createNew="openInNewTab('skill', { id: 'create' })"
            @reload="skillListUtils.loadWhList"
            @selected="(e) => wh.updateLevelSkills(1, e.id, e.selected)"
          />
          <SelectTable
            modalId="talent1"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level1.talents"
            :itemList="talentListUtils.whList.value"
            title="Talents"
            modalTitle="Add/remove talents"
            :loading="talentListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('talent', { id: 'create' })"
            @reload="talentListUtils.loadWhList"
            @selected="(e) => wh.updateLevelTalents(1, e.id, e.selected)"
          />
        </div>
      </div>
    </div>
  </div>
  <p class="text-xl mt-6">Level 2</p>
  <div class="border border-neutral-300 rounded p-2">
    <div
      ref="contentContainerRef"
      class="justify-between text-left gap-4 my-4"
      :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
    >
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput
            v-model="wh.level2.name"
            title="Name"
            :validationStatus="validLevel2Name"
            :disabled="!wh.canEdit"
          />
          <MultipleCheckboxInput
            v-model="wh.level2.attributes"
            title="Attributes"
            :options="attributeOpts"
            :disabled="!wh.canEdit"
          />

          <div class="flex flex-wrap gap-4">
            <SelectInput
              v-model="wh.level2.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.level2.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
          </div>
          <FormTextarea
            v-model="wh.level2.items"
            title="Trappings"
            :validationStatus="validLevel2Items"
            :disabled="!wh.canEdit"
          />
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <SelectTable
            modalId="skill2"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level2.skills"
            :itemList="skillListUtils.whList.value"
            title="Skills"
            modalTitle="Add/remove skills"
            :loading="skillListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('skill', { id: 'create' })"
            @reload="skillListUtils.loadWhList"
            @selected="(e) => wh.updateLevelSkills(2, e.id, e.selected)"
          />
          <SelectTable
            modalId="talent2"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level2.talents"
            :itemList="talentListUtils.whList.value"
            title="Talents"
            modalTitle="Add/remove talents"
            :loading="talentListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('talent', { id: 'create' })"
            @reload="talentListUtils.loadWhList"
            @selected="(e) => wh.updateLevelTalents(2, e.id, e.selected)"
          />
        </div>
      </div>
    </div>
  </div>
  <p class="text-xl mt-6">Level 3</p>
  <div class="border border-neutral-300 rounded p-2">
    <div
      ref="contentContainerRef"
      class="justify-between text-left gap-4 my-4"
      :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
    >
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput
            v-model="wh.level3.name"
            title="Name"
            :validationStatus="validLevel3Name"
            :disabled="!wh.canEdit"
          />
          <MultipleCheckboxInput
            v-model="wh.level3.attributes"
            title="Attributes"
            :options="attributeOpts"
            :disabled="!wh.canEdit"
          />

          <div class="flex flex-wrap gap-4">
            <SelectInput
              v-model="wh.level3.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.level3.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
          </div>
          <FormTextarea
            v-model="wh.level3.items"
            title="Trappings"
            :validationStatus="validLevel3Items"
            :disabled="!wh.canEdit"
          />
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <SelectTable
            modalId="skill3"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level3.skills"
            :itemList="skillListUtils.whList.value"
            title="Skills"
            modalTitle="Add/remove skills"
            :loading="skillListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('skill', { id: 'create' })"
            @reload="skillListUtils.loadWhList"
            @selected="(e) => wh.updateLevelSkills(3, e.id, e.selected)"
          />
          <SelectTable
            modalId="talent3"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level3.talents"
            :itemList="talentListUtils.whList.value"
            title="Talents"
            modalTitle="Add/remove talents"
            :loading="talentListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('talent', { id: 'create' })"
            @reload="talentListUtils.loadWhList"
            @selected="(e) => wh.updateLevelTalents(3, e.id, e.selected)"
          />
        </div>
      </div>
    </div>
  </div>
  <p class="text-xl mt-6">Level 4</p>
  <div class="border border-neutral-300 rounded p-2">
    <div
      ref="contentContainerRef"
      class="justify-between text-left gap-4 my-4"
      :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
    >
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput
            v-model="wh.level4.name"
            title="Name"
            :validationStatus="validLevel4Name"
            :disabled="!wh.canEdit"
          />
          <MultipleCheckboxInput
            v-model="wh.level4.attributes"
            title="Attributes"
            :options="attributeOpts"
            :disabled="!wh.canEdit"
          />

          <div class="flex flex-wrap gap">
            <SelectInput
              v-model="wh.level4.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.level4.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
          </div>
          <FormTextarea
            v-model="wh.level4.items"
            title="Trappings"
            :validationStatus="validLevel4Items"
            :disabled="!wh.canEdit"
          />
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <SelectTable
            modalId="skill4"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level4.skills"
            :itemList="skillListUtils.whList.value"
            title="Skills"
            modalTitle="Add/remove skills"
            :loading="skillListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('skill', { id: 'create' })"
            @reload="skillListUtils.loadWhList"
            @selected="(e) => wh.updateLevelSkills(4, e.id, e.selected)"
          />
          <SelectTable
            modalId="talent4"
            :disabled="!wh.canEdit"
            :initSelectedItems="wh.level4.talents"
            :itemList="talentListUtils.whList.value"
            title="Talents"
            modalTitle="Add/remove talents"
            :loading="talentListUtils.loading.value"
            class="mt-4"
            @createNew="openInNewTab('talent', { id: 'create' })"
            @reload="talentListUtils.loadWhList"
            @selected="(e) => wh.updateLevelTalents(4, e.id, e.selected)"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable
        :disabled="!wh.canEdit"
        :initSources="initSources"
        @selected="(e) => wh.updateSource(e)"
      ></SourceTable>
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Quality/rune" :disabled="!wh.canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit"
      @close="showSubmissionStatus = false"
    />

    <EditControls
      :saving="submissionState.status === 'inProgress'"
      list="careers"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
