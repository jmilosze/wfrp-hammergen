<template>
  <div class="spell">
    <b-container>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form id="edit-spell" @submit.stop.prevent="handleSubmit(submitForm)">
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
                  :options="spellTypeOptions"
                  v-model="element.type"
                >
                </b-form-select>
              </b-form-group>

              <ValidationProvider
                v-slot="{ errors, valid }"
                :rules="{
                  required: true,
                  between: { min: 0, max: 99 },
                  integer: true,
                }"
                name="Casting Number"
                v-show="element.type === 'spell'"
              >
                <b-form-group label="Casting Number" label-for="cn-input">
                  <b-form-input
                    id="cn-input"
                    :disabled="!element.canEdit"
                    :number="true"
                    v-model="element.cn"
                    type="number"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

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
              <ValidationProvider v-slot="{ errors, valid }" :rules="descShortValid" name="Range">
                <b-form-group label="Range" label-for="range-input">
                  <b-form-input id="range-input" :disabled="!element.canEdit" v-model="element.range" type="text">
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" :rules="descShortValid" name="Target">
                <b-form-group label="Target" label-for="target-input">
                  <b-form-input id="target-input" :disabled="!element.canEdit" v-model="element.target" type="text">
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" :rules="descShortValid" name="Duration">
                <b-form-group label="Duration" label-for="duration-input">
                  <b-form-input id="duration-input" :disabled="!element.canEdit" v-model="element.duration" type="text">
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
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
import { SpellApi, generateEmptySpell, generateNewSpell, spellTypes, compareSpell } from "../../services/wh/spell";
import { authRequest } from "../../services/auth";

export default {
  name: "CreateSpell",
  mixins: [CreateElement2],
  components: {
    ValidationObserver,
    ValidationProvider,
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
  },
};
</script>

<style scoped></style>
