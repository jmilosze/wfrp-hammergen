<script setup lang="ts">
import HomeVisitor from "./Home/HomeVisitor.vue";
import HomeDashboard from "./Home/HomeDashboard.vue";
import { useAuth } from "@/composables/auth.ts";

const auth = useAuth();
</script>

<template>
  <HomeDashboard v-if="auth.loggedIn.value" />
  <HomeVisitor v-else />
</template>
