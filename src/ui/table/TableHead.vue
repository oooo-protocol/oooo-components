<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'oooo-components/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th :class="cn('h-12 px-4 text-right align-middle font-medium text-[#fff] [&:has([role=checkbox])]:pr-0', props.class)">
    <slot />
  </th>
</template>
