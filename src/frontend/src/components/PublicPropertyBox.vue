<script setup lang="ts">
import { computed } from "vue";
import HintModal from "./HintModal.vue";
import TextLink from "./TextLink.vue";
import { Visibility } from "../services/wh/common";
import { useAuth } from "../composables/auth";

const visibility = defineModel<Visibility>({ default: Visibility.Private });

defineProps<{
  propertyName: string;
  disabled?: boolean;
}>();

const auth = useAuth();
const isAdmin = computed(() => auth.isAdmin.value);

function onCheckboxChange(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  visibility.value = isChecked ? Visibility.Shared : Visibility.Private;
}
</script>

<template>
  <div>
    <!-- Admin view -->
    <div v-if="isAdmin">
      <div class="mb-1">{{ propertyName }} visibility</div>
      <div class="flex flex-wrap gap-4 items-center">
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :name="`visibility-${propertyName.replace(/\s+/g, '-')}`"
            :value="Visibility.Private"
            :checked="visibility === Visibility.Private"
            :disabled="disabled ? disabled : false"
            class="mr-2 w-5 h-5 accent-neutral-600"
            @change="visibility = Visibility.Private"
          />
          <span>Private</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :name="`visibility-${propertyName.replace(/\s+/g, '-')}`"
            :value="Visibility.Shared"
            :checked="visibility === Visibility.Shared"
            :disabled="disabled ? disabled : false"
            class="mr-2 w-5 h-5 accent-neutral-600"
            @change="visibility = Visibility.Shared"
          />
          <span>Shared</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :name="`visibility-${propertyName.replace(/\s+/g, '-')}`"
            :value="Visibility.Public"
            :checked="visibility === Visibility.Public"
            :disabled="disabled ? disabled : false"
            class="mr-2 w-5 h-5 accent-neutral-600"
            @change="visibility = Visibility.Public"
          />
          <span>Public</span>
        </label>
      </div>
    </div>

    <!-- Non-admin view -->
    <div v-else>
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
          :checked="visibility === Visibility.Shared || visibility === Visibility.Public"
          type="checkbox"
          :disabled="disabled ? disabled : false"
          class="w-5 h-5 accent-neutral-600"
          @change="onCheckboxChange"
        />
        <div class="ml-2">Public</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
