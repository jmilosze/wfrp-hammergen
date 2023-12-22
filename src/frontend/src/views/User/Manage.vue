<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import Username from "./Manage/Username.vue";
import Password from "./Manage/Password.vue";
import Delete from "./Manage/Delete.vue";
</script>

<template>
  <Header title="Manage your account">
    Change your email, password, or delete the account. To make any changes in this section, you will need to confirm
    your <span class="font-bold">current</span> password.
  </Header>
  <Username />
  <Password />
  <Delete />
</template>

<style scoped></style>
