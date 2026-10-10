<script setup lang="ts">
import { Icon } from "@iconify/vue";
import TextLink from "../components/TextLink.vue";
import LinkButton from "../components/LinkButton.vue";
import { useAuth } from "../composables/auth.ts";

const auth = useAuth();

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
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <LinkButton
        v-if="auth.loggedIn.value"
        routeName="character"
        :params="{ id: 'create' }"
        class="btn btn-primary text-lg px-5"
      >
        Create a character
      </LinkButton>
      <LinkButton v-else routeName="register" class="btn btn-primary text-lg px-5">Create an account</LinkButton>
      <LinkButton routeName="careers" class="btn btn-secondary text-lg px-5">Browse the compendium</LinkButton>
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

  <section class="mt-12 pt-4 border-t border-neutral-200 text-sm text-neutral-600 text-center space-y-1">
    <p>
      Descriptions are shortened and do not replace the rulebooks published by
      <TextLink href="https://cubicle7games.com/warhammer-fantasy">Cubicle 7</TextLink>.
    </p>
    <p>
      Questions? See the <TextLink routeName="about" :query="{ view: 'faq' }" sameWindow>FAQ</TextLink>. Need dice? Try
      <TextLink href="https://dice.hammergen.net/">Hammergen Dice</TextLink>. Enjoying Hammergen? Support it on
      <TextLink href="https://ko-fi.com/Q5Q12E0KB">Ko-fi</TextLink>.
    </p>
  </section>
</template>

<style scoped></style>
