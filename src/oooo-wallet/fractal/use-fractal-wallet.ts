import { WALLET, type FractalWalletImpl } from '../types'
import Wrapper from '../wrapper'
import { UnisatWallet } from '../wallet/unisat'

const wrapper = new Wrapper<FractalWalletImpl>(
  'oooo-fractal-wallet',
  {
    [WALLET.UNISAT]: UnisatWallet
  }
)

export const useFractalWallet = () => {
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
