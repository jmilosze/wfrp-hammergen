<template>
  <div class="spell">
    <b-container>
      <b-form id="edit-spell" @submit.stop.prevent="submit">
        <h1>{{ titlePrefix }} Prayer or Spell</h1>

        <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
          >Prayer/Spell saved successfully.
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
                :options="spellTypeOptions"
                v-model="element.type"
                @change="resetCn"
              ></b-form-select>
            </b-form-group>

            <b-form-group label="Casting Number" label-for="cn-input" v-show="element.type === 'spell'">
              <b-form-input
                id="cn-input"
                :disabled="!element.canEdit"
                :number="true"
                v-model="element.cn"
                type="number"
              ></b-form-input>
              <b-form-invalid-feedback :state="validCn[0]">{{ validCn[1] }}</b-form-invalid-feedback>
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

            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Spell" />

            <CreateSubmit
              :showAddAnother="showAddAnother"
              :disabled="!element.canEdit"
              :submitting="submitting"
              @goBack="goBack"
              v-model="addAnother"
            ></CreateSubmit>
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
      </b-form>
    </b-container>
  </div>
</template>

<script>
import CreateElement2 from "./CreateElement.vue";
import CreateSubmit from "./CreateSubmit.vue";
import PublicElementBox from "./PublicElementBox.vue";
import { SpellApi, generateEmptySpell, generateNewSpell, spellTypes, compareSpell } from "../../services/wh/spell";
import { authRequest } from "../../services/auth";
import { validWhCastingNumber, validWhShortDesc } from "../../utils/validation/wh";

export default {
  name: "CreateSpell",
  mixins: [CreateElement2],
  components: {
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new SpellApi(authRequest),

      element: generateEmptySpell(),
      elementOriginal: generateEmptySpell(),

      spellTypeOptions: Object.keys(spellTypes).map((key) => {
        return { value: key, text: spellTypes[key] };
      }),
    };
  },
  created() {
    this.elementType = "spell";
    this.initializeElement();
  },
  methods: {
    formModified() {
      return !compareSpell(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewSpell(canEdit);
      this.elementOriginal = generateNewSpell(canEdit);
    },
    validate() {
      return (
        this.validName[0] &&
        this.validDesc[0] &&
        this.validRange[0] &&
        this.validTarget[0] &&
        this.validDuration[0] &&
        this.validCn[0]
      );
    },
    resetCn() {
      this.element.cn = 0;
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
    validCn() {
      return validWhCastingNumber(this.element.cn);
    },
  },
};
</script>

<style scoped></style>
