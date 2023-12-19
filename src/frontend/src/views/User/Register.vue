<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useEmailValidator, usePasswordValidator } from "../../composables/userValidators.ts";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";
import AlertBlock from "../../components/AlertBlock.vue";
import { useReCaptcha } from "vue-recaptcha-v3";
import { isAxiosError } from "axios";

const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const validatorOn = ref(false);
const errors = ref("");
const submitting = ref(false);
const submissionSuccessful = ref(false);

const { validEmail, invalidEmailMsg } = useEmailValidator(email);
const { validPassword, passwordMatch, invalidPasswordMsg, passwordDoNotMatchMsg } = usePasswordValidator(
  password,
  retypedPassword,
);

const router = useRouter();

const recaptcha = useReCaptcha();

onMounted(() => {
  recaptcha?.instance.value?.showBadge();
});

onUnmounted(() => {
  recaptcha?.instance.value?.hideBadge();
});

async function submitForm() {
  validatorOn.value = true;
  submitting.value = false;
  submissionSuccessful.value = false;
  errors.value = "";
  if (!validEmail.value || !validPassword.value || !passwordMatch.value) {
    return;
  }

  submitting.value = true;

  let token;
  if (import.meta.env.VITE_BYPASS_RECAPTCHA === "true") {
    token = "success";
  } else {
    await recaptcha?.recaptchaLoaded();
    token = await recaptcha?.executeRecaptcha("register");
  }

  try {
    await anonRequest.post("/api/user", {
      username: email.value.toLowerCase(),
      password: password.value,
      captcha: token,
    });
    onSubmissionSuccessful();
  } catch (error) {
    onSubmissionFailed(error);
  }

  submitting.value = false;
}

function onSubmissionSuccessful() {
  validatorOn.value = false;
  email.value = "";
  password.value = "";
  retypedPassword.value = "";
  submissionSuccessful.value = true;

  setTimeout(() => {
    router.push({ name: "login" });
  }, 1500);
}

function onSubmissionFailed(error: any) {
  if (isAxiosError(error) && error.response) {
    if (error.response.status === 409) {
      errors.value = "User with this email already exists.";
      return;
    } else if (error.response.status === 400 && error.response.data.details === "captcha verification error") {
      errors.value = "We suspect you might be a robot. Please try again.";
      return;
    }
  }
  errors.value = "Server error.";
}
</script>

<template>
  <div>
    <Header title="Create a new account">
      <p>
        The email field will be your login username. We do not verify the email addresses so you can use a fake email,
        but if you do, the password reset functionality will not work.
      </p>
    </Header>
    <div class="pt-2 md:w-96">
      <AlertBlock class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</AlertBlock>
      <AlertBlock class="mt-3" alertType="green" :visible="submissionSuccessful"
        >Registration successful, redirecting to login...</AlertBlock
      >
      <div class="flex flex-col items-start">
        <FormStringInput
          type="text"
          class="mt-3"
          v-model="email"
          title="Email"
          :invalidMsg="invalidEmailMsg"
          :isValid="!validatorOn ? true : validEmail"
        />
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
      </div>
      <SubmitButton class="mt-3" @click="submitForm" :processing="submitting">Register</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
