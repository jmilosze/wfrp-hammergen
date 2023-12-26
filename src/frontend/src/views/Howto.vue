<script setup lang="ts">
import Header from "../components/PageHeader.vue";
import TextLink from "../components/TextLink.vue";
</script>

<template>
  <Header title="How to use Hammergen"> </Header>
  <p class="my-2 text-2xl">Warhammer 4th ed database</p>
  <p>
    The most basic was to use Hammergen is to treat it as a large online index of all skills, talents, trappings,
    qualities, spells, and mutations published in any of Warhammer 4th ed book. Hammergen contains almost all of them
    with partial description and note which book and page they are from. Please keep in mind that descriptions of those
    items are often incomplete, abbreviated, and cannot replace original descriptions from the source books.
  </p>
  <p>
    In addition, Hammergen includes a large number of special filters that allow to lookup all things that match some
    criteria, for example:
  </p>
  <ul class="list-disc ml-6 mt-1">
    <li>Find all new trappings from Up in Arms.</li>
    <li>Find which source book contains Chantyman career.</li>
    <li>List all melee weapons from Fencing group.</li>
  </ul>
  <p class="font-semibold">
    To use it as Warhammer database you don't have to signup or login. Just head up to the relevant section and start
    browsing!
  </p>
  <p class="my-2 text-2xl">Character generator</p>
  <p>
    If you create and account, you can start generating your own characters and more! Some examples what you can do:
  </p>
  <ul class="list-disc ml-6 mt-1">
    <li>Auto-generate new characters using rulebook character creation rules</li>
    <li>Create custom skills, talents, careers, trappings, qualities, spells, and mutations</li>
    <li>Generate names and physical descriptions using rulebook rules.</li>
    <li>
      Generate random attribute rolls with one press of a button, appropriate racial bonuses are added automatically.
    </li>
    <li>Save your character and edit it later at any time.</li>
    <li>View your character in a clear printable format.</li>
    <li>Download your character in spreadsheet format or as JSON file.</li>
  </ul>
  <p class="my-2 text-2xl">Share your customer characters and properties with friends</p>
  <p>
    Any character of property you make, you can share with other Hammergen users. In order for them to use it, you must
    mark your character/property as "public". Next, they will need to add you to "linked users". It can be done in
    <TextLink routeName="linkedusers">Linked Users</TextLink> tab visible in the left-hand navigation menu after logging
    in. Every shared character and property are in read-only mode. It means that only the original owner can modify or
    delete it.
  </p>
</template>

<style scoped></style>
