<template>
  <div class="login">
    <div class="container">
      <h1>Manage your account</h1>
      <h4>Change your account settings</h4>
      <hr />
      <div class="row">
        <div class="col-md-3">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <button
                v-on:click="clickTab('profile')"
                class="nav-link btn btn-block text-left"
                v-bind:class="{ active: selectedTab.profile }"
              >
                Profile
              </button>
            </li>
            <li class="nav-item">
              <button
                v-on:click="clickTab('shared')"
                class="nav-link btn btn-block text-left"
                v-bind:class="{ active: selectedTab.shared }"
              >
                Linked Users
              </button>
            </li>
            <li class="nav-item">
              <button
                v-on:click="clickTab('username')"
                class="nav-link btn btn-block text-left"
                v-bind:class="{ active: selectedTab.username }"
              >
                Username
              </button>
            </li>
            <li class="nav-item">
              <button
                v-on:click="clickTab('password')"
                class="nav-link btn btn-block text-left"
                v-bind:class="{ active: selectedTab.password }"
              >
                Password
              </button>
            </li>
            <li class="nav-item">
              <button
                v-on:click="clickTab('delete')"
                class="nav-link btn btn-block text-left"
                v-bind:class="{ active: selectedTab.delete }"
              >
                Delete Account
              </button>
            </li>
          </ul>
        </div>

        <div class="col-md-9">
          <div v-if="selectedTab.profile">
            <Profile />
          </div>

          <div v-if="selectedTab.username">
            <Username />
          </div>

          <div v-if="selectedTab.password">
            <Password />
          </div>

          <div v-if="selectedTab.delete">
            <Delete />
          </div>

          <div v-if="selectedTab.shared">
            <Shared />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from "./Manage/Profile";
import Username from "./Manage/Username";
import Password from "./Manage/Password";
import Delete from "./Manage/Delete";
import Shared from "./Manage/Shared";

export default {
  name: "Manage",
  components: { Delete, Profile, Username, Password, Shared },
  data() {
    return {
      selectedTab: {
        profile: true,
        username: false,
        password: false,
        delete: false,
        shared: false,
        clear: function () {
          this.profile = false;
          this.username = false;
          this.password = false;
          this.delete = false;
          this.shared = false;
        },
      },
    };
  },
  created() {
    if (!this.$store.state.auth.isLoggedIn) {
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    clickTab(tab) {
      this.selectedTab.clear();
      this.selectedTab[tab] = true;
    },
  },
};
</script>

<style scoped></style>
