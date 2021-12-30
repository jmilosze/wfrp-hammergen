<template>
  <div class="item">
    <b-container>
      <validation-observer ref="observer" v-slot="{ handleSubmit, failed }">
        <b-form id="edit-item" @submit.stop.prevent="handleSubmit(submitForm)">
          <h1>{{ titlePrefix }} Item</h1>

          <b-alert variant="success" :fade="true" :show="saveSuccessCountdown" @dismissed="saveSuccessCountdown = 0"
            >Item saved successfully.
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
                  :options="itemOptions"
                  v-model="element.type"
                  @change="resetProperties"
                >
                </b-form-select>
              </b-form-group>

              <b-form-group label="Availability" label-for="availability-input">
                <b-form-select
                  id="availability-input"
                  :disabled="!element.canEdit"
                  :options="availabilityOptions"
                  v-model="element.availability"
                >
                </b-form-select>
              </b-form-group>

              <ValidationProvider
                v-slot="{ errors, valid }"
                :rules="{
                  required: true,
                  between: { min: 0, max: 1000000000 },
                }"
                name="Price (in Brass Pennies)"
              >
                <b-form-group label="Price (in Brass Pennies)" label-for="price-input">
                  <b-form-input
                    id="price-input"
                    :disabled="!element.canEdit"
                    :number="true"
                    v-model="element.price"
                    type="text"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors, valid }"
                :rules="{ required: true, between: { min: 0, max: 1000 } }"
                name="Encumbrance"
                v-show="carriable || element.type !== 5"
              >
                <b-form-group label="Encumbrance" label-for="encumbrance-input">
                  <b-form-input
                    id="encumbrance-input"
                    :disabled="!element.canEdit"
                    :number="true"
                    v-model="element.enc"
                    type="text"
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
            </b-col>
            <b-col md="6">
              <div v-if="element.type === 0">
                <div class="mb-2">Weapon Damage</div>
                <b-table-simple :responsive="true">
                  <b-tr>
                    <b-td>
                      <div class="mt-1 text-nowrap">SB x</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Damage Multiplier"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[0].dmgSbMult"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                    <b-td>
                      <div class="mt-1">+</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Damage"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[0].dmg"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                  </b-tr>
                </b-table-simple>

                <b-form-group label="Weapon Group" label-for="melee-type-input">
                  <b-form-select
                    id="melee-type-input"
                    :disabled="!element.canEdit"
                    :options="meleeOptions"
                    v-model="element.stats[0].group"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group label="One/Two Handed" label-for="melee-hands-input">
                  <b-form-select
                    id="melee-hands-input"
                    :disabled="!element.canEdit"
                    :options="handsOptions"
                    v-model="element.stats[0].hands"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group label="Weapon Reach" label-for="reach-input">
                  <b-form-select
                    id="reach-input"
                    :disabled="!element.canEdit"
                    :options="reachOptions"
                    v-model="element.stats[0].reach"
                  >
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-if="element.type === 1">
                <div class="mb-2">Weapon Damage</div>
                <b-table-simple :responsive="true">
                  <b-tr>
                    <b-td>
                      <div class="mt-1 text-nowrap">SB x</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Damage Multiplier"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[1].dmgSbMult"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                    <b-td>
                      <div class="mt-1">+</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Damage"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[1].dmg"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                  </b-tr>
                </b-table-simple>

                <div class="mb-2">Weapon Range</div>
                <b-table-simple :responsive="true">
                  <b-tr>
                    <b-td>
                      <div class="mt-1 text-nowrap">SB x</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Range Multiplier"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[1].rngSbMult"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                    <b-td>
                      <div class="mt-1">+</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Range"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[1].rng"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                  </b-tr>
                </b-table-simple>

                <b-form-group label="Weapon Group" label-for="ranged-type-input">
                  <b-form-select
                    id="ranged-type-input"
                    :disabled="!element.canEdit"
                    :options="rangedOptions"
                    v-model="element.stats[1].group"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group label="One/Two Handed" label-for="ranged-hands-input">
                  <b-form-select
                    id="ranged-hands-input"
                    :disabled="!element.canEdit"
                    :options="handsOptions"
                    v-model="element.stats[1].hands"
                  >
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-if="element.type === 2">
                <div class="mb-2">Damage Modification</div>
                <b-table-simple :responsive="true">
                  <b-tr>
                    <b-td>
                      <div class="mt-1 text-nowrap">Weapon</div>
                    </b-td>
                    <b-td>
                      <div class="mt-1">+</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Damage"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[2].dmg"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                  </b-tr>
                </b-table-simple>

                <div class="mb-2">Range Modification</div>
                <b-table-simple :responsive="true">
                  <b-tr>
                    <b-td>
                      <div class="mt-1 text-nowrap text-center">Weapon</div>
                    </b-td>
                    <b-td>
                      <div class="mt-1">x</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Range Multiplier"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[2].rngMult"
                            type="text"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                    <b-td>
                      <div class="mt-1">+</div>
                    </b-td>
                    <b-td>
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="Range"
                        :rules="{
                          required: true,
                          between: { min: 0, max: 1000 },
                          integer: true,
                        }"
                      >
                        <b-form-group>
                          <b-form-input
                            :disabled="!element.canEdit"
                            :number="true"
                            v-model="element.stats[2].rng"
                            type="number"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                            {{ errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </ValidationProvider>
                    </b-td>
                  </b-tr>
                </b-table-simple>

                <b-form-group label="Ammunition Group" label-for="ammunition-type-input">
                  <b-form-select
                    id="ammunition-type-input"
                    :disabled="!element.canEdit"
                    :options="ammunitionOptions"
                    v-model="element.stats[2].group"
                  >
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-if="element.type === 3">
                <b-form-group label="Armor Group" label-for="armor-type-input">
                  <b-form-select
                    id="armor-type-input"
                    :disabled="!element.canEdit"
                    :options="armorOptions"
                    v-model="element.stats[3].group"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group label="Armor Location" label-for="armor-location-input">
                  <b-form-checkbox-group
                    id="armor-location-input"
                    :disabled="!element.canEdit"
                    :options="armorLocationOptions"
                    v-model="element.stats[3].location"
                  >
                  </b-form-checkbox-group>
                </b-form-group>

                <ValidationProvider
                  v-slot="{ errors, valid }"
                  :rules="{
                    required: true,
                    between: { min: 0, max: 100 },
                    integer: true,
                  }"
                  name="Armor Points"
                >
                  <b-form-group label="Armor Points" label-for="armor-points-input">
                    <b-form-input
                      id="armor-points-input"
                      :disabled="!element.canEdit"
                      :number="true"
                      v-model="element.stats[3].points"
                      type="number"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div>

              <div v-if="element.type === 4">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  :rules="{
                    required: true,
                    between: { min: 0, max: 100 },
                    integer: true,
                  }"
                  name="Container Capacity"
                >
                  <b-form-group label="Container Capacity" label-for="capacity-input">
                    <b-form-input
                      id="capacity-input"
                      :disabled="!element.canEdit"
                      v-model="element.stats[4].capacity"
                      type="number"
                      :number="true"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback :state="invFeedState(errors, valid)">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group label="Wearable" label-for="wearable-container-input">
                    <b-form-select
                      id="wearable-container-input"
                      :disabled="!element.canEdit"
                      :options="[
                        { value: true, text: 'Yes' },
                        { value: false, text: 'No' },
                      ]"
                      v-model="element.stats[4].wearable"
                    >
                    </b-form-select>
                  </b-form-group>
                </ValidationProvider>
              </div>

              <div v-if="element.type === 5">
                <b-form-group label="Carriable" label-for="carriable-input">
                  <b-form-select
                    id="carriable-input"
                    :disabled="!element.canEdit"
                    :options="[
                      { value: true, text: 'Yes' },
                      { value: false, text: 'No' },
                    ]"
                    v-model="element.stats[5].carryType.carriable"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group label="Wearable" label-for="wearable-input" v-show="carriable">
                  <b-form-select
                    id="wearable-input"
                    :disabled="!element.canEdit"
                    :options="[
                      { value: true, text: 'Yes' },
                      { value: false, text: 'No' },
                    ]"
                    v-model="element.stats[5].carryType.wearable"
                  >
                  </b-form-select>
                </b-form-group>
              </div>

              <div class="mb-2">Qualities and Flaws</div>
              <SelectTable
                title="Add/Remove Qualities and Flaws"
                :elementApi="propertyApi"
                v-model="element.properties"
                :disabled="!element.canEdit || failed"
                :filterFunction="propertyFilter"
                @apiCallError="addError"
                @createNewElement="submitForm('property')"
              ></SelectTable>
              <b-form-invalid-feedback :state="!failed">
                To modify Qualities And Flaws, correct invalid form fields.
              </b-form-invalid-feedback>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Item" />

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
import CreateElement from "./CreateElement";
import CreateSubmit from "./CreateSubmit";
import SelectTable from "./SelectTable";
import PublicElementBox from "./PublicElementBox";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import {
  itemTypes,
  meleeGroups,
  rangedGroups,
  ammunitionGroups,
  armorGroups,
  armorLocations,
  meleeReach,
  weaponHands,
  itemAvailabilities,
  generateEmptyItem,
  generateNewItem,
  ItemApi,
  compareItem,
} from "../../services/wh/item";
import { authRequest } from "../../services/auth";
import { ItemPropertyApi } from "../../services/wh/itemproperty";

