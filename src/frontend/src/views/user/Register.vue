<script setup lang="ts">
import { ref } from "vue";
import { useUserValidator } from "../../composables/userValidators.ts";
import Header from "../../components/Header.vue";
import Button from "../../components/Button.vue";

const validatorOn = ref(false);
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const registrationSuccessful = ref(true);
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
            <div class="mt-3 w-full">
              <p>Email</p>
              <input
                class="border-2 rounded border-neutral-200 focus:border-neutral-700 w-full h-10 px-2 outline-0"
                v-model="email"
              />
              <p class="text-sm text-red-600" :class="[validEmail ? 'hidden' : '']">{{ invalidEmailMsg }}</p>
            </div>
            <div class="mt-3 w-full">
              <p>Password</p>
              <input
                class="border-2 rounded border-neutral-200 focus:border-neutral-700 w-full h-10 px-2 outline-0"
                v-model="password"
              />
              <p class="text-sm text-red-600" :class="[validPassword ? 'hidden' : '']">{{ invalidPasswordMsg }}</p>
            </div>
            <div class="mt-3 w-full">
              <p>Confirm Password</p>
              <input
                class="border-2 rounded border-neutral-200 focus:border-neutral-700 w-full h-10 px-2 outline-0"
                v-model="retypedPassword"
              />
              <p class="text-sm text-red-600" :class="[passwordMatch ? 'hidden' : '']">{{ passwordDoNotMatchMsg }}</p>
            </div>
          </div>
          <div class="mt-5">
            <Button>Register</Button>
          </div>
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
