<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'oooo-components/ui/dialog'
import Button from 'oooo-components/ui/button/Button.vue'
import { useToast } from 'oooo-components/ui/toast/use-toast'
import { useBTCWallet } from '../bitcoin/use-btc-wallet'
import { useEVMWallet } from '../ethereum/use-evm-wallet'

import { NETWORK, WALLET_TYPE, type WALLET } from '../types'
import { BTC_LIVENET_WALLET, BTC_TESTNET_WALLETS, EVM_WALLETS, WALLET_CONFIG_MAP } from '../config'
import { computed } from 'vue'

defineOptions({
  name: 'WalletConnectModal'
})

export interface WalletConnectModalProps {
  type: WALLET_TYPE
  network?: NETWORK
}

const open = defineModel<boolean>()

const props = defineProps<WalletConnectModalProps>()
const { onConnect: onBTCConnect, getWalletInstance: getBTCWalletInstance } = useBTCWallet()
const { onConnect: onEVMConnect } = useEVMWallet()
const { toast } = useToast()

const config = computed(() => {
  if (props.type === WALLET_TYPE.BITCOIN) {
    return {
      title: 'BITCOIN WALLET',
      list: props.network === NETWORK.LIVENET ? BTC_LIVENET_WALLET : BTC_TESTNET_WALLETS,
      onClick: onConnectBTCWallet
    }
  } else {
    return {
      title: 'EVM WALLET',
      list: EVM_WALLETS,
      onClick: onConnectEVMWallet
    }
  }
})

const onConnectEVMWallet = async (name: WALLET) => {
  try {
    await onEVMConnect(name)
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  }
}

const onConnectBTCWallet = async (name: WALLET) => {
  try {
    await onBTCConnect(name)
    const instance = getBTCWalletInstance()
    if (props.network != null) {
      await instance.switchNetwork(props.network)
    }
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>_ CONNECT WALLET</DialogTitle>
        </DialogHeader>
      </template>
      <p class="mb-[8px] text-[14px] text-primary -tracking-tighter">
        {{ config.title }}
      </p>
      <div class="grid md:grid-cols-2 gap-x-[20px] gap-y-[16px]">
        <Button
          class="justify-start gap-[8px] p-[8px] w-full text-[16px]"
          v-for="wallet of config.list"
          :key="wallet"
          variant="outline"
          @click="config.onClick(wallet)"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="WALLET_CONFIG_MAP[wallet].image"
          >
          {{ WALLET_CONFIG_MAP[wallet].name }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
