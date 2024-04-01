<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { Skill, SkillApi } from "../../../services/wh/skill.ts";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { useWhList } from "../../../composables/whList.ts";
import { ref, Ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";

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
  ></div>
</template>

<style scoped></style>
