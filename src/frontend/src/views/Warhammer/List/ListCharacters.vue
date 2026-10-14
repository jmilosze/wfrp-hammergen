<script setup lang="ts">
import { useCharacterList } from "../../../composables/characterList.ts";
import { Character, characterApi } from "../../../services/wh/character/character.ts";
import { authRequest } from "../../../services/auth.ts";
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed, watch } from "vue";
import ActionButtonsCharacter from "../../../components/ActionButtonsCharacter.vue";
import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";
import { Visibility } from "../../../services/wh/core/entity.ts";
import { useEdition } from "../../../composables/edition.ts";
import { useLocalStorage } from "@vueuse/core";

const { edition } = useEdition();
const whList = useCharacterList(characterApi(authRequest), edition);
await whList.loadWhList();
watch(edition, () => whList.loadWhList());
const auth = useAuth();

// The search is kept in the query string. Whether sample characters (the public ones) are shown is remembered in
// the browser; by default visitors see them and logged-in users don't.
const searchTerm = useRouteQuery("search", "");
const SAMPLE = "true";
const showSample = useLocalStorage("characters.showSample", !auth.loggedIn.value);

const filters = computed({
  get: () => ({ show: showSample.value ? [SAMPLE] : [] }),
  set: (value: Record<string, string[]>) => {
    showSample.value = (value.show ?? []).includes(SAMPLE);
  },
});

const sections: FilterSection[] = [
  { key: "show", title: "Show", options: [{ text: "Sample characters", value: SAMPLE }] },
];

const items = computed(() =>
  whList.whList.value
    .filter((wh) => showSample.value || wh.visibility !== Visibility.Public)
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

function formatCharacterRow(character: Character) {
  return {
    id: character.id,
    name: character.name,
    meta: "",
    description: character.description,
    ownerId: character.ownerId,
    visibility: character.visibility,
  };
}
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
  <Header title="Characters" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="character" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="character" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="character" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <ActionButtonsCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
