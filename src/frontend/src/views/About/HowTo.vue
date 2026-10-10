<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
</script>

<template>
  <Header title="How to Use Hammergen?" />
  <p class="my-2 text-2xl">Warhammer database (4th and 5th Edition)</p>
  <p>
    The most basic was to use Hammergen is to treat it as a large online index of all skills, talents, trappings,
    qualities, spells, and mutations published in Warhammer Fantasy Roleplay 4th Edition books and the 5th Edition Core
    Rulebook. Use the 4e | 5e switch in the side navigation bar to choose the edition. Hammergen contains almost all of
    them with partial description and note which book and page they are from. Please keep in mind that descriptions of
    those items are often incomplete, abbreviated, and cannot replace original descriptions from the source books.
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
  <p class="my-2 text-2xl">Share your characters and compendium items with friends</p>
  <p>
    Any character or compendium item (skill, talent, etc.) you make, you can share with other Hammergen users. In order
    for them to use it, you must mark it as "shared". Next, they will need to add you to "linked users". It can be done
    in
    <TextLink routeName="manage" :query="{ view: 'linked' }">Linked Users</TextLink> tab visible in the left-hand
    navigation menu after logging in. Every shared character and compendium item is in read-only mode. It means that
    only the original owner can modify or delete it.
  </p>
</template>

<style scoped></style>
