<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Career, careerApi, careerClassList, printClassName } from "../../../services/wh/content/career.ts";
import { printSpeciesName, careerSpeciesByEdition } from "../../../services/wh/core/species.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/content/list/ContentListPage.vue";
import { computed } from "vue";
import { FilterSection } from "../../../components/content/list/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(careerApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
const classTerm = useListQuery("class");
const speciesTerm = useListQuery("species");

const filters = useFilterModel({ class: classTerm, species: speciesTerm, source: source.term });

// In a section an entry matches any ticked value (a career open to any ticked species); the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => classTerm.value.length === 0 || classTerm.value.includes(wh.careerClass.toString()))
    .filter((wh) => speciesTerm.value.length === 0 || wh.species.some((x) => speciesTerm.value.includes(x.toString())))
    .map((x) => formatCareerRow(x)),
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
    source.section.value,
  ];
});
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Careers"
    routeName="career"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
