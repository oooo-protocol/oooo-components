<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('transition-colors text-[#a4a4a4] hover:text-[#fff] data-[state=selected]:bg-muted', props.class)">
    <slot />
  </tr>
</template>
