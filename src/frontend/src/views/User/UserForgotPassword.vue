<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { IReCaptchaComposition, useReCaptcha } from "vue-recaptcha-v3";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth.ts";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

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

onMounted(() => {
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
    <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
    <FormStringInput v-model="user.email" type="text" class="mt-3" title="Email" :validationStatus="validEmail" />
  </div>
  <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
    >Submit</ActionButton
  >
</template>

<style scoped></style>
