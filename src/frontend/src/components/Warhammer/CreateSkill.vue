<template>
  <div class="skill">
    <b-container>
      <b-form id="edit-talent" @submit.stop.prevent="submit">
        <h1>{{ titlePrefix }} Skill</h1>

        <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
          >Skill saved successfully.
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

            <b-form-group label="Individual Skill or Group of Skills?" label-for="is-group-input">
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

            <b-form-group label="Attribute" label-for="attribute-input">
              <b-form-select
                id="attribute-input"
                :disabled="!element.canEdit"
                :options="attributeOptions"
                v-model="element.attribute"
              >
              </b-form-select>
            </b-form-group>

            <b-form-group label="Type" label-for="type-input">
              <b-form-select
                id="type-input"
                :disabled="!element.canEdit"
                :options="skillTypeOptions"
                v-model="element.type"
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
            <b-form-group label="Display if Skill/Group not taken?" label-for="can-edit-input">
              <b-form-select
                id="can-edit-input"
                :disabled="!element.canEdit"
                :options="[
                  { value: true, text: 'Yes' },
                  { value: false, text: 'No' },
                ]"
                v-model="element.displayZero"
              >
              </b-form-select>
            </b-form-group>
            <div v-if="element.isGroup === false">
              <div class="mb-2">Belongs to Group</div>
              <SelectTable
                title="Add/remove Skill Group"
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

        <b-row>
          <b-col md="6">
            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Skill" />

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
import CreateElement from "./CreateElement.vue";
import CreateSubmit from "./CreateSubmit.vue";
import SelectTable from "./SelectTable.vue";
import PublicElementBox from "./PublicElementBox.vue";
import {
  generateEmptySkill,
  SkillApi,
  skillTypesGroup,
  skillTypesIndividual,
  skillAttributeTypesIndividual,
  skillAttributeTypesGroup,
  compareSkill,
  generateNewSkill,
} from "../../services/wh/skill";
import { authRequest } from "../../services/auth";
import { invertObj } from "../../utils/objectUtils";

const attributeOptionsIndividual = Object.keys(skillAttributeTypesIndividual).map((key) => {
  return { value: parseInt(key), text: skillAttributeTypesIndividual[key] };
});

const attributeOptionsGroup = Object.keys(skillAttributeTypesGroup).map((key) => {
  return { value: parseInt(key), text: skillAttributeTypesGroup[key] };
});

const skillOptionsIndividual = Object.keys(skillTypesIndividual).map((key) => {
  return { value: parseInt(key), text: skillTypesIndividual[key] };
});

const skillOptionsGroup = Object.keys(skillTypesGroup).map((key) => {
  return { value: parseInt(key), text: skillTypesGroup[key] };
});

export default {
  name: "CreateSkill",
  mixins: [CreateElement],
  components: {
    SelectTable,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new SkillApi(authRequest),

      element: generateEmptySkill(),
      elementOriginal: generateEmptySkill(),

      attributeOptions: attributeOptionsIndividual,
      skillTypeOptions: skillOptionsIndividual,
    };
  },
  created() {
    this.elementType = "skill";
    this.initializeElement();
  },
  watch: {
    "element.isGroup": function (newVal) {
      if (newVal === true) {
        this.skillTypeOptions = skillOptionsGroup;
        this.attributeOptions = attributeOptionsGroup;
      } else {
        this.element.group = [];

        if (skillTypesGroup[this.element.type] === "Mixed") {
          this.element.type = invertObj(skillTypesIndividual)["Basic"];
        }
        this.skillTypeOptions = skillOptionsIndividual;

        if (skillAttributeTypesGroup[this.element.attribute] === "Various") {
          this.element.attribute = invertObj(skillAttributeTypesIndividual)["WS"];
        }
        this.attributeOptions = attributeOptionsIndividual;
      }
    },
  },
  methods: {
    groupFilter(skill) {
      return skill.isGroup && skill.id !== this.id;
    },
    formModified() {
      return !compareSkill(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewSkill(canEdit);
      this.elementOriginal = generateNewSkill(canEdit);
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
