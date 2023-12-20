<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { computed, ref } from "vue";
import FormStringInput from "../../components/FormStringInput.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import router from "../../router.ts";
import { anonRequest } from "../../services/auth.ts";
import { invalidPasswordMsg, passwordDoNotMatchMsg, User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";

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

const validPassword = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.validatePassword());
const passwordMatch = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.passwordMatch());

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value || !passwordMatch.value) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    await anonRequest.post("/api/user/resetPassword", {
      password: user.value.password,
      token: props.token,
    });
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
        v-model="user.password"
        title="Password"
        :invalidMsg="invalidPasswordMsg"
        :isValid="validPassword"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.retypedPassword"
        title="Confirm Password"
        :invalidMsg="passwordDoNotMatchMsg"
        :isValid="passwordMatch"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Submit</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
