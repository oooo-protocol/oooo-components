import { WALLET } from '../types'
import Wrapper from '../wrapper'
import { type AptosWalletImpl } from './types'
import { MartianWallet } from './wallets/martian'
import { NightlyWallet } from './wallets/nightly'
import { OKXWallet } from './wallets/okx'

const wrapper = new Wrapper<AptosWalletImpl>(
  'oooo-aptos-wallet',
  {
    [WALLET.MARTIAN]: MartianWallet,
    [WALLET.NIGHTLY]: NightlyWallet,
    [WALLET.OKX]: OKXWallet
  }
)

export const useAptosWallet = () => {
  const getWalletInstance = () => {
    return wrapper.instance
  }

  const onConnect = async (name: WALLET) => {
    await wrapper.onConnect(name)
  }

  const onLogout = async () => {
    await wrapper.onLogout()
  }

  return {
    name: wrapper.name,
    address: wrapper.address,
    getWalletInstance,
    onConnect,
    onLogout
  }
}
