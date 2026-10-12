<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { Talent, talentApi } from "../../../services/wh/content/talent.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, Ref, ref, watch } from "vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import CheckboxInput from "../../../components/CheckboxInput.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { AttributeName, attributeNameList, printAttributeName } from "../../../services/wh/core/attributes.ts";
import { CharacterModifiers } from "../../../services/wh/core/characterModifiers.ts";
import SelectTable from "../../../components/SelectTable.vue";
import { useWhList } from "../../../composables/whList.ts";
import CareerReferencesTable from "../../../components/CareerReferencesTable.vue";

const props = defineProps<{
  id: string;
}>();

const newTalent = new Talent({
  name: "New talent",
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
} = useWhEdit(newTalent, talentApi(authRequest));

const talentListUtils = useWhList(talentApi(authRequest), edition);
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

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validTests = computed(() => wh.value.validateTests());
const validMaxRank = computed(() => wh.value.validateMaxRank(edition.value));

const attOptions = attributeNameList.map((x) => ({ text: printAttributeName(x), value: x }));

watchWh(
  (w) => w.isGroup,
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
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="talentListUtils.apiError.value && talentListUtils.showApiError.value"
      alertType="red"
      @close="talentListUtils.showApiError.value = false"
    >
      {{ talentListUtils.apiError.value }}
    </AlertBlock>
  </div>

  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create talent' : canEdit ? 'Edit talent' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Talent"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <CheckboxInput v-model="wh.isGroup" title="Group talent" :disabled="!canEdit" />
      <PublicPropertyBox v-model="wh.visibility" propertyName="Talent" :disabled="!canEdit" />
    </div>
    <!-- Name, max rank, tests (4e) and group in one column, the description in the other. -->
    <div class="flex flex-col @3xl:flex-row text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <!-- Name, max rank and tests (4e) form one joined group. -->
        <div>
          <SheetTable>
            <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
            <SheetField
              v-if="edition === '4e'"
              v-model="wh.tests"
              title="Tests"
              :validationStatus="validTests"
              :disabled="!canEdit || wh.isGroup"
            />
            <SheetField
              v-if="edition === '5e'"
              v-model="wh.maxRank"
              type="number"
              title="Max rank"
              :validationStatus="validMaxRank"
              :disabled="!canEdit || wh.isGroup"
            />
          </SheetTable>
          <template v-if="edition === '4e'">
            <!-- 4e: Max rank is a characteristic bonus, plus another, plus a number. -->
            <!-- A "Max rank" label cell beside its three parts, matching the Name and Tests rows above. -->
            <div class="@container flex -mt-px border border-neutral-400 bg-white">
              <div
                class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap"
              >
                Max rank
              </div>
              <div class="grid flex-1 min-w-0 gap-px bg-neutral-300 @lg:grid-cols-3 @lg:[&_[data-sheet-label]]:min-w-0">
                <SheetSelect
                  v-model="wh.attribute"
                  title="Att 1"
                  :options="attOptions"
                  :disabled="!canEdit || wh.isGroup"
                />
                <SheetSelect
                  v-model="wh.attribute2"
                  title="Att 2"
                  :options="attOptions"
                  :disabled="!canEdit || wh.isGroup"
                />
                <SheetField
                  v-model="wh.maxRank"
                  type="number"
                  title="Const"
                  :validationStatus="validMaxRank"
                  :disabled="!canEdit || wh.isGroup"
                />
                <p class="col-span-full px-2 py-1 bg-white text-xs text-neutral-600">
                  Max rank = Att 1 Bonus + Att 2 Bonus + Const.
                </p>
              </div>
            </div>
          </template>
        </div>
        <SelectTable
          v-if="!wh.isGroup"
          :disabled="!canEdit"
          :initSelectedItems="wh.group"
          :itemList="groupTalents"
          title="Belongs to group"
          modalTitle="Edit groups"
          :loading="talentListUtils.loading.value"
          routeName="talent"
          :truncateModalDescription="100"
          @reload="talentListUtils.loadWhList"
          @selected="(e) => wh.updateGroup(e.id, e.selected)"
        />
      </div>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SectionCard>
    </div>
    <CharacterModifiersBlock
      v-model="wh.modifiers"
      :edition="edition"
      :disabled="!canEdit || wh.isGroup"
      class="my-4"
    />
    <CareerReferencesTable
      v-if="id !== 'create'"
      :edition="edition"
      :entityId="wh.id"
      :parentGroupIds="wh.group"
      type="talent"
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
        propertyName="Talent"
        :saving="submissionState.status === 'inProgress'"
        list="talents"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Talent"
        :name="wh.name"
        list="talents"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
