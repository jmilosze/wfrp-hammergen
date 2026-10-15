<script setup lang="ts">
import PageHeader from "@/components/ui/PageHeader.vue";
import TextLink from "@/components/ui/TextLink.vue";
</script>

<template>
  <PageHeader title="Frequently asked questions" />
  <div class="divide-y divide-neutral-200">
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Do I need an account?</summary>
      <p class="mt-2">
        Not to browse. The compendium and the example characters in
        <TextLink routeName="characters" sameWindow>Characters</TextLink> are open to everyone. You need an account to
        create and save your own characters and compendium items.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Do you check my email address?</summary>
      <p class="mt-2">
        No, the email is only your login name and is never verified. You can use a made-up one, but then you cannot
        reset a forgotten password.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">What does the 4e | 5e switch do?</summary>
      <p class="mt-2">
        It picks the edition you browse in the compendium and the edition of characters you create. You can change it at
        any time.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Which books are included?</summary>
      <p class="mt-2">
        The 5th Edition Core Rulebook and almost every 4th Edition book. The full list is in
        <TextLink routeName="about" sameWindow>About</TextLink>.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Are the descriptions complete?</summary>
      <p class="mt-2">
        No. They are shortened and cannot replace the rulebooks, so every entry lists the book and page it comes from.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Can I search by book, weapon group and so on?</summary>
      <p class="mt-2">
        Yes, every compendium list has filters. For example, you can list the trappings added in Up in Arms, find the
        book with the Chantyman career, or show all Fencing melee weapons.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">How do I create a character?</summary>
      <p class="mt-2">
        Log in, open <TextLink routeName="characters" sameWindow>Characters</TextLink> and click Create new. Generate
        buttons roll species, characteristics, names and descriptions by the rulebook rules, and racial bonuses are
        added for you. You can edit the character later, view it in a printable format, or download it as a spreadsheet
        or JSON file.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">Can I add my own skills, talents or careers?</summary>
      <p class="mt-2">
        Yes. When logged in, each compendium list has a Create new button for your own careers, skills, talents,
        trappings, qualities, spells, mutations and more.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">How do I share with other players?</summary>
      <p class="mt-2">
        Mark a character or compendium item as <span class="font-semibold">Shared</span>. The other player then adds
        your username in
        <TextLink routeName="manage" :query="{ view: 'linked' }" sameWindow>Manage account → Linked users</TextLink>.
        Shared things are read-only: only you can change or delete them.
      </p>
    </details>
    <details class="py-3">
      <summary class="cursor-pointer text-lg font-semibold">I found a bug or have an idea. Who do I tell?</summary>
      <p class="mt-2">
        Email <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink>. If you enjoy Hammergen, you
        can help with the hosting costs on <TextLink href="https://ko-fi.com/Q5Q12E0KB">Ko-fi</TextLink>.
      </p>
    </details>
  </div>
</template>
