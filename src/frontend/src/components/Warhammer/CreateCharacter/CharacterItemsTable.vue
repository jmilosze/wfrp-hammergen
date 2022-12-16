<template>
  <div class="item-select-table">
    <b-row>
      <b-col md="4">
        <b-table
          hover
          :items="displayEquippedItems"
          :fields="displayEquippedFields"
          :responsive="true"
          :sort-by="displayEquippedFields[0].key"
        >
          <template #thead-top>
            <b-tr>
              <b-th colspan="2">Equipped</b-th>
            </b-tr>
          </template>
        </b-table>
      </b-col>
      <b-col md="4">
        <b-table
          hover
          :items="displayCarriedItems"
          :fields="displayCarriedFields"
          :responsive="true"
          :sort-by="displayCarriedFields[0].key"
        >
          <template #thead-top>
            <b-tr>
              <b-th colspan="2">Carried</b-th>
            </b-tr>
          </template>
        </b-table>
      </b-col>
      <b-col md="4">
        <b-table
          hover
          :items="displayStoredItems"
          :fields="displayStoredFields"
          :responsive="true"
          :sort-by="displayStoredFields[0].key"
        >
          <template #thead-top>
            <b-tr>
              <b-th colspan="2">Owned and Stored</b-th>
            </b-tr>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-button size="sm" class="mb-2 mr-2" @click="showEdit('edit-items')" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>

    <b-button
      size="sm"
      class="mb-2 mr-2"
      @click="addClassItems"
      variant="primary"
      :disabled="disabled || classItemsEmpty"
    >
      Add Class Items
    </b-button>

    <b-button size="sm" class="mb-2 mr-2" @click="clearAll" variant="danger" :disabled="disabled"> Clear All </b-button>

    <b-modal id="edit-items" title="Add/Remove Items" ok-only ok-title="Close" size="lg" scrollable>
      <b-form-group>
        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="$emit('createNew')" :disabled="!canSave">
          Create New
        </b-button>

        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="loadData(true)">
          <span v-if="editLoading" class="spinner-border spinner-border-sm" />
          Reload List
        </b-button>

        <b-form-invalid-feedback :state="canSave" class="mb-2">
          To create new Items, correct all invalid form fields.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <b-input-group>
          <b-form-input v-model="editFilter" type="search" id="filterInput" placeholder="Type to Search">
          </b-form-input>
        </b-input-group>
      </b-form-group>

      <p>{{ resultRange }}</p>

      <b-table
        hover
        :items="listOfItems"
        :fields="editFields"
        :responsive="true"
        :filter="editFilter"
        :no-local-sorting="true"
        :per-page="perPage"
        :current-page="currentPage"
        @sort-changed="onSort"
        @filtered="onFiltered"
        stacked="lg"
      >
        <template v-slot:cell(name)="row">
          <b-link :to="'/item/' + row.item.id" target="_blank">{{ row.item.name }}</b-link>
          <b-form-invalid-feedback :state="row.item.state">
            Item quantity must an integer be between 0 and 1000.
          </b-form-invalid-feedback>
        </template>

        <template #cell(actions)="row">
          <b-button size="sm" @click="row.toggleDetails">
            <div class="text-nowrap">{{ row.detailsShowing ? "Hide" : "Show" }} Details</div>
          </b-button>
        </template>

        <template v-slot:cell(equipped)="row">
          <b-form-input
            :number="true"
            type="number"
            min="0"
            max="1000"
            v-model="row.item.equipped"
            class="rank"
            v-if="isWearable(row.item)"
            @change="selectItem(row.item, 'equipped')"
          ></b-form-input>
          <div v-else>N/A</div>
        </template>

        <template v-slot:cell(carried)="row">
          <b-form-input
            :number="true"
            type="number"
            min="0"
            max="1000"
            v-model="row.item.carried"
            class="rank"
            v-if="isCarriable(row.item)"
            @change="selectItem(row.item, 'carried')"
          ></b-form-input>
          <div v-else>N/A</div>
        </template>

        <template v-slot:cell(stored)="row">
          <b-form-input
            :number="true"
            type="number"
            min="0"
            max="1000"
            v-model="row.item.stored"
            class="rank"
            @change="selectItem(row.item, 'stored')"
          ></b-form-input>
        </template>

        <template v-slot:row-details="row">
          <dl class="row" v-if="row.item.type === 0">
            <dt class="col-sm-4">Weapon Group</dt>
            <dd class="col-sm-8">
              {{ formatMeleeGroup(row.item.stats[0].group) }}
            </dd>

            <dt class="col-sm-4">Weapon Damage</dt>
            <dd class="col-sm-8">
              {{ formatConstPlusSB(row.item.stats[0].dmg, row.item.stats[0].dmgSbMult) }}
            </dd>

            <dt class="col-sm-4">Weapon Reach</dt>
            <dd class="col-sm-8">
              {{ formatMeleeReach(row.item.stats[0].reach) }}
            </dd>
          </dl>

          <dl class="row" v-if="row.item.type === 1">
            <dt class="col-sm-4">Weapon Group</dt>
            <dd class="col-sm-8">
              {{ formatRangedGroup(row.item.stats[1].group) }}
            </dd>

            <dt class="col-sm-4">Weapon Damage</dt>
            <dd class="col-sm-8">
              {{ formatConstPlusSB(row.item.stats[1].dmg, row.item.stats[1].dmgSbMult) }}
            </dd>

            <dt class="col-sm-4">Weapon Range</dt>
            <dd class="col-sm-8">
              {{ formatConstPlusSB(row.item.stats[1].rng, row.item.stats[1].rngSbMult) }}
            </dd>
          </dl>

          <dl class="row" v-if="row.item.type === 2">
            <dt class="col-sm-4">Ammunition Group</dt>
            <dd class="col-sm-8">
              {{ formatAmmunitionGroup(row.item.stats[2].group) }}
            </dd>

            <dt class="col-sm-4">Damage Modification</dt>
            <dd class="col-sm-8">
              {{ formatAmmunitionMod(row.item.stats[2].dmg, 1) }}
            </dd>

            <dt class="col-sm-4">Range Modification</dt>
            <dd class="col-sm-8">
              {{ formatAmmunitionMod(row.item.stats[2].rng, row.item.stats[2].rngMult) }}
            </dd>
          </dl>

          <dl class="row" v-if="row.item.type === 3">
            <dt class="col-sm-4">Armor Group</dt>
            <dd class="col-sm-8">
              {{ formatArmorGroup(row.item.stats[3].group) }}
            </dd>

            <dt class="col-sm-4">Armor Locations</dt>
            <dd class="col-sm-8">
              {{ formatArmorLocations(row.item.stats[3].location) }}
            </dd>

            <dt class="col-sm-4">Armor Points</dt>
            <dd class="col-sm-8">{{ row.item.stats[3].points }}</dd>
          </dl>

          <dl class="row" v-if="row.item.type === 4">
            <dt class="col-sm-4">Container Capacity</dt>
            <dd class="col-sm-8">{{ row.item.stats[4].capacity }}</dd>
          </dl>

          {{ row.item.description }}
        </template>
      </b-table>

      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
      <p>{{ resultRange }}</p>
    </b-modal>
  </div>
