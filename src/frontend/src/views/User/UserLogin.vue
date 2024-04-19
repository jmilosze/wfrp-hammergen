<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import FormInput from "../../components/FormInput.vue";
import { computed, ref } from "vue";
import TextLink from "../../components/TextLink.vue";
import { User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);

const auth = useAuth();

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

  showAfterSubmit.value = true;

  try {
    await auth.login(user.value.email.toLowerCase(), user.value.currentPassword);
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
    <Header title="Log in" />
    <div class="pt-2 md:w-96">
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="user.email" title="Username (email)" :validationStatus="validEmail" class="mt-3" />
      <FormInput
        v-model="user.currentPassword"
        type="password"
        title="Password"
        :validationStatus="validCurrentPassword"
        class="mt-3"
      />
    </div>
    <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
      >Log in</ActionButton
    >
    <div class="mt-5">
      <TextLink routeName="forgotpassword" :sameWindow="true">Forgot your password?</TextLink>
    </div>
    <div class="mt-3">
      <TextLink routeName="register" :sameWindow="true">Register as a new user.</TextLink>
    </div>
  </div>
</template>

<style scoped></style>
