<template>
  <div class="mutation">
    <b-container>
      <b-form id="edit-Mutation" @submit.stop.prevent="submit">
        <h1>{{ titlePrefix }} Mutation</h1>

        <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
          >Mutation saved successfully.
        </b-alert>

        <div v-if="errors.length" class="text-danger field-validation-error mt-3">
          <ul>
            <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </div>

        <b-row>
          <b-col md="6">
            <b-form-group label="Name" label-for="name-input">
              <b-form-input id="name-input" :disabled="!element.canEdit" v-model="element.name" type="text">
              </b-form-input>
              <b-form-invalid-feedback :state="validName[0]">{{ validName[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Type" label-for="type-input">
              <b-form-select
                id="type-input"
                :disabled="!element.canEdit"
                :options="mutationTypeOptions"
                v-model="element.type"
              >
              </b-form-select>
            </b-form-group>
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
          </b-col>
        </b-row>

        <CharacterModifiers
          :size.sync="element.modifiers.size"
          :movement.sync="element.modifiers.movement"
          :ws.sync="element.modifiers.attributes.WS"
          :bs.sync="element.modifiers.attributes.BS"
          :s.sync="element.modifiers.attributes.S"
          :t.sync="element.modifiers.attributes.T"
          :i.sync="element.modifiers.attributes.I"
          :ag.sync="element.modifiers.attributes.Ag"
          :dex.sync="element.modifiers.attributes.Dex"
          :int.sync="element.modifiers.attributes.Int"
          :wp.sync="element.modifiers.attributes.WP"
          :fel.sync="element.modifiers.attributes.Fel"
          @valid="validAtt = $event"
          :disabled="!element.canEdit"
        />

        <b-row>
          <b-col md="6">
            <SourceTable
              v-model="element.source"
              @isValid="validSources = $event"
              :disabled="!element.canEdit"
            ></SourceTable>
          </b-col>
          <b-col md="6">
            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Mutation" />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
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
    </b-container>
  </div>
</template>

<script>
import CreateElement2 from "./CreateElement.vue";
import CreateSubmit from "./CreateSubmit.vue";
import PublicElementBox from "./PublicElementBox.vue";
import CharacterModifiers from "./CharacterModifiers.vue";
import SourceTable from "./SourceTable.vue";
import {
  MutationApi,
  generateEmptyMutation,
  generateNewMutation,
  mutationTypes,
  compareMutation,
} from "../../services/wh/mutation";
import { authRequest } from "../../services/auth";

export default {
  name: "CreateMutation",
  mixins: [CreateElement2],
  components: {
    SourceTable,
    CharacterModifiers,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new MutationApi(authRequest),

      element: generateEmptyMutation(),
      elementOriginal: generateEmptyMutation(),

      mutationTypeOptions: Object.keys(mutationTypes).map((key) => {
        return { value: parseInt(key), text: mutationTypes[key] };
      }),
      validAtt: true,
      validSources: true,
    };
  },
  created() {
    this.elementType = "mutation";
    this.initializeElement();
  },
  methods: {
    formModified() {
      return !compareMutation(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewMutation(canEdit);
      this.elementOriginal = generateNewMutation(canEdit);
    },
    validate() {
      return this.validName[0] && this.validDesc[0] && this.validAtt && this.validSources;
    },
  },
};
</script>

<style scoped></style>
