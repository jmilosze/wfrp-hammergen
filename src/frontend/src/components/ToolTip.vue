<template>
  <div class="relative group inline-block inline-flex">
    <span class="cursor-pointer focus:outline-none dotted-underline px-3 md:px-1 text-lg md:text-base" tabindex="0">
      <slot name="tile"></slot>
    </span>
    <div
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-200 min-w-[1px] max-w-[25vw] md:max-w-[10vw] w-max"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style>
.dotted-underline {
  text-decoration: dotted underline;
}
</style>
