import { WALLET } from '../types'
import Wrapper from '../wrapper'
import { type SuiWalletImpl } from './types'
import { SuietWallet } from './wallets/suiet'

const wrapper = new Wrapper<SuiWalletImpl>(
  'oooo-sui-wallet',
  {
    [WALLET.SUIET]: SuietWallet
  }
)

export const useSuiWallet = () => {
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
