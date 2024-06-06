<script setup lang="ts">
import { useButton } from "../composables/button.ts";

const props = defineProps<{
  variant?: "normal" | "red" | "amber";
  size?: "md" | "sm";
  routeName: string;
  params?: any;
  newWindow?: boolean;
}>();

const { btnClass } = useButton(props.variant, props.size);
</script>

<template>
  <RouterLink :to="{ name: routeName, params: params }" :target="newWindow ? '_blank' : ''" :class="btnClass">
    <span class="flex justify-between items-center">
      <slot />
    </span>
  </RouterLink>
</template>
