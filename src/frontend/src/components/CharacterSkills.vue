<script setup lang="ts">
import { Skill } from "../services/wh/skill.ts";
import { ref, Ref } from "vue";
import { AttributeName } from "../services/wh/attributes.ts";

export interface SkillWithNumber {
  id: string;
  name: string;
  description: string;
  attribute: AttributeName;
  type: number;
  number: number;
}

const props = defineProps<{
  disabled?: boolean;
  skillList: Skill[];
  initSkills: Record<string, number>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "createNew"): void;
  (e: "reload"): void;
}>();

function anySelected(skillsWithNumber: SkillWithNumber): boolean {
  return skillsWithNumber.number !== 0;
}

const skillsWithNumber: Ref<Record<string, SkillWithNumber>> = ref({});
const skillsWithNumberList: Ref<SkillWithNumber[]> = ref([]);

function updateSkillsWithNumber(selectedSkills: Record<string, number>, skillList: Skill[]) {
  skillsWithNumber.value = {};
  for (const skill of skillList) {
    if (!skill.isGroup) {
      skillsWithNumber.value[skill.id] = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        attribute: skill.attribute,
        type: skill.type,
        number: 0,
      };
      if (skill.id in selectedSkills) {
        skillsWithNumber.value[skill.id].number = selectedSkills[skill.id];
      }
    }
  }
  skillsWithNumberList.value = Object.values(skillsWithNumber.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}
</script>

<template></template>

<style scoped></style>