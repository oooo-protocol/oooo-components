<script setup lang="ts">
</script>

<template>
  <div class="app-header absolute top-0 left-0 right-0 flex items-center gap-[20px] md:gap-[40px] px-[24px] md:px-[48px] xl:px-[120px] h-[80px]">
    <slot />
  </div>
</template>

<style lang="scss">
.app-header {
  z-index: 10;
}
</style>
