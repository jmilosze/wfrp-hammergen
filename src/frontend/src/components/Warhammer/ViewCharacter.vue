<template>
  <div class="view-character">
    <b-container>
      <h1>Character Details</h1>

      <div v-if="errors.length" class="text-danger field-validation-error mt-3">
        <ul>
          <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
        </ul>
      </div>

      <b-row>
        <b-col>
          <div class="mb-3 mt-3">
            <b-button class="mt-2 mr-2" variant="primary" size="sm" @click="saveCsv">Download CSV</b-button>
            <b-button class="mt-2 mr-2" variant="primary" size="sm" @click="saveJson">Download JSON</b-button>
            <b-button class="mt-2 mr-2" variant="primary" size="sm" @click="print">Print</b-button>
            <b-button
              v-if="char.canEdit"
              variant="primary"
              class="mt-2 mr-2"
              size="sm"
              :to="{
                name: 'character',
                params: {
                  id: id,
                  goBackChain: [{ name: 'viewCharacter', id: id }],
                },
              }"
            >
              Edit
            </b-button>
            <b-button class="mt-2 mr-2" variant="primary" size="sm" @click="goBack()">Back to List</b-button>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <h6>Basic</h6>
          <b-table-simple bordered>
            <b-tbody>
              <b-tr>
                <b-td>
                  <span class="h6 mr-3">Name</span>
                  <span>{{ dispStr(char.name) }}</span>
                </b-td>
                <b-td>
                  <span class="h6 mr-3">Species</span>
                  <span>{{ dispStr(char.species) }}</span>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td colspan="2">
                  <span class="h6 mr-3">Description</span>
                  <span>{{ dispStr(char.description) }}</span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col md="6">
          <h6>Career</h6>
          <b-table-simple bordered>
            <b-tr>
              <b-td>
                <div class="h6 mr-3">Current</div>
                <span class="text-nowrap">{{ dispStr(char.careerName) }}</span>
                <span> {{ dispStr(char.careerLevelName) }}</span>
              </b-td>
              <b-td>
                <div class="h6 mr-3">Class</div>
                <div>{{ dispStr(char.className) }}</div>
              </b-td>
              <b-td>
                <div class="h6 mr-3">Status</div>
                <div class="text-nowrap">{{ dispStr(char.status + " " + char.standing) }}</div>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="3">
                <div class="h6 mr-3">Past Careers</div>
                <div>{{ dispLst(char.pastCareers) }}</div>
              </b-td>
            </b-tr>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <b-row>
            <b-col md="6">
              <div class="h6">Movement</div>
              <b-table-simple bordered>
                <tr>
                  <b-th>Movement</b-th>
                  <b-th>Walk</b-th>
                  <b-th>Run</b-th>
                </tr>
                <b-tr>
                  <b-td>{{ char.movement }}</b-td>
                  <b-td>{{ char.walk }}</b-td>
                  <b-td>{{ char.run }}</b-td>
                </b-tr>
              </b-table-simple>
            </b-col>

            <b-col>
              <div class="h6">Wealth</div>
              <b-table-simple bordered>
                <b-tr>
                  <b-th>D</b-th>
                  <b-th>SS</b-th>
                  <b-th>GC</b-th>
                </b-tr>
                <b-tr>
                  <b-td>{{ char.brass }}</b-td>
                  <b-td>{{ char.silver }}</b-td>
                  <b-td>{{ char.gold }}</b-td>
                </b-tr>
              </b-table-simple>
            </b-col>
          </b-row>
        </b-col>

        <b-col md="6">
          <div class="h6">Fate And Resilience</div>
          <b-table-simple bordered>
            <b-tr>
              <b-th>Fate</b-th>
              <b-th>Fortune</b-th>
              <b-th>Resilience</b-th>
              <b-th>Resolve</b-th>
            </b-tr>
            <b-tr>
              <b-td>{{ char.fate }}</b-td>
              <b-td>{{ char.fortune }}</b-td>
              <b-td>{{ char.resilience }}</b-td>
              <b-td>{{ char.resolve }}</b-td>
            </b-tr>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <div class="h6">Other</div>

          <b-table-simple bordered>
            <b-tr>
              <b-th>Wounds (unmodified by Hardy)</b-th>
              <b-th>Sin</b-th>
              <b-th>Corruption</b-th>
            </b-tr>
            <b-tr>
              <b-td>{{ char.wounds }}</b-td>
              <b-td>{{ char.sin }}</b-td>
              <b-td>{{ char.corruption }}</b-td>
            </b-tr>
          </b-table-simple>
        </b-col>

        <b-col md="6">
          <div class="h6">Experience</div>
          <b-table-simple bordered>
            <b-tr>
              <b-th>Current</b-th>
              <b-th>Spent</b-th>
              <b-th>Total</b-th>
            </b-tr>
            <b-tr>
              <b-td>{{ char.currentExp }}</b-td>
              <b-td>{{ char.spentExp }}</b-td>
              <b-td>{{ char.totalExp }}</b-td>
            </b-tr>
          </b-table-simple>
        </b-col>
      </b-row>

      <div class="h6">Attributes</div>
      <b-row>
        <b-col md="6">
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th></b-th>
                <b-th>WS</b-th>
                <b-th>BS</b-th>
                <b-th>S</b-th>
                <b-th>T</b-th>
                <b-th>I</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr>
                <b-td>Base</b-td>
                <b-td>{{ char.baseAttributes.WS }}</b-td>
                <b-td>{{ char.baseAttributes.BS }}</b-td>
                <b-td>{{ char.baseAttributes.S }}</b-td>
                <b-td>{{ char.baseAttributes.T }}</b-td>
                <b-td>{{ char.baseAttributes.I }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Other</b-td>
                <b-td>{{ char.otherAttributes.WS }}</b-td>
                <b-td>{{ char.otherAttributes.BS }}</b-td>
                <b-td>{{ char.otherAttributes.S }}</b-td>
                <b-td>{{ char.otherAttributes.T }}</b-td>
                <b-td>{{ char.otherAttributes.I }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Advances</b-td>
                <b-td>{{ char.attributeAdvances.WS }}</b-td>
                <b-td>{{ char.attributeAdvances.BS }}</b-td>
                <b-td>{{ char.attributeAdvances.S }}</b-td>
                <b-td>{{ char.attributeAdvances.T }}</b-td>
                <b-td>{{ char.attributeAdvances.I }}</b-td>
              </b-tr>
              <b-tr>
                <td>Total</td>
                <b-td>{{ char.attributes.WS }}</b-td>
                <b-td>{{ char.attributes.BS }}</b-td>
                <b-td>{{ char.attributes.S }}</b-td>
                <b-td>{{ char.attributes.T }}</b-td>
                <b-td>{{ char.attributes.I }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>

        <b-col md="6">
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th></b-th>
                <b-th>Ag</b-th>
                <b-th>Dex</b-th>
                <b-th>Int</b-th>
                <b-th>WP</b-th>
                <b-th>Fel</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr>
                <b-td>Base</b-td>
                <b-td>{{ char.baseAttributes.Ag }}</b-td>
                <b-td>{{ char.baseAttributes.Dex }}</b-td>
                <b-td>{{ char.baseAttributes.Int }}</b-td>
                <b-td>{{ char.baseAttributes.WP }}</b-td>
                <b-td>{{ char.baseAttributes.Fel }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Other</b-td>
                <b-td>{{ char.otherAttributes.Ag }}</b-td>
                <b-td>{{ char.otherAttributes.Dex }}</b-td>
                <b-td>{{ char.otherAttributes.Int }}</b-td>
                <b-td>{{ char.otherAttributes.WP }}</b-td>
                <b-td>{{ char.otherAttributes.Fel }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Advances</b-td>
                <b-td>{{ char.attributeAdvances.Ag }}</b-td>
                <b-td>{{ char.attributeAdvances.Dex }}</b-td>
                <b-td>{{ char.attributeAdvances.Int }}</b-td>
                <b-td>{{ char.attributeAdvances.WP }}</b-td>
                <b-td>{{ char.attributeAdvances.Fel }}</b-td>
              </b-tr>
              <b-tr>
                <td>Total</td>
                <b-td>{{ char.attributes.Ag }}</b-td>
                <b-td>{{ char.attributes.Dex }}</b-td>
                <b-td>{{ char.attributes.Int }}</b-td>
                <b-td>{{ char.attributes.WP }}</b-td>
                <b-td>{{ char.attributes.Fel }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <div class="h6">Basic Skills</div>
      <b-row>
        <b-col md="6">
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th colspan="2">Attribute</b-th>
                <b-th>Adv</b-th>
                <b-th>Skill</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="skill in char.basicSkills.slice(0, Math.floor(char.basicSkills.length / 2))" :key="skill.id">
                <b-td>{{ dispStr(skill.name) }}</b-td>
                <b-td>{{ skill.attributeName }}</b-td>
                <b-td>{{ skill.attributeValue }}</b-td>
                <b-td>{{ skill.advances }}</b-td>
                <b-td>{{ skill.skill }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>

        <b-col md="6">
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th colspan="2">Attribute</b-th>
                <b-th>Adv</b-th>
                <b-th>Skill</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="skill in char.basicSkills.slice(Math.floor(char.basicSkills.length / 2))" :key="skill.id">
                <b-td>{{ dispStr(skill.name) }}</b-td>
                <b-td>{{ skill.attributeName }}</b-td>
                <b-td>{{ skill.attributeValue }}</b-td>
                <b-td>{{ skill.advances }}</b-td>
                <b-td>{{ skill.skill }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.advancedSkills.length || char.talents.length">
        <b-col md="6" v-if="char.advancedSkills.length">
          <div class="h6">Advanced Skills</div>
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th colspan="2">Attribute</b-th>
                <b-th>Adv</b-th>
                <b-th>Skill</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="skill in char.advancedSkills" :key="skill.id">
                <b-td>{{ dispStr(skill.name) }}</b-td>
                <b-td>{{ skill.attributeName }}</b-td>
                <b-td>{{ skill.attributeValue }}</b-td>
                <b-td>{{ skill.advances }}</b-td>
                <b-td>{{ skill.skill }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
        <b-col md="6" v-if="char.talents.length">
          <div class="h6">Talents</div>
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Times taken</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="talent in char.talents" :key="talent.id">
                <b-td>{{ talent.name }}</b-td>
                <b-td>{{ talent.rank }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.equippedArmor.length">
        <b-col>
          <div class="h6">Equipped Armor</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Locations</b-th>
                <b-th>Enc</b-th>
                <b-th>AP</b-th>
                <b-th>Qualities</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="armor in char.equippedArmor" :key="armor.id">
                <b-td stacked-heading="Name">{{ dispItemName(armor) }}</b-td>
                <b-td stacked-heading="Locations">{{ dispLst(armor.locations) }}</b-td>
                <b-td stacked-heading="Encumbrance">{{ armor.enc }}</b-td>
                <b-td stacked-heading="Armor Points">{{ armor.ap }}</b-td>
                <b-td stacked-heading="Qualities">{{ dispLst(armor.qualities) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.equippedWeapon.length">
        <b-col>
          <div class="h6">Equipped Weapons</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Group</b-th>
                <b-th>Enc</b-th>
                <b-th>Range/Reach</b-th>
                <b-th>Damage</b-th>
                <b-th>Qualities</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="weapon in char.equippedWeapon" :key="weapon.id">
                <b-td stacked-heading="Name">{{ dispItemName(weapon) }}</b-td>
                <b-td stacked-heading="Group">{{ weapon.group }}</b-td>
                <b-td stacked-heading="Encumbrance">{{ weapon.enc }}</b-td>
                <b-td stacked-heading="Range/Reach">{{ weapon.rng }}</b-td>
                <b-td stacked-heading="Damage">{{ weapon.dmg }}</b-td>
                <b-td stacked-heading="Qualities">{{ dispLst(weapon.qualities) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.equippedOther.length">
        <b-col>
          <div class="h6">Other Equipped</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Enc</b-th>
                <b-th>Description</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in char.equippedOther" :key="item.id">
                <b-td stacked-heading="Name">{{ dispItemName(item) }}</b-td>
                <b-td stacked-heading="Encumbrance">{{ item.enc }}</b-td>
                <b-td stacked-heading="Description">{{ dispStr(item.desc) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.carried.length">
        <b-col>
          <div class="h6">Carried</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Enc</b-th>
                <b-th>Description</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in char.carried" :key="item.id">
                <b-td stacked-heading="Name">{{ dispItemName(item) }}</b-td>
                <b-td stacked-heading="Encumbrance">{{ item.enc }}</b-td>
                <b-td stacked-heading="Description">{{ item.desc }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.stored.length">
        <b-col>
          <div class="h6">Stored</div>
          <b-table-simple bordered stacked="md">
            <b-tbody>
              <b-tr>
                <b-td>{{ dispStr(char.stored.map((x) => dispItemName(x)).join(", ")) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>

        <b-col md="6">
          <div class="h6">Encumbrance (Equipped and Carried)</div>
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>Armor</b-th>
                <b-th>Weapon</b-th>
                <b-th>Other</b-th>
                <b-th>Carried</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-td>{{ char.encArmor }}</b-td>
              <b-td>{{ char.encWeapon }}</b-td>
              <b-td>{{ char.encOther }}</b-td>
              <b-td>{{ char.encCarried }}</b-td>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.spells.length">
        <b-col>
          <div class="h6">Spells/Prayers</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>CN</b-th>
                <b-th>Range</b-th>
                <b-th>Target</b-th>
                <b-th>Duration</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in char.spells" :key="item.id">
                <b-td stacked-heading="Name">{{ item.name }}</b-td>
                <b-td stacked-heading="CN">{{ item.cn ? item.cn : "N/A" }}</b-td>
                <b-td stacked-heading="Range">{{ item.range }}</b-td>
                <b-td stacked-heading="Target">{{ item.target }}</b-td>
                <b-td stacked-heading="Duration">{{ item.duration }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.mutations.length">
        <b-col>
          <div class="h6">Mutations</div>
          <b-table-simple bordered stacked="md">
            <b-thead>
              <b-tr>
                <b-th>Name</b-th>
                <b-th>Type</b-th>
                <b-th>Description</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in char.mutations" :key="item.id">
                <b-td stacked-heading="Name">{{ item.name }}</b-td>
                <b-td stacked-heading="Type">{{ item.type }}</b-td>
                <b-td stacked-heading="Description">{{ item.description }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>

      <b-row v-if="char.notes">
        <b-col>
          <div class="h6">Notes</div>
          <b-table-simple bordered stacked="md">
            <b-tbody>
              <b-tr>
                <b-td>{{ char.notes }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { addSpaces } from "../../utils/stringUtils";
import { logoutIfUnauthorized } from "../../utils/navigation";
import { authRequest } from "../../services/auth";
import { saveAs } from "file-saver";
import { CharacterApi, generateEmptyCharacterForDisplay, characterForDisplayToCsv } from "../../services/wh/character";

export default {
  name: "ViewCharacter",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      elementApi: new CharacterApi(authRequest),

      char: generateEmptyCharacterForDisplay(),

      errors: [],
      loaded: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    dispStr(stringToDisp) {
      return addSpaces(stringToDisp, 15);
    },
    dispLst(listToDisp) {
      return addSpaces(listToDisp.join(", "), 15);
    },
    dispItemName(itemToDisp) {
      return this.dispStr(itemToDisp.name + (itemToDisp.number > 1 ? ` (x${itemToDisp.number})` : ""));
    },
    saveCsv() {
      if (this.loaded) {
        let blob = new Blob([characterForDisplayToCsv(this.char)], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${this.char.name}.csv`);
      }
    },
    saveJson() {
      if (this.loaded) {
        let blob = new Blob([JSON.stringify(this.char, null, 2)], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${this.char.name}.json`);
      }
    },
    print() {
      window.print();
    },
    goBack() {
      this.$router.push({ name: "list_character" });
    },

    loadData() {
      logoutIfUnauthorized(this.elementApi.getElementForDisplay)(this.id)
        .then((character) => {
          this.char = character;
          this.loaded = true;
        })
        .catch((error) => {
          this.errors.push("Server Error.");
          throw error;
        });
    },
  },
};
</script>

<style scoped></style>
