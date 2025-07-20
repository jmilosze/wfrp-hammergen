<script setup lang="ts">
import TextLink from "../components/TextLink.vue";
import AlertBlock from "../components/AlertBlock.vue";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const showAlert = ref(false);
</script>

<template>
  <div>
    <div class="text-center mt-5 mb-2 font-hammergen text-6xl md:text-8xl flex justify-center items-center gap-3">
      <Icon icon="game-icons:warhammer" />
      <div>Hammergen</div>
    </div>
    <div class="text-center font-hammergen text-2xl md:text-4xl">Warhammer Fantasy Roleplay character generator</div>
    <AlertBlock v-if="showAlert" alertType="green" class="mt-5" @close="showAlert = false">
      <div class="pl-2">
        <p class="text-2xl font-semibold">High Elf Player's Guide</p>
        <p>
          We are happy to announce that contents of
          <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-high-elf-player-s-guide" target="_blank">
            High Elf Player's Guide
          </TextLink>
          are now available on Hammergen! This includes all new careers, spells and trappings.
        </p>
        <p class="mt-3">
          As always if you enjoy Hammergen, please consider supporting us on
          <TextLink href="https://ko-fi.com/Q5Q12E0KB">Ko-fi</TextLink>. Any donations will help to cover hosting costs.
        </p>
      </div>
    </AlertBlock>
    <div class="text-2xl font-semibold mt-10">What is Hammergen?</div>
    <p>
      Hammergen is an online Warhammer Fantasy Roleplay (WFRP) 4th Edition character generator. It lets you create,
      store, and manage characters as well as custom character properties such as skills, talents, etc. You can share
      everything you create with other players!
    </p>
    <p>
      Hammergen includes all trappings, careers, skills, talents, mutations, spells, and qualities from WFRP 4th ed
      Rulebook and almost all other 4th ed books published by
      <TextLink href="https://cubicle7games.com/warhammer-fantasy">Cubicle 7</TextLink>.
      <span class="font-semibold">
        Please keep in mind that descriptions of those items are often incomplete, abbreviated, and cannot replace
        original descriptions from the source books.
      </span>
    </p>
    <p class="mt-2">
      If at any point you need to roll dices, you can head over to
      <TextLink href="https://dice.hammergen.net/">Hammergen Dice</TextLink>
      where you can roll various RPG dices by yourself or with friends.
    </p>
    <div class="text-2xl font-semibold mt-5">What exactly can I do here?</div>
    <p class="mt-1 text-xl">Generate characters</p>
    <ul class="list-disc ml-6 mt-1">
      <li>Auto-generate new characters using rulebook character creation rules</li>
      <li>Create custom skills, talents, careers, trappings, qualities, spells, and mutations</li>
      <li>Share everything you created with other players.</li>
      <li>Generate names and physical descriptions using rulebook rules.</li>
      <li>
        Generate random attribute rolls with one press of a button, appropriate racial bonuses are added automatically.
      </li>
      <li>Save your character and edit it later at any time.</li>
      <li>View your character in a clear printable format.</li>
      <li>Download your character in spreadsheet format or as JSON file.</li>
    </ul>
    <p class="mt-1 text-xl">Warhammer database</p>
    <p>
      Hammergen has almost all trappings, careers, skills, talents, mutations, spells, and qualities from WFRP 4th ed
      Rulebook and all other 4th ed books published. Full list of included source books can be found in
      <TextLink routeName="about">About</TextLink>
      section. Each of them has a reference to the source book and page they are from. Some examples of what you can use
      filters for are:
    </p>
    <ul class="list-disc ml-6 mt-1">
      <li>Find all new trappings from Up in Arms.</li>
      <li>Find which source book contains Chantyman career.</li>
      <li>List all melee weapons from Fencing group.</li>
    </ul>
    <p>
      You can see example characters (even without registering) by going to
      <TextLink routeName="characters">Characters</TextLink>
      in the side navigation bar.
    </p>
    <div class="text-2xl font-semibold mt-5">How do I use it?</div>
    <p>
      To use it as Warhammer database you don't have to signup or login. Just head up to the relevant section and start
      browsing!
    </p>
    <p>
      To start making characters you need to create an account using email address as login name. We do not verify the
      email addresses so you can use a fake email, but if you do, the password reset functionality will not work.
    </p>
    <p>
      After registering and logging in, all you need to do is go to Characters (in top navigation bar), and click Create
      New button.
    </p>
    <p>
      You can share any custom property (character, skill, trapping, etc.) you made with other players! When a property
      is marked as <span class="font-bold">Public</span>, anyone you give your username to, can see that item in
      read-only mode. Sharing is explained in the
      <TextLink routeName="manage" :query="{ view: 'linked' }">Manage account/Linked users</TextLink> sections available
      after logging in. You can also get there by clicking <TextLink routeName="manage">Manage account</TextLink> tab in
      the navigation bar and then selecting <span class="font-semibold">Linked users</span> section.
    </p>
    <p>
      More in-depth description of how to use Hammergen features can be found in
      <TextLink routeName="about" :query="{ view: 'howto' }">How to use Hammergen</TextLink>.
    </p>
    <div class="text-2xl font-semibold mt-5">About</div>
    <p>
      Hi there! Hammergen is a non-commercial hobby project run by an overworked middle-aged man. If you have any
      comments, discovered bugs, or have any suggestions on how to improve Hammergen, you can contact me by email:
      <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink>. I try to answer emails/fix bugs on the
      same or next day but sometimes life gets in the way so please be patient.
    </p>
    <p>
      If you enjoy using Hammergen, please consider supporting me on
      <TextLink href="https://ko-fi.com/Q5Q12E0KB">Ko-fi</TextLink>. Any donations will help to cover hosting costs.
    </p>
  </div>
</template>

<style scoped></style>
