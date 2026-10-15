<script setup lang="ts">
import AppButton from "@/components/ui/AppButton.vue";
import AccountCard from "@/components/account/AccountCard.vue";
import TextLink from "@/components/ui/TextLink.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormInput from "@/components/form/FormInput.vue";
import { anonRequest } from "@/services/auth";
import { IReCaptchaComposition, useReCaptcha } from "vue-recaptcha-v3";
import AfterSubmit from "@/components/account/AfterSubmit.vue";
import { SubmissionState } from "@/utils/submission.ts";
import { User, UserApi } from "@/services/user.ts";
import { setValidationStatus } from "@/utils/validation.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(anonRequest);

const router = useRouter();
const route = useRoute();
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
      router.push({
        name: "login",
        query: route.query.redirect ? { redirect: route.query.redirect } : undefined,
      });
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
  <div class="flex justify-center py-6">
    <AccountCard title="Create an account" icon="lucide:user-plus" :headingLevel="1" class="w-full max-w-md">
      <template #description>
        The email is your login username. Email addresses aren't verified, so any will do, but password reset only works
        with a real one.
      </template>
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput
        :modelValue="user.email"
        title="Email"
        :validationStatus="validEmail"
        @update:modelValue="(value: string) => (user.email = value.trim())"
      />
      <FormInput v-model="user.newPassword" type="password" title="Password" :validationStatus="validPassword" />
      <FormInput
        v-model="user.confirmNewPassword"
        type="password"
        title="Confirm password"
        :validationStatus="passwordMatch"
      />
      <AppButton
        icon="lucide:user-plus"
        variant="light"
        size="lg"
        class="w-full"
        :busy="submissionState.status === 'inProgress'"
        @click="submitForm"
      >
        Create account
      </AppButton>
      <template #footer>
        <p>Already have an account? <TextLink routeName="login" :sameWindow="true">Log in</TextLink></p>
      </template>
    </AccountCard>
  </div>
</template>
