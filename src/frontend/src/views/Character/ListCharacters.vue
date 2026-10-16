<script setup lang="ts">
import { useCharacterList } from "@/composables/characterList.ts";
import { Character, characterApi } from "@/services/wh/character/character.ts";
import { authRequest } from "@/services/auth.ts";
import { computed, watch } from "vue";
import { Visibility } from "@/services/wh/core/entity.ts";
import { useEdition } from "@/composables/edition.ts";
import { useAuth } from "@/composables/auth.ts";
import { useLocalStorage } from "@vueuse/core";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import CharacterRowActions from "@/components/character/CharacterRowActions.vue";
import { FilterSection } from "@/components/filter/filterSection.ts";

const { edition } = useEdition();
const whList = useCharacterList(characterApi(authRequest), edition);
await whList.loadWhList();
watch(edition, () => whList.loadWhList());
const auth = useAuth();

// Whether sample characters (the public ones) are shown is remembered in the browser; by default visitors see them and
// logged-in users don't.
const SAMPLE = "true";
const showSample = useLocalStorage("characters.showSample", !auth.loggedIn.value);

const filters = computed<Record<string, string[]>>({
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
    .map((x) => formatCharacterRow(x)),
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
  <ContentListPage
    v-model:filters="filters"
    title="Characters"
    routeName="character"
    :items="items"
    :sections="sections"
    :list="whList"
  >
    <template #actions="{ id }">
      <CharacterRowActions :id="id" @copy="whList.copyWh(id)" />
    </template>
  </ContentListPage>
</template>
