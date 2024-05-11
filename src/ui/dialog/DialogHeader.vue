<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DialogClose
} from 'radix-vue'
import { cn } from 'oooo-components/lib/utils'

const props = withDefaults(defineProps<{
  closable?: boolean
  class?: HTMLAttributes['class']
}>(), {
  closable: true
})
</script>

<template>
  <div
    :class="cn('flex flex-col items-end gap-y-1.5 p-[16px] md:px-[40px] md:pt-[32px] border-b border-[#5a6960]', props.class)"
  >
    <DialogClose
      v-if="closable"
      class="absolute left-[16px] top-[16px] md:left-[40px] md:top-[32px] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      CLOSE
    </DialogClose>
    <slot />
  </div>
</template>
