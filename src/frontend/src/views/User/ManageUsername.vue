<script setup lang="ts">
import FormInput from "../../components/FormInput.vue";
import { computed, ref } from "vue";
import { User, UserApi } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { authRequest } from "../../services/auth.ts";
import { setValidationStatus } from "../../utils/validation.ts";
import ActionButton from "../../components/ActionButton.vue";
import { useAuth } from "../../composables/auth.ts";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);
const userApi = new UserApi(authRequest);

const { callAndLogoutIfUnauthorized, getLoggedUserInfo, setLoggedUserInfo } = useAuth();

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
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="user.email" title="Email" :validationStatus="validEmail" class="mt-1" />
      <FormInput
        v-model="user.currentPassword"
        type="password"
        title="Current password"
        :validationStatus="validCurrentPassword"
        class="mt-3"
      />
      <ActionButton class="mt-3" :spinner="submissionState.status === 'inProgress'" @click="submitForm"
        >Update email</ActionButton
      >
    </div>
  </div>
</template>

<style scoped></style>
