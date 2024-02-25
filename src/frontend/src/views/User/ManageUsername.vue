<script setup lang="ts">
import FormStringInput from "../../components/FormStringInput.vue";
import { computed, ref } from "vue";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { authRequest } from "../../services/auth.ts";
import { useAuthStore } from "../../stores/auth.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { callAndLogoutIfUnauthorized, getLoggedUserInfo, setLoggedUserInfo } = useAuthStore();

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
    await callAndLogoutIfUnauthorized(userApi.updateEmail)(user.value);
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
  <div class="mt-5 pb-2 pl-2 border-b-2 border-neutral-200">
    <div class="text-xl">Change username (email)</div>
    <div class="pt-2 md:w-96">
      <AfterSubmit v-if="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormStringInput v-model="user.email" type="text" class="mt-1" title="Email" :validationStatus="validEmail" />
      <FormStringInput
        v-model="user.currentPassword"
        type="password"
        class="mt-3"
        title="Current password"
        :validationStatus="validCurrentPassword"
      />
      <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
        >Update email</ActionButton
      >
    </div>
  </div>
</template>

<style scoped></style>
