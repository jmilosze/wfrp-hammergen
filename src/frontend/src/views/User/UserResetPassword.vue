<script setup lang="ts">
import SectionButton from "../../components/SectionButton.vue";
import AccountCard from "../../components/AccountCard.vue";
import { computed, ref } from "vue";
import FormInput from "../../components/FormInput.vue";
import router from "../../router.ts";
import { anonRequest } from "../../services/auth.ts";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";

const props = withDefaults(
  defineProps<{
    token?: string;
  }>(),
  {
    token: "",
  },
);

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(anonRequest);

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

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value.valid || !passwordMatch.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    await userApi.resetPassword(user.value, props.token);
    user.value.reset();
    submissionState.value.setSuccess("Password reset successful, redirecting to login...");

    setTimeout(() => {
      router.push({ name: "login" });
    }, 1500);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: 'Reset link has expired. Use "Forgot your password?" to generate another password reset email.',
      },
      {
        statusCode: 400,
        details: "",
        message: "Bad request. Password reset token is invalid.",
      },
    ]);
  }
}
</script>

<template>
  <div class="flex justify-center py-6">
    <AccountCard title="Reset password" icon="lucide:lock-keyhole" :headingLevel="1" class="w-full max-w-md">
      <template #description>Choose a new password.</template>
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="user.newPassword" type="password" title="New password" :validationStatus="validPassword" />
      <FormInput
        v-model="user.confirmNewPassword"
        type="password"
        title="Confirm new password"
        :validationStatus="passwordMatch"
      />
      <SectionButton
        icon="lucide:save"
        size="lg"
        class="w-full"
        :busy="submissionState.status === 'inProgress'"
        @click="submitForm"
      >
        Save new password
      </SectionButton>
    </AccountCard>
  </div>
</template>

<style scoped></style>
