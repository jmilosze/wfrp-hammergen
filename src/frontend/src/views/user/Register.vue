<script setup lang="ts">
import { ref } from "vue";
import { useUserValidator } from "../../composables/userValidators.ts";
import Header from "../../components/PageHeader.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";

const validatorOn = ref(false);
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const errors = ref([]);

const { validEmail, validPassword, passwordMatch, invalidEmailMsg, invalidPasswordMsg, passwordDoNotMatchMsg } =
  useUserValidator(validatorOn, email, password, retypedPassword);
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
              class="mt-3"
              v-model="email"
              title="Email"
              :invalidMsg="invalidEmailMsg"
              :isValid="validEmail"
            />
            <FormStringInput
              class="mt-3"
              v-model="password"
              title="Password"
              :invalidMsg="invalidPasswordMsg"
              :isValid="validPassword"
            />
            <FormStringInput
              class="mt-3"
              v-model="retypedPassword"
              title="Confirm Password"
              :invalidMsg="passwordDoNotMatchMsg"
              :isValid="passwordMatch"
            />
          </div>
          <SubmitButton class="mt-5">Register</SubmitButton>
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
