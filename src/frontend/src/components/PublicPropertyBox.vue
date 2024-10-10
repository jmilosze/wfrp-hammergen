<script setup lang="ts">
import HintModal from "./HintModal.vue";
import TextLink from "./TextLink.vue";

const model = defineModel<boolean>();

defineProps<{
  propertyName: string;
  disabled?: boolean;
}>();
</script>

<template>
  <div>
    <div class="flex items-center">
      <div class="mb-1 mr-2">Public {{ propertyName }}?</div>
      <HintModal buttonText="What does it mean?" modalHeader="Public property" modalId="publicHelpModal">
        When an element (character, skill, item, etc.) is marked as Public anyone you give your username to, can see
        that element in read-only mode. Element sharing is explained in the
        <TextLink routeName="linkedusers">Linked users</TextLink> section.
      </HintModal>
    </div>
    <div class="flex items-center">
      <input
        v-model="model"
        type="checkbox"
        :disabled="disabled ? disabled : false"
        class="w-5 h-5 accent-neutral-600"
      />
      <div class="ml-2">Public</div>
    </div>
  </div>
</template>

<style scoped></style>
