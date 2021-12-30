<template>
  <div class="login">
    <div class="container">
      <form @submit.prevent="submit" id="login">
        <h1>Log in</h1>
        <h4>Use a local account to log in.</h4>
        <hr />
        <div class="row">
          <div class="col-md-4">
            <div class="alert alert-danger" v-if="sessionExpired">Session has expired. Please log in again.</div>

            <div class="form-group">
              <label for="email">Username (email)</label>
              <input v-model="username" type="text" id="email" class="form-control" />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input v-model="password" type="password" id="password" class="form-control" />
            </div>

            <div class="form-group">
              <button type="submit" form="login" value="Submit" class="btn btn-primary">
                <span v-if="loggingIn" class="spinner-border spinner-border-sm" />
                Log in
              </button>
            </div>

            <div class="form-group">
              <p>
                <router-link to="/forgotPassword">Forgot your password?</router-link>
              </p>
            </div>

            <div class="form-group">
              <p>
                <router-link to="/register">Register as a new user</router-link>
              </p>
            </div>
          </div>

          <div class="col-md-8">
            <div v-if="errors.length" class="text-danger field-validation-error">
              <ul>
                <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { router } from "../../router";

export default {
  name: "Login",
  props: {
    sessionExpired: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: "",
      password: "",
      errors: [],
      loggingIn: false,
    };
  },
  methods: {
    onLoginFailed(e) {
      if (e.response && e.response.data.code === 102) {
        this.errors.push("Invalid username or password.");
      } else {
        this.errors.push("Server error.");
      }
    },
    submit() {
      this.loggingIn = false;
      this.errors = [];

      if (!this.username) {
        this.errors.push("Username is required");
      }

      if (!this.password) {
        this.errors.push("Password is required");
      }

      if (this.errors.length) {
        return;
      }

      this.loggingIn = true;
      this.$store
        .dispatch("auth/login", { username: this.username.toLowerCase(), password: this.password })
        .then(() => router.push({ name: "home" }))
        .catch((e) => this.onLoginFailed(e))
        .then(() => (this.loggingIn = false));
    },
  },
};
</script>

<style scoped></style>
