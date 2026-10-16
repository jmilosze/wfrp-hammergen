<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Career, careerApi, printClassName } from "@/services/wh/content/career.ts";
import { printSpeciesName, careerSpeciesByEdition } from "@/services/wh/core/species.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { careerFilters } from "@/components/filter/careerFilters.ts";

const { edition } = useEdition();
const whList = useWhList(careerApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(careerFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatCareerRow(x)));

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
