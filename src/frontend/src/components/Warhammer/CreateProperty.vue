<template>
  <div class="property">
    <b-container>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form id="edit-property" @submit.stop.prevent="handleSubmit(submitForm)">
          <h1>{{ titlePrefix }} Item Quality/Flaw</h1>

          <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
            >Item Property saved successfully.
          </b-alert>

          <div v-if="errors.length" class="text-danger field-validation-error mt-3">
            <ul>
              <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
            </ul>
          </div>

          <b-row>
            <b-col md="6">
              <ValidationProvider v-slot="{ errors, valid }" :rules="nameValid" name="Name">
                <b-form-group label="Name" label-for="name-input">
                  <b-form-input id="name-input" :disabled="!element.canEdit" v-model="element.name" type="text">
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <b-form-group label="Type" label-for="type-input">
                <b-form-select
                  id="type-input"
                  :disabled="!element.canEdit"
                  :options="itemPropertyTypeOptions"
                  v-model="element.type"
                >
                </b-form-select>
              </b-form-group>

              <b-form-group label="Applicable To" label-for="applicable-to-input">
                <b-form-checkbox-group
                  id="applicable-to-input"
                  :disabled="!element.canEdit"
                  :options="itemTypeOptions"
                  v-model="element.applicableTo"
                >
                </b-form-checkbox-group>
              </b-form-group>

              <ValidationProvider v-slot="{ errors, valid }" :rules="descValid" name="Description">
                <b-form-group label="Description" label-for="description-input">
                  <b-form-textarea
                    id="description-input"
                    :disabled="!element.canEdit"
                    v-model="element.description"
                    rows="3"
                    max-rows="50"
                  >
                  </b-form-textarea>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Quality/Flaw" />

              <CreateSubmit
                :showAddAnother="showAddAnother"
                :disabled="!element.canEdit"
                :submitting="submitting"
                @goBack="goBack"
                v-model="addAnother"
              ></CreateSubmit>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-container>
  </div>
</template>

<script>
import CreateElement2 from "./CreateElement";
import CreateSubmit from "./CreateSubmit";
import PublicElementBox from "./PublicElementBox";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import {
  ItemPropertyApi,
  generateEmptyItemProperty,
  generateNewItemProperty,
  itemPropertyTypes,
  compareItemProperty,
} from "../../services/wh/itemproperty";
import { itemTypes } from "../../services/wh/item";
import { authRequest } from "../../services/auth";

export default {
  name: "CreateProperty",
  mixins: [CreateElement2],
  components: {
    ValidationObserver,
    ValidationProvider,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new ItemPropertyApi(authRequest),

      element: generateEmptyItemProperty(),
      elementOriginal: generateEmptyItemProperty(),

      itemPropertyTypeOptions: Object.keys(itemPropertyTypes).map((key) => {
        return { value: parseInt(key), text: itemPropertyTypes[key] };
      }),
      itemTypeOptions: Object.keys(itemTypes).map((key) => {
        return { value: parseInt(key), text: itemTypes[key] };
      }),
    };
  },
  created() {
    this.elementType = "property";
    this.initializeElement();
  },
  methods: {
    formModified() {
      return !compareItemProperty(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewItemProperty(canEdit);
      this.elementOriginal = generateNewItemProperty(canEdit);
    },
  },
};
</script>

<style scoped></style>