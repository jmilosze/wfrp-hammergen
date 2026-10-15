<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Skill, skillApi, skillTypeList, printSkillType } from "../../../services/wh/content/skill.ts";
import { attributeNameList, printAttributeName } from "../../../services/wh/core/attributes.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/ContentListPage.vue";
import { computed } from "vue";
import { FilterSection } from "../../../components/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(skillApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
const typeTerm = useListQuery("type");
const attributeTerm = useListQuery("attribute");

const filters = useFilterModel({ type: typeTerm, attribute: attributeTerm, source: source.term });

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter((wh) => attributeTerm.value.length === 0 || attributeTerm.value.includes(wh.attribute.toString()))
    .map((x) => formatSkillRow(x)),
);

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

// Types, characteristics and sources are offered when some skill has them.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.type));
  const attributesInData = new Set(whList.whList.value.map((wh) => wh.attribute));
  return [
    {
      key: "type",
      title: "Type",
      options: skillTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printSkillType(x), value: x.toString() })),
    },
    {
      key: "attribute",
      title: "Characteristic",
      options: attributeNameList
        .filter((x) => attributesInData.has(x))
        .map((x) => ({ text: printAttributeName(x), value: x.toString() })),
    },
    source.section.value,
  ];
});
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
