<template>
  <div class="relative group inline-block">
    <span class="cursor-pointer focus:outline-none text-lg" tabindex="0">
      <slot name="tile"></slot>
    </span>
    <div
      class="absolute left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-200 min-w-[1px] max-w-[25vw] md:max-w-[10vw] w-max z-10"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>
