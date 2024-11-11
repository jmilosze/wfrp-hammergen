<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import Username from "./ManageUsername.vue";
import Password from "./ManagePassword.vue";
import Delete from "./ManageDelete.vue";
import UserLinkedUsers from "./UserLinkedUsers.vue";
import HorizontalNavBar from "../../components/HorizontalNavBar.vue";
import { useQueryParams } from "../../composables/useQueryParams.ts";

const viewNames = [
  { value: "manage", text: "Mange account" },
  { value: "linked", text: "Linked users" },
];

const currentView = useQueryParams(
  "view",
  viewNames.map((x) => x.value),
);
</script>

<template>
  <HorizontalNavBar v-model="currentView" :viewNames="viewNames" />
  <div v-if="currentView === viewNames[0].value">
    <Header title="Manage your account">
      Change your email, password, or delete the account. To make any changes in this section, you will need to confirm
      your <span class="font-bold">current</span> password.
    </Header>
    <Username />
    <Password />
    <Delete />
  </div>
  <div v-else-if="currentView === 'linked'">
    <UserLinkedUsers />
  </div>
</template>

<style scoped></style>
