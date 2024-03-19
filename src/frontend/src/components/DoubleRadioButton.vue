<script setup lang="ts">
defineProps<{
  title?: string;
  invertOrder?: boolean;
  trueText: string;
  falseText: string;
}>();

const model = defineModel<boolean>();
</script>

<template>
  <div>
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div v-if="!invertOrder" class="flex my-3">
      <div class="flex items-center">
        <input v-model="model" type="radio" :value="true" class="mr-2 w-5 h-5 accent-neutral-600" />
        <div class="mr-5">{{ trueText }}</div>
      </div>
      <div class="flex items-center">
        <input v-model="model" type="radio" :value="false" class="mr-2 w-5 h-5 accent-neutral-600" />
        <div>{{ falseText }}</div>
      </div>
    </div>
    <div v-else class="flex my-3">
      <div class="flex items-center">
        <input v-model="model" type="radio" :value="false" class="mr-2 w-5 h-5 accent-neutral-600" />
        <div class="mr-5">{{ falseText }}</div>
      </div>
      <div class="flex items-center">
        <input v-model="model" type="radio" :value="true" class="mr-2 w-5 h-5 accent-neutral-600" />
        <div>{{ trueText }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
