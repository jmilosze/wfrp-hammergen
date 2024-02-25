<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { computed, ref } from "vue";
import FormStringInput from "../../components/FormStringInput.vue";
import router from "../../router.ts";
import { anonRequest } from "../../services/auth.ts";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

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
const showAfterSubmit = ref(false);
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

  showAfterSubmit.value = true;

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
      <AfterSubmit v-if="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />

      <FormStringInput
        v-model="user.newPassword"
        type="password"
        class="mt-3"
        title="Password"
        :validationStatus="validPassword"
      />
      <FormStringInput
        v-model="user.confirmNewPassword"
        type="password"
        class="mt-3"
        title="Confirm Password"
        :validationStatus="passwordMatch"
      />
      <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
        >Submit</ActionButton
      >
    </div>
  </div>
</template>

<style scoped></style>
