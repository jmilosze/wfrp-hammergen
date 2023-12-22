<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import AfterSubmit from "../../components/AfterSubmit.vue";
import SubmitButton from "../../components/SubmitButton.vue";
import { onMounted, Ref, ref } from "vue";
import { SubmissionState } from "../../utils/submission.ts";
import { useAuthStore } from "../../stores/auth.ts";
import { authRequest } from "../../services/auth.ts";
import ActionButton from "../../components/ActionButton.vue";
import { invalidEmailMsg } from "../../services/user.ts";
import FormStringInput from "../../components/FormStringInput.vue";

const submissionState = ref(new SubmissionState());
const sharedAccounts: Ref<Array<string>> = ref([]);
const newSharedAccount = ref("");

const { callAndLogoutIfUnauthorized } = useAuthStore();

onMounted(async () => {
  try {
    const resp = await callAndLogoutIfUnauthorized(authRequest.get)("/api/user");
    sharedAccounts.value = resp?.data.data.sharedAccounts.sort();
  } catch (error) {
    submissionState.value.setFailureFromError(error, []);
  }
});

function removeUsername(username: string) {
  sharedAccounts.value = sharedAccounts.value.filter((item) => item !== username).sort();
}

async function submitForm() {}
</script>

<template>
  <Header title="Update linked users">
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
  <div class="pt-2 overflow-x-auto">
    <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200 min-w-fit">
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="border-b border-neutral-200 p-2">Linked users</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sharedAccount in sharedAccounts" :key="sharedAccount">
            <td
              class="py-2 px-5 hover:bg-neutral-200 border-b border-neutral-200 bg-white flex flex-col items-center md:justify-between flex-wrap md:flex-row md:gap-2"
            >
              <span class="flex-auto">{{ sharedAccount }}</span>
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
  <div class="pt-2 lg:w-3/4">
    <AfterSubmit :submissionState="submissionState" />
    <SubmitButton class="mt-3" @click="submitForm" :submissionState="submissionState">Apply changes</SubmitButton>
  </div>
</template>

<style scoped></style>
