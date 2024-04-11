<script setup lang="ts">
import { defaultSource } from "../../../services/wh/source.ts";
import { Talent, TalentApi } from "../../../services/wh/talent.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, Ref, ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import DoubleRadioButton from "../../../components/DoubleRadioButton.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";
import EditControls from "../../../components/EditControls.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import SelectInput from "../../../components/SelectInput.vue";
import { AttributeName, attributeNameList, printAttributeName } from "../../../services/wh/attributes.ts";
import { CharacterModifiers } from "../../../services/wh/characterModifiers.ts";
import SelectTable from "../../../components/SelectTable.vue";
import { useWhList } from "../../../composables/whList.ts";
import { useNewTab } from "../../../composables/newTab.ts";

const props = defineProps<{
  id: string;
}>();

const newTalent = new Talent({
  name: "New talent",
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
} = useWhEdit(newTalent, new TalentApi(authRequest));

const talentListUtils = useWhList(new TalentApi(authRequest));
const groupTalents: Ref<Talent[]> = ref([]);

talentListUtils.loadWhList();

watch(
  () => talentListUtils.whList.value,
  (newValue) => {
    groupTalents.value = newValue.filter((x) => x.isGroup && x.id !== wh.value.id);
  },
  { immediate: true, deep: true },
);

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validTests = computed(() => wh.value.validateTests());
const validMaxRank = computed(() => wh.value.validateMaxRank());

const attOptions = attributeNameList.map((x) => ({ text: printAttributeName(x), value: x }));

watch(
  () => wh.value.isGroup,
  (newVal) => {
    if (newVal) {
      wh.value.group = new Set<string>();
      wh.value.tests = "";
      wh.value.maxRank = 0;
      wh.value.attribute = AttributeName.None;
      wh.value.modifiers = new CharacterModifiers();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="talentListUtils.apiError.value && talentListUtils.showApiError.value"
      alertType="red"
      @click="talentListUtils.showApiError.value = false"
    >
      {{ talentListUtils.apiError.value }}
    </AlertBlock>
  </div>

  <Header :title="id === 'create' ? 'Create talent' : wh.canEdit ? 'Edit talent' : wh.name" />
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
          title="Individual talent/group of talents"
          :invertOrder="true"
          trueText="Group"
          falseText="Individual"
          :disabled="!wh.canEdit"
        />
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
        <div>
          <p class="mb-1">Max rank</p>
          <div class="flex">
            <SelectInput
              v-model="wh.attribute"
              :options="attOptions"
              :disabled="!wh.canEdit || wh.isGroup"
              class="min-w-24"
            />
            <div class="shrink-0 mx-4 pt-2">Bonus +</div>
            <FormInput
              v-model="wh.maxRank"
              :validationStatus="validMaxRank"
              :disabled="!wh.canEdit || wh.isGroup"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <FormTextarea
          v-model="wh.tests"
          title="Tests"
          :minH="24"
          :validationStatus="validTests"
          :disabled="!wh.canEdit || wh.isGroup"
        />
        <SelectTable
          :disabled="!wh.canEdit || wh.isGroup"
          :initSelectedItems="wh.group"
          :itemList="groupTalents"
          title="Belongs to group"
          modalTitle="Modify groups"
          :loading="talentListUtils.loading.value"
          @createNew="openInNewTab('talent', { id: 'create' })"
          @reload="talentListUtils.loadWhList"
          @selected="(e) => wh.updateGroup(e.id, e.selected)"
        />
      </div>
    </div>
  </div>
  <div class="my-4">
    <CharacterModifiersBlock v-model="wh.modifiers" :disabled="!wh.canEdit || wh.isGroup"></CharacterModifiersBlock>
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
      list="talents"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
