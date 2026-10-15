<script setup lang="ts">
import AppButton from "../../components/ui/AppButton.vue";
import AccountCard from "../../components/account/AccountCard.vue";
import { computed, ref } from "vue";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import { authRequest } from "../../services/auth.ts";
import AfterSubmit from "../../components/account/AfterSubmit.vue";
import FormInput from "../../components/form/FormInput.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { logout } = useAuth();

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
    await userApi.delete(user.value);
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
  <AccountCard title="Delete account" icon="lucide:trash-2" danger>
    <template #description>The account and all its data will be deleted. This can't be undone.</template>
    <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
    <FormInput
      v-model="user.currentPassword"
      type="password"
      title="Current password"
      :validationStatus="validCurrentPassword"
      class="md:w-96"
    />
    <AppButton
      icon="lucide:trash-2"
      size="lg"
      variant="danger"
      class="self-start"
      :busy="submissionState.status === 'inProgress'"
      @click="submitForm"
    >
      Delete account
    </AppButton>
  </AccountCard>
</template>

<style scoped></style>
