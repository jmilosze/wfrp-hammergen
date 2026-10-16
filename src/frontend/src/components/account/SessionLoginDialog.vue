<script setup lang="ts">
import AppButton from "@/components/ui/AppButton.vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import FormInput from "@/components/form/FormInput.vue";
import AfterSubmit from "@/components/account/AfterSubmit.vue";
import { computed, ref, watch } from "vue";
import { useRelogin } from "@/composables/auth.ts";
import { SubmissionState } from "@/utils/submission.ts";
import { setValidationStatus } from "@/utils/validation.ts";

// Asks for the password again when the session has expired (see useRelogin); closing it logs out.
const relogin = useRelogin();

const password = ref("");
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);

const open = computed({
  get: () => relogin.username.value !== null,
  set: (value) => {
    if (!value) {
      relogin.cancel();
    }
  },
});

watch(open, (isOpen) => {
  if (isOpen) {
    password.value = "";
    submissionState.value = new SubmissionState();
    showAfterSubmit.value = false;
  }
});

const validPassword = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return setValidationStatus(password.value !== "", "Password is required.");
  }
});

async function submitForm() {
  const username = relogin.username.value;
  if (username === null) {
    return;
  }
  submissionState.value.setInProgress();

  if (!validPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    await relogin.login(username, password.value);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      { statusCode: 403, details: "", message: "Invalid password." },
      { statusCode: 404, details: "", message: "This account no longer exists." },
    ]);
  }
}
</script>

<template>
  <ModalWindow v-model:open="open" size="xs">
    <template #header> Session expired </template>
    <template #buttons>
      <div class="flex gap-2">
        <AppButton
          icon="lucide:log-in"
          variant="light"
          :busy="submissionState.status === 'inProgress'"
          @click="submitForm"
        >
          Log in
        </AppButton>
        <AppButton icon="lucide:log-out" variant="neutral" @click="open = false">Log out</AppButton>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <p>
        Log in again as <span class="font-semibold">{{ relogin.username.value }}</span> to continue. Your unsaved
        changes are kept.
      </p>
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="password" type="password" title="Password" :validationStatus="validPassword" />
    </div>
  </ModalWindow>
</template>
