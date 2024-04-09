<script setup lang="ts">
import {
  SelectItem,
  type SelectItemProps
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectItemProps & { class?: string }>()
</script>

<template>
  <SelectItem
    v-bind="props"
    :class="
      cn(
        'relative w-full cursor-pointer select-none items-center py-1 px-4 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <slot />
  </SelectItem>
</template>
