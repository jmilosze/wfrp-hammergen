<script setup lang="ts">
import { computed, useId } from "vue";

const props = defineProps<{
  title?: string;
  invertOrder?: boolean;
  trueText: string;
  falseText: string;
  disabled?: boolean;
}>();

const model = defineModel<boolean>();
const radioGroupName = useId();

const options = computed(() =>
  props.invertOrder
    ? [
        { value: false, text: props.falseText },
        { value: true, text: props.trueText },
      ]
    : [
        { value: true, text: props.trueText },
        { value: false, text: props.falseText },
      ]
);
</script>

<template>
  <fieldset>
    <legend v-if="title" class="mb-1">{{ title }}</legend>
    <div class="flex flex-wrap">
      <label
        v-for="(option, index) in options"
        :key="String(option.value)"
        class="inline-flex items-center cursor-pointer"
        :class="{ 'mr-5': index === 0 }"
      >
        <input
          v-model="model"
          type="radio"
          :name="radioGroupName"
          :value="option.value"
          :disabled="disabled"
          class="mr-2 w-5 h-5 accent-neutral-600"
        />
        <span>{{ option.text }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped></style>
