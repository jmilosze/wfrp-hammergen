<script setup lang="ts">
import AppButton from "../../components/ui/AppButton.vue";
import AccountCard from "../../components/account/AccountCard.vue";
import { User, UserApi } from "../../services/user.ts";
import AfterSubmit from "../../components/account/AfterSubmit.vue";
import FormInput from "../../components/form/FormInput.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "../../utils/submission.ts";
import { authRequest } from "../../services/auth.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { getLoggedUserInfo } = useAuth();

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

const validCurrentPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateCurrentPassword();
  }
});

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validPassword.value.valid || !passwordMatch.value.valid || !validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    user.value.email = getLoggedUserInfo().username.toLowerCase();
    await userApi.updatePassword(user.value);

    user.value.reset();
    submissionState.value.setSuccess("Password updated successfully.");
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
  <AccountCard title="Change password" icon="lucide:key-round">
    <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
    <FormInput v-model="user.newPassword" type="password" title="New password" :validationStatus="validPassword" />
    <FormInput
      v-model="user.confirmNewPassword"
      type="password"
      title="Confirm new password"
      :validationStatus="passwordMatch"
    />
    <FormInput
      v-model="user.currentPassword"
      type="password"
      title="Current password"
      :validationStatus="validCurrentPassword"
    />
    <AppButton
      icon="lucide:save"
      variant="light"
      class="self-start"
      :busy="submissionState.status === 'inProgress'"
      size="lg"
      @click="submitForm"
    >
      Update password
    </AppButton>
  </AccountCard>
</template>

<style scoped></style>
