<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import AlertBlock from "../../components/AlertBlock.vue";
import { ref } from "vue";
import FormStringInput from "../../components/FormStringInput.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import { usePasswordValidator } from "../../composables/userValidators.ts";
import router from "../../router.ts";
import { isAxiosError } from "axios";
import { anonRequest } from "../../services/auth.ts";

const props = withDefaults(
  defineProps<{
    token: string;
  }>(),
  {
    token: "",
  },
);

const password = ref("");
const retypedPassword = ref("");
const validatorOn = ref(false);
const errors = ref("");
const submitting = ref(false);
const submissionSuccessful = ref(false);

const { validPassword, passwordMatch, invalidPasswordMsg, passwordDoNotMatchMsg } = usePasswordValidator(
  password,
  retypedPassword,
);

async function submitForm() {
  validatorOn.value = true;
  submitting.value = false;
  submissionSuccessful.value = false;
  errors.value = "";
  if (!validPassword.value || !passwordMatch.value) {
    return;
  }

  submitting.value = true;

  try {
    await anonRequest.post("/api/user/resetPassword", {
      password: password.value,
      token: props.token,
    });
    onSubmissionSuccessful();
  } catch (error) {
    onSubmissionFailed(error);
  }

  submitting.value = false;
}

function onSubmissionSuccessful() {
  validatorOn.value = false;
  password.value = "";
  retypedPassword.value = "";
  submissionSuccessful.value = true;

  setTimeout(() => {
    router.push({ name: "login" });
  }, 1500);
}

function onSubmissionFailed(error: any) {
  if (isAxiosError(error) && error.response) {
    if (error.response.status === 403) {
      errors.value = 'Reset link has expired. Use "Forgot your password?" to generate another password reset email.';
      return;
    } else if (error.response.status === 400) {
      errors.value = "Bad request. Password reset token is invalid.";
      return;
    }
  }
  errors.value = "Server error.";
}
</script>

<template>
  <div>
    <Header title="Reset password">Create a new password.</Header>
    <div class="pt-2 md:w-96">
      <AlertBlock class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</AlertBlock>
      <AlertBlock class="mt-3" alertType="green" :visible="submissionSuccessful"
        >Password reset successful, redirecting to login...</AlertBlock
      >

      <FormStringInput
        type="password"
        class="mt-3"
        v-model="password"
        title="Password"
        :invalidMsg="invalidPasswordMsg"
        :isValid="!validatorOn ? true : validPassword"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="retypedPassword"
        title="Confirm Password"
        :invalidMsg="passwordDoNotMatchMsg"
        :isValid="!validatorOn ? true : passwordMatch"
      />
      <SubmitButton class="mt-3" @click="submitForm" :processing="submitting">Submit</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
