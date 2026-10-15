<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Skill, skillApi, skillTypeList, printSkillType } from "../../../services/wh/content/skill.ts";
import { attributeNameList, printAttributeName } from "../../../services/wh/core/attributes.ts";
import { authRequest } from "../../../services/auth.ts";
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed } from "vue";
import CopyButton from "../../../components/CopyButton.vue";
import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(skillApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));
const typeTerm = useListQuery("type");
const attributeTerm = useListQuery("attribute");

const filters = computed({
  get: () => ({ type: typeTerm.value, attribute: attributeTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    typeTerm.value = value.type ?? [];
    attributeTerm.value = value.attribute ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter((wh) => attributeTerm.value.length === 0 || attributeTerm.value.includes(wh.attribute.toString()))
    .map((x) => formatSkillRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
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
    {
      key: "source",
      title: "Source",
      collapsed: true,
      options: whList.filteredSourceOptions.value.filter((x) => x.value !== ""),
    },
  ];
});
</script>

<template>
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @close="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Skills" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="skill" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="skill" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="skill" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <CopyButton class="my-1" @copy="whList.copyWh(id)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
