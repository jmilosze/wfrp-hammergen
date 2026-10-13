<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Career, careerApi, careerClassList, printClassName } from "../../../services/wh/content/career.ts";
import { printSpeciesName, careerSpeciesByEdition } from "../../../services/wh/core/species.ts";
import { authRequest } from "../../../services/auth.ts";
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(careerApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));
const classTerm = useListQuery("class");
const speciesTerm = useListQuery("species");

const filters = computed({
  get: () => ({ class: classTerm.value, species: speciesTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    classTerm.value = value.class ?? [];
    speciesTerm.value = value.species ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

// In a section an entry matches any ticked value (a career open to any ticked species); the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => classTerm.value.length === 0 || classTerm.value.includes(wh.careerClass.toString()))
    .filter((wh) => speciesTerm.value.length === 0 || wh.species.some((x) => speciesTerm.value.includes(x.toString())))
    .map((x) => formatCareerRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

// The meta line is the class and the species the career is open to.
function formatCareerRow(career: Career) {
  const species =
    career.species.length === careerSpeciesByEdition[edition.value].length
      ? "All species"
      : career.species.map((x) => printSpeciesName(x)).join(", ");
  return {
    id: career.id,
    name: career.name,
    meta: `${printClassName(career.careerClass)} · ${species}`,
    description: career.description,
    ownerId: career.ownerId,
    visibility: career.visibility,
  };
}

// Classes, species and sources are offered when some career has them.
const sections = computed<FilterSection[]>(() => {
  const classesInData = new Set(whList.whList.value.map((wh) => wh.careerClass));
  const speciesInData = new Set(whList.whList.value.flatMap((wh) => wh.species));
  return [
    {
      key: "class",
      title: "Class",
      options: careerClassList
        .filter((x) => classesInData.has(x))
        .map((x) => ({ text: printClassName(x), value: x.toString() })),
    },
    {
      key: "species",
      title: "Species",
      options: careerSpeciesByEdition[edition.value]
        .filter((x) => speciesInData.has(x))
        .map((x) => ({ text: printSpeciesName(x), value: x.toString() })),
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
  <Header title="Careers" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" routeName="career" :params="{ id: 'create' }">Create new</SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="career" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" routeName="career" :params="{ id: 'create' }">Create new</SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <ActionButtonsNonCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
