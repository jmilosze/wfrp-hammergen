<script setup lang="ts">
import HelpButton from "@/components/ui/HelpButton.vue";
import { Edition } from "@/services/wh/core/edition.ts";
import { rulesFor } from "@/services/wh/character/rules/rules.ts";

// The question mark next to the title of the character editor's skills, talents and trappings popups: what the Career,
// Species and Class marks in the rows' notes (and the Character filter) mean.
const props = defineProps<{
  kind: "skills" | "talents" | "trappings";
  edition: Edition;
}>();

const TITLES = {
  skills: "Career and species skills",
  talents: "Career and species talents",
  trappings: "Class and career trappings",
};
</script>

<template>
  <HelpButton :modalHeader="TITLES[props.kind]">
    <p class="my-1">
      The notes of the rows say what your current career, species and class give, so you can see at once what you can
      advance or get. <b>Filters</b> › <b>Character</b> shows only those rows; tick <b>Selected</b> as well to see your
      own {{ props.kind }} with them.
    </p>
    <ul v-if="props.kind === 'skills'" class="my-1 ml-5 list-disc">
      <li>
        <b>Career</b>: the skills of your current career level and of the lower levels of the same career you went
        through. A lower level counts only when it is ticked as a past career; levels you skipped when you entered the
        career don't count.
      </li>
      <li>
        <b>Species</b>: your species' skills<template v-if="props.edition === '5e'"> and fluent languages</template>.
      </li>
    </ul>
    <ul v-else-if="props.kind === 'talents'" class="my-1 ml-5 list-disc">
      <li v-if="rulesFor(props.edition).careerTalentsFromLowerLevels">
        <b>Career</b>: the talents of your current career level and of the lower levels of the same career you went
        through. A lower level counts only when it is ticked as a past career; levels you skipped when you entered the
        career don't count.
      </li>
      <li v-else>
        <b>Career</b>: the talents of your current career level only. In 4e you can buy only the talents of the level
        you are in, not those of lower levels.
      </li>
      <li><b>Species</b>: your species' talents, including every option of a choice (e.g. Savvy or Suave).</li>
      <li>
        <b>Species (Random)</b>: the talents of the Random Talents table, for a species that rolls Random Talents. The
        Species filter shows them too.
      </li>
    </ul>
    <ul v-else class="my-1 ml-5 list-disc">
      <li><b>Class</b>: the class trappings of your current career's class, including every option of a choice.</li>
      <li>
        <b>Career</b>: the trappings of your current career level, including every option of a choice; not those of
        other levels. Most 4e careers don't have their trappings in Hammergen yet, so they show no Career trappings.
      </li>
    </ul>
    <p v-if="props.kind !== 'trappings'" class="my-1">
      A group in a list, e.g. Melee (Any), marks every member of the group. Skills and talents of earlier careers are
      not marked: once you have left a career they are no longer career {{ props.kind }}.
    </p>
    <p class="my-1">
      Without a current career there are no Career<template v-if="props.kind === 'trappings'"> or Class</template>
      marks.
    </p>
  </HelpButton>
</template>
