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
        When a property (character, skill, item, etc.) is marked as <span class="font-semibold">public</span>, anyone
        you give your username to, can see that property in read-only mode. Property sharing is explained in the
        <TextLink routeName="manage" :query="{ view: 'linked' }">Manage account/Linked users</TextLink> section
        (available after logging in).
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
