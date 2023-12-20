<script setup lang="ts">
import FormStringInput from "../../../components/FormStringInput.vue";
import { computed, ref, watch } from "vue";
import { invalidEmailMsg, User } from "../../../services/user.ts";
import { SubmissionState } from "../../../utils/submission.ts";
import AfterSubmit from "../../../components/AfterSubmit.vue";

const props = defineProps<{
  currentEmail: string;
}>();

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const validEmail = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.validateEmail());
const validCurrentPassword = computed(
  () => submissionState.value.notStartedOrSubmitted() || user.value.validateCurrentPassword(),
);

watch(
  () => props.currentEmail,
  (newCurrentEmail) => {
    user.value.email = newCurrentEmail;
  },
);
</script>

<template>
  <div class="mt-5 pb-2 border-b-2 border-neutral-200">
    <div class="text-xl">Change username (email)</div>
    <div class="pt-2 md:w-96">
      <AfterSubmit :submissionState="submissionState" />
      <FormStringInput
        type="text"
        class="mt-1"
        v-model="user.email"
        title="Email"
        :invalidMsg="invalidEmailMsg"
        :isValid="validEmail"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.currentPassword"
        title="Confirm password"
        invalidMsg="Password is required"
        :isValid="validCurrentPassword"
      />
    </div>
  </div>
</template>

<style scoped></style>
