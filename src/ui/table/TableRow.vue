<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'oooo-components/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('transition-colors bg-gradient-to-r from-[#1a1519] to-[#131b16] hover:from-[#493a48] data-[state=selected]:bg-muted', props.class)">
    <slot />
  </tr>
</template>
