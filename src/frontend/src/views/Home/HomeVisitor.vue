<script setup lang="ts">
// Landing page for visitors who are not logged in: what Hammergen is and where to start.
import { Icon } from "@iconify/vue";
import TextLink from "../../components/TextLink.vue";
import LinkButton from "../../components/LinkButton.vue";
import HomeNotes from "./HomeNotes.vue";

const FEATURES = [
  {
    icon: "lucide:dices",
    title: "Generate characters",
    text: "Roll species, careers, characteristics, names and looks using the rulebook rules, then save, print or export the result.",
    routeName: "characters",
    linkText: "Characters",
  },
  {
    icon: "lucide:book-open",
    title: "Search the compendium",
    text: "Careers, skills, talents, trappings, spells and more, each with its source book and page. No account needed.",
    routeName: "careers",
    linkText: "Browse",
  },
  {
    icon: "lucide:users",
    title: "Share with your group",
    text: "Create your own careers, talents or trappings and share them, together with your characters, with other players.",
    routeName: "about",
    query: { view: "faq" },
    linkText: "How sharing works",
  },
];
</script>

<template>
  <section class="flex flex-col items-center text-center pt-6 pb-12">
    <div class="flex items-center gap-3 font-hammergen text-6xl md:text-8xl">
      <Icon icon="game-icons:warhammer" />
      <h1>Hammergen</h1>
    </div>
    <p class="mt-2 font-hammergen text-2xl md:text-4xl">Warhammer Fantasy Roleplay character generator</p>
    <p class="mt-4 max-w-2xl text-lg text-neutral-600">
      Create characters and look up rules content for the 4th and 5th Edition of WFRP.
    </p>
    <!-- The compendium button spans both columns; smaller text on phones keeps the first two side by side. The
    LinkButton's inner row is centred. -->
    <div class="mt-8 grid grid-cols-2 w-full max-w-md gap-3 text-base sm:text-lg *:*:justify-center">
      <LinkButton routeName="register" class="btn btn-primary px-2 whitespace-normal">Create account</LinkButton>
      <LinkButton routeName="login" class="btn btn-primary px-2">Log in</LinkButton>
      <LinkButton routeName="careers" class="col-span-2 btn btn-secondary">Browse the compendium</LinkButton>
    </div>
  </section>

  <section class="grid gap-6 md:grid-cols-3">
    <div
      v-for="feature in FEATURES"
      :key="feature.title"
      class="flex flex-col p-6 bg-neutral-50 border border-neutral-200 rounded-lg"
    >
      <Icon :icon="feature.icon" class="size-10 text-primary-600" />
      <h2 class="mt-3 text-xl font-semibold">{{ feature.title }}</h2>
      <p class="mt-2 flex-auto text-neutral-700">{{ feature.text }}</p>
      <TextLink :routeName="feature.routeName" :query="feature.query" sameWindow class="mt-4">
        {{ feature.linkText }} →
      </TextLink>
    </div>
  </section>

  <HomeNotes />
</template>

<style scoped></style>
