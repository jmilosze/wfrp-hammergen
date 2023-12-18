<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import Alert from "../../components/Alert.vue";
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth";

const email = ref("");
const validatorOn = ref(false);
const password = ref("");
const loggingIn = ref(false);
const errors = ref("");

const authStore = useAuthStore();

async function submitForm() {
  validatorOn.value = true;
  loggingIn.value = false;
  errors.value = "";
  if (!validEmail.value || !validPassword.value) {
    return;
  }

  try {
    loggingIn.value = true;
    await authStore.login(email.value.toLowerCase(), password.value);
  } catch (error) {
    onLoginFailed(error);
  }
  loggingIn.value = false;
}

const validEmail = computed(() => {
  return email.value !== "";
});

const validPassword = computed(() => {
  return password.value !== "";
});

function onLoginFailed(error: any) {
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
      <Alert class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</Alert>
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
      <SubmitButton class="mt-3" @click="submitForm" :processing="loggingIn">Login</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
