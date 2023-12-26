<script setup lang="ts">
import FormStringInput from "../../../components/FormStringInput.vue";
import { computed, ref } from "vue";
import { invalidEmailMsg, User } from "../../../services/user.ts";
import { SubmissionState } from "../../../utils/submission.ts";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import SubmitButton from "../../../components/SubmitButton.vue";
import { authRequest } from "../../../services/auth.ts";
import { useAuthStore } from "../../../stores/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const { callAndLogoutIfUnauthorized, getLoggedUserInfo, setLoggedUserInfo } = useAuthStore();

const validEmail = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.validateEmail());
const validCurrentPassword = computed(
  () => submissionState.value.notStartedOrSubmitted() || user.value.validateCurrentPassword(),
);

user.value.email = getLoggedUserInfo().username;

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value || !validCurrentPassword.value) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    await callAndLogoutIfUnauthorized(authRequest.put)("/api/user/credentials", {
      username: user.value.email.toLowerCase(),
      password: user.value.currentPassword,
      currentPassword: user.value.currentPassword,
    });

    setLoggedUserInfo(user.value.email);
    user.value.currentPassword = "";
    submissionState.value.setSuccess("Username (email) updated successfully.");
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Incorrect current password.",
      },
      {
        statusCode: 409,
        details: "",
        message: "User with this email already exists.",
      },
    ]);
  }
}
</script>

<template>
  <div class="mt-5 pb-2 pl-2 border-b-2 border-neutral-200">
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
        title="Current password"
        invalidMsg="Password is required"
        :isValid="validCurrentPassword"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Update email</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
