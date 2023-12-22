<script setup lang="ts">
import { invalidPasswordMsg, passwordDoNotMatchMsg, User } from "../../../services/user.ts";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormStringInput from "../../../components/FormStringInput.vue";
import SubmitButton from "../../../components/SubmitButton.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "../../../utils/submission.ts";
import { useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const validPassword = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.validatePassword());
const passwordMatch = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.passwordMatch());
const validCurrentPassword = computed(
  () => submissionState.value.notStartedOrSubmitted() || user.value.validateCurrentPassword(),
);

const { getLoggedUserInfo, callAndLogoutIfUnauthorized } = useAuthStore();

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value || !passwordMatch.value || !validCurrentPassword.value) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    await callAndLogoutIfUnauthorized(authRequest.put)("/api/user/credentials", {
      username: getLoggedUserInfo().username.toLowerCase(),
      password: user.value.password,
      currentPassword: user.value.currentPassword,
    });

    user.value.reset();
    submissionState.value.setSuccess("Password updated successfully.");
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Incorrect current password.",
      },
    ]);
  }
}
</script>

<template>
  <div class="mt-5 pb-2 pl-2 border-b-2 border-neutral-200">
    <div class="text-xl">Change password</div>
    <div class="pt-2 md:w-96">
      <AfterSubmit :submissionState="submissionState" />
      <FormStringInput
        type="password"
        class="mt-1"
        v-model="user.password"
        title="New password"
        :invalidMsg="invalidPasswordMsg"
        :isValid="validPassword"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.retypedPassword"
        title="Confirm new password"
        :invalidMsg="passwordDoNotMatchMsg"
        :isValid="passwordMatch"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.currentPassword"
        title="Current password"
        invalidMsg="Password is required"
        :isValid="validCurrentPassword"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Update password</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
