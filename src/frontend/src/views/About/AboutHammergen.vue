<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
import HammergenFaq from "./HammergenFaq.vue";
import UpdateList from "./UpdateList.vue";
import ToggleSwitch from "../../components/ToggleSwitch.vue";
import { useRouteQuery } from "@vueuse/router";

const viewNames = [
  { value: "about", text: "About" },
  { value: "faq", text: "FAQ" },
  { value: "updates", text: "Updates" },
];

const currentView = useRouteQuery("view", viewNames[0].value);

// Core rulebook first, the rest alphabetically.
const SOURCE_BOOKS = [
  { title: "5th Edition", books: ["Warhammer Fantasy Roleplay 5th Edition Core Rulebook"] },
  {
    title: "4th Edition",
    books: [
      "Warhammer Fantasy Roleplay Rulebook (4th Edition)",
      "Altdorf - Crown of the Empire",
      "Archives of the Empire: Volume I, II, and III",
      "Death on the Reik Companion",
      "Deft Steps Light Fingers",
      "Dwarf Player's Guide",
      "Enemy in Shadows",
      "Enemy in Shadows Companion",
      "High Elf Player's Guide",
      "Lords of Stone and Steel",
      "Lustria",
      "Middenheim City of the White Wolf",
      "Reikland Miscellanea",
      "Rough Nights & Hard Days",
      "Salzenmund, City of Salt and Silver",
      "Sea of Claws",
      "Starter Set",
      "Sylvania: The Cursed County",
      "The Imperial Zoo",
      "The Temple of Spite",
      "Tribes and Tribulations",
      "Ubersreik Adventures",
      "Ubersreik Adventures 2",
      "Up in Arms",
      "Winds of Magic",
    ],
  },
];
</script>

<template>
  <div class="flex justify-center mb-4">
    <ToggleSwitch v-model="currentView" :options="viewNames" label="About view" />
  </div>
  <div v-if="currentView === viewNames[0].value">
    <Header title="About Hammergen" />
    <div class="text-2xl font-semibold mt-5">The author</div>
    <p>
      Hi there! Hammergen is a non-commercial hobby project run by an overworked middle-aged man. If you have any
      comments, discovered bugs, or have any suggestions on how to improve Hammergen, you can contact me by email:
      <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink>
      . I try to answer emails/fix bugs on the same or next day but sometimes life gets in the way so please be patient.
    </p>
    <p class="mt-2">
      Hammergen is free to use. If you enjoy it and would like to support it, you can do so on
      <TextLink href="https://ko-fi.com/Q5Q12E0KB">Ko-fi</TextLink>. Donations help cover the hosting costs.
    </p>

    <div class="text-2xl font-semibold mt-5">Source books</div>
    <div class="my-3 p-4 border-l-4 border-brand bg-parchment-light rounded">
      <p class="font-semibold">Hammergen does not replace the rulebooks.</p>
      <p class="mt-1">
        The compendium has entries from every book listed below, but their descriptions are incomplete. Most cover only
        the game mechanics, such as tests, modifiers and effects, and leave out the full rules text. To use Hammergen
        you need the books themselves.
      </p>
      <p class="mt-2">
        <TextLink href="https://cubicle7games.com/warhammer-fantasy">Buy the books from Cubicle 7</TextLink>
      </p>
    </div>
    <div class="mt-3 grid gap-4 md:grid-cols-[1fr_3fr]">
      <div
        v-for="edition in SOURCE_BOOKS"
        :key="edition.title"
        class="p-4 bg-neutral-50 border border-neutral-200 rounded-lg"
      >
        <div class="mb-2 pb-1 border-b border-brand-rule text-sm font-bold uppercase tracking-widest text-brand">
          {{ edition.title }}
        </div>
        <ul class="list-disc ml-5 gap-x-8" :class="{ 'sm:columns-2 lg:columns-3': edition.books.length > 1 }">
          <li v-for="book in edition.books" :key="book" class="break-inside-avoid py-0.5">{{ book }}</li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else-if="currentView === viewNames[1].value">
    <HammergenFaq />
  </div>
  <div v-else>
    <UpdateList />
  </div>
</template>

<style scoped></style>
