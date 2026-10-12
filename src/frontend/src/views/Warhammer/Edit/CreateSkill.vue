<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import {
  getSkillAttributeNameList,
  getSkillTypeList,
  printSkillType,
  Skill,
  skillApi,
  SkillType,
} from "../../../services/wh/content/skill.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { useWhList } from "../../../composables/whList.ts";
import { computed, ref, Ref, watch } from "vue";
import CheckboxInput from "../../../components/CheckboxInput.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SectionCard from "../../../components/SectionCard.vue";
import { AttributeName, printAttributeName } from "../../../services/wh/core/attributes.ts";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import SelectTable from "../../../components/SelectTable.vue";
import CareerReferencesTable from "../../../components/CareerReferencesTable.vue";

const props = defineProps<{
  id: string;
}>();

const newSkill = new Skill({
  name: "New skill",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const {
  wh,
  edition,
  hasVariant,
  addVariant,
  watchWh,
  canEdit,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newSkill, skillApi(authRequest));

const skillListUtils = useWhList(skillApi(authRequest), edition);
const groupSkills: Ref<Skill[]> = ref([]);

skillListUtils.loadWhList();

watch(
  () => skillListUtils.whList.value,
  (newValue) => {
    groupSkills.value = newValue.filter((x) => x.isGroup && x.id !== wh.value.id);
  },
  { immediate: true, deep: true },
);

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const attOptions = computed(() => {
  return getSkillAttributeNameList(wh.value.isGroup).map((x) => ({ text: printAttributeName(x), value: x }));
});

const typeOpts = computed(() => {
  return getSkillTypeList(wh.value.isGroup).map((x) => ({ text: printSkillType(x), value: x }));
});

watchWh(
  (w) => w.isGroup,
  (newVal) => {
    if (newVal) {
      wh.value.group = new Set<string>();
    } else {
      if (wh.value.type === SkillType.Mixed) {
        wh.value.type = SkillType.Basic;
      }
      if (wh.value.attribute === AttributeName.Various) {
        wh.value.attribute = AttributeName.WS;
      }
    }
  },
  { immediate: true },
);
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
  </div>
  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create skill' : canEdit ? 'Edit skill' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Skill"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <CheckboxInput v-model="wh.isGroup" title="Group skill" :disabled="!canEdit" />
      <CheckboxInput v-model="wh.displayZero" title="Display if skill/group not taken?" :disabled="!canEdit" />
      <PublicPropertyBox v-model="wh.visibility" propertyName="Skill" :disabled="!canEdit" />
    </div>
    <!-- Name, attribute, type and group in one column, the description in the other. -->
    <div class="flex flex-col @3xl:flex-row text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable>
          <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <SheetSelect v-model="wh.attribute" title="Attribute" :options="attOptions" :disabled="!canEdit" />
          <SheetSelect v-model="wh.type" title="Type" :options="typeOpts" :disabled="!canEdit" />
        </SheetTable>
        <SelectTable
          v-if="!wh.isGroup"
          :disabled="!canEdit"
          :initSelectedItems="wh.group"
          :itemList="groupSkills"
          title="Belongs to group"
          modalTitle="Edit groups"
          :loading="skillListUtils.loading.value"
          routeName="skill"
          :truncateModalDescription="100"
          @reload="skillListUtils.loadWhList"
          @selected="(e) => wh.modifyGroup(e.id, e.selected)"
        />
      </div>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SectionCard>
    </div>
    <CareerReferencesTable
      v-if="id !== 'create'"
      :edition="edition"
      :entityId="wh.id"
      :parentGroupIds="wh.group"
      type="skill"
    />
    <SourceTable
      :edition="edition"
      :disabled="!canEdit"
      :initSources="initSources"
      class="my-4"
      @selected="(e) => wh.updateSource(e)"
    />
  </template>
  <div v-show="hasVariant" class="mt-4">
    <div class="flex flex-col md:flex-row gap-4">
      <EditControls
        :submissionState="submissionState"
        :showSubmissionStatus="showSubmissionStatus"
        propertyName="Skill"
        :saving="submissionState.status === 'inProgress'"
        list="skills"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Skill"
        :name="wh.name"
        list="skills"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
