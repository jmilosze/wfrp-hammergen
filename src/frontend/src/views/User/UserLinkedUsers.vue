<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import AfterSubmit from "../../components/AfterSubmit.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "../../utils/submission.ts";
import { useAuthStore } from "../../stores/auth.ts";
import { authRequest } from "../../services/auth.ts";
import ActionButton from "../../components/ActionButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { User, UserApi } from "../../services/user.ts";
import { setValidationStatus } from "../../utils/validation.ts";

const submissionState = ref(new SubmissionState());
const newSharedAccount = ref("");
const user = ref(new User());
const userApi = new UserApi(authRequest);

const { callAndLogoutIfUnauthorized } = useAuthStore();

const validNewSharedAccount = computed(() => {
  if (submissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateNewSharedAccount(newSharedAccount.value);
  }
});

try {
  user.value = await callAndLogoutIfUnauthorized(userApi.get)();
} catch (error) {
  submissionState.value.setFailureFromError(error, []);
}

function removeUsername(username: string) {
  user.value.sharedAccounts = user.value.sharedAccounts.filter((item) => item !== username).sort();
}

async function addUsername() {
  submissionState.value.setInProgress();

  if (!validNewSharedAccount.value.valid) {
    submissionState.value.setValidationError();
    return;
  }

  try {
    const userExists: boolean = await callAndLogoutIfUnauthorized(userApi.checkIfExists)(newSharedAccount.value);
    if (userExists) {
      user.value.addSharedAccount(newSharedAccount.value);
      newSharedAccount.value = "";
      submissionState.value.setSuccess("");
    } else {
      submissionState.value.setFailure(`User ${newSharedAccount.value} not found.`);
    }
  } catch (error) {
    submissionState.value.setFailureFromError(error, []);
  }
}

async function submitForm() {
  submissionState.value.setInProgress();

  try {
    await callAndLogoutIfUnauthorized(userApi.updateSharedAccounts)(user.value);
    submissionState.value.setSuccess(
      "Linked user list updated successfully! In order to be able to see content shared by newly added users please log out and then log back in.",
    );
  } catch (error) {
    submissionState.value.setFailureFromError(error, []);
  }
}
</script>

<template>
  <Header title="Linked users">
    <p>
      In this page, you can add "linked users". You need to know their username (the email they used to register). When
      you add a user, you can see all their public properties (characters, items, skills, etc.) in read-only mode. This
      means you can, for example, equip an item made by someone else. After adding all users, click apply changes to
      save the new user list.
    </p>
    <p class="mt-3">
      If you want to share your character, items and so on, all you need to do is mark them as non-private (checkbox in
      the edit form) and provide your username to whoever you want to share it with. They will need to add your username
      here and will be able to see all shared content in read-only mode.
    </p>
    <p class="text-xl mt-3">Important note about sharing</p>
    <p class="mt-3">
      When you share some custom property (for example an item), make sure that you also share all other custom
      properties that property includes (for example custom quality of that item). If you do not, other users will be
      able to see shared item but it will not have your custom quality.
    </p>
  </Header>
  <div class="pt-2 overflow-x-auto select-none">
    <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200 min-w-fit">
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="border-b border-neutral-200 p-2">Linked users</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sharedAccount in user.sharedAccounts" :key="sharedAccount">
            <td
              class="py-2 px-5 hover:bg-neutral-200 border-b border-neutral-200 bg-white flex flex-col items-stretch md:justify-between flex-wrap md:flex-row md:gap-2"
            >
              <span class="flex-auto text-center md:text-start">{{ sharedAccount }}</span>
              <ActionButton variant="danger" class="text-sm mt-2 md:mt-0" @click="removeUsername(sharedAccount)"
                >Remove</ActionButton
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
  <div class="pt-2 md:w-96">
    <AfterSubmit class="mt-2" :submissionState="submissionState" />
    <FormStringInput
      v-model="newSharedAccount"
      type="text"
      class="mt-3"
      title="Add new user (email)"
      :validationStatus="validNewSharedAccount"
    >
      <SubmitButton variant="normal" class="ml-3" :submissionState="submissionState" @click="addUsername"
        >Add</SubmitButton
      >
    </FormStringInput>
    <SubmitButton class="mt-3" :submissionState="submissionState" @click="submitForm">Apply changes</SubmitButton>
  </div>
</template>

<style scoped></style>