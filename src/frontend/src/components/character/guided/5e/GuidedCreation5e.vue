<script setup lang="ts">
import { computed, watch } from "vue";
import WizardFrame, { WizardStep } from "@/components/wizard/WizardFrame.vue";
import { CreationChoices5e } from "@/services/wh/character/generation/5e/creation5e.ts";
import {
  completeChoices5e,
  GUIDED_STEPS_5E,
  GuidedContext5e,
  GuidedState5e,
  GuidedStep5e,
  guidedStepDone5e,
  newGuidedState5e,
  revalidate5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";
import GuidedSpecies5e from "./GuidedSpecies5e.vue";
import GuidedCareer5e from "./GuidedCareer5e.vue";
import GuidedCharacteristics5e from "./GuidedCharacteristics5e.vue";
import GuidedSkills5e from "./GuidedSkills5e.vue";
import GuidedTalents5e from "./GuidedTalents5e.vue";
import GuidedTrappings5e from "./GuidedTrappings5e.vue";
import GuidedDetails5e from "./GuidedDetails5e.vue";
import GuidedSummary5e from "./GuidedSummary5e.vue";
import GuidedPreview5e from "./GuidedPreview5e.vue";
import GuidedHelp5e from "./GuidedHelp5e.vue";

// 5e guided creation in the wizard frame, with 5e content only (as the generator). The state is the page's
// (v-model), so closing the wizard and coming back resumes it. After every change the later choices are checked
// against the earlier ones. Finish hands the choices to the page, which builds the character.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const emit = defineEmits<{
  (e: "finish", choices: CreationChoices5e): void;
  (e: "close"): void;
}>();

const revalidate = () => revalidate5e(state.value, props.context);
watch(state, revalidate, { deep: true, immediate: true });
watch(() => props.context, revalidate);

const steps = computed<WizardStep<GuidedStep5e>[]>(() =>
  GUIDED_STEPS_5E.map((x) => ({
    id: x.id,
    title: x.title,
    done: guidedStepDone5e(x.id, state.value, props.context),
    attention: state.value.attention.includes(x.id),
  })),
);

function finish() {
  const choices = completeChoices5e(state.value, props.context);
  if (choices !== null) {
    emit("finish", choices);
  }
}

function stepIs(step: GuidedStep5e): boolean {
  return state.value.step === step;
}
</script>

<template>
  <WizardFrame
    v-model:current="state.step"
    title="Guided creation"
    :steps="steps"
    @finish="finish"
    @close="emit('close')"
    @startOver="state = newGuidedState5e()"
  >
    <GuidedSpecies5e v-if="stepIs('species')" v-model:state="state" :context="context" />
    <GuidedCareer5e v-else-if="stepIs('career')" v-model:state="state" :context="context" />
    <GuidedCharacteristics5e v-else-if="stepIs('characteristics')" v-model:state="state" :context="context" />
    <GuidedSkills5e v-else-if="stepIs('skills')" v-model:state="state" :context="context" />
    <GuidedTalents5e v-else-if="stepIs('talents')" v-model:state="state" :context="context" />
    <GuidedTrappings5e v-else-if="stepIs('trappings')" v-model:state="state" :context="context" />
    <GuidedDetails5e v-else-if="stepIs('details')" v-model:state="state" />
    <GuidedSummary5e v-else :state="state" :context="context" />
    <template #help>
      <GuidedHelp5e :step="state.step" />
    </template>
    <template v-if="!stepIs('summary')" #preview>
      <GuidedPreview5e :state="state" :context="context" />
    </template>
  </WizardFrame>
</template>
