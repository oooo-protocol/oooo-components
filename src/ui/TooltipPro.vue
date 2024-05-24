<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from 'oooo-components/ui/tooltip'

defineProps<{
  message: string
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <slot />
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ message }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
