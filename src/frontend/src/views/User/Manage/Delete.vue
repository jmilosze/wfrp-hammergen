<script setup lang="ts">
import { computed, ref } from "vue";
import { User } from "../../../services/user.ts";
import { SubmissionState } from "../../../utils/submission.ts";
import { useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormStringInput from "../../../components/FormStringInput.vue";
import SubmitButton from "../../../components/SubmitButton.vue";
import { setValidationStatus } from "../../../services/validation.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());

const { callAndLogoutIfUnauthorized, logout } = useAuthStore();

const validCurrentPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateCurrentPassword();
  }
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validCurrentPassword.value) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    await callAndLogoutIfUnauthorized(authRequest.delete)("/api/user", {
      data: { password: user.value.currentPassword },
    });

    user.value.reset();
    submissionState.value.setSuccess("Account deleted successfully deleted. Logging out...");
    setTimeout(() => {
      logout();
    }, 1500);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Incorrect current password.",
      },
    ]);
  }
}
</script>

<template>
  <div class="mt-3 p-2 border-4 border-red-600 rounded-lg">
    <div class="text-xl">Delete account</div>
    <p>The account and all its data will be deleted. It will be impossible to recover.</p>
    <div class="pt-2 md:w-96">
      <AfterSubmit :submissionState="submissionState" />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="user.currentPassword"
        title="Current password"
        :validationStatus="validCurrentPassword"
      />
      <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState" :variant="'danger'"
        >Delete account</SubmitButton
      >
    </div>
  </div>
</template>

<style scoped></style>
