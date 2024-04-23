<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate'
import Icon from 'oooo-components/ui/Icon.vue'

defineProps<{
  name: string
}>()
</script>

<template>
  <ErrorMessage
    as="p"
    class="flex items-center gap-[8px] font-[300] leading-[1.14] tracking-[0.88px] text-sm text-destructive"
    v-slot="{ message }"
    :name="name"
  >
    <Icon
      class="shrink-0 text-[16px]"
      name="imp"
    />
    {{ message }}
  </ErrorMessage>
</template>
