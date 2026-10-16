<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Skill, skillApi, printSkillType } from "@/services/wh/content/skill.ts";
import { printAttributeName } from "@/services/wh/core/attributes.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { skillFilters } from "@/components/filter/skillFilters.ts";

const { edition } = useEdition();
const whList = useWhList(skillApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(skillFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatSkillRow(x)));

function formatSkillRow(skill: Skill) {
  return {
    id: skill.id,
    name: skill.name,
    meta: `${printSkillType(skill.type)} · ${printAttributeName(skill.attribute)}`,
    description: skill.description,
    ownerId: skill.ownerId,
    visibility: skill.visibility,
  };
}
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Skills"
    routeName="skill"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
