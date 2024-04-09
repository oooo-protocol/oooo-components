<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DialogClose
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('flex flex-col items-end gap-y-1.5 px-[16px] py-[24px] md:px-[40px] md:py-[32px] border-b border-[#5a6960]', props.class)"
  >
    <DialogClose
      class="absolute left-[16px] top-[24px] md:left-[40px] md:top-[32px] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      CLOSE
    </DialogClose>
    <slot />
  </div>
</template>