export default {
  name: "CreateItem",
  mixins: [CreateElement],
  components: {
    ValidationObserver,
    ValidationProvider,
    SelectTable,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new ItemApi(authRequest),
      propertyApi: new ItemPropertyApi(authRequest),

      element: generateEmptyItem(),
      elementOriginal: generateEmptyItem(),

      availabilityOptions: Object.keys(itemAvailabilities).map((key) => {
        return { value: parseInt(key), text: itemAvailabilities[key] };
      }),
      itemOptions: Object.keys(itemTypes).map((key) => {
        return { value: parseInt(key), text: itemTypes[key] };
      }),
      meleeOptions: Object.keys(meleeGroups).map((key) => {
        return { value: parseInt(key), text: meleeGroups[key] };
      }),
      handsOptions: Object.keys(weaponHands).map((key) => {
        return { value: parseInt(key), text: weaponHands[key] };
      }),
      reachOptions: Object.keys(meleeReach).map((key) => {
        return { value: parseInt(key), text: meleeReach[key] };
      }),
      rangedOptions: Object.keys(rangedGroups).map((key) => {
        return { value: parseInt(key), text: rangedGroups[key] };
      }),
      ammunitionOptions: Object.keys(ammunitionGroups).map((key) => {
        return { value: parseInt(key), text: ammunitionGroups[key] };
      }),
      armorOptions: Object.keys(armorGroups).map((key) => {
        return { value: parseInt(key), text: armorGroups[key] };
      }),
      armorLocationOptions: Object.keys(armorLocations).map((key) => {
        return { value: parseInt(key), text: armorLocations[key] };
      }),
    };
  },
  created() {
    this.elementType = "item";
    this.initializeElement();
  },
  computed: {
    carriable() {
      return this.element.stats[5].carryType.carriable;
    },
  },
  watch: {
    carriable(val) {
      if (!val) {
        this.element.enc = 0.0;
        this.element.stats[5].carryType.wearable = false;
      }
    },
  },
  methods: {
    propertyFilter(property) {
      return property.applicableTo.includes(this.element.type);
    },
    formModified() {
      return !compareItem(this.element, this.elementOriginal);
    },
    setElementToNew(canEdit) {
      this.element = generateNewItem(canEdit);
      this.elementOriginal = generateNewItem(canEdit);
    },
    resetProperties() {
      this.element.properties = [];
    },
  },
};
</script>

<style scoped>
.container input {
  min-width: 70px;
}
</style>