<script setup lang="ts">
import HelpButton from "@/components/ui/HelpButton.vue";
import { MAX_ITEM_VALUE_LENGTH } from "@/utils/idNumberValue.ts";

// The question mark that explains how a career level's trappings are entered, with examples; in the Trappings card
// and next to the title of the popups that add trappings.
// How common trappings are entered, for the Trappings help.
const HELP_EXAMPLES: [string, string][] = [
  ["Rope, Lantern", "Two rows: Rope; Lantern"],
  ["Bow with 10 Arrows", "One row: Bow, and Arrow with quantity 10 (+ Trapping)"],
  ["Sword or Axe", "One row with two options: Sword; Axe (+ Option)"],
  ["Bow with 10 Arrows or Pistol with 10 Shots", "One row, two options: Bow, 10 Arrows; Pistol, 10 Bullets"],
  ["1d10 Candles", "Candle with quantity 1d10"],
  ["Hand Weapon (Sickle)", 'Hand Weapon with note "Sickle"'],
  ["A loyal squire", 'Retainer with note "Squire"'],
  ["3d10 Silver", "Money: Silver, 3d10"],
];
</script>

<template>
  <HelpButton modalHeader="Trappings">
    <p class="my-1">
      <b>Items and Assets</b> lists what the career level gives. Each row is one entry: a trapping, a few trappings that
      go together, or a choice between options.
    </p>
    <ul class="my-1 ml-5 list-disc">
      <li><b>Add</b> picks trappings; each one you add is a row of its own, with a quantity of 1.</li>
      <li>
        <b>Edit</b> a row to change its quantities and notes, add additional trappings to it (+ Trapping) or add options
        to choose from (+ Option).
      </li>
      <li><b>Quantity</b> is a number or dice, with an optional modifier: 10, 1d10, 2d6+3.</li>
      <li>
        <b>Note</b> (at most {{ MAX_ITEM_VALUE_LENGTH }} characters) says what the trapping is, and is copied to the
        character's trapping, e.g. Hand Weapon with "Sickle", or Retainer with "Squire".
      </li>
      <li><b>Several options</b> in a row are a choice: a character gets one of them.</li>
    </ul>
    <p class="my-1">
      <b>One row or several?</b> A row is one item of the career's trappings list, as the rulebook writes it: "Rope,
      Lantern" is two rows, but "Bow with 10 Arrows" is one row holding both trappings, because the arrows come with the
      bow. This matters in two ways:
    </p>
    <ul class="my-1 ml-5 list-disc">
      <li>
        In 5e, each row is one tick of the level's trappings when the character advances (each Money row is one too), so
        "Bow with 10 Arrows" is one tick, not two.
      </li>
      <li>
        In a choice, everything that comes together has to be in the same option: "Bow with 10 Arrows or Pistol with 10
        Shots" is one row with two options, each of two trappings.
      </li>
    </ul>
    <p class="my-1"><b>Money</b> is coins with a number or dice, e.g. 20 Gold or 3d10 Silver.</p>
    <p class="my-1">
      <b>Old text</b>: levels whose trappings are still written as text show it in a box at the bottom. Enter them as
      rows instead; once the text is emptied, the box goes.
    </p>
    <p class="my-1">
      <b>Generated characters</b> get the trappings and money of every level up to their own: one option of each choice,
      picked at random, with dice rolled and notes copied. Trappings that can't be carried, such as places or retainers,
      go to Stored, and the money is added to the character's coins.
    </p>
    <p class="mt-3 mb-1 font-semibold">Examples</p>
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left border-b border-neutral-300">
          <th class="py-1 pr-2">Career gives</th>
          <th class="py-1">Enter</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="example in HELP_EXAMPLES" :key="example[0]" class="border-b border-neutral-200">
          <td class="py-1 pr-2 align-top">{{ example[0] }}</td>
          <td class="py-1 align-top">{{ example[1] }}</td>
        </tr>
      </tbody>
    </table>
  </HelpButton>
</template>
