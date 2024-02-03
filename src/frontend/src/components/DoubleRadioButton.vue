<script setup lang="ts">
defineProps<{
  title?: string;
  invertOrder?: boolean;
  trueText: string;
  falseText: string;
  disabled?: boolean;
}>();

const model = defineModel<boolean>();
</script>

<template>
  <div>
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div v-if="!invertOrder" class="flex flex-wrap">
      <div class="flex items-center">
        <input
          v-model="model"
          type="radio"
          :value="true"
          :disabled="disabled"
          class="mr-2 w-5 h-5 accent-neutral-600"
        />
        <div class="mr-5">{{ trueText }}</div>
      </div>
      <div class="flex items-center">
        <input
          v-model="model"
          type="radio"
          :value="false"
          :disabled="disabled"
          class="mr-2 w-5 h-5 accent-neutral-600"
        />
        <div>{{ falseText }}</div>
      </div>
    </div>
    <div v-else class="flex flex-wrap">
      <div class="flex items-center">
        <input
          v-model="model"
          type="radio"
          :value="false"
          :disabled="disabled"
          class="mr-2 w-5 h-5 accent-neutral-600"
        />
        <div class="mr-5">{{ falseText }}</div>
      </div>
      <div class="flex items-center">
        <input
          v-model="model"
          type="radio"
          :value="true"
          :disabled="disabled"
          class="mr-2 w-5 h-5 accent-neutral-600"
        />
        <div>{{ trueText }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
