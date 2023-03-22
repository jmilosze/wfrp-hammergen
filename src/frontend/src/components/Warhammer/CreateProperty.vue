<template>
  <div class="property">
    <b-container>
      <b-form id="edit-property" @submit.stop.prevent="submit">
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
            <b-form-group label="Name" label-for="name-input">
              <b-form-input
                id="name-input"
                :disabled="!element.canEdit"
                v-model="element.name"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback :state="validName[0]">{{ validName[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Type" label-for="type-input">
              <b-form-select
                id="type-input"
                :disabled="!element.canEdit"
                :options="itemPropertyTypeOptions"
                v-model="element.type"
              ></b-form-select>
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

            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Quality/Flaw" />

            <CreateSubmit
              :showAddAnother="showAddAnother"
              :disabled="!element.canEdit"
              :submitting="submitting"
              @goBack="goBack"
              v-model="addAnother"
            ></CreateSubmit>
          </b-col>
          <b-col md="6">
            <b-form-group label="Description" label-for="description-input">
              <b-form-textarea
                id="description-input"
                :disabled="!element.canEdit"
                v-model="element.description"
                rows="3"
                max-rows="50"
              >
              </b-form-textarea>
              <b-form-invalid-feedback :state="validDesc[0]">{{ validDesc[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <SourceTable :initial-sources="element.source"> </SourceTable> </b-col
          >
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import CreateElement2 from "./CreateElement.vue";
import CreateSubmit from "./CreateSubmit.vue";
import PublicElementBox from "./PublicElementBox.vue";
import SourceTable from "./SourceTable.vue";
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
    CreateSubmit,
    PublicElementBox,
    SourceTable,
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
