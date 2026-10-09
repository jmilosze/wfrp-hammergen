<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { validFloatFn, validIntegerFn } from "../../../services/wh/core/validators.ts";
import { Visibility } from "../../../services/wh/core/entity.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { ValidationStatus } from "../../../utils/validation.ts";
import { authRequest } from "../../../services/auth.ts";
import {
  ammoGroupList,
  armourGroupsByEdition,
  armourLocationList,
  availabilityList,
  BRASS_PER_GOLD,
  BRASS_PER_SILVER,
  brassToCoins,
  carryTypeList,
  type Coins,
  coinsToBrass,
  Item,
  itemApi,
  ItemType,
  itemTypeList,
  meleeGroupsByEdition,
  meleeReachList,
  printAmmoGroup,
  printArmourGroup,
  printArmourLocation,
  printAvailability,
  printCarryType,
  printItemType,
  printMeleeGroup,
  printMeleeReach,
  printPrice,
  printRangedGroup,
  printWeaponHands,
  rangedGroupList,
  weaponHandsList,
} from "../../../services/wh/content/item.ts";
import { computed, ref, watch } from "vue";
import FormInput from "../../../components/FormInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import SourceTable from "../../../components/SourceTable.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import { useWhList } from "../../../composables/whList.ts";
import { itemPropertyApi } from "../../../services/wh/content/itemproperty.ts";
import SelectTable from "../../../components/SelectTable.vue";
import MultipleCheckboxInput from "../../../components/MultipleCheckboxInput.vue";
import { spellApi } from "../../../services/wh/content/spell.ts";
import { runeApi } from "../../../services/wh/content/rune.ts";
import SelectIdNumberTable from "../../../components/SelectIdNumberTable.vue";
import SelectIdValueTable from "../../../components/SelectIdValueTable.vue";

const props = defineProps<{
  id: string;
}>();

