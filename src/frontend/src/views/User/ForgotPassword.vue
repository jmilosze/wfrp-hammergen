<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";
import FormStringInput from "../../components/FormStringInput.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import { anonRequest } from "../../services/auth.ts";
import { invalidEmailMsg, User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const validEmail = computed(() => submissionState.value.notStartedOrSubmitted() || user.value.validateEmail());

const recaptcha = useReCaptcha();

onMounted(() => {
  recaptcha?.instance.value?.showBadge();
});

onUnmounted(() => {
  recaptcha?.instance.value?.hideBadge();
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value) {
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
    await anonRequest.post("/api/user/sendResetPassword", {
      username: user.value.email.toLowerCase(),
      captcha: token,
    });
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
  <div>
    <Header title="Forgot your password?"
      >Please submit email address you used as a account login. We will send you password reset link. If you cannot see
      the email please check your junk/spam folders.
    </Header>
    <div class="text-xl mt-3">Please be advised</div>
    <div class="mt-1">
      <p>
        Occasionally when using "Forgot your password" you might not get the email at all. This is because email
        provides (for example Microsoft or Google) sometimes block IP addresses of the service Hammergen uses to send
        emails. If that happens to you, please wait a minute or two and try again few more times. If you still do not
        see any email from us, please contact us at
        <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink> to restore your account.
      </p>
    </div>
  </div>
  <div class="pt-2 md:w-96">
    <AfterSubmit :submissionState="submissionState" />
    <FormStringInput
      type="text"
      class="mt-3"
      v-model="user.email"
      title="Email"
      :invalidMsg="invalidEmailMsg"
      :isValid="validEmail"
    />
  </div>
  <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Submit</SubmitButton>
</template>

<style scoped></style>
