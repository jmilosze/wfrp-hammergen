<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import AlertBlock from "../../components/AlertBlock.vue";
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import TextLink from "../../components/TextLink.vue";

const email = ref("");
const password = ref("");
const validatorOn = ref(false);
const errors = ref("");
const submitting = ref(false);

const authStore = useAuthStore();

async function submitForm() {
  validatorOn.value = true;
  submitting.value = false;
  errors.value = "";
  if (!validEmail.value || !validPassword.value) {
    return;
  }

  try {
    submitting.value = true;
    await authStore.login(email.value.toLowerCase(), password.value);
  } catch (error) {
    onSubmissionFailed(error);
  }
  submitting.value = false;
}

const validEmail = computed(() => {
  return email.value !== "";
});

const validPassword = computed(() => {
  return password.value !== "";
});

function onSubmissionFailed(error: any) {
  if (error.response) {
    if (error.response.status === 403 || error.response.status === 404) {
      errors.value = "Invalid username or password.";
      return;
    }
  }
  errors.value = "Server error.";
}
</script>

<template>
  <div>
    <Header title="Log in"> </Header>
    <div class="pt-2 md:w-96">
      <AlertBlock class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</AlertBlock>
      <div class="flex flex-col items-start">
        <FormStringInput
          type="text"
          class="mt-3"
          v-model="email"
          title="Username (email)"
          invalidMsg="Username is required."
          :isValid="!validatorOn ? true : validEmail"
        />
        <FormStringInput
          type="password"
          class="mt-3"
          v-model="password"
          title="Password"
          invalidMsg="Password is required"
          :isValid="!validatorOn ? true : validPassword"
        />
      </div>
      <SubmitButton class="mt-3" @click="submitForm" :processing="submitting">Log in</SubmitButton>
      <div class="mt-5">
        <TextLink routeName="forgotpassword">Forgot your password?</TextLink>
      </div>
      <div class="mt-3">
        <TextLink routeName="register">Register as a new user.</TextLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
