<script setup lang="ts">
import { SelectLabel, type SelectLabelProps } from 'radix-vue'
import { cn } from 'oooo-components/lib/utils'

const props = defineProps<SelectLabelProps & { class?: string }>()
</script>

<template>
  <SelectLabel :class="cn('py-1.5 px-4 text-[#a4a4a4]', props.class)">
    <slot />
  </SelectLabel>
</template>
