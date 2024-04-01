<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { Skill, SkillApi } from "../../../services/wh/skill.ts";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { useWhList } from "../../../composables/whList.ts";
import { computed, ref, Ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import DoubleRadioButton from "../../../components/DoubleRadioButton.vue";
import SelectInput from "../../../components/SelectInput.vue";
import { AttributeName, attributeNameList, printAttributeName } from "../../../services/wh/attributes.ts";

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

const attOptions = attributeNameList
  .filter((x) => x !== AttributeName.None && x !== AttributeName.Various)
  .map((x) => ({ text: printAttributeName(x), value: x }));
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
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
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
        />
        <SelectInput
          v-model="wh.attribute"
          :options="attOptions"
          :disabled="!wh.canEdit"
          class="min-w-24"
        ></SelectInput>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
