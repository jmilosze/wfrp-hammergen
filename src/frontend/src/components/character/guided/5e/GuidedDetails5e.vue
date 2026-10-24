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
// background go into the notes; only the name is needed.
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
      <AppButton class="h-10" icon="lucide:dices" @click="generate('name')">Generate</AppButton>
    </div>
    <FormTextarea
      v-model="d.description"
      title="Description"
      placeholder="Age, looks, manner"
      :validationStatus="validLongDescFn(d.description)"
    >
      <AppButton icon="lucide:dices" class="mb-1" @click="generate('description')">Generate</AppButton>
    </FormTextarea>
    <FormInput v-model="d.ambition" title="Ambition" placeholder="A long-term goal of your own" />
    <FormInput v-model="d.partyAmbition" title="Party ambition" placeholder="A goal the whole group shares" />
    <FormTextarea
      v-model="d.background"
      title="Background"
      placeholder="Where you grew up, your family and friends, who or what has your loyalty, and what you have been up to lately"
      :validationStatus="validLongDescFn(d.background)"
    />
    <p class="text-sm text-neutral-700">The ambitions and the background go into the character's notes.</p>
  </div>
</template>
