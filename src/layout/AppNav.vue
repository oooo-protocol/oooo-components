<script setup lang="ts">
import { ref } from 'vue'
import Icon from 'oooo-components/ui/Icon.vue'
import AppNavItem, { type Menu } from './AppNavItem.vue'

defineProps<{
  menus: Menu[]
}>()

const showMenubar = ref(false)

const onMenuClose = () => {
  showMenubar.value = false
}
</script>

<template>
  <div
    class="flex gap-[20px] cursor-pointer"
    @click="showMenubar = true"
  >
    <Icon
      class="text-[26px]"
      name="menu"
    />
    <Teleport
      to="body"
      v-if="showMenubar"
    >
      <div class="app-nav">
        <div class="app-nav__header">
          <span
            class="app-nav__close"
            @click="showMenubar = false"
          >
            CLOSE
          </span>
        </div>
        <ul class="app-nav__content">
          <AppNavItem
            v-for="menu of menus"
            :menu="menu"
            :key="menu.name"
            @close="onMenuClose()"
          />
        </ul>
      </div>
      <div
        class="app-nav__mask"
        @click="showMenubar = false"
      />
    </Teleport>
  </div>
</template>

<style lang="scss">
.app-nav {
  @apply z-20 absolute top-0 right-0 left-0 bg-[#1c1c1c];

  &__mask {
    @apply absolute top-0 left-0 w-[100vw] h-[100vh];
  }

  &__header {
    @apply py-[32px] px-[24px] md:px-[48px] xl:px-[120px] border-b border-[#5a6960];
  }

  &__close {
    @apply cursor-pointer select-none text-[14px] leading-[1.14] tracking-[0.88] text-[#a4a4a4];
  }

  &__content {
    @apply py-[40px] px-[24px] md:px-[48px] xl:px-[120px] space-y-[20px];
  }

  &__menu {
    @apply text-[14px] leading-[32px] tracking-[1px] text-[#bce4cd];
  }
}
</style>
