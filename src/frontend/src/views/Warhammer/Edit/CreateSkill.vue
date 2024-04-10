<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import {
  getSkillAttributeNameList,
  getSkillTypeList,
  printSkillType,
  Skill,
  SkillApi,
  SkillType,
} from "../../../services/wh/skill.ts";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { useWhList } from "../../../composables/whList.ts";
import { computed, ref, Ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import DoubleRadioButton from "../../../components/DoubleRadioButton.vue";
import SelectInput from "../../../components/SelectInput.vue";
import { AttributeName, printAttributeName } from "../../../services/wh/attributes.ts";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import EditControls from "../../../components/EditControls.vue";
import SelectTable from "../../../components/SelectTable.vue";

const props = defineProps<{
  id: string;
}>();

const newSkill = new Skill({
  name: "New skill",
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
} = useWhEdit(newSkill, new SkillApi(authRequest));

const { whList, loadWhList, loading } = useWhList(new SkillApi(authRequest));
const groupSkills: Ref<Skill[]> = ref([]);

loadWhList();

watch(
  () => whList,
  (newValue) => {
    groupSkills.value = newValue.value.filter((x) => x.isGroup && x.id !== wh.value.id);
  },
  { immediate: true, deep: true },
);

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const attOptions = computed(() => {
  return getSkillAttributeNameList(wh.value.isGroup).map((x) => ({ text: printAttributeName(x), value: x }));
});

const typeOpts = computed(() => {
  return getSkillTypeList(wh.value.isGroup).map((x) => ({ text: printSkillType(x), value: x }));
});

watch(
  () => wh.value.isGroup,
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
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create skill' : wh.canEdit ? 'Edit skill' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <DoubleRadioButton
          v-model="wh.isGroup"
          title="Individual skill/group of skills"
          :invertOrder="true"
          trueText="Group"
          falseText="Individual"
          :disabled="!wh.canEdit"
        />
        <SelectInput
          v-model="wh.attribute"
          :options="attOptions"
          :disabled="!wh.canEdit"
          title="Attribute"
          class="min-w-24"
        />
        <SelectInput v-model="wh.type" :options="typeOpts" :disabled="!wh.canEdit" title="Type" class="min-w-24" />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <DoubleRadioButton
          v-model="wh.displayZero"
          title="Display if skill/group not taken?"
          trueText="Yes"
          falseText="No"
          :disabled="!wh.canEdit"
        />
        <SelectTable
          :disabled="!wh.canEdit || wh.isGroup"
          :initSelectedItems="wh.group"
          :itemList="groupSkills"
          title="Belongs to group"
          modalTitle="Modify groups"
          :loading="loading"
          @createNew="openInNewTab('skill', { id: 'create' })"
          @reload="loadWhList"
          @selected="(e) => wh.modifyGroup(e.id, e.selected)"
        />
      </div>
    </div>
  </div>
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable :disabled="!wh.canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Quality/rune" :disabled="!wh.canEdit" />
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
      list="skills"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
