<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { computed, ref } from "vue";
import FormStringInput from "../../components/FormStringInput.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import router from "../../router.ts";
import { anonRequest } from "../../services/auth.ts";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../services/validation.ts";

const props = withDefaults(
  defineProps<{
    token: string;
  }>(),
  {
    token: "",
  },
);

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const userApi = new UserApi(anonRequest);

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

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value.valid || !passwordMatch.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    await userApi.resetPassword(user.value, props.token);
    user.value.reset();
    submissionState.value.setSuccess("Password reset successful, redirecting to login...");

    setTimeout(() => {
      router.push({ name: "login" });
    }, 1500);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: 'Reset link has expired. Use "Forgot your password?" to generate another password reset email.',
      },
      {
        statusCode: 400,
        details: "",
        message: "Bad request. Password reset token is invalid.",
      },
    ]);
  }
}
</script>

<template>
  <div>
    <Header title="Reset password">Create a new password.</Header>
    <div class="pt-2 md:w-96">
      <AfterSubmit :submissionState="submissionState" />

      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.newPassword"
        title="Password"
        :validationStatus="validPassword"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.confirmNewPassword"
        title="Confirm Password"
        :validationStatus="passwordMatch"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Submit</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
