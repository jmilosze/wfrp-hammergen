<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Talent, talentApi } from "@/services/wh/content/talent.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { talentFilters } from "@/components/filter/talentFilters.ts";

const { edition } = useEdition();
const whList = useWhList(talentApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(talentFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatTalentRow(x)));

// The meta line is the max rank (group talents have none).
function formatTalentRow(talent: Talent) {
  const maxRank = talent.getMaxRankDisplay();
  return {
    id: talent.id,
    name: talent.name,
    meta: maxRank === "" ? "" : `Max rank ${maxRank}`,
    description: talent.description,
    ownerId: talent.ownerId,
    visibility: talent.visibility,
  };
}
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Talents"
    routeName="talent"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
