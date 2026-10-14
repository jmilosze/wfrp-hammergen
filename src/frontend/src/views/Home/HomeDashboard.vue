<script setup lang="ts">
import SectionLink from "../../components/SectionLink.vue";
// Landing page for logged-in users: their most recently edited characters of the current edition and the compendium.
import { computed, watch } from "vue";
import { formatTimeAgo } from "@vueuse/core";
import { RouterLink } from "vue-router";
import AlertBlock from "../../components/AlertBlock.vue";
import TextLink from "../../components/TextLink.vue";
import HomeNotes from "./HomeNotes.vue";
import { useAuth } from "../../composables/auth.ts";
import { useCharacterList } from "../../composables/characterList.ts";
import { useEdition } from "../../composables/edition.ts";
import { characterApi } from "../../services/wh/character/character.ts";
import { authRequest } from "../../services/auth.ts";
import { COMPENDIUM_SECTIONS } from "../../navigation.ts";

const RECENT_CHARACTERS = 6;

const auth = useAuth();
const { edition } = useEdition();
const whList = useCharacterList(characterApi(authRequest), edition);
await whList.loadWhList();
watch(edition, () => whList.loadWhList());

// The list also holds sample and shared characters; only the user's own are shown.
const userId = auth.getLoggedUserInfo().userId;
const recentCharacters = computed(() =>
  whList.whList.value
    .filter((character) => character.ownerId === userId)
    .sort((a, b) => Date.parse(b.modifiedOn) - Date.parse(a.modifiedOn))
    .slice(0, RECENT_CHARACTERS),
);
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

  <section class="flex flex-col gap-x-6 gap-y-3 pt-2 pb-8">
    <h1 class="font-hammergen text-4xl md:text-5xl">Welcome back</h1>
    <div class="flex flex-wrap gap-3">
      <SectionLink icon="lucide:plus" routeName="character" :params="{ id: 'create' }" variant="dark" size="lg">
        New character
      </SectionLink>
      <SectionLink icon="lucide:users" routeName="characters" variant="dark" size="lg">All characters</SectionLink>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-3">Your {{ edition }} characters</h2>
    <div v-if="recentCharacters.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="character in recentCharacters"
        :key="character.id"
        class="flex flex-col p-4 bg-neutral-50 border border-neutral-200 rounded-lg"
      >
        <RouterLink
          :to="{ name: 'viewCharacter', params: { id: character.id } }"
          class="text-lg font-semibold hover:underline"
        >
          {{ character.name }}
        </RouterLink>
        <p class="mt-1 flex-auto line-clamp-2 text-neutral-700">{{ character.description }}</p>
        <div class="mt-3 flex items-center justify-between gap-2 text-sm">
          <span class="text-neutral-500">Edited {{ formatTimeAgo(new Date(character.modifiedOn)) }}</span>
          <span class="flex gap-3">
            <TextLink routeName="viewCharacter" :params="{ id: character.id }" sameWindow>View</TextLink>
            <TextLink routeName="character" :params="{ id: character.id }" sameWindow>Edit</TextLink>
          </span>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-neutral-300 rounded-lg text-center"
    >
      <p class="text-neutral-700">You have no {{ edition }} characters yet.</p>
      <SectionLink icon="lucide:plus" routeName="character" :params="{ id: 'create' }" variant="dark" size="lg">
        Create your first character
      </SectionLink>
    </div>
  </section>

  <section class="mt-10">
    <h2 class="text-2xl font-semibold mb-3">Compendium</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="section in COMPENDIUM_SECTIONS"
        :key="section.title"
        class="p-4 bg-neutral-50 border border-neutral-200 rounded-lg"
      >
        <div class="mb-2 pb-1 border-b border-brand-rule text-[0.7rem] font-bold uppercase tracking-widest text-brand">
          {{ section.title }}
        </div>
        <RouterLink
          v-for="link in section.links"
          :key="link.listRoute"
          :to="{ name: link.listRoute }"
          class="block py-0.5 hover:underline"
        >
          {{ link.text }}
        </RouterLink>
      </div>
    </div>
  </section>

  <HomeNotes />
</template>

<style scoped></style>
