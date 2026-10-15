<script setup lang="ts">
import AppButton from "@/components/ui/AppButton.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import AfterSubmit from "@/components/account/AfterSubmit.vue";
import { computed, ref } from "vue";
import { SubmissionState } from "@/utils/submission.ts";
import { authRequest } from "@/services/auth.ts";
import FormInput from "@/components/form/FormInput.vue";
import { User, UserApi } from "@/services/user.ts";
import { setValidationStatus } from "@/utils/validation.ts";
import { UnauthorizedError } from "@/composables/auth.ts";
import AlertBlock from "@/components/ui/AlertBlock.vue";
import AccountCard from "@/components/account/AccountCard.vue";
import { Icon } from "@iconify/vue";

const apiError = ref("");
const showApiError = ref(true);
const applyChangesSubmissionState = ref(new SubmissionState());
const addUserSubmissionState = ref(new SubmissionState());
const showApplyChangesAfterSubmit = ref(false);
const showAddUserAfterSubmit = ref(false);
const newSharedAccount = ref("");
const user = ref(new User());
const originalUser = ref(new User());
const userApi = new UserApi(authRequest);

const validNewSharedAccount = computed(() => {
  if (addUserSubmissionState.value.notStartedOrSubmitted()) {
    return setValidationStatus(true);
  } else {
    return user.value.validateNewSharedAccount(newSharedAccount.value);
  }
});

try {
  user.value = await userApi.get();
  originalUser.value = user.value.copy();
} catch {
  apiError.value = "Error. Could not pull data from server.";
}

// An email split after its "@", where it may wrap.
function emailParts(email: string): [string, string] {
  const at = email.indexOf("@") + 1;
  return [email.slice(0, at), email.slice(at)];
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
    const userExists = await userApi.checkIfExists(newSharedAccount.value);
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
    await userApi.updateSharedAccounts(user.value);
    originalUser.value = user.value.copy();
    applyChangesSubmissionState.value.setSuccess(
      "Linked user list updated successfully! In order to be able to see content shared by newly added users please log out and then log back in.",
    );
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      applyChangesSubmissionState.value.setFailureFromError(error, []);
    }
  }
}
</script>

<template>
  <AlertBlock v-if="apiError && showApiError" alertType="red" :centered="true" @close="showApiError = false">
    {{ apiError }}
  </AlertBlock>
  <PageHeader title="Linked users">
    <p>
      Add the users whose shared content you want to see, by their username (the email they registered with). You then
      see all their shared characters and compendium entries (skills, talents and so on) read-only, so you can, for
      example, equip a trapping someone else made. Apply the changes once you have added everyone.
    </p>
    <p class="mt-3">
      To share your own characters or compendium entries, mark them as shared in their editor and give your username to
      whoever you want to share with. Once they add you here, they see all your shared content read-only.
    </p>
  </PageHeader>
  <div class="my-4 p-4 border-l-4 border-brand bg-parchment-light rounded">
    <p class="font-semibold">Share what your content uses</p>
    <p class="mt-1">
      When you share a custom compendium entry (for example a trapping), share the custom entries it uses as well (for
      example a custom quality of that trapping). Otherwise others see the trapping without your quality.
    </p>
  </div>
  <AccountCard title="Your linked users" icon="lucide:users" class="max-w-2xl">
    <AfterSubmit
      :visible="showApplyChangesAfterSubmit"
      :submissionState="applyChangesSubmissionState"
      @close="showApplyChangesAfterSubmit = false"
    />
    <AfterSubmit
      :visible="showAddUserAfterSubmit"
      :submissionState="addUserSubmissionState"
      @close="showAddUserAfterSubmit = false"
    />
    <ul class="list-none m-0 p-0 bg-white border border-neutral-300 rounded-lg">
      <li
        v-for="sharedAccount in user.sharedAccounts"
        :key="sharedAccount"
        class="flex items-center gap-3 px-3 py-2 border-b border-neutral-200 last:border-b-0 hover:bg-neutral-100"
      >
        <Icon icon="lucide:user" class="hidden sm:block size-4 shrink-0 text-neutral-500" />
        <!-- A long email wraps after the "@" rather than anywhere; only a part too long for a line breaks inside. -->
        <span class="flex-1 min-w-0 wrap-break-word">
          {{ emailParts(sharedAccount)[0] }}<wbr />{{ emailParts(sharedAccount)[1] }}
        </span>
        <button
          type="button"
          class="rounded border border-neutral-400 bg-white p-1.5 text-neutral-800 hover:bg-neutral-200 cursor-pointer"
          :title="`Remove ${sharedAccount}`"
          :aria-label="`Remove ${sharedAccount}`"
          @click="removeUsername(sharedAccount)"
        >
          <Icon icon="lucide:x" class="size-4" />
        </button>
      </li>
      <li v-if="user.sharedAccounts.length === 0" class="px-3 py-2 text-neutral-500">No linked users yet.</li>
    </ul>
    <FormInput
      v-model="newSharedAccount"
      title="Add a user (their email)"
      :validationStatus="validNewSharedAccount"
      @input="newSharedAccount = ($event.target as HTMLInputElement).value.trim()"
    >
      <AppButton
        icon="lucide:plus"
        variant="light"
        iconOnlyWhenNarrow
        aria-label="Add user"
        class="ml-2 h-full"
        :busy="addUserSubmissionState.status === 'inProgress'"
        @click="addUsername"
      >
        Add
      </AppButton>
    </FormInput>
    <AppButton
      icon="lucide:check"
      variant="light"
      size="lg"
      class="self-start"
      :busy="applyChangesSubmissionState.status === 'inProgress'"
      @click="submitForm"
    >
      Apply changes
    </AppButton>
  </AccountCard>
</template>
