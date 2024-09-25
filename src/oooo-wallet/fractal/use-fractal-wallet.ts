import { WALLET, type FractalWalletImpl } from '../types'
import Wrapper from '../wrapper'
import { UnisatFractalWallet } from '../wallet/unisat-fractal'
import { OKXFractalWallet } from '../wallet/okx-fractal'

const wrapper = new Wrapper<FractalWalletImpl>(
  'oooo-fractal-wallet',
  {
    [WALLET.UNISAT]: UnisatFractalWallet,
    [WALLET.OKX]: OKXFractalWallet
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
