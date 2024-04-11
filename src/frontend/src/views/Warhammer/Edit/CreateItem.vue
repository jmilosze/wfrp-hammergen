<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import {
  ammoGroupList,
  armourGroupList,
  armourLocationList,
  availabilityList,
  carryTypeList,
  Item,
  ItemApi,
  ItemType,
  itemTypeList,
  meleeGroupList,
  meleeReachList,
  printAmmoGroup,
  printArmourGroup,
  printArmourLocation,
  printAvailability,
  printCarryType,
  printItemType,
  printMeleeGroup,
  printMeleeReach,
  printRangedGroup,
  printWeaponHands,
  rangedGroupList,
  weaponHandsList,
} from "../../../services/wh/item.ts";
import { computed, ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import SourceTable from "../../../components/SourceTable.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import { useWhList } from "../../../composables/whList.ts";
import { ItemPropertyApi } from "../../../services/wh/itemproperty.ts";
import SelectTable from "../../../components/SelectTable.vue";
import MultipleCheckboxInput from "../../../components/MultipleCheckboxInput.vue";
import { SpellApi } from "../../../services/wh/spell.ts";

const props = defineProps<{
  id: string;
}>();

const newItem = new Item({
  name: "New item",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

const {
  wh,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newItem, new ItemApi(authRequest));

const propertyListUtils = useWhList(new ItemPropertyApi(authRequest));
propertyListUtils.loadWhList();

const spellListUtils = useWhList(new SpellApi(authRequest));
spellListUtils.loadWhList();

const propertyList = computed(() => {
  return propertyListUtils.whList.value.filter((x) => x.applicableTo.includes(wh.value.type));
});

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validPrice = computed(() => wh.value.validatePrice());
const validEnc = computed(() => wh.value.validateEnc());

const validMeleeSbDmgMult = computed(() => wh.value.validateMeleeDmgSbMult());
const validMeleeDmg = computed(() => wh.value.validateMeleeDmg());
const validRangedSbDmgMult = computed(() => wh.value.validateRangedDmgSbMult());
const validRangedDmg = computed(() => wh.value.validateRangedDmg());
const validRangedSbRngMult = computed(() => wh.value.validateRangedRngSbMult());
const validRangedRng = computed(() => wh.value.validateRangedRng());
const validAmmunitionDmg = computed(() => wh.value.validateAmmunitionDmg());
const validAmmunitionRngMult = computed(() => wh.value.validateAmmunitionRngMult());
const validAmmunitionRng = computed(() => wh.value.validateAmmunitionRng());
const validArmourPoints = computed(() => wh.value.validateArmourPoints());
const validContainerCapacity = computed(() => wh.value.validateContainerCapacity());

const typeOpts = itemTypeList.map((x) => ({ text: printItemType(x), value: x }));
const availOpts = availabilityList.map((x) => ({ text: printAvailability(x), value: x }));
const weaponHandsOpts = weaponHandsList.map((x) => ({ text: printWeaponHands(x), value: x }));
const meleeGroupOpts = meleeGroupList.map((x) => ({ text: printMeleeGroup(x), value: x }));
const meleeReachOpts = meleeReachList.map((x) => ({ text: printMeleeReach(x), value: x }));
const rangedGroupOpts = rangedGroupList.map((x) => ({ text: printRangedGroup(x), value: x }));
const ammunitionGroupOpts = ammoGroupList.map((x) => ({ text: printAmmoGroup(x), value: x }));
const ArmourLocationOpts = armourLocationList.map((x) => ({ text: printArmourLocation(x), value: x }));
const armourGroupOpts = armourGroupList.map((x) => ({ text: printArmourGroup(x), value: x }));
const carryTypeOpts = carryTypeList.map((x) => ({ text: printCarryType(x), value: x }));

watch(
  () => wh.value.type,
  () => {
    wh.value.resetDetails();
  },
);
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="propertyListUtils.apiError.value && propertyListUtils.showApiError.value"
      alertType="red"
      @click="propertyListUtils.showApiError.value = false"
    >
      {{ propertyListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="spellListUtils.apiError.value && spellListUtils.showApiError.value"
      alertType="red"
      @click="spellListUtils.showApiError.value = false"
    >
      {{ spellListUtils.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create trapping' : wh.canEdit ? 'Edit trapping' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <SelectInput v-model="wh.type" :options="typeOpts" :disabled="!wh.canEdit" title="Type" class="min-w-24" />
        <SelectInput
          v-model="wh.availability"
          :options="availOpts"
          :disabled="!wh.canEdit"
          title="Availability"
          class="min-w-24"
        />
        <FormInput
          v-model="wh.price"
          title="Price (in brass)"
          :validationStatus="validPrice"
          :disabled="!wh.canEdit"
          type="number"
        />
        <FormInput
          v-model="wh.enc"
          title="Encumbrance"
          :validationStatus="validEnc"
          :disabled="!wh.canEdit"
          type="number"
        />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
    <div class="flex-1">
      <div v-if="wh.type === ItemType.Melee" class="flex flex-col gap-4">
        <div>
          <p class="mb-1">Weapon damage</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">SB x</div>
            <FormInput
              v-model="wh.melee.dmgSbMult"
              :validationStatus="validMeleeSbDmgMult"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
            <div class="shrink-0 mx-4 pt-2">+</div>
            <FormInput
              v-model="wh.melee.dmg"
              :validationStatus="validMeleeDmg"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <SelectInput
          v-model="wh.melee.group"
          :options="meleeGroupOpts"
          :disabled="!wh.canEdit"
          title="Weapon group"
          class="min-w-24"
        />
        <SelectInput
          v-model="wh.melee.hands"
          :options="weaponHandsOpts"
          :disabled="!wh.canEdit"
          title="One/Two handed"
          class="min-w-24"
        />
        <SelectInput
          v-model="wh.melee.reach"
          :options="meleeReachOpts"
          :disabled="!wh.canEdit"
          title="Weapon reach"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Ranged" class="flex flex-col gap-4">
        <div>
          <p class="mb-1">Weapon damage</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">SB x</div>
            <FormInput
              v-model="wh.ranged.dmgSbMult"
              :validationStatus="validRangedSbDmgMult"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
            <div class="shrink-0 mx-4 pt-2">+</div>
            <FormInput
              v-model="wh.ranged.dmg"
              :validationStatus="validRangedDmg"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <div>
          <p class="mb-1">Weapon range</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">SB x</div>
            <FormInput
              v-model="wh.ranged.rngSbMult"
              :validationStatus="validRangedSbRngMult"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
            <div class="shrink-0 mx-4 pt-2">+</div>
            <FormInput
              v-model="wh.ranged.rng"
              :validationStatus="validRangedRng"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <SelectInput
          v-model="wh.ranged.group"
          :options="rangedGroupOpts"
          :disabled="!wh.canEdit"
          title="Weapon group"
          class="min-w-24"
        />
        <SelectInput
          v-model="wh.ranged.hands"
          :options="weaponHandsOpts"
          :disabled="!wh.canEdit"
          title="One/Two handed"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Ammunition" class="flex flex-col gap-4">
        <div>
          <p class="mb-1">Damage modification</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">Weapon +</div>
            <FormInput
              v-model="wh.ammunition.dmg"
              :validationStatus="validAmmunitionDmg"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <div>
          <p class="mb-1">Range modification</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">Weapon x</div>
            <FormInput
              v-model="wh.ammunition.rngMult"
              :validationStatus="validAmmunitionRngMult"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
            <div class="shrink-0 mx-4 pt-2">+</div>
            <FormInput
              v-model="wh.ammunition.rng"
              :validationStatus="validAmmunitionRng"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
        <SelectInput
          v-model="wh.ammunition.group"
          :options="ammunitionGroupOpts"
          :disabled="!wh.canEdit"
          title="Ammunition group"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Armour" class="flex flex-col gap-4">
        <MultipleCheckboxInput
          v-model="wh.armour.location"
          title="Armour location"
          :disabled="!wh.canEdit"
          :options="ArmourLocationOpts"
        />
        <FormInput
          v-model="wh.armour.points"
          title="Armour points"
          :validationStatus="validArmourPoints"
          type="number"
          :disabled="!wh.canEdit"
        />
        <SelectInput
          v-model="wh.armour.group"
          :options="armourGroupOpts"
          :disabled="!wh.canEdit"
          title="Armour group"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Container" class="flex flex-col gap-4">
        <FormInput
          v-model="wh.container.capacity"
          title="Container capacity"
          :validationStatus="validContainerCapacity"
          type="number"
          :disabled="!wh.canEdit"
        />
        <SelectInput
          v-model="wh.container.carryType"
          :options="carryTypeOpts"
          :disabled="!wh.canEdit"
          title="Can it be worn/carried?"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Other" class="flex flex-col gap-4">
        <SelectInput
          v-model="wh.other.carryType"
          :options="carryTypeOpts"
          :disabled="!wh.canEdit"
          title="Can it be worn/carried?"
          class="min-w-24"
        />
      </div>
      <div v-else-if="wh.type === ItemType.Grimoire" class="flex flex-col gap-4">
        <SelectTable
          modalId="grimoire"
          :disabled="!wh.canEdit"
          :initSelectedItems="wh.grimoire.spells"
          :itemList="spellListUtils.whList.value"
          title="Spells"
          modalTitle="Add/remove spells"
          :loading="spellListUtils.loading.value"
          class="mt-4"
          @createNew="openInNewTab('spell', { id: 'create' })"
          @reload="spellListUtils.loadWhList"
          @selected="(e) => wh.updateSpells(e.id, e.selected)"
        />
      </div>
      <SelectTable
        :disabled="!wh.canEdit"
        :initSelectedItems="wh.properties"
        :itemList="propertyList"
        title="Qualities and runes"
        modalTitle="Modify qualities and runes"
        :loading="propertyListUtils.loading.value"
        class="mt-4"
        @createNew="openInNewTab('property', { id: 'create' })"
        @reload="propertyListUtils.loadWhList"
        @selected="(e) => wh.updateProperties(e.id, e.selected)"
      />
    </div>
  </div>
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable :disabled="!wh.canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Trapping" :disabled="!wh.canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit my-2"
      @close="showSubmissionStatus = false"
    />

    <EditControls
      :saving="submissionState.status === 'inProgress'"
      list="items"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
