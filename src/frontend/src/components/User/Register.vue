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
            <b-form-group label="Email" label-for="email-input">
              <b-form-input id="email-input" v-model="username" type="text"></b-form-input>
              <b-form-invalid-feedback :state="validInputEmail[0]"> {{ validInputEmail[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Password" label-for="password-input">
              <b-form-input id="password-input" v-model="password" type="password"></b-form-input>
              <b-form-invalid-feedback :state="validInputPassword[0]">
                {{ validInputPassword[1] }}</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group label="Confirm password" label-for="retyped-password-input">
              <b-form-input id="retyped-password-input" v-model="retypedPassword" type="password"></b-form-input>
              <b-form-invalid-feedback :state="validInputPasswordMatch[0]">
                {{ validInputPasswordMatch[1] }}</b-form-invalid-feedback
              >
            </b-form-group>

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
import { validEmail, validPassword, validPasswordMatch, validUserName } from "../../utils/validation/user";
import { anonRequest } from "../../services/auth";

export default {
  name: "UserRegister",
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
      validatorOn: false,
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
      this.validatorOn = false;
      this.username = "";
      this.password = "";
      this.retypedPassword = "";
      this.registrationSuccessful = true;

      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
    },

    async submit() {
      this.validatorOn = true;
      this.registering = false;
      this.registrationSuccessful = false;
      this.errors = [];

      if (
        !this.validInputEmail[0] ||
        !this.validInputPassword[0] ||
        !this.validInputPasswordMatch[0]
      ) {
        return;
      }

      this.registering = true;

      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("register");

      try {
        await anonRequest.post("/api/user", {
          username: this.username.toLowerCase(),
          password: this.password,
          captcha: token,
        });
        this.onRegistrationSuccessful();
      } catch (error) {
        this.onRegistrationFailed(error);
      } finally {
        this.registering = false;
      }
    },
  },
  computed: {
    validInputEmail() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validEmail(this.username);
    },
    validInputPassword() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPassword(this.password);
    },
    validInputPasswordMatch() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPasswordMatch(this.password, this.retypedPassword);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
