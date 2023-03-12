<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-container>
      <b-navbar-brand :to="{ name: 'home' }">Hammergen</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'list_character' }">Characters </b-nav-item>

          <b-nav-item-dropdown text="Other" right>
            <b-dropdown-item :to="{ name: 'list_item' }">Items</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_skill' }">Skills</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_talent' }">Talents</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_property' }">Qualities and Flaws</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_spell' }">Prayers and Spells</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_mutation' }">Mutations</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'list_career' }">Careers</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="https://ko-fi.com/Q5Q12E0KB" target="_blank">Support Hammergen</b-nav-item>
          <b-nav-item-dropdown text="About" right>
            <b-dropdown-item :to="{ name: 'updates' }">Updates</b-dropdown-item></b-nav-item-dropdown
          >
          <b-nav-item v-if="!authStore.loggedIn" :to="{ name: 'register' }">Register</b-nav-item>
          <b-nav-item v-if="!authStore.loggedIn" :to="{ name: 'login' }">Login</b-nav-item>
          <b-nav-item v-if="authStore.loggedIn" :to="{ name: 'manage' }">Manage Account</b-nav-item>
          <b-nav-form v-if="authStore.loggedIn">
            <b-button variant="btn-link" v-on:click="logout" class="nav-link">Logout</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import NavHelpers from "./NavHelpers.vue";

export default {
  name: "NavBar",
  mixins: [NavHelpers],
};
</script>

<style scoped></style>
