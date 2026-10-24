<script setup lang="ts" generic="Id extends string">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import AppButton from "@/components/ui/AppButton.vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";

// The frame of a step-by-step creator (guided character creation, HG-43/HG-44), with no knowledge of what the steps
// hold: the step list, the current step (default slot), Back and Next, and an optional preview beside the step.
// - A step is done when it has all its choices; attention marks a step whose choice an earlier change cleared.
// - The step list reaches every done step and the first step not done; Next needs the current step done. On the last
//   step Next is Finish.
// - Close leaves the creator (its state is kept by the page); Start over asks first.
// - Wide: the step list on the left, the preview on the right when there is room. Narrow: a "Step 3 of 8" header that
//   opens the step list, the preview under the step.
export interface WizardStep<Id extends string = string> {
  id: Id;
  title: string;
  done: boolean;
  attention?: boolean;
}

const props = defineProps<{ title: string; steps: WizardStep<Id>[] }>();
const current = defineModel<Id>("current", { required: true });

const emit = defineEmits<{
  (e: "finish"): void;
  (e: "close"): void;
  (e: "startOver"): void;
}>();

const currentIndex = computed(() => props.steps.findIndex((x) => x.id === current.value));
const currentStep = computed(() => props.steps[currentIndex.value]);
const firstNotDone = computed(() => props.steps.findIndex((x) => !x.done));
const isLast = computed(() => currentIndex.value === props.steps.length - 1);

const stepListOpen = ref(false);
const startOverOpen = ref(false);

function reachable(index: number): boolean {
  return props.steps[index].done || index === firstNotDone.value;
}

function goTo(index: number) {
  current.value = props.steps[index].id;
  stepListOpen.value = false;
}

function next() {
  if (isLast.value) {
    emit("finish");
  } else {
    goTo(currentIndex.value + 1);
  }
}

function startOver() {
  startOverOpen.value = false;
  emit("startOver");
}
</script>

<template>
  <section class="@container my-4" :aria-label="title">
    <div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-4 border-b border-brand-rule">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <div class="flex flex-wrap gap-2">
        <AppButton icon="lucide:rotate-ccw" @click="startOverOpen = true">Start over</AppButton>
        <AppButton icon="lucide:x" @click="emit('close')">Close</AppButton>
      </div>
    </div>
    <!-- Narrow screens: where the player is, opening the step list. -->
    <button
      type="button"
      class="@3xl:hidden flex w-full items-center justify-between gap-2 mb-3 px-3 py-2 rounded border border-neutral-300 bg-neutral-50"
      :aria-expanded="stepListOpen"
      @click="stepListOpen = !stepListOpen"
    >
      <span>
        Step {{ currentIndex + 1 }} of {{ steps.length }} · <span class="font-semibold">{{ currentStep.title }}</span>
      </span>
      <Icon :icon="stepListOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-5" />
    </button>
    <div class="grid gap-4 @3xl:grid-cols-[14rem_1fr] @5xl:grid-cols-[14rem_1fr_18rem]">
      <nav
        :class="stepListOpen ? 'block' : 'hidden'"
        class="@3xl:block @3xl:row-span-2 @5xl:row-span-1"
        aria-label="Steps"
      >
        <ol class="flex flex-col gap-1">
          <li v-for="(step, index) in steps" :key="step.id">
            <button
              type="button"
              class="flex w-full items-center gap-2 px-2 py-1.5 rounded text-left disabled:text-neutral-400 disabled:cursor-not-allowed"
              :class="step.id === current ? 'bg-parchment font-semibold' : 'enabled:hover:bg-neutral-100'"
              :aria-current="step.id === current ? 'step' : undefined"
              :disabled="!reachable(index)"
              @click="goTo(index)"
            >
              <span
                class="flex items-center justify-center size-6 shrink-0 rounded-full border text-xs"
                :class="step.done ? 'bg-brand border-brand text-parchment' : 'border-neutral-400'"
              >
                <Icon v-if="step.done" icon="lucide:check" class="size-4" />
                <template v-else>{{ index + 1 }}</template>
              </span>
              <span class="flex-1">{{ step.title }}</span>
              <template v-if="step.attention">
                <Icon icon="lucide:circle-alert" class="size-4 text-error" />
                <span class="sr-only">needs attention</span>
              </template>
            </button>
          </li>
        </ol>
      </nav>
      <div class="min-w-0 flex flex-col gap-4">
        <h3 class="text-base font-semibold">{{ currentStep.title }}</h3>
        <slot />
        <div class="flex justify-between gap-2 pt-3 border-t border-neutral-300">
          <AppButton icon="lucide:arrow-left" :disabled="currentIndex === 0" @click="goTo(currentIndex - 1)">
            Back
          </AppButton>
          <AppButton
            :icon="isLast ? 'lucide:check' : 'lucide:arrow-right'"
            :variant="isLast ? 'light' : 'neutral'"
            :disabled="!currentStep.done"
            @click="next"
          >
            {{ isLast ? "Finish" : "Next" }}
          </AppButton>
        </div>
      </div>
      <aside v-if="$slots.preview" class="min-w-0" aria-label="Preview">
        <slot name="preview" />
      </aside>
    </div>
  </section>
  <ModalWindow v-model:open="startOverOpen" size="xs">
    <template #header>Start over</template>
    <p>Clear every choice and roll and start again from the first step?</p>
    <template #buttons>
      <div class="flex gap-2">
        <AppButton icon="lucide:rotate-ccw" variant="light" @click="startOver">Start over</AppButton>
        <AppButton icon="lucide:x" @click="startOverOpen = false">Cancel</AppButton>
      </div>
    </template>
  </ModalWindow>
</template>
