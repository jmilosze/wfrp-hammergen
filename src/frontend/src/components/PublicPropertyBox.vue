<script setup lang="ts">
import { computed } from "vue";
import HintModal from "./HintModal.vue";
import TextLink from "./TextLink.vue";
import { Visibility } from "../services/wh/core/entity.ts";
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
    <div v-if="isAdmin" class="flex flex-wrap gap-4 items-center">
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
    <div v-else class="flex items-center gap-2">
      <label class="flex items-center gap-2">
        <input
          :checked="visibility === Visibility.Shared || visibility === Visibility.Public"
          type="checkbox"
          :disabled="disabled ? disabled : false"
          class="w-5 h-5 accent-neutral-600"
          @change="onCheckboxChange"
        />
        Shared?
      </label>
      <HintModal buttonText="?" square modalHeader="Sharing" modalId="sharedHelpModal">
        A character or compendium item (skill, talent, etc.) marked as <span class="font-semibold">shared</span> can be
        seen in read-only mode by anyone you give your username to. Sharing is explained in the
        <TextLink routeName="manage" :query="{ view: 'linked' }">Manage account/Linked users</TextLink> section
        (available after logging in).
      </HintModal>
    </div>
  </div>
</template>

<style scoped></style>
