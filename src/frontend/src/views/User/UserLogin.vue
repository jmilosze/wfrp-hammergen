<script setup lang="ts">
import AppButton from "../../components/ui/AppButton.vue";
import AccountCard from "../../components/account/AccountCard.vue";
import FormInput from "../../components/form/FormInput.vue";
import { computed, ref } from "vue";
import TextLink from "../../components/ui/TextLink.vue";
import { User } from "../../services/user.ts";
import { SubmissionState } from "../../utils/submission.ts";
import AfterSubmit from "../../components/account/AfterSubmit.vue";
import { setValidationStatus } from "../../utils/validation.ts";
import { useAuth } from "../../composables/auth.ts";
import { useRoute } from "vue-router";

const user = ref(new User());
const submissionState = ref(new SubmissionState());
const showAfterSubmit = ref(false);

const auth = useAuth();
const route = useRoute();

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

async function submitForm() {
  submissionState.value.setInProgress();

  if (!validEmail.value.valid || !validCurrentPassword.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  showAfterSubmit.value = true;

  try {
    await auth.login(user.value.email.toLowerCase(), user.value.currentPassword);
  } catch (error) {
    submissionState.value.setFailureFromError(error, [
      {
        statusCode: 403,
        details: "",
        message: "Invalid username or password.",
      },
      {
        statusCode: 404,
        details: "",
        message: "Invalid username or password.",
      },
    ]);
  }
}
</script>

<template>
  <div class="flex justify-center py-6">
    <AccountCard title="Log in" icon="lucide:log-in" :headingLevel="1" class="w-full max-w-md">
      <AfterSubmit :visible="showAfterSubmit" :submissionState="submissionState" @close="showAfterSubmit = false" />
      <FormInput v-model="user.email" title="Username (email)" :validationStatus="validEmail" />
      <FormInput
        v-model="user.currentPassword"
        type="password"
        title="Password"
        :validationStatus="validCurrentPassword"
      />
      <AppButton
        icon="lucide:log-in"
        variant="light"
        size="lg"
        class="w-full"
        :busy="submissionState.status === 'inProgress'"
        @click="submitForm"
      >
        Log in
      </AppButton>
      <template #footer>
        <TextLink routeName="forgotpassword" :sameWindow="true">Forgot your password?</TextLink>
        <p>
          New here?
          <TextLink
            routeName="register"
            :query="route.query.redirect ? { redirect: route.query.redirect } : undefined"
            :sameWindow="true"
          >
            Create an account
          </TextLink>
        </p>
      </template>
    </AccountCard>
  </div>
</template>

<style scoped></style>
