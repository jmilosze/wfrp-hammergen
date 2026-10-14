<script setup lang="ts">
import { splitQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Talent, talentApi } from "../../../services/wh/content/talent.ts";
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
const whList = useWhList(talentApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));

const filters = computed({
  get: () => ({ source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    sourceTerm.value = value.source ?? [];
  },
});

const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .map((x) => formatTalentRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

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

// Sources are offered when some talent has them; the only filter, so it starts open.
const sections = computed<FilterSection[]>(() => [
  {
    key: "source",
    title: "Source",
    collapsed: false,
    options: whList.filteredSourceOptions.value.filter((x) => x.value !== ""),
  },
]);
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
  <Header title="Talents" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="talent" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="talent" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="talent" :params="{ id: 'create' }">
          Create new
        </SectionLink>
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
