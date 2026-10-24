<script setup lang="ts">
import { computed } from "vue";
import { printSpeciesWithRegion } from "@/services/wh/core/species.ts";
import { printCareerCoin } from "@/services/wh/content/careerTrapping.ts";
import { printItemWithValue } from "@/utils/idNumberValue.ts";
import { buildCharacter5e } from "@/services/wh/character/generation/5e/creation5e.ts";
import { completeChoices5e, GuidedContext5e, GuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";

// Step 8: the character as Finish will create it, and the bonuses earned. Finish puts it on the sheet, where it can
// still be changed before saving.
const props = defineProps<{ state: GuidedState5e; context: GuidedContext5e }>();

const choices = computed(() => completeChoices5e(props.state, props.context));
const character = computed(() => {
  if (choices.value === null) {
    return null;
  }
  // The talents' modifiers (Hardy, size) count towards Movement and Wounds.
  const built = buildCharacter5e(choices.value);
  built.hydrateTalentModifiers(props.context.talents);
  return built;
});

const nameOf = (list: { id: string; name: string }[], id: string) => list.find((x) => x.id === id)?.name ?? id;
const skills = computed(() =>
  Object.entries(character.value?.skills ?? {})
    .map(([id, points]) => `${nameOf(props.context.skills, id)} +${points}`)
    .sort(),
);
const talents = computed(() =>
  Object.entries(character.value?.talents ?? {})
    .map(([id, rank]) => `${nameOf(props.context.talents, id)}${rank > 1 ? ` ×${rank}` : ""}`)
    .sort(),
);
const trappings = computed(() =>
  [...(character.value?.carriedItems ?? []), ...(character.value?.storedItems ?? [])].map(
    (x) => `${x.number === 1 ? "" : `${x.number} × `}${printItemWithValue(nameOf(props.context.items, x.id), x.value)}`,
  ),
);
const coins = computed(() =>
  character.value === null
    ? ""
    : [
        [character.value.gold, printCareerCoin("gold")],
        [character.value.silver, printCareerCoin("silver")],
        [character.value.brass, printCareerCoin("brass")],
      ]
        .filter(([n]) => n !== 0)
        .map(([n, coin]) => `${n} ${coin}`)
        .join(", "),
);
const bonuses = computed(() => {
  if (choices.value === null) {
    return [];
  }
  return [
    choices.value.bonusFortune > 0 ? "+1 Fortune for keeping your first species roll" : "",
    choices.value.bonusTicks > 0
      ? `${choices.value.bonusTicks} ${choices.value.bonusTicks === 1 ? "tick" : "ticks"} on the Career Advancement Tracker for the level 2 trappings`
      : "",
    choices.value.bonusFate > 0 ? "+1 Fate from Oh Fickle Fate: you kept every first roll" : "",
  ].filter((x) => x !== "");
});
</script>

<template>
  <p v-if="character === null">Finish the steps above to see your character here.</p>
  <div v-else class="flex flex-col gap-2">
    <p>This is the character Finish puts on the sheet. You can still change anything there before you save.</p>
    <div class="font-semibold">{{ character.name }}</div>
    <div>{{ printSpeciesWithRegion(character.species) }}, {{ choices?.career.name }}</div>
    <div>
      Fate {{ character.fate }} · Fortune {{ character.fortune }} · Movement {{ character.getMovement() }} · Wounds
      {{ character.getWounds() }}
    </div>
    <div><span class="font-semibold">Skills:</span> {{ skills.join(", ") }}</div>
    <div><span class="font-semibold">Talents:</span> {{ talents.join(", ") }}</div>
    <div><span class="font-semibold">Trappings:</span> {{ trappings.join(", ") }}</div>
    <div><span class="font-semibold">Coins:</span> {{ coins || "none" }}</div>
    <div v-if="bonuses.length > 0">
      <span class="font-semibold">Bonuses earned:</span>
      <ul class="list-disc pl-6">
        <li v-for="bonus in bonuses" :key="bonus">{{ bonus }}</li>
      </ul>
    </div>
  </div>
</template>
