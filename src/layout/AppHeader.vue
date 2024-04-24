<script setup lang="ts">
</script>

<template>
  <div class="app-header relative shrink-0 flex items-center md:gap-[40px] px-[24px] md:px-[48px] xl:px-[120px] h-[80px]">
    <slot />
  </div>
</template>

<style lang="scss">
.app-header {
  z-index: 10;
}
</style>
