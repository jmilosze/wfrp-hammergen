<template>
  <div class="character-modifiers-box">
    <div class="flex-container">
      <div class="h5 align-center mr-2">Character Modifiers</div>
      <b-button size="sm" variant="info" @click="modifiersTooltip = !modifiersTooltip"> What are modifiers? </b-button>
    </div>
    <b-collapse v-model="modifiersTooltip" class="mt-2 mb-2">
      <p>
        Talent modifiers are <b>automatically</b> added to character sheet in both edit and view modes. For example, if
        you add a talent that modifies the Size, it will automatically affect the number of Wounds. Sum of all Attribute
        modifiers is displayed in "other" row in character sheet.
      </p>
      <p>
        All characters have default size Average, by using size modifier you can change is to Small (-1), Large (+1)
        etc.
      </p>
    </b-collapse>

    <b-row>
      <b-col>
        <b-form-group label="Attributes">
          <b-row>
            <b-col xl="4">
              <b-table-simple :responsive="true">
                <b-thead>
                  <b-th>WS</b-th>
                  <b-th>BS</b-th>
                  <b-th>S</b-th>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="ws"
                        @input="(newVal) => $emit('update:ws', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="bs"
                        @input="(newVal) => $emit('update:bs', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="s"
                        @input="(newVal) => $emit('update:s', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
            <b-col xl="4">
              <b-table-simple :responsive="true">
                <b-thead>
                  <b-th>T</b-th>
                  <b-th>I</b-th>
                  <b-th>Ag</b-th>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="t"
                        @input="(newVal) => $emit('update:t', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="i"
                        @input="(newVal) => $emit('update:i', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="ag"
                        @input="(newVal) => $emit('update:ag', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
            <b-col xl="4">
              <b-table-simple :responsive="true">
                <b-thead>
                  <b-th>Dex</b-th>
                  <b-th>Int</b-th>
                  <b-th>WP</b-th>
                  <b-th>Fel</b-th>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="dex"
                        @input="(newVal) => $emit('update:dex', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="int"
                        @input="(newVal) => $emit('update:int', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="wp"
                        @input="(newVal) => $emit('update:wp', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                    <b-td>
                      <b-form-input
                        :disabled="disabled"
                        :number="true"
                        min="-99"
                        max="99"
                        type="number"
                        :value="fel"
                        @input="(newVal) => $emit('update:fel', parseInt(newVal))"
                      >
                      </b-form-input>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-form-invalid-feedback :state="validAtt">
            Invalid value of one or more Attributes. Attributes have to be integers between -99 and 99.
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="3">
        <b-form-group label="Character Size">
          <b-form-select
            id="type-input"
            :disabled="disabled"
            :options="[-2, -1, 0, 1, 2]"
            :value="size"
            @input="(newVal) => $emit('update:size', parseInt(newVal))"
          >
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group label="Character Movement">
          <b-form-select
            id="type-input"
            :disabled="disabled"
            :options="[-2, -1, 0, 1, 2]"
            :value="movement"
            @input="(newVal) => $emit('update:movement', parseInt(newVal))"
          >
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "CharacterModifiers",
  props: {
    disabled: Boolean,
    ws: Number,
    bs: Number,
    s: Number,
    t: Number,
    i: Number,
    ag: Number,
    dex: Number,
    int: Number,
    wp: Number,
    fel: Number,
    size: Number,
    movement: Number,
  },
  emits: [
    "valid",
    "update:ws",
    "update:bs",
    "update:s",
    "update:t",
    "update:i",
    "update:ag",
    "update:dex",
    "update:int",
    "update:wp",
    "update:fel",
    "update:size",
  ],
  data() {
    return {
      modifiersTooltip: false,
    };
  },
  computed: {
    validAtt() {
      for (let value of [this.ws, this.bs, this.s, this.t, this.i, this.ag, this.dex, this.int, this.wp, this.fel]) {
        if (value > 99 || value < -99 || !Number.isInteger(value)) {
          return false;
        }
      }
      return true;
    },
  },
  watch: {
    validAtt: function (newVal) {
      this.$emit("valid", newVal);
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
}
.align-center {
  align-self: center;
}
</style>
