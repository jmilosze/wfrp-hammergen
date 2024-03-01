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
import ViewCharacterTable from "../../components/ViewCharacterTable.vue";

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

const equippedArmourDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "locations", displayName: "Locations" },
    { name: "enc", displayName: "Enc" },
    { name: "ap", displayName: "AP" },
    { name: "qualities", displayName: "Qualities and runes" },
  ],
  items: character.value.equippedArmor.map((x) => ({
    name: addSpaces(x.name),
    locations: x.locations?.map((x) => addSpaces(x)).join(", "),
    enc: x.enc,
    ap: x.ap,
    qualities: x.qualitiesFlawsRunes?.map((x) => addSpaces(x)).join(", "),
  })),
});

const displayBasicSkills = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "attributeName", displayName: "Attribute", colspan: 2 },
    { name: "attributeValue", displayName: "Attribute", colspan: 0 },
    { name: "advances", displayName: "Adv" },
    { name: "skill", displayName: "Skill" },
  ],
  items: character.value.basicSkills.map((x) => ({
    name: addSpaces(x.name),
    attributeName: addSpaces(x.attributeName),
    attributeValue: x.attributeValue,
    advances: x.advances,
    skill: x.skill,
  })),
});

const displayAdvancedSkills = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "attributeName", displayName: "Attribute", colspan: 2 },
    { name: "attributeValue", displayName: "Attribute", colspan: 0 },
    { name: "advances", displayName: "Adv" },
    { name: "skill", displayName: "Skill" },
  ],
  items: character.value.advancedSkills.map((x) => ({
    name: addSpaces(x.name),
    attributeName: addSpaces(x.attributeName),
    attributeValue: x.attributeValue,
    advances: x.advances,
    skill: x.skill,
  })),
});

const displayTalents = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "rank", displayName: "Times taken" },
  ],
  items: character.value.talents.map((x) => ({
    name: addSpaces(x.name),
    rank: x.rank,
  })),
});

const equippedWeaponDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "group", displayName: "Group" },
    { name: "enc", displayName: "Enc" },
    { name: "rng", displayName: "Range / reach" },
    { name: "dmg", displayName: "Damage" },
    { name: "qualities", displayName: "Qualities and runes" },
  ],
  items: character.value.equippedWeapon.map((x) => ({
    name: addSpaces(x.name),
    group: addSpaces(x.group),
    enc: x.enc,
    ap: x.ap,
    rng: addSpaces(x.rng),
    dmg: addSpaces(x.dmg),
    qualities: x.qualitiesFlawsRunes?.map((x) => addSpaces(x)).join(", "),
  })),
});
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
      <ViewCharacterTable
        title="Basic Skills 1"
        :items="displayBasicSkills.items.slice(0, Math.floor(character.basicSkills.length / 2))"
        :fields="displayBasicSkills.fields"
        class="m-2 grow"
      >
      </ViewCharacterTable>

      <ViewCharacterTable
        title="Basic Skills 2"
        :items="displayBasicSkills.items.slice(Math.floor(character.basicSkills.length / 2))"
        :fields="displayBasicSkills.fields"
        class="m-2 grow"
      >
      </ViewCharacterTable>
    </div>
    <div
      v-if="character.advancedSkills.length || character.talents.length"
      class="flex justify-between text-left"
      :class="[isEqualOrGreater ? '' : 'flex-wrap']"
    >
      <ViewCharacterTable
        title="Advanced Skills"
        :items="displayAdvancedSkills.items"
        :fields="displayAdvancedSkills.fields"
        class="m-2 grow"
      >
      </ViewCharacterTable>
      <ViewCharacterTable
        title="Talents"
        :items="displayTalents.items"
        :fields="displayTalents.fields"
        class="m-2 grow"
      >
      </ViewCharacterTable>
    </div>
    <ViewCharacterTable
      title="Equipped Armor"
      :stack="!isEqualOrGreater"
      :items="equippedArmourDisp.items"
      :fields="equippedArmourDisp.fields"
      class="m-2"
    >
    </ViewCharacterTable>
    <ViewCharacterTable
      title="Equipped Weapon"
      :stack="!isEqualOrGreater"
      :items="equippedWeaponDisp.items"
      :fields="equippedWeaponDisp.fields"
      class="m-2"
    >
    </ViewCharacterTable>
  </div>
</template>

<style scoped></style>
