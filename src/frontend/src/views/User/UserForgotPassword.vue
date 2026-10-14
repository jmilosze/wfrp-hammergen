<script setup lang="ts">
import SectionButton from "../../components/SectionButton.vue";
import AccountCard from "../../components/AccountCard.vue";
import TextLink from "../../components/TextLink.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { IReCaptchaComposition, useReCaptcha } from "vue-recaptcha-v3";
import FormInput from "../../components/FormInput.vue";
import { anonRequest } from "../../services/auth.ts";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(anonRequest);

const recaptcha = useReCaptcha() as IReCaptchaComposition;

const validEmail = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateEmail();
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

  if (!validEmail.value.valid) {
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
    await userApi.sendResetPassword(user.value, token);
    user.value.reset();
    submissionState.value.setSuccess("To reset you password please check your email and follow instructions.");
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 404,
        details: "",
        message: "User not found.",
      },
      {
        statusCode: 400,
        details: "captcha verification error",
        message: "We suspect you might be a robot. Please try again.",
      },
    ]);
  }
}
</script>

<template>
  <div class="flex justify-center py-6">
    <AccountCard title="Forgot your password?" icon="lucide:key-round" :headingLevel="1" class="w-full max-w-md">
      <template #description>
        Enter the email you log in with and we'll send you a link to reset your password. If it doesn't arrive, check
        your junk or spam folder.
      </template>
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="user.email" title="Email" :validationStatus="validEmail" />
      <SectionButton
        icon="lucide:send"
        size="lg"
        class="w-full"
        :busy="submissionState.status === 'inProgress'"
        @click="submitForm"
      >
        Send reset link
      </SectionButton>
      <div class="p-3 border-l-4 border-primary-500 bg-primary-50 rounded text-sm">
        <p class="font-semibold">No email at all?</p>
        <p class="mt-1">
          Email providers (for example Microsoft or Google) sometimes block the service Hammergen sends emails with.
          Wait a minute or two and try again a few times. If still nothing arrives, contact
          <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink> to restore your account.
        </p>
      </div>
      <template #footer>
        <p>Remembered it? <TextLink routeName="login" :sameWindow="true">Log in</TextLink></p>
      </template>
    </AccountCard>
  </div>
</template>

<style scoped></style>
