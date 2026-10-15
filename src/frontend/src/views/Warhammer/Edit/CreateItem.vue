<script setup lang="ts">
import SheetTitle from "../../../components/SheetTitle.vue";
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
  printRangedGroup,
  printWeaponHands,
  rangedGroupList,
  weaponHandsList,
} from "../../../services/wh/content/item.ts";
import { computed, ref, watch } from "vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SheetGroup from "../../../components/SheetGroup.vue";
import SheetCell from "../../../components/SheetCell.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import SourceTable from "../../../components/SourceTable.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import { useWhList } from "../../../composables/whList.ts";
import { itemPropertyApi } from "../../../services/wh/content/itemproperty.ts";
import SelectTable from "../../../components/SelectTable.vue";
import MultipleCheckboxColumnInput from "../../../components/MultipleCheckboxColumnInput.vue";
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
  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create trapping' : canEdit ? 'Edit trapping' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Trapping"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <PublicPropertyBox v-model="wh.visibility" propertyName="Trapping" :disabled="!canEdit" />
    </div>
    <!-- Name, type, price and description in one column, the type's own properties and the lists in the other. -->
    <div class="flex flex-col @3xl:flex-row text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable>
          <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <SheetSelect v-model="wh.type" title="Type" :options="typeOpts" :disabled="!canEdit" />
          <SheetSelect v-model="wh.availability" title="Availability" :options="availOpts" :disabled="!canEdit" />
          <SheetField
            v-model="wh.enc"
            type="number"
            title="Encumbrance"
            :validationStatus="validEnc"
            :disabled="!canEdit"
          />
          <SheetGroup title="Price" :columns="3">
            <SheetField
              v-model="priceGold"
              type="number"
              title="Gold"
              :validationStatus="validPriceGold"
              :disabled="!canEdit"
            />
            <SheetField
              v-model="priceSilver"
              type="number"
              title="Silver"
              :validationStatus="validPriceSilver"
              :disabled="!canEdit"
            />
            <SheetField
              v-model="priceBrass"
              type="number"
              title="Brass"
              :validationStatus="validPriceBrass"
              :disabled="!canEdit"
            />
            <div
              v-if="!validPrice.valid && validCoins"
              role="alert"
              class="col-span-full px-2 py-1 bg-white text-sm text-error"
            >
              {{ validPrice.message }}
            </div>
          </SheetGroup>
        </SheetTable>
        <SectionCard title="Description" class="grow">
          <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="md" />
        </SectionCard>
      </div>
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable v-if="wh.type !== ItemType.Grimoire">
          <template v-if="wh.type === ItemType.Melee">
            <SheetGroup title="Damage">
              <SheetField
                v-model="wh.melee.dmgSbMult"
                type="number"
                title="Mult"
                :validationStatus="validMeleeSbDmgMult"
                :disabled="!canEdit"
              />
              <SheetField
                v-model="wh.melee.dmg"
                type="number"
                title="Const"
                :validationStatus="validMeleeDmg"
                :disabled="!canEdit"
              />
              <template #note>Damage = SB × Mult + Const.</template>
            </SheetGroup>
            <SheetSelect v-model="wh.melee.group" title="Group" :options="meleeGroupOpts" :disabled="!canEdit" />
            <SheetSelect v-model="wh.melee.hands" title="Hands" :options="weaponHandsOpts" :disabled="!canEdit" />
            <SheetSelect v-model="wh.melee.reach" title="Reach" :options="meleeReachOpts" :disabled="!canEdit" />
          </template>
          <template v-else-if="wh.type === ItemType.Ranged">
            <SheetGroup title="Damage">
              <SheetField
                v-model="wh.ranged.dmgSbMult"
                type="number"
                title="Mult"
                :validationStatus="validRangedSbDmgMult"
                :disabled="!canEdit"
              />
              <SheetField
                v-model="wh.ranged.dmg"
                type="number"
                title="Const"
                :validationStatus="validRangedDmg"
                :disabled="!canEdit"
              />
              <template #note>Damage = SB × Mult + Const.</template>
            </SheetGroup>
            <SheetGroup title="Range">
              <SheetField
                v-model="wh.ranged.rngSbMult"
                type="number"
                title="Mult"
                :validationStatus="validRangedSbRngMult"
                :disabled="!canEdit"
              />
              <SheetField
                v-model="wh.ranged.rng"
                type="number"
                title="Const"
                :validationStatus="validRangedRng"
                :disabled="!canEdit"
              />
              <template #note>Range = SB × Mult + Const.</template>
            </SheetGroup>
            <SheetSelect v-model="wh.ranged.group" title="Group" :options="rangedGroupOpts" :disabled="!canEdit" />
            <SheetSelect v-model="wh.ranged.hands" title="Hands" :options="weaponHandsOpts" :disabled="!canEdit" />
          </template>
          <template v-else-if="wh.type === ItemType.Ammunition">
            <SheetGroup title="Damage" :columns="1">
              <SheetField
                v-model="wh.ammunition.dmg"
                type="number"
                title="Const"
                :validationStatus="validAmmunitionDmg"
                :disabled="!canEdit"
              />
              <template #note>Damage = weapon damage + Const.</template>
            </SheetGroup>
            <SheetGroup title="Range">
              <SheetField
                v-model="wh.ammunition.rngMult"
                type="number"
                title="Mult"
                :validationStatus="validAmmunitionRngMult"
                :disabled="!canEdit"
              />
              <SheetField
                v-model="wh.ammunition.rng"
                type="number"
                title="Const"
                :validationStatus="validAmmunitionRng"
                :disabled="!canEdit"
              />
              <template #note>Range = weapon range × Mult + Const.</template>
            </SheetGroup>
            <SheetSelect
              v-model="wh.ammunition.group"
              title="Group"
              :options="ammunitionGroupOpts"
              :disabled="!canEdit"
            />
          </template>
          <template v-else-if="wh.type === ItemType.Armour">
            <SheetField
              v-model="wh.armour.points"
              type="number"
              title="AP"
              :validationStatus="validArmourPoints"
              :disabled="!canEdit"
            />
            <SheetSelect v-model="wh.armour.group" title="Group" :options="armourGroupOpts" :disabled="!canEdit" />
            <SheetCell title="Location">
              <MultipleCheckboxColumnInput
                v-model="wh.armour.location"
                :options="ArmourLocationOpts"
                :disabled="!canEdit"
                bare
                twoColumns
                class="-mx-2"
              />
            </SheetCell>
          </template>
          <template v-else-if="wh.type === ItemType.Container">
            <SheetField
              v-model="wh.container.capacity"
              type="number"
              title="Capacity"
              :validationStatus="validContainerCapacity"
              :disabled="!canEdit"
            />
            <SheetSelect
              v-model="wh.container.carryType"
              title="Carrying"
              :options="carryTypeOpts"
              :disabled="!canEdit"
            />
          </template>
          <SheetSelect
            v-else-if="wh.type === ItemType.Other"
            v-model="wh.other.carryType"
            title="Carrying"
            :options="carryTypeOpts"
            :disabled="!canEdit"
          />
        </SheetTable>
        <SelectTable
          v-if="wh.type === ItemType.Grimoire"
          :disabled="!canEdit"
          :initSelectedItems="wh.grimoire.spells"
          :itemList="spellListUtils.whList.value"
          title="Spells"
          modalTitle="Edit spells"
          :loading="spellListUtils.loading.value"
          routeName="spell"
          :truncateModalDescription="100"
          @reload="spellListUtils.loadWhList"
          @selected="(e) => wh.updateSpells(e.id, e.selected)"
        />
        <!-- Qualities, flaws and runes joined under one title band, like the character sheet's groups. -->
        <div>
          <SheetTitle class="border border-neutral-400">Properties</SheetTitle>
          <SelectIdValueTable
            :disabled="!canEdit"
            :selected="Object.entries(wh.properties).map(([id, value]) => ({ id: id, value: value }))"
            :itemList="propertyList"
            title="Qualities and Flaws"
            modalTitle="Edit Qualities and Flaws"
            :loading="propertyListUtils.loading.value"
            :validationStatus="wh.validateProperties()"
            routeName="property"
            :truncateModalDescription="100"
            class="-mt-px"
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
            modalTitle="Edit runes"
            :loading="runeListUtils.loading.value"
            routeName="rune"
            :truncateModalDescription="100"
            class="-mt-px"
            :validationStatus="validRunes"
            @reload="runeListUtils.loadWhList"
            @updated="(e) => wh.updateRunes(e.id, e.number)"
          />
        </div>
      </div>
    </div>
    <SourceTable
      :edition="edition"
      :disabled="!canEdit"
      :initSources="initSources"
      class="my-4"
      @selected="(e) => wh.updateSource(e)"
    />
  </template>
  <div v-show="hasVariant" class="mt-4">
    <div class="flex flex-col md:flex-row gap-4">
      <EditControls
        :submissionState="submissionState"
        :showSubmissionStatus="showSubmissionStatus"
        propertyName="Trapping"
        :saving="submissionState.status === 'inProgress'"
        list="items"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Trapping"
        :name="wh.name"
        list="items"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
