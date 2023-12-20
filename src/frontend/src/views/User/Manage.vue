<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import Username from "./Manage/Username.vue";
import Password from "./Manage/Password.vue";
import Delete from "./Manage/Delete.vue";
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../stores/auth.ts";

const email = ref("");

const { getLoggedUserInfo } = useAuthStore();

onMounted(() => {
  email.value = getLoggedUserInfo().username;
});
</script>

<template>
  <Header title="Manage your account">
    Change your email, password, or delete the account. To make any changes in this section, you will need to re-confirm
    your current password.
  </Header>
  <Username :currentEmail="email" />
  <Password />
  <Delete />
</template>

<style scoped></style>
