<template>
  <div class="shared">
    <h4>Update linked users.</h4>
    <div>
      <b-alert :show="updateSuccessful" variant="success" dismissible>
        <h6>Linked user list updated successfully!</h6>
        <hr />
        <p>In order to be able to see content shared by newly added users please log out and then log back in.</p>
      </b-alert>
    </div>
    <p>
      Here you can add "linked users". You need to know their username (the email they used to register). When you add a
      user you can see all their public characters, items, skills, etc. in read-only mode. After adding all users, click
      apply changes to save the new user list.
    </p>
    <p>
      If you want to share your character, items and so on, all you need to do is mark them as non-private (checkbox in
      the edit form) and provide your username to whoever you want to share it with. They will need to add your username
      here and will be able to see all shared content in read-only mode.
    </p>
    <h6>Important note about sharing</h6>
    <p>
      When you share some custom element (for example an item), make sure that you also share all other custom component
      that element includes (for example custom Quality of that item). If you do not, other users will be able to see
      shared item but it will not have your custom quality. This does not apply to characters. If you share character
      other users will be able to see all custom skills, talents, items etc. that character has.
    </p>
    <div v-if="sharedAccounts.length > 0">
      <div class="row">
        <b-table class="col-12" hover :items="tableFields" :fields="tableHeader" :responsive="true">
          <template v-slot:cell(name)="row">
            <div class="flex-container">
              <span class="username mt-1">{{ row.item.name }}</span>
              <b-button variant="danger" size="sm" class="delButton mt-1" @click="removeUsername(row.item.name)">
                Remove
              </b-button>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div v-if="errors.length" class="text-danger field-validation-error">
          <ul>
            <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </div>
        <div>
          <b-form-group label="New username" label-for="username-input">
            <b-input-group>
              <b-form-input id="username-input" v-model="newConnectedAcc" type="text"> </b-form-input>
              <b-input-group-append>
                <b-button variant="primary" @click="addUsername">
                  <span v-if="nameCheckSubmitting" class="spinner-border spinner-border-sm" />
                  Add
                </b-button>
              </b-input-group-append>
            </b-input-group>
            <b-form-invalid-feedback :state="addAccountStatus.state">
              {{ addAccountStatus.errorMsg }}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <b-button variant="primary" @click="submitUpdate">
          <span v-if="updateSubmitting" class="spinner-border spinner-border-sm" />
          Apply Changes
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";

export default {
  name: "Shared",
  data() {
    return {
      updateSuccessful: false,
      nameCheckSubmitting: false,
      updateSubmitting: false,
      errors: [],
      sharedAccounts: [],
      newConnectedAcc: "",
      addAccountStatus: { state: true, errorMsg: "" },
      username: "",
      tableHeader: [{ key: "name", label: "Username", sortable: true }],
    };
  },
  computed: {
    tableFields() {
      return this.sharedAccounts.map(function (x) {
        return { name: x };
      });
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async submitUpdate() {
      this.updateSuccessful = false;
      this.errors = [];
      this.updateSubmitting = true;

      try {
        await logoutIfUnauthorized(authRequest.post)("/api/user/update", { shared_accounts: this.sharedAccounts });
        this.updateSuccessful = true;
      } catch (error) {
        this.errors.push("Server Error.");
      }
      this.updateSubmitting = false;
    },
    removeUsername(username) {
      this.sharedAccounts = this.sharedAccounts.filter((item) => item !== username);
    },
    async loadData() {
      try {
        const resp = await logoutIfUnauthorized(authRequest.get)("/api/user");
        this.sharedAccounts = resp.data.data.shared_accounts;
        this.username = resp.data.data.username;
      } catch (error) {
        this.errors.push("Server Error.");
      }
    },
    setStatus(submitting, state, errorMsg) {
      this.nameCheckSubmitting = submitting;
      this.addAccountStatus = {
        state: state,
        errorMsg: errorMsg,
      };
    },
    async addUsername() {
      this.errors = [];
      this.setStatus(true, true, "");

      const newAcc = this.newConnectedAcc.toLowerCase();

      if (this.sharedAccounts.includes(newAcc)) {
        this.setStatus(false, false, `Username ${this.newConnectedAcc} is already on the list.`);
        return;
      }

      if (!newAcc) {
        this.setStatus(false, false, "Please specify username.");
        return;
      }

      if (newAcc === this.username) {
        this.setStatus(false, false, "You cannot add your own username.");
        return;
      }

      try {
        const resp = await logoutIfUnauthorized(authRequest.get)(`/api/user/${newAcc}`);
        if (resp.data.data.exists) {
          this.sharedAccounts.push(newAcc);
          this.newConnectedAcc = "";
          this.setStatus(false, true, "");
        } else {
          this.setStatus(false, false, `Username ${this.newConnectedAcc} not found.`);
        }
      } catch (error) {
        this.errors.push("Server Error.");
      }
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
}
.username {
  flex-grow: 10;
}

.delButton {
  flex-grow: 1;
}
</style>