const newItem = new Item({
  name: "New item",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const {
  wh,
  edition,
  hasVariant,
  addVariant,
  watchWh,
  canEdit,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newItem, itemApi(authRequest));

const propertyListUtils = useWhList(itemPropertyApi(authRequest), edition);
propertyListUtils.loadWhList();

const spellListUtils = useWhList(spellApi(authRequest), edition);
spellListUtils.loadWhList();

const runeListUtils = useWhList(runeApi(authRequest), edition);
runeListUtils.loadWhList();

const propertyList = computed(() => {
  return propertyListUtils.whList.value.filter((x) => x.applicableTo.includes(wh.value.type));
});

const runeList = computed(() => {
  return runeListUtils.whList.value.filter((x) => x.applicableTo.includes(wh.value.type));
});

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validEnc = computed(() => wh.value.validateEnc());

const priceGold = ref(0);
const priceSilver = ref(0);
const priceBrass = ref(0);

const MAX_PRICE_GOLD = 100000000;
const MAX_PRICE_BRASS = MAX_PRICE_GOLD * BRASS_PER_GOLD;
const MAX_PRICE_SILVER = Math.floor(MAX_PRICE_BRASS / BRASS_PER_SILVER);

// An empty number input emits NaN; treat it as 0 coins.
function coinValue(value: number): number {
  return Number.isNaN(value) ? 0 : value;
}

function currentCoins(): Coins {
  return {
    gold: coinValue(priceGold.value),
    silver: coinValue(priceSilver.value),
    brass: coinValue(priceBrass.value),
  };
}

function validCoin(value: number, max: number, integer: boolean): ValidationStatus {
  if (Number.isNaN(value)) {
    return { valid: true, message: "" };
  }
  return integer ? validIntegerFn(value, 0, max) : validFloatFn(value, 0, max);
}

const validPriceGold = computed(() => validCoin(priceGold.value, MAX_PRICE_GOLD, true));
const validPriceSilver = computed(() => validCoin(priceSilver.value, MAX_PRICE_SILVER, true));
const validPriceBrass = computed(() => validCoin(priceBrass.value, MAX_PRICE_BRASS, false));
const validCoins = computed(
  () => validPriceGold.value.valid && validPriceSilver.value.valid && validPriceBrass.value.valid,
);

const validPrice = computed<ValidationStatus>(() => {
  if (wh.value.validatePrice().valid) {
    return { valid: true, message: "" };
  }
  return {
    valid: false,
    message: `Total price must be at most ${MAX_PRICE_GOLD.toLocaleString("en-GB")} GC.`,
  };
});

watch([priceGold, priceSilver, priceBrass], () => {
  if (!validCoins.value) {
    wh.value.price = Number.NaN;
    return;
  }
  wh.value.price = coinsToBrass(currentCoins());
});

watch(
  () => wh.value.price,
  (newPrice) => {
    if (Number.isNaN(newPrice) || newPrice === coinsToBrass(currentCoins())) {
      return;
    }
    const coins = brassToCoins(newPrice);
    priceGold.value = coins.gold;
    priceSilver.value = coins.silver;
    priceBrass.value = coins.brass;
  },
  { immediate: true },
);

const formattedPrice = computed(() => (Number.isNaN(wh.value.price) ? "—" : printPrice(wh.value.price)));

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
const validRunes = computed(() => wh.value.validateRunes());

const typeOpts = itemTypeList.map((x) => ({ text: printItemType(x), value: x }));
const availOpts = availabilityList.map((x) => ({ text: printAvailability(x), value: x }));
const weaponHandsOpts = weaponHandsList.map((x) => ({ text: printWeaponHands(x), value: x }));
const meleeGroupOpts = computed(() =>
  meleeGroupsByEdition[edition.value].map((x) => ({ text: printMeleeGroup(x), value: x })),
);
const meleeReachOpts = meleeReachList.map((x) => ({ text: printMeleeReach(x), value: x }));
const rangedGroupOpts = rangedGroupList.map((x) => ({ text: printRangedGroup(x), value: x }));
const ammunitionGroupOpts = ammoGroupList.map((x) => ({ text: printAmmoGroup(x), value: x }));
const ArmourLocationOpts = armourLocationList.map((x) => ({ text: printArmourLocation(x), value: x }));
const armourGroupOpts = computed(() =>
  armourGroupsByEdition[edition.value].map((x) => ({ text: printArmourGroup(x), value: x })),
);
const carryTypeOpts = carryTypeList.map((x) => ({ text: printCarryType(x), value: x }));

watchWh(
  (w) => w.type,
  () => {
    wh.value.resetDetails();
  },
);
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="propertyListUtils.apiError.value && propertyListUtils.showApiError.value"
      alertType="red"
      @close="propertyListUtils.showApiError.value = false"
    >
      {{ propertyListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="spellListUtils.apiError.value && spellListUtils.showApiError.value"
      alertType="red"
      @close="spellListUtils.showApiError.value = false"
    >
      {{ spellListUtils.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create trapping' : canEdit ? 'Edit trapping' : wh.name" />
  <EditorEditionSelector
    v-model="edition"
    :hasVariant="hasVariant"
    :canEdit="canEdit"
    propertyName="Trapping"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <SelectInput v-model="wh.type" :options="typeOpts" :disabled="!canEdit" title="Type" class="min-w-24" />
          <SelectInput
            v-model="wh.availability"
            :options="availOpts"
            :disabled="!canEdit"
            title="Availability"
            class="min-w-24"
          />
          <p class="-mb-3">Price</p>
          <div class="border border-neutral-300 rounded p-2">
            <div class="flex flex-col @2xl:flex-row gap-4">
              <FormInput
                v-model="priceGold"
                type="number"
                title="Gold (GC)"
                :validationStatus="validPriceGold"
                :disabled="!canEdit"
                class="flex-1"
              />
              <FormInput
                v-model="priceSilver"
                type="number"
                title="Silver (/-)"
                :validationStatus="validPriceSilver"
                :disabled="!canEdit"
                class="flex-1"
              />
              <FormInput
                v-model="priceBrass"
                type="number"
                title="Brass (d)"
                :validationStatus="validPriceBrass"
                :disabled="!canEdit"
                class="flex-1"
              />
            </div>
            <div class="text-xs text-neutral-500 mt-2">Total: {{ formattedPrice }}</div>
            <div v-if="!validPrice.valid && validCoins" role="alert" class="text-sm text-red-600 mt-1">
              {{ validPrice.message }}
            </div>
          </div>
          <FormInput
            v-model="wh.enc"
            title="Encumbrance"
            :validationStatus="validEnc"
            :disabled="!canEdit"
            type="number"
          />
          <FormTextarea
            v-model="wh.description"
            title="Description"
            :validationStatus="validDesc"
            :disabled="!canEdit"
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
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
              <div class="shrink-0 mx-4 pt-2">+</div>
              <FormInput
                v-model="wh.melee.dmg"
                :validationStatus="validMeleeDmg"
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
            </div>
          </div>
          <SelectInput
            v-model="wh.melee.group"
            :options="meleeGroupOpts"
            :disabled="!canEdit"
            title="Weapon group"
            class="min-w-24"
          />
          <SelectInput
            v-model="wh.melee.hands"
            :options="weaponHandsOpts"
            :disabled="!canEdit"
            title="One/Two handed"
            class="min-w-24"
          />
          <SelectInput
            v-model="wh.melee.reach"
            :options="meleeReachOpts"
            :disabled="!canEdit"
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
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
              <div class="shrink-0 mx-4 pt-2">+</div>
              <FormInput
                v-model="wh.ranged.dmg"
                :validationStatus="validRangedDmg"
                :disabled="!canEdit"
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
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
              <div class="shrink-0 mx-4 pt-2">+</div>
              <FormInput
                v-model="wh.ranged.rng"
                :validationStatus="validRangedRng"
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
            </div>
          </div>
          <SelectInput
            v-model="wh.ranged.group"
            :options="rangedGroupOpts"
            :disabled="!canEdit"
            title="Weapon group"
            class="min-w-24"
          />
          <SelectInput
            v-model="wh.ranged.hands"
            :options="weaponHandsOpts"
            :disabled="!canEdit"
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
                :disabled="!canEdit"
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
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
              <div class="shrink-0 mx-4 pt-2">+</div>
              <FormInput
                v-model="wh.ammunition.rng"
                :validationStatus="validAmmunitionRng"
                :disabled="!canEdit"
                type="number"
                class="min-w-14"
              />
            </div>
          </div>
          <SelectInput
            v-model="wh.ammunition.group"
            :options="ammunitionGroupOpts"
            :disabled="!canEdit"
            title="Ammunition group"
            class="min-w-24"
          />
        </div>
        <div v-else-if="wh.type === ItemType.Armour" class="flex flex-col gap-4">
          <MultipleCheckboxInput
            v-model="wh.armour.location"
            title="Armour location"
            :disabled="!canEdit"
            :options="ArmourLocationOpts"
          />
          <FormInput
            v-model="wh.armour.points"
            title="Armour points"
            :validationStatus="validArmourPoints"
            type="number"
            :disabled="!canEdit"
          />
          <SelectInput
            v-model="wh.armour.group"
            :options="armourGroupOpts"
            :disabled="!canEdit"
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
            :disabled="!canEdit"
          />
          <SelectInput
            v-model="wh.container.carryType"
            :options="carryTypeOpts"
            :disabled="!canEdit"
            title="Can it be worn/carried?"
            class="min-w-24"
          />
        </div>
        <div v-else-if="wh.type === ItemType.Other" class="flex flex-col gap-4">
          <SelectInput
            v-model="wh.other.carryType"
            :options="carryTypeOpts"
            :disabled="!canEdit"
            title="Can it be worn/carried?"
            class="min-w-24"
          />
        </div>
        <div v-else-if="wh.type === ItemType.Grimoire" class="flex flex-col gap-4">
          <SelectTable
            modalId="grimoire"
            :disabled="!canEdit"
            :initSelectedItems="wh.grimoire.spells"
            :itemList="spellListUtils.whList.value"
            title="Spells"
            modalTitle="Add/remove spells"
            :loading="spellListUtils.loading.value"
            routeName="spell"
            :truncateModalDescription="100"
            class="mt-4"
            @reload="spellListUtils.loadWhList"
            @selected="(e) => wh.updateSpells(e.id, e.selected)"
          />
        </div>
        <SelectIdValueTable
          :disabled="!canEdit"
          :selected="Object.entries(wh.properties).map(([id, value]) => ({ id: id, value: value }))"
          :itemList="propertyList"
          title="Qualities and flaws"
          modalTitle="Modify qualities and flaws"
          :loading="propertyListUtils.loading.value"
          :validationStatus="wh.validateProperties()"
          routeName="property"
          :truncateModalDescription="100"
          class="mt-4"
          @reload="propertyListUtils.loadWhList"
          @remove="(e) => wh.updateProperties(e.id, false)"
          @selected="(e) => wh.updateProperties(e.id, e.selected)"
          @updateValue="(e) => wh.updatePropertyValue(e.id, e.value)"
        />
        <SelectIdNumberTable
          :disabled="!canEdit"
          :initItems="wh.runes"
          :allItemList="runeList"
          title="Runes"
          modalTitle="Modify runes"
          :loading="runeListUtils.loading.value"
          routeName="rune"
          :truncateModalDescription="100"
          :validationStatus="validRunes"
          class="mt-4"
          @reload="runeListUtils.loadWhList"
          @updated="(e) => wh.updateRunes(e.id, e.number)"
        />
      </div>
    </div>
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="my-3 flex-1">
        <SourceTable
          :edition="edition"
          :disabled="!canEdit"
          :initSources="initSources"
          @selected="(e) => wh.updateSource(e)"
        />
      </div>
      <div class="my-3 flex-1">
        <PublicPropertyBox v-model="wh.visibility" propertyName="Trapping" :disabled="!canEdit" />
      </div>
    </div>
  </template>
  <div v-show="hasVariant" class="mt-4">
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
      :readOnly="!canEdit"
    />

    <DeleteBlock
      v-if="id !== 'create' && canEdit"
      propertyName="Trapping"
      :name="wh.name"
      list="items"
      :deleteItem="deleteItem"
    />
  </div>
</template>

<style scoped></style>
