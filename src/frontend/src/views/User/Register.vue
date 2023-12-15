<script setup lang="ts">
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserValidator } from "../../composables/userValidators.ts";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { anonRequest } from "../../services/auth";

const validatorOn = ref(false);
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const errors: Ref<string[]> = ref([]);
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
  }, 1000);
}

function onRegistrationFailed(error: any) {
  if ("response" in error) {
    if (error.response && error.response.status === 409) {
      errors.value.push("User with this email already exists.");
    } else if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.details === "captcha verification error"
    ) {
      errors.value.push("We suspect you might be a robot. Please try again.");
    } else {
      errors.value.push("Server error.");
    }
  } else {
    errors.value.push("Server error.");
  }
}

async function submitForm() {
  validatorOn.value = true;
  registering.value = false;
  registrationSuccessful.value = false;
  errors.value = [];
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
    <div class="flex lg:justify-start flex-col lg:flex-row">
      <div class="flex flex-col md:flex-row">
        <div class="pt-2 md:w-96">
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
          <SubmitButton class="mt-5" @click="submitForm" :processing="registering">Register</SubmitButton>
        </div>
      </div>
      <div class="pt-5 lg:pl-5">
        <ul>
          <li v-for="error in errors" :key="error" class="text-red-600">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
