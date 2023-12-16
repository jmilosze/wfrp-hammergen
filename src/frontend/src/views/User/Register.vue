<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserValidator } from "../../composables/userValidators.ts";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";
import Alert from "../../components/Alert.vue";

const validatorOn = ref(false);
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const errors = ref("");
const registering = ref(false);
const registrationSuccessful = ref(false);

const { validEmail, validPassword, passwordMatch, invalidEmailMsg, invalidPasswordMsg, passwordDoNotMatchMsg } =
  useUserValidator(email, password, retypedPassword);

const router = useRouter();

function onRegistrationSuccessful() {
  validatorOn.value = false;
  email.value = "";
  password.value = "";
  retypedPassword.value = "";
  registrationSuccessful.value = true;

  setTimeout(() => {
    router.push({ name: "home" });
  }, 1500);
}

function onRegistrationFailed(error: any) {
  if ("response" in error) {
    if (error.response && error.response.status === 409) {
      errors.value = "User with this email already exists.";
      return;
    } else if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.details === "captcha verification error"
    ) {
      errors.value = "We suspect you might be a robot. Please try again.";
      return;
    }
  }
  errors.value = "Server error.";
}

async function submitForm() {
  validatorOn.value = true;
  registering.value = false;
  registrationSuccessful.value = false;
  errors.value = "";
  if (!validEmail.value || !validPassword.value || !passwordMatch.value) {
    return;
  }

  registering.value = true;

  try {
    await anonRequest.post("/api/user", {
      username: email.value.toLowerCase(),
      password: password.value,
      captcha: "success",
    });
    onRegistrationSuccessful();
  } catch (error) {
    onRegistrationFailed(error);
  }

  registering.value = false;
}
</script>

<template>
  <div>
    <Header title="Create a new account">
      <p>
        The email field will be your login username. We do not verify the email addresses so you can use a fake email,
        but if you do, the password reset functionality will not work.
      </p>
    </Header>
    <div class="pt-2 md:w-96">
      <Alert class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</Alert>
      <Alert class="mt-3" alertType="green" :visible="registrationSuccessful"
        >Registration successful, redirecting to login...</Alert
      >
      <div class="flex flex-col items-start">
        <FormStringInput
          type="text"
          class="mt-3"
          v-model="email"
          title="Email"
          :invalidMsg="invalidEmailMsg"
          :isValid="!validatorOn ? true : validEmail"
        />
        <FormStringInput
          type="password"
          class="mt-3"
          v-model="password"
          title="Password"
          :invalidMsg="invalidPasswordMsg"
          :isValid="!validatorOn ? true : validPassword"
        />
        <FormStringInput
          type="password"
          class="mt-3"
          v-model="retypedPassword"
          title="Confirm Password"
          :invalidMsg="passwordDoNotMatchMsg"
          :isValid="!validatorOn ? true : passwordMatch"
        />
      </div>
      <SubmitButton class="mt-3" @click="submitForm" :processing="registering">Register</SubmitButton>
    </div>
  </div>
</template>

<style scoped></style>
