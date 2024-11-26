import { WALLET } from '../types'
import Wrapper from '../wrapper'
import { type MovementAptosWalletImpl } from './types'
import { RazorWallet } from './wallets/razor'
import { NightlyWallet } from './wallets/nightly'

const wrapper = new Wrapper<MovementAptosWalletImpl>(
  'oooo-aptos-wallet',
  {
    [WALLET.RAZOR]: RazorWallet,
    [WALLET.NIGHTLY]: NightlyWallet
  }
)

export const useMovementAptosWallet = () => {
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
