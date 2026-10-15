<script setup lang="ts">
import { Visibility, isNew, NEW_ID } from "@/services/wh/core/entity.ts";
import {
  getSkillAttributeNameList,
  getSkillTypeList,
  printSkillType,
  Skill,
  skillApi,
  SkillType,
} from "@/services/wh/content/skill.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { useWhEdit } from "@/composables/whEdit.ts";
import ContentEditorPage from "@/components/content/edit/ContentEditorPage.vue";
import { authRequest } from "@/services/auth.ts";
import { useWhList } from "@/composables/whList.ts";
import { computed, ref, Ref, watch } from "vue";
import LabelledCheckbox from "@/components/form/LabelledCheckbox.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import { AttributeName, printAttributeName } from "@/services/wh/core/attributes.ts";
import FormTextarea from "@/components/form/FormTextarea.vue";
import SelectTable from "@/components/picker/SelectTable.vue";
import CareerReferencesTable from "@/components/content/edit/CareerReferencesTable.vue";

const props = defineProps<{
  id: string;
}>();

const newSkill = new Skill({
  name: "New skill",
  id: NEW_ID,
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newSkill, skillApi(authRequest));
const { wh, edition, watchWh, canEdit } = editor;

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

await editor.loadWh(props.id);

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
  <ContentEditorPage :id="id" :edit="editor" propertyName="Skill" list="skills" :lists="[skillListUtils]">
    <template #toolbar>
      <LabelledCheckbox v-model="wh.isGroup" title="Group skill" :disabled="!canEdit" />
      <LabelledCheckbox v-model="wh.displayZero" title="Display if skill/group not taken?" :disabled="!canEdit" />
    </template>
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
          :selected="wh.group"
          :itemList="groupSkills"
          title="Belongs to group"
          removable
          disableDescription
          modalTitle="Edit groups"
          :loading="skillListUtils.loading.value"
          routeName="skill"
          :truncateModalDescription="100"
          @reload="skillListUtils.loadWhList"
          @selected="(e) => wh.modifyGroup(e.id, e.selected)"
        />
      </div>
      <SheetCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SheetCard>
    </div>
    <CareerReferencesTable
      v-if="!isNew(id)"
      :edition="edition"
      :entityId="wh.id"
      :parentGroupIds="wh.group"
      type="skill"
    />
  </ContentEditorPage>
</template>
