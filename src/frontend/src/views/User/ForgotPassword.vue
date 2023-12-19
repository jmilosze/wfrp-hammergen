<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";
import AlertBlock from "../../components/AlertBlock.vue";
import { useEmailValidator } from "../../composables/userValidators.ts";
import FormStringInput from "../../components/FormStringInput.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import { anonRequest } from "../../services/auth.ts";
import { isAxiosError } from "axios";

const email = ref("");
const validatorOn = ref(false);
const errors = ref("");
const submitting = ref(false);
const submissionSuccessful = ref(false);

const recaptcha = useReCaptcha();

const { validEmail, invalidEmailMsg } = useEmailValidator(email);

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
  if (!validEmail.value) {
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
      username: email.value.toLowerCase(),
      captcha: token,
    });
    onSubmissionSuccessful();
  } catch (error) {
    onSubmissionFailed(error);
  }
}

function onSubmissionSuccessful() {
  validatorOn.value = false;
  email.value = "";
  submissionSuccessful.value = true;
}

function onSubmissionFailed(error: any) {
  if (isAxiosError(error) && error.response) {
    if (error.response.status === 404) {
      errors.value = "User not found.";
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
    <AlertBlock class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</AlertBlock>
    <AlertBlock class="mt-3" alertType="green" :visible="submissionSuccessful"
      >To reset you password please check your email and follow instructions.</AlertBlock
    >
    <FormStringInput
      type="text"
      class="mt-3"
      v-model="email"
      title="Email"
      :invalidMsg="invalidEmailMsg"
      :isValid="!validatorOn ? true : validEmail"
    />
  </div>
  <SubmitButton class="mt-3" @click="submitForm" :processing="submitting">Submit</SubmitButton>
</template>

<style scoped></style>
