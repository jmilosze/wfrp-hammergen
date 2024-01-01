<script setup lang="ts">
import { User, UserApi } from "../../../services/user.ts";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormStringInput from "../../../components/FormStringInput.vue";
import SubmitButton from "../../../components/SubmitButton.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "../../../utils/submission.ts";
import { useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";
import { setValidationStatus } from "../../../utils/validation.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const userApi = new UserApi(authRequest);

const { getLoggedUserInfo, callAndLogoutIfUnauthorized } = useAuthStore();

const validPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validatePassword();
  }
});

const passwordMatch = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validatePasswordMatch();
  }
});

const validCurrentPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateCurrentPassword();
  }
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value.valid || !passwordMatch.value.valid || !validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    user.value.email = getLoggedUserInfo().username.toLowerCase();
    await callAndLogoutIfUnauthorized(userApi.updatePassword)(user.value);

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
        v-model="user.newPassword"
        title="New password"
        :validationStatus="validPassword"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.confirmNewPassword"
        title="Confirm new password"
        :validationStatus="passwordMatch"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.currentPassword"
        title="Current password"
        :validationStatus="validCurrentPassword"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Update password</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
