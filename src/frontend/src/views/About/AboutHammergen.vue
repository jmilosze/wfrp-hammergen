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
    <div class="my-3 p-4 border-l-4 border-primary-500 bg-primary-50 rounded">
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
    <p>Hammergen includes contents from the following source books:</p>
    <p class="mt-2 font-semibold">5th Edition</p>
    <ul class="list-disc ml-6 mt-1">
      <li>Warhammer Fantasy Roleplay 5th Edition Core Rulebook</li>
    </ul>
    <p class="mt-2 font-semibold">4th Edition</p>
    <ul class="list-disc ml-6 mt-1">
      <li>Warhammer Fantasy Roleplay Rulebook (4th Edition)</li>
      <li>Rough Nights & Hard Days</li>
      <li>Archives of the Empire: Volume I, II, and III</li>
      <li>Up in Arms</li>
      <li>Winds of Magic</li>
      <li>Middenheim City of the White Wolf</li>
      <li>Salzenmund, City of Salt and Silver</li>
      <li>Sea of Claws</li>
      <li>Lustria</li>
      <li>Enemy in Shadows</li>
      <li>Enemy in Shadows Companion</li>
      <li>Death on the Reik Companion</li>
      <li>Starter Set</li>
      <li>Ubersreik Adventures</li>
      <li>Ubersreik Adventures 2</li>
      <li>Altdorf - Crown of the Empire</li>
      <li>The Imperial Zoo</li>
      <li>Reikland Miscellanea</li>
      <li>Tribes and Tribulations</li>
      <li>Dwarf Player's Guide</li>
      <li>Deft Steps Light Fingers</li>
      <li>High Elf Player's Guide</li>
      <li>Lords of Stone and Steel</li>
      <li>The Temple of Spite</li>
      <li>Sylvania: The Cursed County</li>
    </ul>
  </div>
  <div v-else-if="currentView === viewNames[1].value">
    <HammergenFaq />
  </div>
  <div v-else>
    <UpdateList />
  </div>
</template>

<style scoped></style>
