<script setup lang="ts">
import { defaultSource } from "@/services/wh/core/source.ts";
import {
  Career,
  careerApi,
  careerClassList,
  copyCareerLevel,
  printClassName,
  zeroCareerLevel,
} from "@/services/wh/content/career.ts";
import { printSpeciesName, careerSpeciesByEdition } from "@/services/wh/core/species.ts";
import { Visibility, NEW_ID } from "@/services/wh/core/entity.ts";
import { useWhEdit } from "@/composables/whEdit.ts";
import ContentEditorPage from "@/components/content/edit/ContentEditorPage.vue";
import { authRequest } from "@/services/auth.ts";
import { computed } from "vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import LabelPicker from "@/components/picker/LabelPicker.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import { useWhList } from "@/composables/whList.ts";
import { skillApi } from "@/services/wh/content/skill.ts";
import { talentApi } from "@/services/wh/content/talent.ts";
import CareerLevel from "@/components/content/edit/CareerLevel.vue";

const props = defineProps<{
  id: string;
}>();

const newCareer = new Career({
  name: "New career",
  id: NEW_ID,
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newCareer, careerApi(authRequest));
const { wh, edition, watchWh, canEdit } = editor;

const skillListUtils = useWhList(skillApi(authRequest), edition);
skillListUtils.loadWhList();

const talentListUtils = useWhList(talentApi(authRequest), edition);
talentListUtils.loadWhList();

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validLevel1Name = computed(() => wh.value.validateLevel1Name());
const validLevel2Name = computed(() => wh.value.validateLevel2Name());
const validLevel3Name = computed(() => wh.value.validateLevel3Name());
const validLevel4Name = computed(() => wh.value.validateLevel4Name());
const validLevel5Name = computed(() => wh.value.validateLevel5Name());
const validLevel1Items = computed(() => wh.value.validateLevel1Items());
const validLevel2Items = computed(() => wh.value.validateLevel2Items());
const validLevel3Items = computed(() => wh.value.validateLevel3Items());
const validLevel4Items = computed(() => wh.value.validateLevel4Items());
const validLevel5Items = computed(() => wh.value.validateLevel5Items());

const speciesOpts = computed(() =>
  careerSpeciesByEdition[edition.value].map((x) => ({ text: printSpeciesName(x), value: x })),
);
const classOpts = careerClassList.map((x) => ({ text: printClassName(x), value: x }));

watchWh(
  (w) => w.level1.exists,
  (newValue) => {
    if (!newValue) {
      wh.value.level1 = copyCareerLevel(zeroCareerLevel);
    }
  },
);
watchWh(
  (w) => w.level2.exists,
  (newValue) => {
    if (!newValue) {
      wh.value.level2 = copyCareerLevel(zeroCareerLevel);
    }
  },
);
watchWh(
  (w) => w.level3.exists,
  (newValue) => {
    if (!newValue) {
      wh.value.level3 = copyCareerLevel(zeroCareerLevel);
    }
  },
);
watchWh(
  (w) => w.level4.exists,
  (newValue) => {
    if (!newValue) {
      wh.value.level4 = copyCareerLevel(zeroCareerLevel);
    }
  },
);
watchWh(
  (w) => w.level5.exists,
  (newValue) => {
    if (!newValue) {
      wh.value.level5 = copyCareerLevel(zeroCareerLevel);
    }
  },
);
</script>

<template>
  <ContentEditorPage
    :id="id"
    :edit="editor"
    propertyName="Career"
    list="careers"
    :lists="[skillListUtils, talentListUtils]"
  >
    <!-- Name, class and species in one column, the description in the other. -->
    <div class="flex flex-col @3xl:flex-row text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable>
          <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <SheetSelect v-model="wh.careerClass" title="Class" :options="classOpts" :disabled="!canEdit" />
        </SheetTable>
        <LabelPicker v-model="wh.species" title="Species" :options="speciesOpts" :disabled="!canEdit" />
      </div>
      <SheetCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SheetCard>
    </div>
    <div class="flex flex-col gap-4">
      <CareerLevel
        v-model:name="wh.level1.name"
        v-model:attributes="wh.level1.attributes"
        v-model:status="wh.level1.status"
        v-model:standing="wh.level1.standing"
        v-model:items="wh.level1.items"
        v-model:exists="wh.level1.exists"
        level="1"
        :canEdit="canEdit"
        :skills="wh.level1.skills"
        :talents="wh.level1.talents"
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
        v-model:exists="wh.level2.exists"
        level="2"
        :canEdit="canEdit"
        :skills="wh.level2.skills"
        :talents="wh.level2.talents"
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
        v-model:exists="wh.level3.exists"
        level="3"
        :canEdit="canEdit"
        :skills="wh.level3.skills"
        :talents="wh.level3.talents"
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
        v-model:exists="wh.level4.exists"
        level="4"
        :canEdit="canEdit"
        :skills="wh.level4.skills"
        :talents="wh.level4.talents"
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
      <CareerLevel
        v-model:name="wh.level5.name"
        v-model:attributes="wh.level5.attributes"
        v-model:status="wh.level5.status"
        v-model:standing="wh.level5.standing"
        v-model:items="wh.level5.items"
        v-model:exists="wh.level5.exists"
        level="5"
        :canEdit="canEdit"
        :skills="wh.level5.skills"
        :talents="wh.level5.talents"
        :whSkillList="skillListUtils.whList.value"
        :whSkillListLoading="skillListUtils.loading.value"
        :whTalentList="talentListUtils.whList.value"
        :whTalentListLoading="talentListUtils.loading.value"
        :validName="validLevel5Name"
        :validItems="validLevel5Items"
        @reloadWhSkillList="skillListUtils.loadWhList"
        @reloadWhTalentList="talentListUtils.loadWhList"
        @updateSkill="(e) => wh.updateLevelSkills(5, e.id, e.selected)"
        @updateTalent="(e) => wh.updateLevelTalents(5, e.id, e.selected)"
      />
    </div>
  </ContentEditorPage>
</template>
