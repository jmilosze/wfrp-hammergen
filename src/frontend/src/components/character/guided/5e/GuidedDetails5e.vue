<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import { validLongDescFn, validShortDescFn } from "@/services/wh/core/validators.ts";
import { generateName } from "@/services/wh/character/generation/shared/name.ts";
import { generateDescription } from "@/services/wh/character/generation/shared/description.ts";
import { GuidedState5e, guidedSpecies5e } from "@/services/wh/character/generation/5e/guided5e.ts";

// Step 7 (pp. 41–42): name and description (both can be generated), the ambitions and the background. Ambitions and
// background go into the notes (D6); only the name is needed.
const state = defineModel<GuidedState5e>("state", { required: true });

const species = computed(() => guidedSpecies5e(state.value));
const d = computed(() => state.value.details);

function generate(field: "name" | "description") {
  if (species.value !== null) {
    d.value[field] = field === "name" ? generateName(species.value) : generateDescription(species.value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-end gap-2">
      <FormInput
        v-model="d.name"
        title="Name"
        class="flex-1"
        :validationStatus="validShortDescFn(d.name)"
        :maxlength="200"
      />
      <AppButton icon="lucide:dices" @click="generate('name')">Generate name</AppButton>
    </div>
    <div class="flex flex-col items-start gap-1">
      <FormTextarea
        v-model="d.description"
        title="Description: age, looks, manner"
        class="w-full"
        :validationStatus="validLongDescFn(d.description)"
      />
      <AppButton icon="lucide:dices" @click="generate('description')">Generate description</AppButton>
    </div>
    <FormInput v-model="d.ambition" title="Ambition: a long-term goal of your own" />
    <FormInput v-model="d.partyAmbition" title="Party ambition: a goal the whole group shares" />
    <div class="flex flex-col gap-1">
      <FormTextarea v-model="d.background" title="Background" :validationStatus="validLongDescFn(d.background)" />
      <details class="text-sm">
        <summary class="cursor-pointer font-semibold">Questions to get you started</summary>
        <ul class="list-disc pl-6">
          <li>Where did you grow up, and what is it like there?</li>
          <li>Who is your family, and how do they see you?</li>
          <li>Who are your closest friends, old and new?</li>
          <li>What do you remember most fondly, and what would you rather forget?</li>
          <li>Which god do you turn to, if any?</li>
          <li>Who or what has your loyalty?</li>
          <li>What have you been up to lately, and is anyone after you?</li>
        </ul>
      </details>
    </div>
    <p class="text-sm text-neutral-700">The ambitions and the background go into the character's notes.</p>
  </div>
</template>
