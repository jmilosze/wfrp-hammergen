<script setup lang="ts">
defineProps<{ attributeNames: string[] }>();
</script>

<template>
  <div class="rounded-xl border border-neutral-300 bg-neutral-50">
    <table class="w-full">
      <tbody>
        <tr>
          <th v-for="attributeName in attributeNames" :key="attributeName" class="p-2 font-semibold">
            {{ attributeName }}
          </th>
        </tr>
        <tr>
          <td v-for="attributeName in attributeNames" :key="attributeName" class="p-2">
            <slot :name="attributeName"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
