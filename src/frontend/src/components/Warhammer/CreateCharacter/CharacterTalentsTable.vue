<template>
  <div class="talent-select-table">
    <b-table hover :items="displayItems" :fields="displayFields" :responsive="true" :sort-by="displayFields[0].key">
      <template v-slot:cell(skill)="row">
        <span class="text-nowrap">{{ row.item.name }}</span>
      </template>
    </b-table>

    <b-button size="sm" class="mb-2 mr-2" @click="showEdit('edit-talents')" variant="primary" :disabled="disabled">
      Add/Modify
    </b-button>

    <b-button
      size="sm"
      class="mb-2 mr-2"
      @click="addSpeciesTalents"
      variant="primary"
      :disabled="disabled || !canGenerateTalents"
    >
      Add Species Talents
    </b-button>

    <b-button size="sm" class="mb-2 mr-2" @click="clearAll" variant="danger" :disabled="disabled"> Clear All </b-button>

    <b-modal id="edit-talents" title="Add/Remove Talents" ok-only ok-title="Close" scrollable>
      <b-form-group>
        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="$emit('createNew')" :disabled="!canSave">
          Create New
        </b-button>

        <b-button variant="secondary" size="sm" class="mr-2 mb-1" @click="loadData(true)">
          <span v-if="editLoading" class="spinner-border spinner-border-sm" />
          Reload List
        </b-button>

        <b-form-invalid-feedback :state="canSave" class="mb-2">
          To create new Talents, correct all invalid form fields.
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
      >
        <template #cell(name)="row">
          <b-link :to="'/talent/' + row.item.id" target="_blank">{{ row.item.name }}</b-link>
        </template>

        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="row.toggleDetails">
            <div class="text-nowrap">{{ row.detailsShowing ? "Hide" : "Show" }} Details</div>
          </b-button>
        </template>

        <template v-slot:cell(select)="row">
          <b-form-group>
            <b-form-input
              :number="true"
              type="number"
              min="0"
              max="1000"
              v-model="row.item.number"
              @change="selectItem(row.item)"
              class="rank"
            ></b-form-input>
            <b-form-invalid-feedback :state="row.item.state">
              This Talent can be taken between 0 and
              {{ formatMaxRank(row.item) }} times.
            </b-form-invalid-feedback>
          </b-form-group>
        </template>

        <template v-slot:row-details="row">
          <dl class="row">
            <dt class="col-sm-3">Max Rank</dt>
            <dd class="col-sm-9">{{ formatMaxRank(row.item) }}</dd>

            <dt class="col-sm-3">Tests</dt>
            <dd class="col-sm-9">
              {{ row.item.tests ? row.item.tests : "N/A" }}
            </dd>
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
import { TalentApi, talentAttributes } from "../../../services/wh/talent";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";
import { generateSpeciesTalents, resolveTalentGroups } from "../../../services/wh/characterGeneration/talentGeneration";
import { sumAndMultAttr } from "../../../services/wh/attributes";
import { sumAndMultModifiers } from "@/services/wh/characterModifiers";

const MAX_CHARS = 15;

