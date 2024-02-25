<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import AfterSubmit from "../../components/AfterSubmit.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "../../utils/submission.ts";
import { UnauthorizedError, useAuthStore } from "../../stores/auth.ts";
import { authRequest } from "../../services/auth.ts";
import ActionButton from "../../components/ActionButton.vue";
import FormStringInput from "../../components/FormStringInput.vue";
import { User, UserApi } from "../../services/user.ts";
import { setValidationStatus } from "../../utils/validation.ts";

const applyChangesSubmissionState = ref(new SubmissionState());
const addUserSubmissionState = ref(new SubmissionState());
const showApplyChangesAfterSubmit = ref(false);
const showAddUserAfterSubmit = ref(false);
const newSharedAccount = ref("");
const user = ref(new User());
const originalUser = ref(new User());
const userApi = new UserApi(authRequest);

const { callAndLogoutIfUnauthorized } = useAuthStore();

const validNewSharedAccount = computed(() => {
  if (addUserSubmissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateNewSharedAccount(newSharedAccount.value);
  }
});

try {
  user.value = await callAndLogoutIfUnauthorized(userApi.get)();
  originalUser.value = user.value.copy();
} catch (error) {
  if (!(error instanceof UnauthorizedError)) {
    applyChangesSubmissionState.value.setFailureFromError(error, []);
  }
}

function removeUsername(username: string) {
  user.value.sharedAccounts = user.value.sharedAccounts.filter((item) => item !== username).sort();
}

async function addUsername() {
  addUserSubmissionState.value.setInProgress();

  if (!validNewSharedAccount.value.valid) {
    addUserSubmissionState.value.setValidationError();
    return;
  }

  showAddUserAfterSubmit.value = true;

  try {
    const userExists = await callAndLogoutIfUnauthorized(userApi.checkIfExists)(newSharedAccount.value);
    if (userExists) {
      user.value.addSharedAccount(newSharedAccount.value);
      newSharedAccount.value = "";
      addUserSubmissionState.value.setSuccess("");
    } else {
      addUserSubmissionState.value.setFailure(`User ${newSharedAccount.value} not found.`);
    }
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      addUserSubmissionState.value.setFailureFromError(error, []);
    }
  }
}

async function submitForm() {
  if (user.value.isEqualTo(originalUser.value)) {
    return;
  }
  applyChangesSubmissionState.value.setInProgress();
  showApplyChangesAfterSubmit.value = true;
  try {
    await callAndLogoutIfUnauthorized(userApi.updateSharedAccounts)(user.value);
    originalUser.value = user.value.copy();
    applyChangesSubmissionState.value.setSuccess(
      "Linked user list updated successfully! In order to be able to see content shared by newly added users please log out and then log back in.",
    );
  } catch (error) {
    applyChangesSubmissionState.value.setFailureFromError(error, []);
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
              <ActionButton variant="red" class="text-sm mt-2 md:mt-0" @click="removeUsername(sharedAccount)"
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
    <AfterSubmit
      :visible="showApplyChangesAfterSubmit"
      :submissionState="applyChangesSubmissionState"
      class="mt-2"
      @close="showApplyChangesAfterSubmit = false"
    />
    <AfterSubmit
      :visible="showAddUserAfterSubmit"
      :submissionState="addUserSubmissionState"
      class="mt-2"
      @close="showAddUserAfterSubmit = false"
    />
    <FormStringInput
      v-model="newSharedAccount"
      type="text"
      class="mt-3"
      title="Add new user (email)"
      :validationStatus="validNewSharedAccount"
    >
      <ActionButton class="ml-3" :spinner="addUserSubmissionState.status === 'inProgress'" @click="addUsername"
        >Add</ActionButton
      >
    </FormStringInput>
    <ActionButton class="mt-3" :spinner="applyChangesSubmissionState.status === 'inProgress'" @click="submitForm"
      >Apply changes</ActionButton
    >
  </div>
</template>

<style scoped></style>
