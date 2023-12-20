<script setup lang="ts">
import FormStringInput from "../../../components/FormStringInput.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useEmailValidator } from "../../../composables/userValidators.ts";
import AlertBlock from "../../../components/AlertBlock.vue";

const props = defineProps<{
  currentEmail: string;
}>();

const email = ref();
const password = ref("");
const validatorOn = ref(false);
const errors = ref("");
const submitting = ref(false);
const submissionSuccessful = ref(false);

const { validEmail, invalidEmailMsg } = useEmailValidator(email);

const validPassword = computed(() => {
  return password.value !== "";
});

watch(
  () => props.currentEmail,
  (newCurrentEmail) => {
    email.value = newCurrentEmail;
  },
);
</script>

<template>
  <div class="mt-5 pb-2 border-b-2 border-neutral-200">
    <div class="text-xl">Change username (email)</div>
    <div class="pt-2 md:w-96">
      <AlertBlock class="mt-3" alertType="red" :visible="errors !== ''">{{ errors }}</AlertBlock>
      <AlertBlock class="mt-3" alertType="green" :visible="submissionSuccessful"
        >Registration successful, redirecting to login...</AlertBlock
      >
      <FormStringInput
        type="text"
        class="mt-1"
        v-model="email"
        title="Email"
        :invalidMsg="invalidEmailMsg"
        :isValid="!validatorOn ? true : validEmail"
      />
      <FormStringInput
        type="password"
        class="mt-3"
        v-model="password"
        title="Confirm password"
        invalidMsg="Password is required"
        :isValid="!validatorOn ? true : validPassword"
      />
    </div>
  </div>
</template>

<style scoped></style>
