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
import { APTOS_WALLETS, BTC_LIVENET_WALLET, BTC_TESTNET_WALLETS, EVM_WALLETS, FRACTAL_LIVENET_WALLET, FRACTAL_TESTNET_WALLET, WALLET_CONFIG_MAP, MOVMENT_APTOS_WALLETS } from '../config'
import { computed, ref } from 'vue'
import { useFractalWallet } from '../fractal/use-fractal-wallet'
import { useAptosWallet } from '../aptos/use-aptos-wallet'
import { useMovementAptosWallet } from '../movement-aptos/use-movement-aptos-wallet'

defineOptions({
  name: 'WalletConnectModal'
})

export interface WalletConnectModalProps {
  type: WALLET_TYPE
  network?: NETWORK
}

const open = defineModel<boolean>()
const openingWalletName = ref<WALLET>()

const props = defineProps<WalletConnectModalProps>()
const { onConnect: onBTCConnect, getWalletInstance: getBTCWalletInstance } = useBTCWallet()
const { onConnect: onEVMConnect } = useEVMWallet()
const { onConnect: onFractalConnect, getWalletInstance: getFractalWalletInstance } = useFractalWallet()
const { onConnect: onAptosConnect } = useAptosWallet()
const { onConnect: onMovementAptosConnect } = useMovementAptosWallet()
const { toast } = useToast()

const config = computed(() => {
  if (props.type === WALLET_TYPE.BITCOIN) {
    return {
      title: 'BITCOIN WALLET',
      list: props.network === NETWORK.LIVENET ? BTC_LIVENET_WALLET : BTC_TESTNET_WALLETS,
      onClick: onConnectBTCWallet
    }
  } else if (props.type === WALLET_TYPE.FRACTAL) {
    return {
      title: 'FRACTAL BITCOIN WALLET',
      list: props.network === NETWORK.LIVENET ? FRACTAL_LIVENET_WALLET : FRACTAL_TESTNET_WALLET,
      onClick: onConnectFractalWallet
    }
  } else if (props.type === WALLET_TYPE.APTOS) {
    return {
      title: 'APTOS WALLET',
      list: APTOS_WALLETS,
      onClick: onConnectAptosWallet
    }
  } else if (props.type === WALLET_TYPE.MOVEMENT_APTOS) {
    return {
      title: 'MOVEMENT APTOS WALLET',
      list: MOVMENT_APTOS_WALLETS,
      onClick: onConnectMovementAptosWallet
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
    openingWalletName.value = name
    await onEVMConnect(name)
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  } finally {
    openingWalletName.value = undefined
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

const onConnectFractalWallet = async (name: WALLET) => {
  try {
    await onFractalConnect(name)
    const instance = getFractalWalletInstance()
    if (props.network != null) {
      await instance.switchChain(props.network === NETWORK.LIVENET ? 'FRACTAL_BITCOIN_MAINNET' : 'FRACTAL_BITCOIN_TESTNET')
    }
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  }
}

const onConnectAptosWallet = async (name: WALLET) => {
  try {
    await onAptosConnect(name)
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  }
}

const onConnectMovementAptosWallet = async (name: WALLET) => {
  try {
    await onMovementAptosConnect(name)
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
    <DialogContent @pointer-down-outside.prevent>
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
          :loading="openingWalletName === wallet"
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
