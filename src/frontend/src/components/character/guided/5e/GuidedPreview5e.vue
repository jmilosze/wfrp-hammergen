<script setup lang="ts">
import { computed } from "vue";
import { characteristicList, getAttributeValue, printAttributeName } from "@/services/wh/core/attributes.ts";
import { printSpeciesWithRegion } from "@/services/wh/core/species.ts";
import { ADVANCE_POINTS_5E } from "@/services/wh/character/generation/5e/experience5e.ts";
import { speciesFortuneBonus5e } from "@/services/wh/character/generation/5e/species5e.ts";
import {
  fickleFateBonus5e,
  guidedCareer5e,
  GuidedContext5e,
  guidedPreview5e,
  guidedSpecies5e,
  GuidedState5e,
  guidedTalentsContext5e,
  guidedTrappingsContext5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";
import { guidedSpeciesTalents5e, speciesTalentRows5e } from "@/services/wh/character/generation/5e/talents5e.ts";

// The character so far, beside the step: only what the player chose or rolled, with the bonuses the
// rolls earned (Fortune for the species roll, level 2 trappings for the career roll, Fate for Oh Fickle Fate), and the
// characteristics once rolled.
const props = defineProps<{ state: GuidedState5e; context: GuidedContext5e }>();

const species = computed(() => guidedSpecies5e(props.state));
const career = computed(() => guidedCareer5e(props.state, props.context));
const fortuneBonus = computed(() =>
  props.state.species === null ? 0 : speciesFortuneBonus5e(props.state.speciesRolls, props.state.species),
);
const bonusTrappings = computed(() => guidedTrappingsContext5e(props.state, props.context).bonusTrappings);
const fateBonus = computed(() => fickleFateBonus5e(props.state));
const skillName = (id: string) => props.context.skills.find((x) => x.id === id)?.name ?? id;
// The species skills picked (a group's pick is its specialisation; one not yet picked is left out), each at +5.
const speciesSkills = computed(() =>
  Object.values(props.state.skills.species)
    .filter((x) => x !== "")
    .map(skillName),
);
// The career skills that got Advances, with the points they add.
const careerSkills = computed(() =>
  Object.entries(props.state.skills.advances).map(([id, count]) => `${skillName(id)} +${count * ADVANCE_POINTS_5E}`),
);
const talentName = (id: string) => props.context.talents.find((x) => x.id === id)?.name ?? id;
// The species talents settled so far (a choice, a group's member or a Random Talent not yet made is left out).
const speciesTalents = computed(() =>
  guidedSpeciesTalents5e(
    speciesTalentRows5e(props.state.talents, guidedTalentsContext5e(props.state, props.context)),
  ).map(talentName),
);
const careerTalent = computed(() =>
  props.state.talents.career === null ? null : talentName(props.state.talents.career),
);
const rolled = computed(() => props.state.characteristics.method !== null);
const previewCharacter = computed(() => guidedPreview5e(props.state, props.context));
const attributes = computed(() => previewCharacter.value?.getTotalAttributes() ?? null);
</script>

<template>
  <div class="flex flex-col gap-2 rounded border border-neutral-300 bg-white p-3 text-sm">
    <div class="font-semibold">Your character so far</div>
    <p v-if="species === null" class="text-neutral-700">It takes shape here as you go.</p>
    <template v-else>
      <div>
        {{ printSpeciesWithRegion(species) }}<template v-if="career !== null"> · {{ career.name }}</template>
        <div v-if="fortuneBonus > 0" class="text-neutral-700">+1 Fortune</div>
        <div v-if="career !== null && bonusTrappings > 0" class="text-neutral-700">
          +{{ bonusTrappings }} {{ bonusTrappings === 1 ? "trapping" : "trappings" }} from level 2
        </div>
        <div v-if="fateBonus > 0" class="text-neutral-700">+1 Fate</div>
        <div v-if="rolled && previewCharacter !== null">Wounds {{ previewCharacter.getWounds() }}</div>
      </div>
      <table v-if="rolled && attributes !== null" class="w-full text-center tabular-nums">
        <tbody>
          <tr>
            <th v-for="att in characteristicList.slice(0, 5)" :key="att" class="font-semibold">
              {{ printAttributeName(att) }}
            </th>
          </tr>
          <tr>
            <td v-for="att in characteristicList.slice(0, 5)" :key="att">{{ getAttributeValue(att, attributes) }}</td>
          </tr>
          <tr>
            <th v-for="att in characteristicList.slice(5)" :key="att" class="font-semibold">
              {{ printAttributeName(att) }}
            </th>
          </tr>
          <tr>
            <td v-for="att in characteristicList.slice(5)" :key="att">{{ getAttributeValue(att, attributes) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="speciesSkills.length > 0">
        <span class="font-semibold">Species skills (+5):</span> {{ speciesSkills.join(", ") }}
      </div>
      <div v-if="careerSkills.length > 0">
        <span class="font-semibold">Career skills:</span> {{ careerSkills.join(", ") }}
      </div>
      <div v-if="speciesTalents.length > 0">
        <span class="font-semibold">Species talents:</span> {{ speciesTalents.join(", ") }}
      </div>
      <div v-if="careerTalent !== null"><span class="font-semibold">Career talent:</span> {{ careerTalent }}</div>
    </template>
  </div>
</template>
