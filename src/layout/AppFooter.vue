<script setup lang="ts">
import Icon from 'oooo-components/ui/Icon.vue'
import { useQuery } from '@tanstack/vue-query'

defineProps<{
  isHideLogo?: boolean
}>()

const links = [
  {
    name: 'X.com',
    link: 'https://twitter.com/oooo_money'
  },
  {
    name: 'Medium',
    link: 'https://medium.com/@oooo-prot'
  },
  {
    name: 'Discord',
    link: 'https://discord.gg/ooooprotocol'
  },
  {
    name: 'Telegram',
    link: 'https://t.me/oooo_protocol'
  }
]

const { data: price } = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const { data: { BTC } } = await fetch('https://production.api.coindesk.com/v2/tb/price/ticker?assets=BTC').then(async (response) => await response.json())

    return {
      current: BTC.ohlc.c,
      change: BTC.change.percent
    }
  }
})
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between md:items-end mt-[auto] pt-[14px] pb-[40px] xl:pt-[40px] px-[24px] md:px-[48px] xl:px-[60px] normal-case">
    <div class="xl:w-[300px] hidden md:block">
      <a
        v-if="!isHideLogo"
        class="block w-max md:mb-[24px] xl:mb-[70px]"
        href="https://oooo.money"
      >
        <Icon
          name="OOOOlogo"
          class="md:text-[48px] xl:text-[72px]"
        />
      </a>
      <p>Bitcoin BTC</p>
      <div
        class="flex md:flex-col xl:flex-row gap-[20px] md:gap-[0] xl:gap-[20px]"
        v-if="price"
      >
        <p>${{ price.current.toLocaleString() }}</p>
        <p class="text-[#ff5402]">
          {{ price.change }}% (1d)
        </p>
      </div>
    </div>
    <ul class="mt-[4px] flex flex-wrap gap-[42px] md:gap-[24px] justify-between md:justify-center xl:justify-start tracking-[2px]">
      <li
        v-for="link in links"
        :key="link.name"
      >
        <a :href="link.link">{{ link.name }}</a>
      </li>
    </ul>
    <div class="flex md:flex-col xl:flex-row justify-center items-center gap-[10px] mt-[12px] text-[#a4a4a4]">
      <p class="text-[13px] md:text-[16px]">
        Secured by
      </p>
      <img
        class="h-[16px] md:h-[22px]"
        src="@/assets/images/logo/safeheron.png"
      >
      <img
        class="h-[16px] md:h-[22px]"
        src="@/assets/images/logo/scale-bit.png"
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.oooo {
  &-logo {
    width: 140px;
    height: 64px;

    @media (min-width: 768px) {
      width: 266px;
      height: 70px;
    }

    @media (min-width: 1280px) {
      width: 302px;
      height: 80px;
    }
  }
}
</style>