</template>

<script>
import TableCommon from "./TableCommon.vue";
import { addSpaces } from "../../../utils/stringUtils";
import { generateClassItems } from "../../../services/wh/characterGeneration/characterGeneration";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";
import {
  ammunitionGroups,
  armorGroups,
  armorLocations,
  ItemApi,
  meleeGroups,
  meleeReach,
  rangedGroups,
} from "../../../services/wh/item";

const MAX_CHARS = 15;
const itemTypes = ["equipped", "carried", "stored"];

export default {
  name: "CharacterItemsTable",
  props: {
    itemsEquipped: {
      type: Array,
      required: true,
    },
    itemsCarried: {
      type: Array,
      required: true,
    },
    itemsStored: {
      type: Array,
      required: true,
    },
    classItems: {
      type: Object,
      required: true,
    },
  },
  mixins: [TableCommon],
  data() {
    return {
      itemApi: new ItemApi(authRequest),

      editFilter: null,
      listOfItems: [],
      displayCarriedFields: [
        { key: "name", sortable: true },
        { key: "carried", label: "Quantity", sortable: true },
      ],
      displayEquippedFields: [
        { key: "name", sortable: true },
        { key: "equipped", label: "Quantity", sortable: true },
      ],
      displayStoredFields: [
        { key: "name", sortable: true },
        { key: "stored", label: "Quantity", sortable: true },
      ],
      editFields: [
        { key: "name", sortable: true },
        { key: "actions", sortable: false },
        { key: "equipped", sortable: true },
        { key: "carried", sortable: true },
        { key: "stored", sortable: true },
      ],
      perPage: 50,
      currentPage: 1,
      totalRows: 1,
      editLoading: false,
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    listOfItems() {
      this.totalRows = this.listOfItems.length;
    },
    itemsEquipped(newVal) {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(newVal, "equipped");
    },
    itemsCarried(newVal) {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(newVal, "carried");
    },
    itemsStored(newVal) {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(newVal, "stored");
    },
  },
  computed: {
    classItemsEmpty() {
      return !Object.keys(this.classItems).length;
    },
    displayCarriedItems() {
      try {
        return this.listOfItems.filter((x) => x.carried !== 0);
      } catch {
        return [];
      }
    },
    displayStoredItems() {
      try {
        return this.listOfItems.filter((x) => x.stored !== 0);
      } catch {
        return [];
      }
    },
    displayEquippedItems() {
      try {
        return this.listOfItems.filter((x) => x.equipped !== 0);
      } catch {
        return [];
      }
    },
    isValid() {
      return this.listOfItems.reduce((x, y) => x && y.state, true);
    },
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortBy, ctx.sortDesc);
    },
    sortListOfItems(key, sortDesc) {
      if (key !== "equipped" && key !== "carried" && key !== "stored") {
        this.listOfItems.sort((a, b) => a[key].localeCompare(b[key]));
      } else {
        this.listOfItems.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
      }
      if (sortDesc) {
        this.listOfItems.reverse();
      }
    },
    addClassItems() {
      let items = generateClassItems(this.classItems);
      for (let itemType of ["equipped", "carried"]) {
        for (let item of items[itemType]) {
          let itemToUpdate = this.listOfItems.find((x) => x.id === item.id);
          if (itemToUpdate && itemToUpdate[itemType] < item.number) {
            itemToUpdate[itemType] = item.number;
            this.selectItem(itemToUpdate, itemType);
          }
        }
      }
    },
    clearAll() {
      this.listOfItems.forEach((x) => {
        for (let itemType of ["equipped", "carried", "stored"]) {
          if (x[itemType] !== 0) {
            x[itemType] = 0;
            this.selectItem(x, itemType);
          }
        }
      });
    },
    resetItems(newItems, itemType) {
      this.listOfItems.forEach((x) => {
        x[itemType] = 0;
        x.state = true;
      });
      for (let newItem of newItems) {
        let item = this.listOfItems.find((x) => x.id === newItem.id);

        if (item) {
          let isValid =
            (itemType === "equipped" && this.isWearable(item)) ||
            (itemType === "carried" && this.isCarriable(item)) ||
            itemType === "stored";

          if (isValid) {
            item[itemType] = newItem.number;
          }
          if (!isValid) {
            // this.$emit(`${itemType}Changed`, { id: newItem.id, number: 0 });
          }
        } else {
          // this.$emit(`${itemType}Changed`, { id: newItem.id, number: 0 });
        }
      }
      this.$emit("stateChanged", this.isValid);
      this.sortListOfItems("equipped", true);
    },
    formatMeleeGroup(group) {
      return meleeGroups[group];
    },
    formatMeleeReach(reach) {
      return meleeReach[reach];
    },
    formatConstPlusSB(constPart, multPart) {
      const elems = [];
      if (multPart === 1) {
        elems.push("SB");
      } else if (multPart > 1) {
        elems.push("SBx" + parseInt(multPart));
      }

      if (constPart > 0) {
        elems.push(parseInt(constPart));
      }
      return elems.join("+");
    },
    formatAmmunitionMod(const_part, multPart) {
      if (const_part === 0 && multPart === 1) {
        return "-";
      }
      const elems = [];
      if (multPart === 1) {
        elems.push("");
      } else if (multPart !== 1) {
        elems.push("Weapon x" + parseFloat(multPart));
      }

      if (const_part !== 0) {
        elems.push(parseInt(const_part));
      }
      return elems.join(const_part > 0 ? "+" : "");
    },
    formatRangedGroup(group) {
      return rangedGroups[group];
    },
    formatAmmunitionGroup(group) {
      return ammunitionGroups[group];
    },
    formatArmorGroup(group) {
      return armorGroups[group];
    },
    formatArmorLocations(locationList) {
      return locationList.map((x) => armorLocations[x]).join(", ");
    },
    selectItem(item, type) {
      item.state = true;
      for (let itemType of itemTypes) {
        item.state = item.state && Number.isInteger(item[itemType]) && item[itemType] >= 0 && item[itemType] <= 1000;
      }
      this.$emit(`${type}Changed`, { id: item.id, number: item[type] });
      this.$emit("stateChanged", this.isValid);
    },
    isCarriable(item) {
      return !(item.type === 5 && !item.stats[5].carryType.carriable);
    },
    isWearable(item) {
      return (
        !(item.type === 5 && !item.stats[5].carryType.wearable) &&
        !(item.type === 4 && !item.stats[4].wearable) &&
        !(item.type === 6)
      );
    },
    async loadData(reload = false) {
      this.editLoading = true;
      let currentEquipped = this.getCurrentItems("equipped");
      let currentCarried = this.getCurrentItems("carried");
      let currentStored = this.getCurrentItems("stored");

      const listOfItems = await logoutIfUnauthorized(this.itemApi.listElements)();
      for (let item of listOfItems) {
        item.equipped = 0;
        item.carried = 0;
        item.stored = 0;
        item.state = true;
        item.name = addSpaces(item.name, MAX_CHARS);
        item.description = addSpaces(item.description, MAX_CHARS);
      }

      this.listOfItems = listOfItems;

      if (reload) {
        this.resetItems(currentEquipped, "equipped");
        this.resetItems(currentCarried, "carried");
        this.resetItems(currentStored, "stored");
      } else {
        this.resetItems(this.itemsEquipped, "equipped");
        this.resetItems(this.itemsCarried, "carried");
        this.resetItems(this.itemsStored, "stored");
      }

      this.editLoading = false;
    },
    getCurrentItems(itemType) {
      let currentItems = [];
      for (let item of this.listOfItems) {
        if (item[itemType] > 0) {
          currentItems.push({ id: item.id, number: item[itemType] });
        }
      }
      return currentItems;
    },
  },
};
</script>

<style scoped>
.rank {
  min-width: 65px;
}
</style>
