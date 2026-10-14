<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import Username from "./ManageUsername.vue";
import Password from "./ManagePassword.vue";
import Delete from "./ManageDelete.vue";
import UserLinkedUsers from "./UserLinkedUsers.vue";
import ToggleSwitch from "../../components/ToggleSwitch.vue";
import { useRouteQuery } from "@vueuse/router";

const viewNames = [
  { value: "manage", text: "Manage account" },
  { value: "linked", text: "Linked users" },
];

const currentView = useRouteQuery("view", viewNames[0].value);
</script>

<template>
  <div class="flex justify-center mb-4">
    <ToggleSwitch v-model="currentView" :options="viewNames" label="Account view" />
  </div>
  <div v-if="currentView === viewNames[0].value">
    <Header title="Manage your account">
      Change your email or password, or delete the account. Every change asks for your
      <span class="font-semibold">current</span> password.
    </Header>
    <div class="grid gap-6 mt-4 md:grid-cols-2">
      <Username />
      <Password />
      <Delete class="md:col-span-2" />
    </div>
  </div>
  <div v-else-if="currentView === 'linked'">
    <UserLinkedUsers />
  </div>
</template>

<style scoped></style>