export default {
  name: "CharacterTalentsTable",
  mixins: [TableCommon],
  props: {
    characterTalents: {
      type: Array,
      required: true,
    },
    characterAtts: {
      type: Object,
      required: true,
    },
    speciesTalents: {
      type: Array,
      required: true,
    },
    randomTalents: {
      type: Array,
      required: true,
    },
    characterSpecies: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      talentApi: new TalentApi(authRequest),

      listOfItems: [],
      editFilter: null,
      editFields: [
        { key: "name", sortable: true },
        { key: "actions", label: "Actions", sortable: false },
        { key: "select", label: "Rank", sortable: true },
      ],
      displayFields: [
        { key: "name", sortable: true },
        { key: "number", label: "Times Taken", sortable: true },
      ],
      perPage: 50,
      currentPage: 1,
      totalRows: 1,
      editLoading: false,

      talentsWithModifiers: [],
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    canGenerateTalents() {
      return !!this.speciesTalents.length && !!this.randomTalents.length;
    },
    displayItems() {
      try {
        return this.listOfItems.filter((x) => x.number !== 0);
      } catch {
        return [];
      }
    },
    isValid() {
      return this.listOfItems.reduce((x, y) => x && y.state, true);
    },
  },
  watch: {
    listOfItems() {
      this.totalRows = this.listOfItems.length;
    },
    characterAtts() {
      this.listOfItems.forEach((x) => {
        x.state = x.number !== "" && x.number >= 0 && x.number <= this.getMaxRank(x);
      });
      this.$emit("stateChanged", this.isValid);
    },
    characterTalents() {
      if (this.listOfItems.length < 1) {
        return;
      }
      this.resetItems(this.characterTalents);
    },
  },
  methods: {
    onSort(ctx) {
      this.sortListOfItems(ctx.sortBy, ctx.sortDesc);
    },
    sortListOfItems(key, sortDesc) {
      if (key !== "select") {
        this.listOfItems.sort((a, b) => a[key].localeCompare(b[key]));
      } else {
        this.listOfItems.sort((a, b) => (a.number < b.number ? -1 : a.number > b.number ? 1 : 0));
      }
      if (sortDesc) {
        this.listOfItems.reverse();
      }
    },
    clearAll() {
      this.listOfItems.forEach((x) => {
        if (x.number !== 0) {
          x.number = 0;
          this.selectItem(x);
        }
      });
    },
    resetItems(newTalents) {
      this.listOfItems.forEach((x) => {
        x.number = 0;
        x.state = true;
      });
      for (let newTalent of newTalents) {
        let talent = this.listOfItems.find((x) => x.id === newTalent.id);
        if (talent) {
          let isValid =
            Number.isInteger(newTalent.number) && newTalent.number >= 0 && newTalent.number <= this.getMaxRank(talent);
          if (isValid) {
            talent.number = newTalent.number;
          } else {
            // this.$emit("selectedChanged", { id: newTalent.id, number: 0 });
          }
        } else {
          // this.$emit("selectedChanged", { id: newTalent.id, number: 0 });
        }
      }
      this.$emit("stateChanged", this.isValid);
      let newModifiers = this.calcModifiers();
      this.$emit("modifiersChanged", newModifiers);
      this.sortListOfItems("select", true);
    },
    formatMaxRank(talent) {
      const elems = [];
      if (talent.maxRank > 0) {
        elems.push(parseInt(talent.maxRank));
      }
      if (talent.maxRankAtt > 0) {
        elems.push(talentAttributes[talent.maxRankAtt] + " Bonus");
      }

      if (talent.maxRankAtt > 0) {
        return parseInt(this.getMaxRank(talent)) + " (" + elems.join(" + ") + ")";
      } else {
        return parseInt(this.getMaxRank(talent));
      }
    },
    getMaxRank(talent) {
      if (talent.maxRankAtt > 0) {
        return talent.maxRank + Math.floor(this.characterAtts[talentAttributes[talent.maxRankAtt]] / 10);
      } else {
        return talent.maxRank;
      }
    },
    calcModifiers() {
      return sumAndMultModifiers(
        this.talentsWithModifiers.map((t) => ({ multiplier: t.number, modifiers: t.modifiers }))
      );
    },
    selectItem(talent) {
      talent.state = Number.isInteger(talent.number) && talent.number >= 0 && talent.number <= this.getMaxRank(talent);

      this.$emit("selectedChanged", {
        id: talent.id,
        number: talent.number,
      });

      if (talent.hasModifiers) {
        let newModifiers = this.calcModifiers();
        this.$emit("modifiersChanged", newModifiers);
      }

      this.$emit("stateChanged", this.isValid);
    },
    addSpeciesTalents() {
      let resolvedTalentGroups = resolveTalentGroups(this.listOfItems);
      let generatedTalents = generateSpeciesTalents(
        this.speciesTalents,
        resolvedTalentGroups,
        this.randomTalents,
        this.characterSpecies
      );

      for (let generatedTalent of generatedTalents) {
        let talentToUpdate = this.listOfItems.find((x) => x.id === generatedTalent.id);
        if (talentToUpdate && talentToUpdate.number < generatedTalent.number) {
          talentToUpdate.number = generatedTalent.number;
          this.selectItem(talentToUpdate);
        }
      }
    },
    async loadData(reload = false) {
      this.editLoading = true;
      let currentTalents = this.getCurrentTalents();

      let listOfItems = await logoutIfUnauthorized(this.talentApi.listElements)();
      listOfItems = listOfItems.filter((x) => !x.isGroup);
      this.$emit("listOfTalents", JSON.parse(JSON.stringify(listOfItems)));

      for (let item of listOfItems) {
        item.number = 0;
        item.state = true;
        item.name = addSpaces(item.name, MAX_CHARS);
        item.description = addSpaces(item.description, MAX_CHARS);

        if (item.hasModifiers === true) {
          this.talentsWithModifiers.push(item);
        }
      }
      this.listOfItems = listOfItems;

      if (reload) {
        this.resetItems(currentTalents);
      } else {
        this.resetItems(this.characterTalents);
      }

      this.editLoading = false;
    },

    getCurrentTalents() {
      let currentTalents = [];
      for (let item of this.listOfItems) {
        if (item.number > 0) {
          currentTalents.push({ id: item.id, number: item.number });
        }
      }
      return currentTalents;
    },
  },
};
</script>

<style scoped>
.rank {
  min-width: 65px;
}
</style>