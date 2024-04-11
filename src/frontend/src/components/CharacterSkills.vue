<script setup lang="ts">
import { AttributeName } from "../services/wh/attributes.ts";
import { Skill } from "../services/wh/skill.ts";

type SkillWithNumber = {
  id: string;
  careerId: string;
  name: string;
  description: string;
  attributeName: AttributeName;
  attributeValue: number;
  number: number;
};

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
</script>

<template></template>

<style scoped></style>
