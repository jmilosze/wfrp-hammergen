<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import TextLink from "../../components/TextLink.vue";
import { User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const authStore = useAuthStore();

const validEmail = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateEmail();
  }
});

const validCurrentPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateCurrentPassword();
  }
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value.valid || !validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

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
      <FormStringInput
        v-model="user.email"
        type="text"
        class="mt-3"
        title="Username (email)"
        :validationStatus="validEmail"
      />
      <FormStringInput
        v-model="user.currentPassword"
        type="password"
        class="mt-3"
        title="Password"
        :validationStatus="validCurrentPassword"
      />
    </div>
    <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
      >Log in</ActionButton
    >
    <div class="mt-5">
      <TextLink routeName="forgotpassword">Forgot your password?</TextLink>
    </div>
    <div class="mt-3">
      <TextLink routeName="register">Register as a new user.</TextLink>
    </div>
  </div>
</template>

<style scoped></style>
