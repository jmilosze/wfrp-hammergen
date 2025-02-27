<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../../components/PageHeader.vue";
import FormInput from "../../components/FormInput.vue";
import { anonRequest } from "../../services/auth";
import { IReCaptchaComposition, useReCaptcha } from "vue-recaptcha-v3";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { SubmissionState } from "../../utils/submission.ts";
import { User, UserApi } from "../../services/user.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
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

onMounted(async () => {
  await recaptcha.recaptchaLoaded();
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

  showAfterSubmit.value = true;

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
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput
        v-model="user.email"
        title="Email"
        :validationStatus="validEmail"
        class="mt-3"
        @input="user.email = ($event.target as HTMLInputElement).value.trim()"
      />
      <FormInput
        v-model="user.newPassword"
        type="password"
        title="Password"
        :validationStatus="validPassword"
        class="mt-3"
      />
      <FormInput
        v-model="user.confirmNewPassword"
        type="password"
        title="Confirm Password"
        :validationStatus="passwordMatch"
        class="mt-3"
      />
    </div>
    <ActionButton class="mt-3 btn" :spinner="submissionState.status === 'inProgress'" @click="submitForm">
      Register
    </ActionButton>
  </div>
</template>

<style scoped></style>
