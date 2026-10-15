<script setup lang="ts" generic="T extends object">
// A read-only list of the character view, e.g. the prayers or the carried trappings. Each field is a column; a slot
// named after a field replaces its cell (e.g. a link). The list is shown only when it has items.
// title: a box of its own in the style of the editor's SheetList, the title heading the first column.
// subtitle: a part of a bigger SheetCard (e.g. Carried in Trappings), introduced by a band like the editor's.
// stackable: on a narrow box each row becomes lines of "Field: value", for lists too wide for a phone.
// split: on a wide box the rows run in two columns side by side, for long lists of short rows (e.g. basic skills).
export interface ViewField {
  name: string;
  displayName: string;
}

const props = defineProps<{
  fields: ViewField[];
  items: T[];
  title?: string;
  subtitle?: string;
  stackable?: boolean;
  split?: boolean;
}>();

defineSlots<Record<string, (item: T) => unknown>>();

// The value of a field without a slot of its own.
function value(item: T, name: string): unknown {
  return Object.entries(item).find(([key]) => key === name)?.[1];
}

// The tables to render, each layout shown at its own widths: one table of all rows, and when split, the two halves
// side by side on a wide box. Split tables have fixed columns, the name taking half, so the halves and the parts of a
// card line up.
const half = Math.ceil(props.items.length / 2);
const layouts = props.split
  ? [
      { class: "@2xl:hidden", parts: [props.items] },
      {
        class: "hidden @2xl:grid grid-cols-2 divide-x divide-neutral-300",
        parts: [props.items.slice(0, half), props.items.slice(half)],
      },
    ]
  : [{ class: props.stackable ? "hidden @2xl:block" : "", parts: [props.items] }];

const thClass = "py-2 px-2 border-b border-neutral-300 text-left";
const tdClass = "py-2 px-2 border-b border-neutral-300";
</script>

<template>
  <div
    v-if="items.length"
    class="@container font-sheet lining-nums print:break-inside-avoid"
    :class="title ? 'bg-white border border-neutral-400' : 'not-last:border-b border-neutral-300'"
  >
    <div
      v-if="subtitle"
      class="px-2 py-1 bg-neutral-100 border-b border-neutral-300 font-semibold print:break-after-avoid"
    >
      {{ subtitle }}
    </div>
    <div v-for="(layout, l) in layouts" :key="l" :class="layout.class">
      <!-- Each table sits in a div, so a shorter half keeps its row heights instead of stretching to the other. -->
      <div v-for="(part, p) in layout.parts" :key="p">
        <table class="w-full [&_tbody>tr:last-child>td]:border-b-0" :class="{ 'table-fixed': split }">
          <thead>
            <tr>
              <th v-for="(field, i) in fields" :key="field.name" :class="[thClass, { 'w-1/2': split && i === 0 }]">
                {{ i === 0 && title ? title : field.displayName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in part" :key="i">
              <td v-for="field in fields" :key="field.name" :class="tdClass">
                <slot :name="field.name" v-bind="item">{{ value(item, field.name) }}</slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="stackable" class="@2xl:hidden">
      <div v-if="title" class="py-2 px-2 border-b border-neutral-300 font-semibold">{{ title }}</div>
      <div v-for="(item, i) in items" :key="i" class="px-2 py-1 not-last:border-b border-neutral-300">
        <div v-for="field in fields" :key="field.name">
          <span class="font-semibold">{{ field.displayName }}: </span>
          <slot :name="field.name" v-bind="item">{{ value(item, field.name) }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
