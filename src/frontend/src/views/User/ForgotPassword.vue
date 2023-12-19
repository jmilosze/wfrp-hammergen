<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import TextLink from "../../components/TextLink.vue";
</script>

<template>
  <div>
    <Header title="Forgot your password?"
      >Please submit email address you used as a account login. We will send you password reset link. If you cannot see
      the email please check your junk/spam folders.
    </Header>
    <div class="text-xl mt-3">Please be advised</div>
    <div class="mt-1">
      <p>
        Occasionally when using "Forgot your password" you might not get the email at all. This is because email
        provides (for example Microsoft or Google) sometimes block IP addresses of the service Hammergen uses to send
        emails. If that happens to you, please wait a minute or two and try again few more times. If you still do not
        see any email from us, please contact us at
        <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink> to restore your account.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
