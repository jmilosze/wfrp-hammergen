<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";
import { useReCaptcha } from "vue-recaptcha-v3";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { SubmissionState } from "../../utils/submission.ts";
import { invalidEmailMsg, invalidPasswordMsg, passwordDoNotMatchMsg, User } from "../../services/user.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const validEmail = computed(() => submissionState.value.notStartedOrSuccess() || user.value.validateEmail());
const validPassword = computed(() => submissionState.value.notStartedOrSuccess() || user.value.validatePassword());
const passwordMatch = computed(() => submissionState.value.notStartedOrSuccess() || user.value.passwordMatch());

const router = useRouter();
const recaptcha = useReCaptcha();

onMounted(() => {
  recaptcha?.instance.value?.showBadge();
});

onUnmounted(() => {
  recaptcha?.instance.value?.hideBadge();
});

async function submitForm() {
  submissionState.value.reset();
  submissionState.value.setInProgress();

  if (!validEmail.value || !validPassword.value || !passwordMatch.value) {
    submissionState.value.setValidationError();
    return;
  }

  let token;
  if (import.meta.env.VITE_BYPASS_RECAPTCHA === "true") {
    token = "success";
  } else {
    await recaptcha?.recaptchaLoaded();
    token = await recaptcha?.executeRecaptcha("register");
  }

  try {
    await anonRequest.post("/api/user", {
      username: user.value.email.toLowerCase(),
      password: user.value.password,
      captcha: token,
    });
    onSubmissionSuccessful();
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 400,
        details: "captcha verification error",
        message: "We suspect you might be a robot. Please try again.",
      },
      {
        statusCode: 409,
        details: "",
        message: "User with this email already exists.",
      },
    ]);
  }
}

function onSubmissionSuccessful() {
  user.value.reset();
  submissionState.value.setSuccess("Registration successful, redirecting to login...");

  setTimeout(() => {
    router.push({ name: "login" });
  }, 1500);
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
      <AfterSubmit :submissionState="submissionState" />
      <div class="flex flex-col items-start">
        <FormStringInput
          type="text"
          class="mt-3"
          v-model="user.email"
          title="Email"
          :invalidMsg="invalidEmailMsg"
          :isValid="validEmail"
        />
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
      </div>
      <SubmitButton class="mt-3" @click="submitForm" :processing="submissionState.status == 'inProgress'"
        >Register</SubmitButton
      >
    </div>
  </div>
</template>

<style scoped></style>
