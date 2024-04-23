<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'oooo-components/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <thead :class="cn('border-b border-[#bce4cd]', props.class)">
    <slot />
  </thead>
</template>
