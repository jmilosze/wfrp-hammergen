<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { UnauthorizedError, useAuthStore } from "../../stores/auth.ts";
import { ref, Ref } from "vue";
import { CharacterApi } from "../../services/wh/character.ts";
import { authRequest } from "../../services/auth.ts";
import { CharacterFullToCsv, newCharacterFull } from "../../services/wh/characterFull.ts";
import ActionButton from "../../components/ActionButton.vue";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";
import { addSpaces } from "../../utils/string.ts";
import { useElSize } from "../../composables/viewSize.ts";
import { ViewSize } from "../../utils/viewSize.ts";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const authStore = useAuthStore();
const characterApi = new CharacterApi(authRequest);

const errors: Ref<string[]> = ref([]);
const character = ref(newCharacterFull());
await loadCharacter();

async function loadCharacter() {
  errors.value = [];
  try {
    character.value = await authStore.callAndLogoutIfUnauthorized(characterApi.getElementForDisplay)(props.id);
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      errors.value.push("Server Error.");
      throw error;
    }
  }
}

function saveJson() {
  const blob = new Blob([JSON.stringify(character.value, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.json`);
}

function saveCsv() {
  const blob = new Blob([CharacterFullToCsv(character.value)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.csv`);
}

function print() {
  const divContents = document.getElementById("character")?.innerHTML as string;
  const a = window.open("", "") as Window;
  a.document.write("<html>");
  a.document.write("<body >");
  a.document.write(divContents);
  a.document.write("</body></html>");
  a.document.close();
  a.print();
  a.close();
}

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);
</script>

<template>
  <Header title="Character details"> </Header>
  <div ref="contentContainerRef" class="flex flex-wrap">
    <ActionButton :size="'sm'" class="m-1" @click="saveCsv()">Download CSV</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="saveJson()">Download JSON</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="print()">Print</ActionButton>
    <ActionButton
      v-if="character.canEdit"
      :size="'sm'"
      class="m-1"
      @click="router.push({ name: 'character', params: { id: id } })"
      >Edit</ActionButton
    >
    <ActionButton :size="'sm'" class="m-1" @click="router.push({ name: 'characters' })">Back to list</ActionButton>
  </div>
  <div id="character">
    <div class="flex justify-between text-left" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
      <div class="m-2 grow">
        <div class="mb-1">Basic</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <td class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Name</span>
                  <span class="mr-3"> {{ addSpaces(character.name) }}</span>
                </div>
              </td>
              <td class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Species</span>
                  <span class="mr-3"> {{ addSpaces(character.species) }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Description</span>
                  <span class="mr-3"> {{ addSpaces(character.description) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Career</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <td class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Current</span>
                  <span class="mr-3"> {{ addSpaces(character.careerName) }}</span>
                </div>
              </td>
              <td class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Class</span>
                  <span class="mr-3"> {{ addSpaces(character.className) }}</span>
                </div>
              </td>
              <td class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Status</span>
                  <span class="mr-3"> {{ addSpaces(character.status + " " + character.standing) }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="border border-neutral-400 p-2">
                <div class="flex flex-wrap">
                  <span class="mr-3 font-semibold">Past Careers</span>
                  <span class="mr-3"> {{ addSpaces(character.pastCareers.join(", ")) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-between text-left" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
      <div class="m-2 grow">
        <div class="mb-1">Movement</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Base</th>
              <th class="border border-neutral-400 p-2 font-semibold">Walk</th>
              <th class="border border-neutral-400 p-2 font-semibold">Run</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2 mr-3">
                {{ character.movement }}
              </td>
              <td class="border border-neutral-400 p-2 mr-3">
                {{ character.walk }}
              </td>
              <td class="border border-neutral-400 p-2 mr-3">
                {{ character.run }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Wealth</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">D</th>
              <th class="border border-neutral-400 p-2 font-semibold">SS</th>
              <th class="border border-neutral-400 p-2 font-semibold">GC</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">
                {{ character.brass }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.silver }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.gold }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Fate</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Fate</th>
              <th class="border border-neutral-400 p-2 font-semibold">Fortune</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">
                {{ character.fate }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.fortune }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Resilience</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Resilience</th>
              <th class="border border-neutral-400 p-2 font-semibold">Resolve</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">
                {{ character.resilience }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.resolve }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-between text-left" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
      <div class="m-2 grow">
        <div class="mb-1">Other</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Wounds (unmodified by Hardy)</th>
              <th class="border border-neutral-400 p-2 font-semibold">Sin</th>
              <th class="border border-neutral-400 p-2 font-semibold">Corruption</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">
                {{ character.wounds }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.sin }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.corruption }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Experience</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Current</th>
              <th class="border border-neutral-400 p-2 font-semibold">Spent</th>
              <th class="border border-neutral-400 p-2 font-semibold">Total</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">
                {{ character.currentExp }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.spentExp }}
              </td>
              <td class="border border-neutral-400 p-2">
                {{ character.totalExp }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-between text-left" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
      <div class="m-2 grow">
        <div class="mb-1">Attributes 1</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold"></th>
              <th class="border border-neutral-400 p-2 font-semibold">WS</th>
              <th class="border border-neutral-400 p-2 font-semibold">BS</th>
              <th class="border border-neutral-400 p-2 font-semibold">S</th>
              <th class="border border-neutral-400 p-2 font-semibold">T</th>
              <th class="border border-neutral-400 p-2 font-semibold">I</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Base</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.WS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.BS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.S }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.T }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.I }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Other</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.WS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.BS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.S }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.T }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.I }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Advances</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.WS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.BS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.S }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.T }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.I }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Total</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.WS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.BS }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.S }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.T }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.I }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Attributes 2</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold"></th>
              <th class="border border-neutral-400 p-2 font-semibold">Ag</th>
              <th class="border border-neutral-400 p-2 font-semibold">Dex</th>
              <th class="border border-neutral-400 p-2 font-semibold">Int</th>
              <th class="border border-neutral-400 p-2 font-semibold">WP</th>
              <th class="border border-neutral-400 p-2 font-semibold">Fel</th>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Base</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.Ag }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.Dex }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.Int }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.WP }}</td>
              <td class="border border-neutral-400 p-2">{{ character.baseAttributes.Fel }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Other</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.Ag }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.Dex }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.Int }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.WP }}</td>
              <td class="border border-neutral-400 p-2">{{ character.otherAttributes.Fel }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Advances</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.Ag }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.Dex }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.Int }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.WP }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributeAdvances.Fel }}</td>
            </tr>
            <tr>
              <td class="border border-neutral-400 p-2">Total</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.Ag }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.Dex }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.Int }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.WP }}</td>
              <td class="border border-neutral-400 p-2">{{ character.attributes.Fel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-between text-left" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
      <div class="m-2 grow">
        <div class="mb-1">Basic Skills 1</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th colspan="2" class="border border-neutral-400 p-2 font-semibold">Attribute</th>
              <th class="border border-neutral-400 p-2 font-semibold">Adv</th>
              <th class="border border-neutral-400 p-2 font-semibold">Skill</th>
            </tr>
            <tr
              v-for="skill in character.basicSkills.slice(0, Math.floor(character.basicSkills.length / 2))"
              :key="skill.name"
            >
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.attributeName) }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.attributeValue }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.advances }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.skill }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Basic Skills 2</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th colspan="2" class="border border-neutral-400 p-2 font-semibold">Attribute</th>
              <th class="border border-neutral-400 p-2 font-semibold">Adv</th>
              <th class="border border-neutral-400 p-2 font-semibold">Skill</th>
            </tr>
            <tr
              v-for="skill in character.basicSkills.slice(Math.floor(character.basicSkills.length / 2))"
              :key="skill.name"
            >
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.attributeName) }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.attributeValue }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.advances }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.skill }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      v-if="character.advancedSkills.length || character.talents.length"
      class="flex justify-between text-left"
      :class="[isEqualOrGreater ? '' : 'flex-wrap']"
    >
      <div class="m-2 grow">
        <div class="mb-1">Advanced Skills</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th colspan="2" class="border border-neutral-400 p-2 font-semibold">Attribute</th>
              <th class="border border-neutral-400 p-2 font-semibold">Adv</th>
              <th class="border border-neutral-400 p-2 font-semibold">Skill</th>
            </tr>
            <tr v-for="skill in character.advancedSkills" :key="skill.name">
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(skill.attributeName) }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.attributeValue }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.advances }}</td>
              <td class="border border-neutral-400 p-2">{{ skill.skill }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="m-2 grow">
        <div class="mb-1">Talents</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th colspan="2" class="border border-neutral-400 p-2 font-semibold">Times taken</th>
            </tr>
            <tr v-for="talent in character.talents" :key="talent.name">
              <td class="border border-neutral-400 p-2">{{ addSpaces(talent.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ talent.rank }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="character.equippedArmor.length" class="text-left">
      <div class="m-2">
        <div class="mb-1">Equipped Armor</div>
        <table v-if="isEqualOrGreater" class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th class="border border-neutral-400 p-2 font-semibold">Locations</th>
              <th class="border border-neutral-400 p-2 font-semibold">Enc</th>
              <th class="border border-neutral-400 p-2 font-semibold">AP</th>
              <th class="border border-neutral-400 p-2 font-semibold">Qualities or Runes</th>
            </tr>
            <tr v-for="armour in character.equippedArmor" :key="armour.name">
              <td class="border border-neutral-400 p-2">{{ addSpaces(armour.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ armour.locations?.map((x) => addSpaces(x)).join(", ") }}</td>
              <td class="border border-neutral-400 p-2">{{ armour.enc }}</td>
              <td class="border border-neutral-400 p-2">{{ armour.ap }}</td>
              <td class="border border-neutral-400 p-2">
                {{ armour.qualitiesFlawsRunes?.map((x) => addSpaces(x)).join(", ") }}
              </td>
            </tr>
          </tbody>
        </table>
        <table v-else class="border-collapse w-full">
          <tbody>
            <tr v-for="armour in character.equippedArmor" :key="armour.name">
              <td class="border border-neutral-400 p-2">
                <div>
                  <span class="font-semibold">Name: </span>
                  <span>{{ addSpaces(armour.name) }}</span>
                </div>
                <div>
                  <span class="font-semibold">Locations: </span>
                  <span>{{ armour.locations?.map((x) => addSpaces(x)).join(", ") }}</span>
                </div>
                <div>
                  <span class="font-semibold">Enc: </span>
                  <span>{{ armour.enc }}</span>
                </div>
                <div>
                  <span class="font-semibold">AP: </span>
                  <span>{{ armour.ap }}</span>
                </div>
                <div>
                  <span class="font-semibold">Qualities or Runes: </span>
                  <span>{{ armour.qualitiesFlawsRunes?.map((x) => addSpaces(x)).join(", ") }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="character.equippedWeapon.length" class="text-left">
      <div class="m-2">
        <div class="mb-1">Equipped Weapon</div>
        <table class="border-collapse w-full">
          <tbody>
            <tr>
              <th class="border border-neutral-400 p-2 font-semibold">Name</th>
              <th class="border border-neutral-400 p-2 font-semibold">Group</th>
              <th class="border border-neutral-400 p-2 font-semibold">Enc</th>
              <th class="border border-neutral-400 p-2 font-semibold">Range or reach</th>
              <th class="border border-neutral-400 p-2 font-semibold">Damage</th>
              <th class="border border-neutral-400 p-2 font-semibold">Qualities or runes</th>
            </tr>
            <tr v-for="weapon in character.equippedWeapon" :key="weapon.name">
              <td class="border border-neutral-400 p-2">{{ addSpaces(weapon.name) }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(weapon.group) }}</td>
              <td class="border border-neutral-400 p-2">{{ weapon.enc }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(weapon.rng) }}</td>
              <td class="border border-neutral-400 p-2">{{ addSpaces(weapon.dmg) }}</td>
              <td class="border border-neutral-400 p-2">
                {{ weapon.qualitiesFlawsRunes?.map((x) => addSpaces(x)).join(", ") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
