<template>
  <div class="register">
    <div class="container">
      <form @submit.prevent="submit" id="register">
        <h1>Register</h1>
        <h4>Create a new account.</h4>
        <hr />
        <div class="alert alert-success" v-if="registrationSuccessful">
          Registration successful, redirecting to login...
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="username">Name</label>
              <input v-model="name" type="text" id="username" class="form-control" />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="username" type="text" id="email" class="form-control" />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input v-model="password" type="password" id="password" class="form-control" />
            </div>

            <div class="form-group">
              <label for="retyped-password">Confirm password</label>
              <input v-model="retypedPassword" type="password" id="retyped-password" class="form-control" />
            </div>

            <div class="form-group">
              <button type="submit" form="register" value="Submit" class="btn btn-primary">
                <span v-if="registering" class="spinner-border spinner-border-sm" />
                Register
              </button>
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
import { emailErrors, passwordErrors, nameErrors } from "../../utils/userValidators";
import { anonRequest } from "../../services/auth";

export default {
  name: "Register",
  created() {
    this.$recaptchaLoaded().then(() => {
      this.$recaptchaInstance.showBadge();
    });
  },
  destroyed() {
    this.$recaptchaInstance.hideBadge();
  },
  data() {
    return {
      name: "",
      username: "",
      password: "",
      retypedPassword: "",

      errors: [],

      registering: false,
      registrationSuccessful: false,
    };
  },
  methods: {
    onRegistrationFailed(error) {
      if (error.response && error.response.data.code === 101) {
        this.errors.push("User with this email already exists.");
      } else if (error.response && error.response.data.code === 106) {
        this.errors.push("We suspect you might be a robot. Please try again.");
      } else {
        this.errors.push("Server error.");
      }
    },

    onRegistrationSuccessful() {
      this.name = "";
      this.username = "";
      this.password = "";
      this.retypedPassword = "";
      this.registrationSuccessful = true;

      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
    },

    async submit() {
      this.registering = false;
      this.registrationSuccessful = false;

      this.errors = [];
      this.errors.push(...emailErrors(this.username));
      this.errors.push(...passwordErrors(this.password, this.retypedPassword));
      this.errors.push(...nameErrors(this.name));

      if (this.errors.length) {
        return;
      }

      this.registering = true;

      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("register");

      try {
        await anonRequest.post("/api/user", {
          name: this.name,
          username: this.username.toLowerCase(),
          password: this.password,
          shared_accounts: [],
          recaptcha: token,
        });
        this.onRegistrationSuccessful();
      } catch (error) {
        this.onRegistrationFailed(error);
      } finally {
        this.registering = false;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
