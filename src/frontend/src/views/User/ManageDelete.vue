<script setup lang="ts">
import { computed, ref } from "vue";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import { authRequest } from "../../services/auth.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import FormInput from "../../components/FormInput.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { callAndLogoutIfUnauthorized, logout } = useAuth();

const validCurrentPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateCurrentPassword();
  }
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    await callAndLogoutIfUnauthorized(userApi.delete)(user.value);
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
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput
        v-model="user.currentPassword"
        type="password"
        class="mt-3"
        title="Current password"
        :validationStatus="validCurrentPassword"
      />
      <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" variant="red" @click="submitForm">
        Delete account
      </ActionButton>
    </div>
  </div>
</template>

<style scoped></style>
