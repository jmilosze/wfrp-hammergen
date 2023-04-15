<template>
  <div class="talent">
    <b-container>
      <b-form id="edit-talent" @submit.stop.prevent="submit">
        <h1>{{ titlePrefix }} Talent</h1>

        <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
          >Talent saved successfully.
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

            <b-form-group label="Individual Talent or Group of Talents?" label-for="is-group-input">
              <b-form-select
                id="is-group-input"
                :disabled="!element.canEdit"
                :options="[
                  { value: true, text: 'Group' },
                  { value: false, text: 'Individual' },
                ]"
                v-model="element.isGroup"
              >
              </b-form-select>
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
            <div v-if="element.isGroup === false">
              <div>Max Rank</div>
              <b-table-simple :responsive="true">
                <b-tr>
                  <b-td>
                    <b-form-group>
                      <b-form-select
                        id="max-rank-att-input"
                        :disabled="!element.canEdit"
                        :options="attributeOptions"
                        v-model="element.maxRankAtt"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-td>

                  <b-td>
                    <div class="mt-1 text-nowrap text-center">Bonus</div>
                  </b-td>

                  <b-td>
                    <div class="mt-1">+</div>
                  </b-td>

                  <b-td>
                    <b-form-group>
                      <b-form-input :disabled="!element.canEdit" :number="true" v-model="element.maxRank" type="number">
                      </b-form-input>
                      <b-form-invalid-feedback :state="validMaxRank[0]">{{ validMaxRank[1] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-td>
                </b-tr>
              </b-table-simple>

              <b-form-group label="Tests" label-for="tests-input">
                <b-form-textarea
                  id="tests-input"
                  :disabled="!element.canEdit"
                  v-model="element.tests"
                  rows="3"
                  max-rows="50"
                >
                </b-form-textarea>
                <b-form-invalid-feedback :state="validTests[0]">{{ validTests[1] }}</b-form-invalid-feedback>
              </b-form-group>

              <div class="mb-2">Belongs to Group</div>
              <SelectTable
                title="Add/remove Talent Group"
                :elementApi="elementApi"
                v-model="element.group"
                :disabled="!element.canEdit"
                :filterFunction="groupFilter"
                :showCreateNew="false"
                @apiCallError="addError"
              ></SelectTable>
            </div>
          </b-col>
        </b-row>

        <div v-if="element.isGroup === false">
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
        </div>

        <b-row class="mt-4">
          <b-col md="6">
            <SourceTable
              v-model="element.source"
              @isValid="validSources = $event"
              :disabled="!element.canEdit"
            ></SourceTable>
          </b-col>
          <b-col md="6">
            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Talent" />
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
            >
            </CreateSubmit>
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
import SelectTable from "./SelectTable.vue";
import SourceTable from "./SourceTable.vue";
import {
  compareTalent,
  generateEmptyTalent,
  generateNewTalent,
  TalentApi,
  talentAttributes,
} from "../../services/wh/talent";
import { authRequest } from "../../services/auth";
import CharacterModifiers from "./CharacterModifiers.vue";
import { generateEmptyModifiers } from "../../services/wh/characterModifiers";
import { validWhShortDesc, validWhTalentMaxRank } from "../../utils/validation/wh";

export default {
  name: "CreateTalent",
  mixins: [CreateElement2],
  components: {
    SourceTable,
    CharacterModifiers,
    SelectTable,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new TalentApi(authRequest),

      element: generateEmptyTalent(),
      elementOriginal: generateEmptyTalent(),

      attributeOptions: Object.keys(talentAttributes).map((key) => {
        return { value: parseInt(key), text: talentAttributes[key] };
      }),
      validAtt: true,
      validSources: true,
    };
  },
  created() {
    this.elementType = "talent";
    this.initializeElement();
  },
  watch: {
    "element.isGroup": function (newVal) {
      if (newVal === true) {
        this.element.group = [];
        this.element.tests = "";
        this.element.maxRank = 0;
        this.element.maxRankAtt = 0;
        this.element.modifiers = generateEmptyModifiers();
      }
    },
  },
  methods: {
    groupFilter(talent) {
      return talent.isGroup && talent.id !== this.id;
    },
    formModified() {
      return !compareTalent(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewTalent(canEdit);
      this.elementOriginal = generateNewTalent(canEdit);
    },
    validate() {
      return (
        this.validName[0] &&
        this.validDesc[0] &&
        this.validTests[0] &&
        this.validMaxRank[0] &&
        this.validAtt &&
        this.validSources
      );
    },
  },
  computed: {
    validTests() {
      return validWhShortDesc(this.element.tests);
    },
    validMaxRank() {
      return validWhTalentMaxRank(this.element.maxRank);
    },
  },
};
</script>

<style scoped>
.container select {
  min-width: 95px;
}
</style>
