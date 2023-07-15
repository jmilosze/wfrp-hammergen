<template>
  <div class="profile">
    <form @submit.prevent="submit" id="profile">
      <h4>User profile</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="username">Username (email)</label>
            <input class="form-control" disabled="" type="text" id="username" v-model="username" />
          </div>
        </div>

        <div class="col-md-6">
          <div v-if="errors.length" class="text-danger field-validation-error">
            <ul>
              <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { authRequest } from "../../../services/auth";
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "UserProfile",
  mixins: [NavHelpers],
  created() {
    this.callAndLogoutIfUnauthorized(authRequest.get)("/api/user")
      .then((resp) => (this.username = resp.data.data.username))
      .catch(() => this.errors.push("Server Error."));
  },
  data() {
    return {
      validatorOn: false,
      errors: [],
      username: "",
    };
  },
};
</script>

<style scoped></style>
