<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import {
  Career,
  CareerApi,
  careerClassList,
  printClassName,
  printSpeciesName,
  speciesList,
} from "../../../services/wh/career.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import MultipleCheckboxColumnInput from "../../../components/MultipleCheckboxColumnInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import EditControls from "../../../components/EditControls.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { useWhList } from "../../../composables/whList.ts";
import { SkillApi } from "../../../services/wh/skill.ts";
import { TalentApi } from "../../../services/wh/talent.ts";
import CareerLevel from "../../../components/CareerLevel.vue";

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

const contentContainerRef = ref<HTMLDivElement | null>(null);
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
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="skillListUtils.apiError.value && skillListUtils.showApiError.value"
      alertType="red"
      @close="skillListUtils.showApiError.value = false"
    >
      {{ skillListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="talentListUtils.apiError.value && talentListUtils.showApiError.value"
      alertType="red"
      @close="talentListUtils.showApiError.value = false"
    >
      {{ talentListUtils.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create career' : wh.canEdit ? 'Edit career' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <MultipleCheckboxColumnInput
          v-model="wh.species"
          title="Species"
          :options="speciesOpts"
          :disabled="!wh.canEdit"
          :viewBreakpoint="[
            { columns: 3, view: ViewSize.xs },
            { columns: 2, view: ViewSize.xxs },
          ]"
        />
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
  <CareerLevel
    v-model:name="wh.level1.name"
    v-model:attributes="wh.level1.attributes"
    v-model:status="wh.level1.status"
    v-model:standing="wh.level1.standing"
    v-model:items="wh.level1.items"
    level="1"
    :singleColumn="!isEqualOrGreater"
    :canEdit="wh.canEdit"
    :initialSkills="wh.level1.skills"
    :initialTalents="wh.level1.talents"
    :whSkillList="skillListUtils.whList.value"
    :whSkillListLoading="skillListUtils.loading.value"
    :whTalentList="talentListUtils.whList.value"
    :whTalentListLoading="talentListUtils.loading.value"
    :validName="validLevel1Name"
    :validItems="validLevel1Items"
    @reloadWhSkillList="skillListUtils.loadWhList"
    @reloadWhTalentList="talentListUtils.loadWhList"
    @updateSkill="(e) => wh.updateLevelSkills(1, e.id, e.selected)"
    @updateTalent="(e) => wh.updateLevelTalents(1, e.id, e.selected)"
  />
  <CareerLevel
    v-model:name="wh.level2.name"
    v-model:attributes="wh.level2.attributes"
    v-model:status="wh.level2.status"
    v-model:standing="wh.level2.standing"
    v-model:items="wh.level2.items"
    level="2"
    :singleColumn="!isEqualOrGreater"
    :canEdit="wh.canEdit"
    :initialSkills="wh.level2.skills"
    :initialTalents="wh.level2.talents"
    :whSkillList="skillListUtils.whList.value"
    :whSkillListLoading="skillListUtils.loading.value"
    :whTalentList="talentListUtils.whList.value"
    :whTalentListLoading="talentListUtils.loading.value"
    :validName="validLevel2Name"
    :validItems="validLevel2Items"
    @reloadWhSkillList="skillListUtils.loadWhList"
    @reloadWhTalentList="talentListUtils.loadWhList"
    @updateSkill="(e) => wh.updateLevelSkills(2, e.id, e.selected)"
    @updateTalent="(e) => wh.updateLevelTalents(2, e.id, e.selected)"
  />
  <CareerLevel
    v-model:name="wh.level3.name"
    v-model:attributes="wh.level3.attributes"
    v-model:status="wh.level3.status"
    v-model:standing="wh.level3.standing"
    v-model:items="wh.level3.items"
    level="3"
    :singleColumn="!isEqualOrGreater"
    :canEdit="wh.canEdit"
    :initialSkills="wh.level3.skills"
    :initialTalents="wh.level3.talents"
    :whSkillList="skillListUtils.whList.value"
    :whSkillListLoading="skillListUtils.loading.value"
    :whTalentList="talentListUtils.whList.value"
    :whTalentListLoading="talentListUtils.loading.value"
    :validName="validLevel3Name"
    :validItems="validLevel3Items"
    @reloadWhSkillList="skillListUtils.loadWhList"
    @reloadWhTalentList="talentListUtils.loadWhList"
    @updateSkill="(e) => wh.updateLevelSkills(3, e.id, e.selected)"
    @updateTalent="(e) => wh.updateLevelTalents(3, e.id, e.selected)"
  />
  <CareerLevel
    v-model:name="wh.level4.name"
    v-model:attributes="wh.level4.attributes"
    v-model:status="wh.level4.status"
    v-model:standing="wh.level4.standing"
    v-model:items="wh.level4.items"
    level="4"
    :singleColumn="!isEqualOrGreater"
    :canEdit="wh.canEdit"
    :initialSkills="wh.level4.skills"
    :initialTalents="wh.level4.talents"
    :whSkillList="skillListUtils.whList.value"
    :whSkillListLoading="skillListUtils.loading.value"
    :whTalentList="talentListUtils.whList.value"
    :whTalentListLoading="talentListUtils.loading.value"
    :validName="validLevel4Name"
    :validItems="validLevel4Items"
    @reloadWhSkillList="skillListUtils.loadWhList"
    @reloadWhTalentList="talentListUtils.loadWhList"
    @updateSkill="(e) => wh.updateLevelSkills(4, e.id, e.selected)"
    @updateTalent="(e) => wh.updateLevelTalents(4, e.id, e.selected)"
  />
  <div class="flex justify-between text-left gap-4 my-4" :class="[isEqualOrGreater ? '' : 'flex-col']">
    <div class="my-3 flex-1">
      <SourceTable :disabled="!wh.canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Career" :disabled="!wh.canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit my-2"
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
    />
  </div>
</template>

<style scoped></style>
