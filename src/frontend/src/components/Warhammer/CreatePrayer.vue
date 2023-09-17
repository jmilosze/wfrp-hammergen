<template>
  <div class="prayer">
    <b-container>
      <b-form id="edit-prayer" @submit.stop.prevent="submit">
        <h1>{{ titlePrefix }} Prayer</h1>

        <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
          >Prayer saved successfully.
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
          </b-col>

          <b-col md="6">
            <b-form-group label="Range" label-for="range-input">
              <b-form-input
                id="range-input"
                :disabled="!element.canEdit"
                v-model="element.range"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback :state="validRange[0]">{{ validRange[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Target" label-for="target-input">
              <b-form-input
                id="target-input"
                :disabled="!element.canEdit"
                v-model="element.target"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback :state="validTarget[0]">{{ validTarget[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Duration" label-for="duration-input">
              <b-form-input
                id="duration-input"
                :disabled="!element.canEdit"
                v-model="element.duration"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback :state="validDuration[0]">{{ validDuration[1] }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <SourceTable
              v-model="element.source"
              @isValid="validSources = $event"
              :disabled="!element.canEdit"
            ></SourceTable>
          </b-col>
          <b-col md="6">
            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Prayer" />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <CreateSubmit
              :showAddAnother="showAddAnother"
              :disabled="!element.canEdit"
              :submitting="submitting"
              @goBack="goBack(true)"
              v-model="addAnother"
            ></CreateSubmit>
          </b-col>
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
import { comparePrayer, generateEmptyPrayer, generateNewPrayer, PrayerApi } from "../../services/wh/prayer";
import { authRequest } from "../../services/auth";
import { validWhShortDesc } from "../../utils/validation/wh";

export default {
  name: "CreatePrayer",
  mixins: [CreateElement2],
  components: {
    SourceTable,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new PrayerApi(authRequest),

      element: generateEmptyPrayer(),
      elementOriginal: generateEmptyPrayer(),

      validSources: true,
    };
  },
  created() {
    this.elementType = "prayer";
    this.initializeElement();
  },
  methods: {
    formModified() {
      return !comparePrayer(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewPrayer(canEdit);
      this.elementOriginal = generateNewPrayer(canEdit);
      this.elementOriginal = generateNewPrayer(canEdit);
    },
    validate() {
      return (
        this.validName[0] &&
        this.validDesc[0] &&
        this.validRange[0] &&
        this.validTarget[0] &&
        this.validDuration[0] &&
        this.validSources
      );
    },
  },
  computed: {
    validRange() {
      return validWhShortDesc(this.element.range);
    },
    validTarget() {
      return validWhShortDesc(this.element.target);
    },
    validDuration() {
      return validWhShortDesc(this.element.duration);
    },
  },
};
</script>

<style scoped></style>
