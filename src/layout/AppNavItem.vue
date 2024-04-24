<script setup lang="ts">
defineOptions({
  name: 'AppNavItem'
})

export interface Menu {
  name: string
  children?: Menu[]
  tag?: string
  attributes?: Record<string, any>
  closable?: boolean
}

const props = defineProps<{
  menu: Menu
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const onClick = () => {
  if (props.menu.closable) {
    emits('close')
  }
}
</script>

<template>
  <li
    class="app-nav-menu"
    :key="menu.name"
  >
    <component
      :is="menu.tag ?? 'p'"
      v-bind="menu.attributes"
      @click="onClick"
    >
      {{ menu.name }}
    </component>
    <ul
      class="app-nav-menu__children"
      v-if="menu.children"
    >
      <AppNavItem
        v-for="child of menu.children"
        :key="child.name"
        :menu="child"
      />
    </ul>
  </li>
</template>

<style lang="scss">
.app-nav-menu {
  @apply text-[14px] leading-[32px] tracking-[1px] text-[#bce4cd];
  &:not(:last-child) {
    @apply mb-[20px];
  }

  > a {
    @apply hover:text-[#7c9486];
  }

  &__children {
    @apply px-[20px] pt-[20px];
  }
}
</style>
