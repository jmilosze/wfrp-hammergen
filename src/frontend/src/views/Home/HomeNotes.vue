<script setup lang="ts">
// Small print at the bottom of the landing pages.
import TextLink from "../../components/ui/TextLink.vue";
</script>

<template>
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
