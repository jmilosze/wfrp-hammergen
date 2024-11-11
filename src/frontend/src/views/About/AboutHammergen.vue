<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
import HowTo from "./HowTo.vue";
import UpdateList from "./UpdateList.vue";
import HorizontalNavBar from "../../components/HorizontalNavBar.vue";
import { useQueryParams } from "../../composables/useQueryParams.ts";

const viewNames = [
  { value: "about", text: "About" },
  { value: "howto", text: "How To Use It?" },
  { value: "updates", text: "Updates" },
];

const currentView = useQueryParams(
  "view",
  viewNames.map((x) => x.value),
);
</script>

<template>
  <HorizontalNavBar v-model="currentView" :viewNames="viewNames" />
  <div v-if="currentView === viewNames[0].value">
    <Header title="About Hammergen" />
    <div class="text-2xl font-semibold mt-5">The author</div>
    <p>
      Hi there! Hammergen is a non-commercial hobby project run by an overworked middle-aged man. If you have any
      comments, discovered bugs, or have any suggestions on how to improve Hammergen, you can contact me by email:
      <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink>
      . I try to answer emails/fix bugs on the same or next day but sometimes life gets in the way so please be patient.
    </p>

    <div class="text-2xl font-semibold mt-5">Source books</div>
    <p>Hammergen includes contents from the following source books:</p>
    <ul class="list-disc ml-6 mt-1">
      <li>Warhammer Fantasy Roleplay Rulebook</li>
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
    </ul>
  </div>
  <div v-else-if="currentView === viewNames[1].value">
    <HowTo />
  </div>
  <div v-else>
    <UpdateList />
  </div>
</template>

<style scoped></style>
