<template>
  <div class="career">
    <b-container>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form id="edit-talent" @submit.stop.prevent="handleSubmit(submitForm)">
          <h1>{{ titlePrefix }} Career</h1>

          <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
            >Career saved successfully.
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

              <b-form-group label="Species" label-for="species-input">
                <b-form-checkbox-group
                  id="species-input"
                  :disabled="!element.canEdit"
                  :options="speciesOptions"
                  v-model="element.species"
                >
                </b-form-checkbox-group>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group label="Class" label-for="class-input">
                <b-form-select
                  id="class-input"
                  :disabled="!element.canEdit"
                  :options="classOptions"
                  v-model="element.class"
                >
                </b-form-select>
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
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <div>
                Level 1
                <ValidationProvider v-slot="{ errors, valid }" :rules="nameValid" name="Level 1 Name">
                  <b-form-group label="Name" label-for="level-1-name-input">
                    <b-form-input
                      id="level-1-name-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelOne.name"
                      type="text"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>

                <b-form-group label="Attributes" label-for="lvl-1-att-input">
                  <b-form-checkbox-group
                    id="lvl-1-att-input"
                    :disabled="!element.canEdit"
                    :options="attributeOptions"
                    v-model="element.levelOne.attributes"
                  >
                  </b-form-checkbox-group>
                </b-form-group>

                <b-row>
                  <b-col sm="6">
                    <b-form-group label="Status" label-for="lvl-1-status-input">
                      <b-form-select
                        id="lvl-1-status-input"
                        :disabled="!element.canEdit"
                        :options="statusOptions"
                        v-model="element.levelOne.status"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group label="Standing" label-for="lvl-1-standing-input">
                      <b-form-select
                        id="lvl-1-standing-input"
                        :disabled="!element.canEdit"
                        :options="standingOptions"
                        v-model="element.levelOne.standing"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <ValidationProvider v-slot="{ errors, valid }" :rules="descValid" name="Level 1 Trappings">
                  <b-form-group label="Level 1 Trappings" label-for="lvl-1-trappings-input">
                    <b-form-textarea
                      id="lvl-1-trappings-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelOne.items"
                      rows="3"
                      max-rows="50"
                    >
                    </b-form-textarea>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div>
              <div>
                Level 2
                <ValidationProvider v-slot="{ errors, valid }" :rules="nameValid" name="Level 2 Name">
                  <b-form-group label="Name" label-for="level-2-name-input">
                    <b-form-input
                      id="level-2-name-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelTwo.name"
                      type="text"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>

                <b-form-group label="Attributes" label-for="lvl-2-att-input">
                  <b-form-checkbox-group
                    id="lvl-2-att-input"
                    :disabled="!element.canEdit"
                    :options="attributeOptions"
                    v-model="element.levelTwo.attributes"
                  >
                  </b-form-checkbox-group>
                </b-form-group>

                <b-row>
                  <b-col sm="6">
                    <b-form-group label="Status" label-for="lvl-2-status-input">
                      <b-form-select
                        id="lvl-2-status-input"
                        :disabled="!element.canEdit"
                        :options="statusOptions"
                        v-model="element.levelTwo.status"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group label="Standing" label-for="lvl-2-standing-input">
                      <b-form-select
                        id="lvl-2-standing-input"
                        :disabled="!element.canEdit"
                        :options="standingOptions"
                        v-model="element.levelTwo.standing"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <ValidationProvider v-slot="{ errors, valid }" :rules="descValid" name="Level 2 Trappings">
                  <b-form-group label="Level 2 Trappings" label-for="lvl-2-trappings-input">
                    <b-form-textarea
                      id="lvl-2-trappings-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelTwo.items"
                      rows="3"
                      max-rows="50"
                    >
                    </b-form-textarea>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div>
            </b-col>
            <b-col md="6">
              <div>
                Level 3
                <ValidationProvider v-slot="{ errors, valid }" :rules="nameValid" name="Level 3 Name">
                  <b-form-group label="Name" label-for="level-3-name-input">
                    <b-form-input
                      id="level-3-name-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelThree.name"
                      type="text"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>

                <b-form-group label="Attributes" label-for="lvl-3-att-input">
                  <b-form-checkbox-group
                    id="lvl-3-att-input"
                    :disabled="!element.canEdit"
                    :options="attributeOptions"
                    v-model="element.levelThree.attributes"
                  >
                  </b-form-checkbox-group>
                </b-form-group>

                <b-row>
                  <b-col sm="6">
                    <b-form-group label="Status" label-for="lvl-3-status-input">
                      <b-form-select
                        id="lvl-3-status-input"
                        :disabled="!element.canEdit"
                        :options="statusOptions"
                        v-model="element.levelThree.status"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group label="Standing" label-for="lvl-3-standing-input">
                      <b-form-select
                        id="lvl-3-standing-input"
                        :disabled="!element.canEdit"
                        :options="standingOptions"
                        v-model="element.levelThree.standing"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <ValidationProvider v-slot="{ errors, valid }" :rules="descValid" name="Level 3 Trappings">
                  <b-form-group label="Level 3 Trappings" label-for="lvl-3-trappings-input">
                    <b-form-textarea
                      id="lvl-3-trappings-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelThree.items"
                      rows="3"
                      max-rows="50"
                    >
                    </b-form-textarea>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div>
              <div>
                Level 4
                <ValidationProvider v-slot="{ errors, valid }" :rules="nameValid" name="Level 4 Name">
                  <b-form-group label="Name" label-for="level-4-name-input">
                    <b-form-input
                      id="level-4-name-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelFour.name"
                      type="text"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>

                <b-form-group label="Attributes" label-for="lvl-4-att-input">
                  <b-form-checkbox-group
                    id="lvl-4-att-input"
                    :disabled="!element.canEdit"
                    :options="attributeOptions"
                    v-model="element.levelFour.attributes"
                  >
                  </b-form-checkbox-group>
                </b-form-group>

                <b-row>
                  <b-col sm="6">
                    <b-form-group label="Status" label-for="lvl-4-status-input">
                      <b-form-select
                        id="lvl-4-status-input"
                        :disabled="!element.canEdit"
                        :options="statusOptions"
                        v-model="element.levelFour.status"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group label="Standing" label-for="lvl-4-standing-input">
                      <b-form-select
                        id="lvl-4-standing-input"
                        :disabled="!element.canEdit"
                        :options="standingOptions"
                        v-model="element.levelFour.standing"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>

                <ValidationProvider v-slot="{ errors, valid }" :rules="descValid" name="Level 4 Trappings">
                  <b-form-group label="Level 4 Trappings" label-for="lvl-4-trappings-input">
                    <b-form-textarea
                      id="lvl-4-trappings-input"
                      :disabled="!element.canEdit"
                      v-model="element.levelFour.items"
                      rows="3"
                      max-rows="50"
                    >
                    </b-form-textarea>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <div class="mb-2">Skills</div>
              <CareerSelectTable
                title="Add/remove Skill"
                :elementApi="skillApi"
                :disabled="!element.canEdit"
                @apiCallError="addError"
                :level1.sync="element.levelOne.skills"
                :level2.sync="element.levelTwo.skills"
                :level3.sync="element.levelThree.skills"
                :level4.sync="element.levelFour.skills"
                @createNewElement="submitForm('skill')"
              ></CareerSelectTable>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <div class="mb-2">Talents</div>
              <CareerSelectTable
                title="Add/remove Talent"
                :elementApi="talentApi"
                :disabled="!element.canEdit"
                @apiCallError="addError"
                :level1.sync="element.levelOne.talents"
                :level2.sync="element.levelTwo.talents"
                :level3.sync="element.levelThree.talents"
                :level4.sync="element.levelFour.talents"
                @createNewElement="submitForm('talent')"
              ></CareerSelectTable>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Career" />

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
import CreateElement from "../CreateElement.vue";
import CreateSubmit from "../CreateSubmit.vue";
import CareerSelectTable from "./CareerSelectTable.vue";
import PublicElementBox from "../PublicElementBox.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { SkillApi } from "../../../services/wh/skill";
import { TalentApi } from "../../../services/wh/talent";
import {
  CareerApi,
  generateEmptyCareer,
  statusStandings,
  statusTiers,
  careerClasses,
  compareCareer,
  generateNewCareer,
} from "../../../services/wh/career";
import { attributes } from "../../../services/wh/character";
import { species } from "../../../services/wh/character";
import { authRequest } from "../../../services/auth";

