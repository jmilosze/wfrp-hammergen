<script setup lang="ts">
import { computed } from "vue";
import { useFilterModel, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Talent, talentApi } from "../../../services/wh/content/talent.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/ContentListPage.vue";

const { edition } = useEdition();
const whList = useWhList(talentApi(authRequest), edition);
await whList.loadWhList();

// The source is the only filter, so it starts open.
const source = useSourceFilter(whList.whList, edition, false);
const filters = useFilterModel({ source: source.term });
const sections = computed(() => [source.section.value]);

const items = computed(() => whList.whList.value.filter((wh) => source.matches(wh)).map((x) => formatTalentRow(x)));

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
