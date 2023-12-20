<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import TextLink from "../../components/TextLink.vue";
import { User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const validatorOn = ref(false);
const validEmail = computed(() => !validatorOn.value || user.value.validateEmail());
const validCurrentPassword = computed(() => !validatorOn.value || user.value.validateCurrentPassword());

const authStore = useAuthStore();

async function submitForm() {
  validatorOn.value = true;
  submissionState.value.reset();
  if (!validEmail.value || !validCurrentPassword.value) {
    return;
  }

  submissionState.value.setInProgress();

  try {
    await authStore.login(user.value.email.toLowerCase(), user.value.currentPassword);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Invalid username or password.",
      },
      {
        statusCode: 404,
        details: "",
        message: "Invalid username or password.",
      },
    ]);
  }
}
</script>

<template>
  <div>
    <Header title="Log in"> </Header>
    <div class="pt-2 md:w-96">
      <AfterSubmit :submissionState="submissionState" />
      <div class="flex flex-col items-start">
        <FormStringInput
          type="text"
          class="mt-3"
          v-model="user.email"
          title="Username (email)"
          invalidMsg="Username is required."
          :isValid="!validatorOn ? true : validEmail"
        />
        <FormStringInput
          type="password"
          class="mt-3"
          v-model="user.currentPassword"
          title="Password"
          invalidMsg="Password is required"
          :isValid="!validatorOn ? true : validCurrentPassword"
        />
      </div>
      <SubmitButton class="mt-3" @click="submitForm" :processing="submissionState.status == 'inProgress'"
        >Log in</SubmitButton
      >
      <div class="mt-5">
        <TextLink routeName="forgotpassword">Forgot your password?</TextLink>
      </div>
      <div class="mt-3">
        <TextLink routeName="register">Register as a new user.</TextLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
