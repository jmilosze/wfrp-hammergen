<script setup lang="ts">
import { Visibility, isNew, NEW_ID } from "@/services/wh/core/entity.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { Talent, talentApi } from "@/services/wh/content/talent.ts";
import { useWhEdit } from "@/composables/whEdit.ts";
import ContentEditorPage from "@/components/content/edit/ContentEditorPage.vue";
import { authRequest } from "@/services/auth.ts";
import { computed, Ref, ref, watch } from "vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetGroup from "@/components/sheet/SheetGroup.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import LabelledCheckbox from "@/components/form/LabelledCheckbox.vue";
import ModifiersBlock from "@/components/content/edit/ModifiersBlock.vue";
import { AttributeName, attributeNameList, printAttributeName } from "@/services/wh/core/attributes.ts";
import { CharacterModifiers } from "@/services/wh/core/characterModifiers.ts";
import SelectTable from "@/components/picker/SelectTable.vue";
import { useWhList } from "@/composables/whList.ts";
import CareerReferencesTable from "@/components/content/edit/CareerReferencesTable.vue";

const props = defineProps<{
  id: string;
}>();

const newTalent = new Talent({
  name: "New talent",
  id: NEW_ID,
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newTalent, talentApi(authRequest));
const { wh, edition, watchWh, canEdit } = editor;

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

await editor.loadWh(props.id);

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
  <ContentEditorPage :id="id" :edit="editor" propertyName="Talent" list="talents" :lists="[talentListUtils]">
    <template #toolbar>
      <LabelledCheckbox v-model="wh.isGroup" title="Group talent" :disabled="!canEdit" />
    </template>
    <!-- Name, max rank, tests (4e) and group in one column, the description in the other. -->
    <div class="flex flex-col @3xl:flex-row text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
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
          <!-- 4e: Max rank is a characteristic bonus, plus another, plus a number. -->
          <SheetGroup v-else title="Max rank" :columns="3">
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
            <template #note>Max rank = Att 1 Bonus + Att 2 Bonus + Const.</template>
          </SheetGroup>
        </SheetTable>
        <SelectTable
          v-if="!wh.isGroup"
          :disabled="!canEdit"
          :selected="wh.group"
          :itemList="groupTalents"
          title="Belongs to group"
          removable
          disableDescription
          modalTitle="Edit groups"
          :loading="talentListUtils.loading.value"
          routeName="talent"
          :truncateModalDescription="100"
          @reload="talentListUtils.loadWhList"
          @selected="(e) => wh.updateGroup(e.id, e.selected)"
        />
      </div>
      <SheetCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SheetCard>
    </div>
    <ModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit || wh.isGroup" class="my-4" />
    <CareerReferencesTable
      v-if="!isNew(id)"
      :edition="edition"
      :entityId="wh.id"
      :parentGroupIds="wh.group"
      type="talent"
    />
  </ContentEditorPage>
</template>
