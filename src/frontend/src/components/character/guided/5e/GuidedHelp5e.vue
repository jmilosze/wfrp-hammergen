<script setup lang="ts">
import HelpButton from "@/components/ui/HelpButton.vue";
import { GuidedStep5e } from "@/services/wh/character/generation/5e/guided5e.ts";

// The rules behind each step of 5e guided creation, in a popup beside the step's title. Steps without an explanation
// yet show nothing.
defineProps<{ step: GuidedStep5e }>();
</script>

<template>
  <HelpButton v-if="step === 'species'" modalHeader="Species">
    <p class="my-3">
      Rolling uses the Species Table of the rulebook (p. 23): 01–90 is Human, 91–94 Halfling, 95–98 Dwarf, 99 High Elf
      and 00 Wood Elf. A roll can only give one of these five; a species that isn't on the table can only be chosen.
    </p>
  </HelpButton>
  <HelpButton v-else-if="step === 'career'" modalHeader="Class and career">
    <p class="my-3">
      Rolling uses your species' column of the Random Class and Career Table of the rulebook (p. 37), so a roll can only
      give a career that is on that table. The picker is wider: it offers every career open to your species that has at
      least its first level defined, including careers that are not on the table.
    </p>
    <p class="my-3">
      A custom career may lack some of its first level characteristics, skills, talents or trappings. You can still go
      on, but you can't pick or advance what the career doesn't have. If it has no characteristics, there are no career
      points to distribute.
    </p>
  </HelpButton>
</template>
