<script setup lang="ts">
import SectionButton from "../../components/SectionButton.vue";
import AccountCard from "../../components/AccountCard.vue";
import FormInput from "../../components/FormInput.vue";
import { computed, ref } from "vue";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { authRequest } from "../../services/auth.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { getLoggedUserInfo, setLoggedUserInfo } = useAuth();

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

user.value.email = getLoggedUserInfo().username;

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value.valid || !validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    await userApi.updateEmail(user.value);
    setLoggedUserInfo(user.value.email);
    user.value.currentPassword = "";
    submissionState.value.setSuccess("Username (email) updated successfully.");
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Incorrect current password.",
      },
      {
        statusCode: 409,
        details: "",
        message: "User with this email already exists.",
      },
    ]);
  }
}
</script>

<template>
  <AccountCard title="Change email" icon="lucide:mail">
    <template #description>Your email is also your login username.</template>
    <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
    <FormInput v-model="user.email" title="New email" :validationStatus="validEmail" />
    <FormInput
      v-model="user.currentPassword"
      type="password"
      title="Current password"
      :validationStatus="validCurrentPassword"
    />
    <SectionButton
      icon="lucide:save"
      variant="light"
      size="lg"
      class="self-start"
      :busy="submissionState.status === 'inProgress'"
      @click="submitForm"
    >
      Update email
    </SectionButton>
  </AccountCard>
</template>

<style scoped></style>
