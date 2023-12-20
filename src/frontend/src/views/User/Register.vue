<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useEmailValidator, usePasswordValidator } from "../../composables/userValidators.ts";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";
import { useReCaptcha } from "vue-recaptcha-v3";
import { isAxiosError } from "axios";
import AfterSubmit from "../../components/AfterSubmit.vue";

const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const validatorOn = ref(false);
const submissionStatus: Ref<"notStarted" | "inProgress" | "success" | "failure"> = ref("notStarted");
const submissionMessage = ref("");

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
  submissionStatus.value = "notStarted";
  submissionMessage.value = "";
  if (!validEmail.value || !validPassword.value || !passwordMatch.value) {
    return;
  }

  submissionStatus.value = "inProgress";

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
}

function onSubmissionSuccessful() {
  email.value = "";
  password.value = "";
  retypedPassword.value = "";
  validatorOn.value = false;
  submissionStatus.value = "success";
  submissionMessage.value = "Registration successful, redirecting to login...";

  setTimeout(() => {
    router.push({ name: "login" });
  }, 1500);
}

function onSubmissionFailed(error: any) {
  submissionStatus.value = "failure";

  if (isAxiosError(error) && error.response) {
    if (error.response.status === 409) {
      submissionMessage.value = "User with this email already exists.";
      return;
    } else if (error.response.status === 400 && error.response.data.details === "captcha verification error") {
      submissionMessage.value = "We suspect you might be a robot. Please try again.";
      return;
    }
  }
  submissionMessage.value = "Server error.";
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
      <AfterSubmit
        :display="submissionStatus == 'success' || submissionStatus == 'failure'"
        :submissionSuccessful="submissionStatus == 'success'"
        :message="submissionMessage"
      />
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
      <SubmitButton class="mt-3" @click="submitForm" :processing="submissionStatus == 'inProgress'"
        >Register</SubmitButton
      >
    </div>
  </div>
</template>

<style scoped></style>
