<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../../components/PageHeader.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";
import { IReCaptchaComposition, useReCaptcha } from "vue-recaptcha-v3";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { SubmissionState } from "../../utils/submission.ts";
import { User, UserApi } from "../../services/user.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const userApi = new UserApi(anonRequest);

const router = useRouter();
const recaptcha = useReCaptcha() as IReCaptchaComposition;

const validEmail = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateEmail();
  }
});

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

onMounted(() => {
  recaptcha.instance.value?.showBadge();
});

onUnmounted(() => {
  recaptcha.instance.value?.hideBadge();
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value.valid || !validPassword.value.valid || !passwordMatch.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  let token: string;
  if (import.meta.env.VITE_BYPASS_RECAPTCHA === "true") {
    token = "success";
  } else {
    await recaptcha.recaptchaLoaded();
    token = await recaptcha.executeRecaptcha("register");
  }

  try {
    await userApi.create(user.value, token);
    user.value.reset();
    submissionState.value.setSuccess("Registration successful, redirecting to login...");

    setTimeout(() => {
      router.push({ name: "login" });
    }, 1500);
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
      <FormStringInput v-model="user.email" type="text" class="mt-3" title="Email" :validationStatus="validEmail" />
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
    </div>
    <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
      >Register</ActionButton
    >
  </div>
</template>

<style scoped></style>
