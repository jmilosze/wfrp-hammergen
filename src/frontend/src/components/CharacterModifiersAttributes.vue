<script setup lang="ts">
defineProps<{ attribute1Name: string; attribute2Name: string }>();
</script>

<template>
  <div class="rounded-xl border border-neutral-300 bg-neutral-50">
    <table class="w-full">
      <tbody>
        <tr>
          <th class="p-2 font-semibold">{{ attribute1Name }}</th>
          <th class="p-2 font-semibold rounded">{{ attribute2Name }}</th>
        </tr>
        <tr>
          <td class="p-2">
            <input
              type="number"
              class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
            />
          </td>
          <td class="p-2">
            <input
              type="number"
              class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