export default {
  name: "CreateCareer",
  mixins: [CreateElement],
  components: {
    ValidationObserver,
    ValidationProvider,
    CreateSubmit,
    CareerSelectTable,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new CareerApi(authRequest),
      talentApi: new TalentApi(authRequest),
      skillApi: new SkillApi(authRequest),

      element: generateEmptyCareer(),
      elementOriginal: generateEmptyCareer(),

      speciesOptions: Object.keys(species).map((key) => {
        return { value: parseInt(key), text: species[key] };
      }),

      classOptions: Object.keys(careerClasses).map((key) => {
        return { value: parseInt(key), text: careerClasses[key] };
      }),

      statusOptions: Object.keys(statusTiers).map((key) => {
        return { value: parseInt(key), text: statusTiers[key] };
      }),

      standingOptions: Object.keys(statusStandings).map((key) => {
        return { value: parseInt(key), text: statusStandings[key] };
      }),

      attributeOptions: Object.keys(attributes).map((key) => {
        return { value: parseInt(key), text: attributes[key] };
      }),
    };
  },
  created() {
    this.elementType = "career";
    this.initializeElement();
  },
  methods: {
    formModified() {
      return !compareCareer(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewCareer(canEdit);
      this.elementOriginal = generateNewCareer(canEdit);
    },
  },
};
</script>

<style scoped>
.container input {
  min-width: 70px;
}

.container select {
  min-width: 95px;
}
</style>
