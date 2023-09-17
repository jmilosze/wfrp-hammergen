<template>
  <div class="item">
    <b-container>
      <b-form id="edit-item" @submit.stop.prevent="submit">
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
            <b-form-group label="Name" label-for="name-input">
              <b-form-input id="name-input" :disabled="!element.canEdit" v-model="element.name" type="text">
              </b-form-input>
              <b-form-invalid-feedback :state="validName[0]">{{ validName[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Type" label-for="type-input">
              <b-form-select
                id="type-input"
                :disabled="!element.canEdit"
                :options="itemOptions"
                v-model="element.type"
                @change="resetItemStats"
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

            <b-form-group label="Price (in Brass Pennies)" label-for="price-input">
              <b-form-input
                id="price-input"
                :disabled="!element.canEdit"
                :number="true"
                v-model="element.price"
                type="text"
              >
              </b-form-input>
              <b-form-invalid-feedback :state="validPrice[0]">{{ validPrice[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Encumbrance" label-for="encumbrance-input">
              <b-form-input
                id="encumbrance-input"
                :disabled="!element.canEdit"
                :number="true"
                v-model="element.enc"
                type="text"
              >
              </b-form-input>
              <b-form-invalid-feedback :state="validEnc[0]">{{ validEnc[1] }}</b-form-invalid-feedback>
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
            <div v-if="element.type === 0">
              <div class="mb-2">Weapon Damage</div>
              <b-table-simple :responsive="true">
                <b-tr>
                  <b-td>
                    <div class="mt-1 text-nowrap">SB x</div>
                  </b-td>
                  <b-td>
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[0].dmgSbMult"
                        type="text"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validMeleeDmgMult[0]"
                        >{{ validMeleeDmgMult[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-td>
                  <b-td>
                    <div class="mt-1">+</div>
                  </b-td>
                  <b-td>
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[0].dmg"
                        type="number"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validMeleeDmg[0]"
                        >{{ validMeleeDmg[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
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
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[1].dmgSbMult"
                        type="text"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validRangedDmgMult[0]"
                        >{{ validRangedDmgMult[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-td>
                  <b-td>
                    <div class="mt-1">+</div>
                  </b-td>
                  <b-td>
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[1].dmg"
                        type="number"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validRangedDmg[0]"
                        >{{ validRangedDmg[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
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
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[1].rngSbMult"
                        type="text"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validRangedRngMult[0]"
                        >{{ validRangedRngMult[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-td>
                  <b-td>
                    <div class="mt-1">+</div>
                  </b-td>
                  <b-td>
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[1].rng"
                        type="number"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validRangedRng[0]"
                        >{{ validRangedRng[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
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
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[2].dmg"
                        type="number"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validAmmoDmg[0]">{{ validAmmoDmg[1] }} </b-form-invalid-feedback>
                    </b-form-group>
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
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[2].rngMult"
                        type="text"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validAmmoRngMult[0]"
                        >{{ validAmmoRngMult[1] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-td>
                  <b-td>
                    <div class="mt-1">+</div>
                  </b-td>
                  <b-td>
                    <b-form-group>
                      <b-form-input
                        :disabled="!element.canEdit"
                        :number="true"
                        v-model="element.stats[2].rng"
                        type="number"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback :state="validAmmoRng[0]">{{ validAmmoRng[1] }} </b-form-invalid-feedback>
                    </b-form-group>
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
              <b-form-group label="Armour Group" label-for="armour-type-input">
                <b-form-select
                  id="armour-type-input"
                  :disabled="!element.canEdit"
                  :options="armourOptions"
                  v-model="element.stats[3].group"
                >
                </b-form-select>
              </b-form-group>

              <b-form-group label="Armour Location" label-for="armour-location-input">
                <b-form-checkbox-group
                  id="armour-location-input"
                  :disabled="!element.canEdit"
                  :options="armourLocationOptions"
                  v-model="element.stats[3].location"
                >
                </b-form-checkbox-group>
              </b-form-group>

              <b-form-group label="Armour Points" label-for="armour-points-input">
                <b-form-input
                  id="armour-points-input"
                  :disabled="!element.canEdit"
                  :number="true"
                  v-model="element.stats[3].points"
                  type="number"
                >
                </b-form-input>
                <b-form-invalid-feedback :state="validAp[0]">{{ validAp[1] }} </b-form-invalid-feedback>
              </b-form-group>
            </div>

            <div v-if="element.type === 4">
              <b-form-group label="Container Capacity" label-for="capacity-input">
                <b-form-input
                  id="capacity-input"
                  :disabled="!element.canEdit"
                  v-model="element.stats[4].capacity"
                  type="number"
                  :number="true"
                >
                </b-form-input>
                <b-form-invalid-feedback :state="validCap[0]">{{ validCap[1] }} </b-form-invalid-feedback>
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

            <div v-if="element.type === 6">
              <div class="mb-2">Spells</div>
              <SelectTable
                title="Add/remove Spell"
                :elementApi="spellApi"
                v-model="element.stats[6].spells"
                :disabled="!element.canEdit || !validAll"
                @apiCallError="addError"
                @createNewElement="submitForm('spell')"
              ></SelectTable>
            </div>

            <div class="mb-2">Qualities and Flaws</div>
            <SelectTable
              title="Add/Remove Qualities and Flaws"
              :elementApi="propertyApi"
              v-model="element.properties"
              :disabled="!element.canEdit || !validAll"
              :filterFunction="propertyFilter"
              @apiCallError="addError"
              @createNewElement="submitForm('property')"
            ></SelectTable>
            <b-form-invalid-feedback :state="validAll">
              To modify Qualities And Flaws, correct invalid form fields.
            </b-form-invalid-feedback>
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
            <PublicElementBox v-if="element.canEdit" v-model="element.shared" elementName="Item" />
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
import CreateElement from "./CreateElement.vue";
import CreateSubmit from "./CreateSubmit.vue";
import SelectTable from "./SelectTable.vue";
import PublicElementBox from "./PublicElementBox.vue";
import SourceTable from "./SourceTable.vue";
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
  generateEmptyStats,
} from "../../services/wh/item";
import { authRequest } from "../../services/auth";
import { ItemPropertyApi } from "../../services/wh/itemproperty";
import { SpellApi } from "../../services/wh/spell";
import {
  validWhItemEnc,
  validWhItemDmg,
  validWhItemDmgMult,
  validWhItemPrice,
  validWhItemRngMult,
  validWhItemRng,
  validWhItemAp,
  validWhItemCap,
} from "../../utils/validation/wh";

export default {
  name: "CreateItem",
  mixins: [CreateElement],
  components: {
    SourceTable,
    SelectTable,
    CreateSubmit,
    PublicElementBox,
  },
  data() {
    return {
      elementApi: new ItemApi(authRequest),
      propertyApi: new ItemPropertyApi(authRequest),
      spellApi: new SpellApi(authRequest),

      element: generateEmptyItem(),
      elementOriginal: generateEmptyItem(),

      validSources: true,

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
      armourOptions: Object.keys(armorGroups).map((key) => {
        return { value: parseInt(key), text: armorGroups[key] };
      }),
      armourLocationOptions: Object.keys(armorLocations).map((key) => {
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
    validPrice() {
      return validWhItemPrice(this.element.price);
    },
    validEnc() {
      return validWhItemEnc(this.element.enc);
    },
    validMeleeDmgMult() {
      return validWhItemDmgMult(this.element.stats[0].dmgSbMult);
    },
    validMeleeDmg() {
      return validWhItemDmg(this.element.stats[0].dmg);
    },
    validRangedDmgMult() {
      return validWhItemDmgMult(this.element.stats[1].dmgSbMult);
    },
    validRangedDmg() {
      return validWhItemDmg(this.element.stats[1].dmg);
    },
    validRangedRngMult() {
      return validWhItemRngMult(this.element.stats[1].rngSbMult);
    },
    validRangedRng() {
      return validWhItemRng(this.element.stats[1].rng);
    },
    validAmmoRngMult() {
      return validWhItemRngMult(this.element.stats[2].rngMult);
    },
    validAmmoRng() {
      return validWhItemRng(this.element.stats[2].rng);
    },
    validAmmoDmg() {
      return validWhItemDmg(this.element.stats[2].dmg);
    },
    validAp() {
      return validWhItemAp(this.element.stats[3].points);
    },
    validCap() {
      return validWhItemCap(this.element.stats[4].capacity);
    },
    validAll() {
      return this.validate();
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
    resetItemStats() {
      this.element.stats = generateEmptyStats();
      this.element.properties = [];
    },
    validate() {
      return (
        this.validName[0] &&
        this.validDesc[0] &&
        this.validPrice[0] &&
        this.validMeleeDmgMult[0] &&
        this.validMeleeDmg[0] &&
        this.validRangedDmgMult[0] &&
        this.validRangedDmg[0] &&
        this.validRangedRngMult[0] &&
        this.validRangedRng[0] &&
        this.validAmmoRngMult[0] &&
        this.validAmmoRng[0] &&
        this.validAmmoDmg[0] &&
        this.validAp[0] &&
        this.validCap[0] &&
        this.validSources
      );
    },
  },
};
</script>

<style scoped>
.container input {
  min-width: 70px;
}
</style>
